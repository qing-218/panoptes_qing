import WebSocket from 'ws';

export default async function createProxyClient(address: string) {
    const ws = new WebSocket(address);
    let close = false;

    ws.on('open', () => {
        ws.on('message', messageHandler);
        ws.on('error', (e) => {
            console.log('WebSocket error: ' + e);
        });
    });

    const openedPromise = new Promise((resolve, reject) => {
        ws.once('error', reject);
        ws.once('open', resolve);
    });

    const closedPromise = new Promise(res => {
        ws.on('close', res);
    });

    async function messageHandler() {
        ws.send(Buffer.from(JSON.stringify({
            close
        }), 'utf8'));
    }

    await openedPromise;
    return {
        close: () => {
            close = true;
            return closedPromise;
        },
        kill: () => {
            ws.close(1000);
            return closedPromise;
        }
    };
}
