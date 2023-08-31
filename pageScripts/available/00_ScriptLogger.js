window.ScriptLogger = function(namespace) {
    this.log = payload => {
        const framePath = []
        let currentFrame = self
        while (framePath[0] !== top) {
            framePath.unshift(currentFrame)
            currentFrame = currentFrame.parent
        }

        scriptLog(JSON.stringify({
            namespace,
            timestamp: Date.now(),
            framePath: framePath.map(f => f.location.href),
            payload
        }));
    }
}
