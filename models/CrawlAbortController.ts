import frida from 'frida';
import { consoleReadline } from '../utils/logUtils.js';

interface CrawlAbortSignal extends AbortSignal {
    cancelIfAborted<T>(promise: Promise<T>): Promise<T>;
}

export class CrawlAbortError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CrawlAbortError';
    }
}

export class SigAbortError extends CrawlAbortError {
    constructor(public signal: 'INT' | 'TERM') {
        super(`Received ${signal} signal`);
        this.name = 'SigAbortError';
    }
}

const crawlAbortSignalPrototype = Object.create(AbortSignal.prototype);
crawlAbortSignalPrototype.cancelIfAborted = function <T>(promise: Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        const rejectIfAborted = () => {
            try {
                this.throwIfAborted();
            } catch (err) {
                reject(err);
            }
        };

        rejectIfAborted();
        this.addEventListener('abort', rejectIfAborted, { once: true });

        promise
            .then(resolve)
            .catch(reject)
            .finally(() => this.removeEventListener('abort', rejectIfAborted));
    });
};

class CrawlAbortControllerState {
    readonly controller = new AbortController();
    readonly signal = Object.setPrototypeOf(this.controller.signal, crawlAbortSignalPrototype);
    readonly cancellable = new frida.Cancellable();
}

export default class CrawlAbortController implements AbortController {
    get signal(): CrawlAbortSignal {
        return this._state.signal;
    }

    get cancellable(): frida.Cancellable {
        return this._state.cancellable;
    }

    private _state = new CrawlAbortControllerState();

    abort(reason?: any) {
        if (reason instanceof SigAbortError)
            console.log(reason.message);

        this._state.controller.abort(reason);
    }

    reset() {
        if (!this.signal.aborted) return;
        this._state = new CrawlAbortControllerState();
        this._init();
    }

    private _init() {
        const sigIntHandler = () =>
            this.abort(new SigAbortError('INT'));

        const sigTermHandler = () =>
            this.abort(new SigAbortError('TERM'));

        consoleReadline.on('SIGINT', sigIntHandler);
        process.on('SIGTERM', sigTermHandler);
        process.on('SIGINT', sigIntHandler);

        this.signal.addEventListener('abort', () => {
            this.cancellable.cancel();
            consoleReadline.off('SIGINT', sigIntHandler);
            process.off('SIGTERM', sigTermHandler);
            process.off('SIGINT', sigIntHandler);
        }, { once: true });
    }

    constructor() {
        this._init();
    }
}
