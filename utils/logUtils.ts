import winston from 'winston';
import readline from 'node:readline/promises';
import util from 'node:util';
import { indentLines } from './stringUtils.js';

export const defaultLogLevel = 'debug';
const consoleLogLevel = 'info';

const errorToObject = (err: any): any => {
    if (!(err instanceof Error)) return err;

    return {
        ...err,
        stack: err.stack,
        message: err.message,
        cause: err.cause instanceof Error ? errorToObject(err.cause) : err.cause
    };
};

const errorToString = (err: any): string => {
    if (!(err instanceof Error))
        return util.inspect(err, true, 2, true);

    let base = `${err.stack}\nProperties: ${JSON.stringify(err, null, 2)}`;
    if (err.cause)
        base += `\nCause: ${errorToString(err.cause)}`;

    return base;
};

const errorFormat = winston.format(info => {
    info.error = errorToObject(info.error);
    return info;
});

export const fileLogFormat = winston.format.combine(
    winston.format.timestamp(),
    errorFormat(),
    winston.format.json()
);

export const consoleTransport = new winston.transports.Console({
    level: consoleLogLevel,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => {
            if (info.error)
                info.message += indentLines(`\nReason: ${errorToString(info.error)}`);

            if (info.tabId != null)
                info.message = `(Tab ${info.tabId}) ${info.message}`;

            if (info.port != null)
                info.message = `(Port ${info.port}) ${info.message}`;

            if (info.label != null)
                info.message = `(${info.label}) ${info.message}`;

            if (info.listNumber != null)
                info.message = `[Website ${info.listNumber}] ${info.message}`;

            return `${info.level}: ${info.message}`;
        })
    )
});

export const consoleReadline = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
