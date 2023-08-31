import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import * as csv from 'csv-stringify/sync';
import psl from 'psl';

const blockedHosts = new Set();
const firstPartyDomains = [
    'ucweb.com',
    'coccoc.com',
    'miui.com',
    'opera.com',
    'qq.com',
    'yandex.net',
    'alibaba.com'
];
const firstPartyHostRegex = new RegExp(`(.+\.)?(${firstPartyDomains.join('|').replace('.', '\.')})$`);

const stevenBlack = readline.createInterface({
    input: fss.createReadStream('./constants/stevenblack.txt'),
    crlfDelay: Infinity
});

for await (const line of stevenBlack) {
    if (!line.startsWith('0.0.0.0')) continue;

    const host = line.substring(8);
    if (firstPartyHostRegex.test(host)) continue;

    blockedHosts.add(host);
}

const stats = [];

for (let i = 2; i < process.argv.length; i++) {
    const resultsDir = process.argv[i];
    const susNativeFlows = JSON.parse(await fs.readFile(
        path.join(resultsDir, 'susNativeFlows.json'), { encoding: 'utf8' }));

    const hostCount = {};
    for (const flow of susNativeFlows) {
        const { hostname } = new URL(flow.url);
        hostCount[hostname] ??= 0;
        hostCount[hostname]++;
    }

    let nativeHostCount = 0;
    let nativeRequestCount = 0;

    let nativeAdHostCount = 0;
    let nativeAdRequestCount = 0;

    const domains = new Set();
    const adDomains = new Set();
    for (const host in hostCount) {
        const count = hostCount[host];
        const { domain } = psl.parse(host);

        nativeHostCount++;
        nativeRequestCount += count;
        domains.add(domain);

        if (!blockedHosts.has(host)) continue;

        nativeAdHostCount++;
        nativeAdRequestCount += count;
        adDomains.add(domain);
    }

    stats.push({
        directory: resultsDir,
        hostCount: nativeAdHostCount,
        hostPercentage: nativeAdHostCount / nativeHostCount,
        requestCount: nativeAdRequestCount,
        requestPercentage: nativeAdRequestCount / nativeRequestCount,
        domainCount: adDomains.size,
        domainPercentage: adDomains.size / domains.size,
        domains: Array.from(adDomains).join(', ')
    });
}

console.log(csv.stringify(stats, {
    header: true,
    columns: [
        { key: 'directory', header: 'Directory' },
        { key: 'hostCount', header: 'Host count' },
        { key: 'hostPercentage', header: 'Host %' },
        { key: 'requestCount', header: 'Request count' },
        { key: 'requestPercentage', header: 'Request %' },
        { key: 'domainCount', header: 'Domain count' },
        { key: 'domainPercentage', header: 'Domain %' },
        { key: 'domains', header: 'Domains' }
    ]
}));