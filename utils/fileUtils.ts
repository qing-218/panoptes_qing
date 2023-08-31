import fs from 'node:fs/promises';
import path from 'node:path';

export async function ensureEmptyDir(dirPath: string) {
    try {
        const contents = await fs.readdir(dirPath);
        for (const name of contents)
            await fs.rm(path.join(dirPath, name), { recursive: true });

    } catch (err: unknown) {
        const nodeErr = err as NodeJS.ErrnoException;
        if (nodeErr.code !== 'ENOENT')
            throw err;

        await fs.mkdir(dirPath);
    }
}

export async function mkdirForce(dirPath: string) {
    try {
        await fs.mkdir(dirPath);
    } catch (err: unknown) {
        const nodeErr = err as NodeJS.ErrnoException;
        if (nodeErr.code !== 'EEXIST') throw err;
    }
}