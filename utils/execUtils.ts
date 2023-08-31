import cp from 'node:child_process';
import path from 'node:path';
import { rootPath, rootNames } from '../constants/files.js';

export class ExecError extends Error {
    constructor(
        public executable: string,
        public args: string[],
        public code: number
    ) {
        super(`Command ${path.basename(executable)} finished with code ${code}`);
        this.name = 'ExecError';
    }
}

interface IExecuteOptions extends cp.SpawnOptions {
    filePath: string;
}

export function execScript(options: IExecuteOptions, ...args: string[]): Promise<void> {
    return execFile({
        cwd: rootPath,
        ...options,
        filePath: path.join(rootPath, rootNames.scriptsDir, options.filePath)
    }, ...args);
}

export function execFile(options: IExecuteOptions, ...args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const { filePath, ...rest } = options;
        const script = cp.spawn(filePath, args, { stdio: 'inherit', shell: true, ...rest });

        script.on('error', reject);
        script.on('close', code => {
            if (code)
                reject(new ExecError(filePath, args, code));
            else
                resolve();
        });
    });
}
