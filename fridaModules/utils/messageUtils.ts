import { FridaRequests, FridaEvents, FridaRequest, FridaEvent, FridaResponse } from '../common/fridaMessages.js';

export const raiseEvent = <T extends keyof FridaEvents>(
    event: T,
    params: FridaEvents[T],
    data?: ArrayBuffer
): void => {
    send({ event, params } as FridaEvent, data);
};

type RequestHandler<T extends keyof FridaRequests> =
    (params: FridaRequests[T]['requestType'], data: ArrayBuffer | null) =>
        Promise<[FridaRequests[T]['responseType'], ArrayBuffer | null]>

export function onRequest<T extends keyof FridaRequests & string>(method: T, handler: RequestHandler<T>) {
    const recursiveHandler = (payload: FridaRequest, data: ArrayBuffer | null) => {
        handler(payload.params, data).then(res => {
            send({ id: payload.id, params: res[0] } as FridaResponse, res[1]);
        });

        recv(method, recursiveHandler);
    };
    recv(method, recursiveHandler);
}