import process from 'node:process';
import { execScript } from '../utils/execUtils.js';
import createProxyClient from '../utils/proxyUtils.js';
import path from 'node:path';

const packageName = process.argv[2];
console.log('Selected package:', packageName);

console.log('Starting proxy client');
const proxy = await createProxyClient('ws://127.0.0.1:3001');

await execScript({ filePath: 'intercept-traffic.sh' }, packageName);

console.log('Stopping proxy client');
await proxy.close();

console.log('Transferring flows');
const destPath = path.resolve(`./${packageName}.flows`);
await execScript({ filePath: 'get-addon-file.sh' }, 'combined.flows', destPath);