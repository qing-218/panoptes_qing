window.getCallStack = () => {
    const original = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const { stack } = new Error()
    Error.prepareStackTrace = original

    return stack.map(frame => ({
        fileName: frame.getFileName(),
        functionName: frame.getFunctionName(),
        lineNumber: frame.getLineNumber(),
        columnNumber: frame.getColumnNumber()
    }));
}
