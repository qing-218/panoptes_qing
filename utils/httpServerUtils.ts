import express from 'express';
import NavigationTypes from '../constants/NavigationTypes.js';

const port = 3002;
const app = express();

const getBaseUrl = (host: string) =>
    `http://${host}:${port}`;

export const getBlankPageUrl = (httpHost: string, id: string = '') =>
    `${getBaseUrl(httpHost)}/blank/${id}`;

export const getNavigationTypeEmulationUrl = (httpHost: string, type: NavigationTypes, destUrl: string) => {
    if (destUrl.startsWith(getBlankPageUrl(httpHost))) return destUrl;
    if (type === NavigationTypes.Direct) return destUrl;

    return `${getBaseUrl(httpHost)}/redirect/${type}/${encodeURIComponent(destUrl)}`;
};

app.get('/static/clickLink.js', (req, res) => {
    res.type('text/javascript').send('link.click()');
});

app.get('/redirect/302/:url', (req, res) => {
    res.redirect(302, req.params.url);
});

app.get('/redirect/link/:url', (req, res) => {
    res.type('text/html').send(`
        <html lang='en'>
            <head>
                <title>Redirecting using link</title>
                <script src='/static/clickLink.js' defer></script>
            </head>
            <body>
                <a id='link' href='${req.params.url}' target='${req.query.target ?? '_self'}'>Link</a>
            </body>
        </html>
    `);
});

app.get('/redirect/meta/:url', (req, res) => {
    res.type('text/html').send(`
     <html lang='en'>
        <head>
            <title>Redirecting using meta tag</title>
            <meta http-equiv='refresh' content="0;URL='${req.params.url}'" />   
        </head>
        <body>
            Redirecting
        </body>
    </html>
    `);
});

app.get('/blank/:id?', (req, res) => {
    res.type('text/html').send(`
        <html lang='en'>
            <head>
                <title>Blank page ${req.params.id ?? ''}</title>
            </head>
            <body>
                Ready for navigation
            </body>
        </html>
    `);
});

export function startHttpServer() {
    return new Promise<() => Promise<void>>((resolve) => {
        const server = app.listen(port, () => {
            resolve(() => new Promise<void>((resolve, reject) => {
                server.close(err => {
                    if (err) reject(err);
                    resolve();
                });
                server.closeAllConnections();
            }));
        });
    });
}