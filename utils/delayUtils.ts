export function sleep(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export function sleepForever(): Promise<never> {
    return new Promise(() => {

    });
}