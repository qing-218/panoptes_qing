import fs from 'node:fs/promises';
import path from 'node:path';

function getHeaderValue(headers, name) {
    for (const pair of headers) {
        if (pair[0].toLowerCase() === name)
            return pair[1].toLowerCase();
    }
    return "";
}

function getContentType(headers) {
    return getHeaderValue(headers, "content-type")
        .split(";")[0]
        .split(" ")[0];
}

// const allowedResourceExtensions = ["png", "jpeg", "jpg", "svg", "gif"];
// const allowedResourceExtensionsRegex = new RegExp(`\.(${allowedResourceExtensions.join("|")})$`, "i");

const allowedResourceTypes = new Set([
    // "application/rss+xml",      //RSS
    // "application/xml",          //RSS
    // "text/xml",                 //RSS
    // "application/atom+xml",     //RSS
    // "application/rdf+xml",      //RSS
    // "application/json",         //Manifests
    // "image/x-icon",             //Favicons
    // "image/png",                //Favicons
    // "image/vnd.microsoft.icon", //Favicons
    // "image/gif",                //Favicons
    // "image/svg+xml",            //Favicons
    // "image/jpeg",               //Favicons
    // "application/javascript",   //Service workers
    // "text/javascript",          //Service workers
    "application/dns-message",  //Google DNS over HTTPS
]);

const allowedRequestTypes = new Set([
    "application/reports+json", //NEL
    "application/dns-message"   //Cloudflare DNS over HTTPS
]);

function isFlowsSus(flow) {
    if (allowedRequestTypes.has(getContentType(flow.requestHeaders))) return false;

    // if (!!getHeaderValue(flow.requestHeaders, "origin")) return false;
    // if (!!getHeaderValue(flow.requestHeaders, "referer")) return false;

    // if (getHeaderValue(flow.responseHeaders, "upgrade") === "websocket") return false;
    // if (!!getHeaderValue(flow.responseHeaders, "location")) return false;

    if (flow.method === "OPTIONS") return false;
    if (flow.method !== "GET") return true;

    // const { pathname } = new URL(flow.url);
    // if (allowedResourceExtensionsRegex.test(pathname)) return false;

    return !allowedResourceTypes.has(getContentType(flow.responseHeaders));
}

for (let i = 2; i < process.argv.length; i++) {
    const resultsDir = process.argv[i];
    console.log("Processing directory", resultsDir);

    const nativeFlows = JSON.parse(await fs.readFile(
        path.join(resultsDir, "nativeFlows.json"), { encoding: "utf8" }));

    await fs.writeFile(
        path.join(resultsDir, "susNativeFlows.json"),
        JSON.stringify(nativeFlows.filter(isFlowsSus), null, 4)
    );
}
