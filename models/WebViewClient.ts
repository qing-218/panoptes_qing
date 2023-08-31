import EventEmitter from 'node:events';
import { Script, ScriptMessageHandler } from 'frida';
import { MessageType } from 'frida/dist/script.js';
import {
    FridaRequests,
    FridaEvents,
    FridaResponse,
    FridaEvent,
    FridaRequest
} from '../common/fridaMessages.js';
import winston from 'winston';

export type MessageHandler<T> = (msg: T, data?: Buffer | null) => void;

export default class WebViewClient extends EventEmitter {
    private _messageId = 0;

    private constructor(private _script: Script, private _logger: winston.Logger) {
        super();
    }

    public static init(script: Script, logger: winston.Logger) {
        const instance = new WebViewClient(script, logger);

        const messageHandler: ScriptMessageHandler = (message, data) => {
            switch (message.type) {
                case MessageType.Error:
                    throw new Error(message.description);
                case MessageType.Send:
                    logger.silly(`Received frida message: ${JSON.stringify(message, null, 2)}`);
                    const payload: FridaEvent | FridaResponse = message.payload;

                    if ('event' in payload)
                        instance.emit(payload.event, payload.params, data);
                    else if ('id' in payload)
                        instance.emit(payload.id, payload.params, data);
                    else
                        throw new Error('Malformed message');

                    break;
            }
        };

        script.message.connect(messageHandler);

        return {
            instance,
            unregisterSignals: () => {
                script.message.disconnect(messageHandler);
            }
        };
    }

    public send<T extends keyof FridaRequests>(
        method: T,
        params: FridaRequests[T]['requestType'],
        data?: Buffer | null
    ): Promise<FridaRequests[T]['responseType']> {
        this._logger.silly(
            `Sending frida message of type '${method}': ${JSON.stringify(params, null, 2)}`);

        return new Promise((resolve) => {
            const id = (this._messageId++).toString();
            super.once(id, resolve);
            this._script.post({ params, type: method, id } as FridaRequest, data);
        });
    }

    public once<T extends keyof FridaEvents>(event: T, handler: MessageHandler<FridaEvents[T]>) {
        return super.once(event, handler);
    }

    public on<T extends keyof FridaEvents>(event: T, handler: MessageHandler<FridaEvents[T]>) {
        return super.on(event, handler);
    }

    public off<T extends keyof FridaEvents>(event: T, handler: MessageHandler<FridaEvents[T]>) {
        return super.off(event, handler);
    }
}
