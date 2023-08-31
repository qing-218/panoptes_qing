import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
export const rootPath = path.join(__dirname, '..');

export const rootNames = {
    scriptsDir: 'scripts',
    fridaModulesDir: path.join('fridaModules', 'dist')
};

export const cwdNames = {
    websiteListFile: 'websites.txt',
    resultsDir: 'results',
    pageScriptsDir: 'pageScripts',
    fridaScriptsDir: 'fridaScripts'
};

export const currentResultsSymlinkName = 'current';
export const getResultsDirName = (browser: string, crawlId: string, part: number) =>
    `${browser}_${crawlId}-${part}`;

export const resultNames = {
    metadataFile: 'metadata.json',
    lastNumberCrawledFile: 'lastNumberCrawled.txt',
    websitesDir: 'websites',
    websiteListFile: 'websites.txt',
    crawlLogFile: 'crawlLog.txt',
    combinedFlowsFile: 'combined.flows'
};
export const getWebsiteResultsDirName = (listNumber: number, host: string, visitNumber: number) =>
    `${listNumber}-${host}-${visitNumber}`;

export const websiteResultNames = {
    metadataFile: 'metadata.json',
    navigationsFile: 'navigations.json',
    pageScriptsFile: 'pageScripts.json',
    visitLogFile: 'visitLog.txt'
};
