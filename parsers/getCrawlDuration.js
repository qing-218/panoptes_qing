import fs from 'node:fs';

const log = fs.readFileSync('./crawlLog.txt', { encoding: 'utf8' }).trimEnd();
const lines = log.split('\n');

const lastLine = JSON.parse(lines[lines.length - 1]);
if (lastLine['message'] !== 'Done') {
    console.log('Crawl is not done yet');
    process.exit();
}

let duration = 0;
let startTimestamp = 0;
for (const line of lines) {
    const { timestamp, message } = JSON.parse(line);
    switch (message) {
        case 'Starting crawl': //For older crawls
        case 'Opening website list file':
            startTimestamp = Date.parse(timestamp);
            break;
        case 'Killing app':
            duration += Date.parse(timestamp) - startTimestamp;
            break;
    }
}

console.log(duration / 1000 / 60, 'minutes');


