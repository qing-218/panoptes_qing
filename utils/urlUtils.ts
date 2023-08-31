export const isHttpURL = (url: URL): boolean =>
    url.protocol === 'http:' || url.protocol === 'https:';

export const addHttpPrefix = (url: string) =>
    /^https?:\/\//.test(url) ? url : 'http://' + url;
