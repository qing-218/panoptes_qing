const logger = new ScriptLogger('calledMethods');

window.interceptMethod = (logger, object, methodName) => {
    const target = object[methodName]
    object[methodName] = function proxy() {
        const returnValue = target.apply(this, arguments)
        logger.log({
            method: methodName,
            args: Array.from(arguments),
            returnValue,
            callStack: getCallStack()
        });

        return returnValue;
    }
}
