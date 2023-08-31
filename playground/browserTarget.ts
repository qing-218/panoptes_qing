import CDP from 'chrome-remote-interface';
// import { Protocol } from 'devtools-protocol';
import process from 'process';

const version = await CDP.Version();
const browser = await CDP({
    local: true,
    target: version.webSocketDebuggerUrl
});
console.log('Connected to browser', await browser.Target.getTargetInfo().then(r => r.targetInfo));

const page = await CDP({
    local: true
});
console.log('Connected to page', await page.Target.getTargetInfo().then(r => r.targetInfo));

page.Network.requestIntercepted(params => {
    page.Network.continueInterceptedRequest({
        interceptionId: params.interceptionId,
        headers: { ...params.request.headers, 'x-header-test': 'yes' }
    }).catch(err => {
        console.log('Failed to continue intercepted request', err);
    });
});

await page.Network.setRequestInterception({
    patterns: [{}]
});

await page.Network.enable();

browser.Fetch.requestPaused(params => {
    console.log(params.request.headers['x-header-test']);
    browser.Fetch.continueRequest({ requestId: params.requestId })
        .catch(err => {
            console.log('Failed to continue paused request', err);
        });
});

await browser.Fetch.enable({
    handleAuthRequests: false
});

// Target.attachedToTarget(params => {
//     console.log('Attached to target', params.targetInfo);
// });
//
// await Target.setAutoAttach({
//     autoAttach: true,
//     waitForDebuggerOnStart: false,
//     filter: [{ type: 'page' }],
//     flatten: true
// } as Protocol.Target.SetAutoAttachRequest);

process.stdin.resume();