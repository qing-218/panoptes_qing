export default class NavigationError extends Error {
    constructor(public code: string, public url: string) {
        super(`Navigation failed. Code: ${code}`);
        this.name = 'NavigationError';
    }
}