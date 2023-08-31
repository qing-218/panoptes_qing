import { Buffer } from 'node:buffer';

interface BaseRequestMetadata {
    mark: string;
}

export function getRequestMetadataHeaderValue<T extends BaseRequestMetadata>(value: T) {
    return Buffer.from(JSON.stringify(value, null, 4), 'utf8').toString('base64');
}

export function parseRequestMetadataHeader<T extends BaseRequestMetadata>(value: string) {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
}