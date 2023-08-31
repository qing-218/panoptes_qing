const logger = new ScriptLogger('calledSetters');

window.interceptSetter = (logger, object, propertyName) => {
    let owner = object
    while (!owner.hasOwnProperty(propertyName)) {
        owner = Object.getPrototypeOf(owner)
    }

    const descriptor = Object.getOwnPropertyDescriptor(owner, propertyName)
    Object.defineProperty(object, propertyName, {
        ...descriptor,
        get() {
            return descriptor.get.call(this);
        },
        set(value) {
            descriptor.set.call(this, value)
            logger.log({
                property: propertyName,
                value,
                callStack: getCallStack()
            });
        }
    })
}
