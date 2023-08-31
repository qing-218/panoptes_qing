type HandlerAction<TArgs extends any[], TYield, TReturn, TNext> =
    ((...args: TArgs) => AsyncGenerator<TYield, TReturn, TNext>);

export type HandlerActionYield<T> =
    T extends HandlerAction<any, infer TYield, any, any> ? TYield : never;

export type HandlerActionReturn<T> =
    T extends HandlerAction<any, any, infer TResult, any> ? TResult : never;

export type HandlerActionNext<T> =
    T extends HandlerAction<any, any, any, infer TNext> ? TNext : never;


interface IHandler<TArgs extends any[], TReturn> {
    handle(...args: TArgs): Promise<TReturn>;
}

export const createHandler = <
    TArgs extends any[],
    TYieldRequired,
    TYield extends TYieldRequired,
    TNextRequired,
    TNext extends TNextRequired,
    TReturn
>(
    action: HandlerAction<TArgs, TYield, TReturn, TNextRequired>,
    nextHandler: IHandler<[TYieldRequired], TNext>
): IHandler<TArgs, TReturn> => ({
    handle: async function(...args: TArgs): Promise<TReturn> {
        const actionGenerator = action.apply(this, args);
        let actionResult = await actionGenerator.next();
        while (!actionResult.done) {
            let nextHandlerResult: TNext;
            try {
                nextHandlerResult = await nextHandler.handle.call(this, actionResult.value);
            } catch (err) {
                actionResult = await actionGenerator.throw(err);
                continue;
            }

            actionResult = await actionGenerator.next(nextHandlerResult);
        }

        return actionResult.value;
    }
});

export const NoopHandler: IHandler<[], void> = {
    async handle(): Promise<void> { }
};

export function getNoopAction<T>() {
    return async function* (props: T) { yield props; };
}