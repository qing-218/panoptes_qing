export default class BrowserCrashedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BrowserCrashedError';
    }
}
