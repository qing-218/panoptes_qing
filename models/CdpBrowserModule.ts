import BaseBrowserModule from './BaseBrowserModule.js';
import sharedConstants from '../common/constants.json' assert { type: 'json' };
import CDP from 'chrome-remote-interface';
import { Protocol } from 'devtools-protocol';
import _ from 'lodash';
import { getRequestMetadataHeaderValue } from '../common/metadataHeaderUtils.js';
import { sleep } from '../utils/delayUtils.js';
import util from 'node:util';
import cp from 'node:child_process';
import PageBindings from '../constants/PageBindings.js';
import { getNavigationTypeEmulationUrl } from '../utils/httpServerUtils.js';
import { HandlerActionYield } from '../utils/handlerUtils.js';
import NavigationError from './NavigationError.js';
import BaseBrowserControls from './BaseBrowserControls.js';
import BaseTabControls from './BaseTabControls.js';
import BaseTabInfo from './BaseTabInfo.js';
import BaseTabResults from './BaseTabResults.js';
import winston from 'winston';
import BasePageResults from './BasePageResults.js';

const exec = util.promisify(cp.exec);

interface BrowserInstance {
    port: number;
    client: CDP.Client;
    disconnect: () => Promise<void>;
    updatePopupDetection: () => Promise<void>;
}

interface RequestMetadata {
    currentTargetId: string,
    targetId: string,
    requestId?: string,
    isNavigation: boolean,
    listNumber: number,
    mark: string
}

interface CdpTabInfo extends BaseTabInfo {
    socket: string;
}

class CdpTabResults extends BaseTabResults<CdpTabInfo, CdpPageResults> {
    public constructor(
        public targetId: string,
        public port: number,
        logger: winston.Logger,
        tabInfo: CdpTabInfo,
        currentPage: CdpPageResults | null
    ) {
        super(logger, tabInfo, currentPage);
    }

    newVisit(listNumber: number, url: URL, visitNumber: number): CdpPageResults {
        return (this._currentPage = new CdpPageResults(this, listNumber, url, visitNumber));
    }
}

class CdpPageResults extends BasePageResults<CdpTabInfo, CdpTabResults> {
    constructor(
        parent: CdpTabResults,
        listNumber: number,
        url: URL,
        visitNumber: number
    ) {
        super(parent, listNumber, url, visitNumber);
    }

    protected _getLoggerDefaultMeta(): any {
        return Object.assign(super._getLoggerDefaultMeta(), {
            port: this.parent.port
        });
    }

    protected async _save() {
        await super._save({
            targetId: this.parent.targetId
        });
    }
}

interface CdpBrowserControls extends BaseBrowserControls {
    getAllSockets: () => string[],
    getInstance: (socket: string) => BrowserInstance,
    setPopupDetectionEnabled: (enabled: boolean) => Promise<void>
}

interface CdpTabControls extends BaseTabControls<CdpTabInfo, CdpPageResults, CdpTabResults> {
    client: CDP.Client;
}

export default abstract class CdpBrowserModule extends BaseBrowserModule<
    CdpTabInfo,
    CdpPageResults, CdpTabResults,
    CdpBrowserControls, CdpTabControls
> {
    protected abstract readonly _cdpPort: string;
    protected readonly _browserSetupBeforeAppSetup: boolean = false;

    protected async _getTabs(props: HandlerActionYield<typeof this._setupBrowser>): Promise<CdpTabInfo[]> {
        const { browserControls, logger } = props;

        const allTabs: CdpTabInfo[] = [];
        for (const socket of browserControls.getAllSockets()) {
            const { port } = browserControls.getInstance(socket);

            logger.verbose('Scanning for pages', { port });
            const tabs = await CDP.List({ port });

            for (const tab of tabs)
                allTabs.push({ ...tab, socket });
        }

        return allTabs;
    }

    protected async _getBrowserControls(props: HandlerActionYield<typeof this._attachToApp>)
        : Promise<CdpBrowserControls> {

        const { logger, abortController, driver } = props;

        let popupDetectionEnabled = false;
        const freePorts: number[] = [];
        const instances: Record<string, BrowserInstance> = {};

        for (let port = 3100; port <= 3109; port++)
            freePorts.push(port);

        const connectToBrowser = async (port: number): Promise<CDP.Client> => {
            const browserLogger = logger.child({ port });

            abortController.signal.throwIfAborted();
            browserLogger.verbose('Getting version info');
            const version = await CDP.Version({ port });

            abortController.signal.throwIfAborted();
            browserLogger.verbose('Attaching to browser');
            const client = await CDP({
                port,
                local: true,
                target: version.webSocketDebuggerUrl
            });

            abortController.signal.throwIfAborted();
            browserLogger.verbose('Getting target id');
            const browserTargetId = await client.Target.getTargetInfo().then(i => i.targetInfo.targetId);

            client.Fetch.requestPaused(params => {
                const { request } = params;

                // Allow the request to pass through if labeled by a page
                if (request.headers[sharedConstants.webRequestMetadataHeader]) {
                    client.Fetch.continueRequest({ requestId: params.requestId }).catch(error =>
                        browserLogger.debug('Failed to pass-through paused request', { error }));

                    return;
                }

                // Add metadata header
                request.headers[sharedConstants.webRequestMetadataHeader] =
                    getRequestMetadataHeaderValue<RequestMetadata>({
                        targetId: params.frameId,
                        currentTargetId: browserTargetId,
                        requestId: params.networkId,
                        isNavigation: false,
                        listNumber: -1,
                        mark: 'browser'
                    });

                // Continue the request with the new headers
                const newHeaders: Protocol.Fetch.HeaderEntry[] = _.map<
                    Protocol.Network.Headers,
                    Protocol.Fetch.HeaderEntry
                >(request.headers, (value, name) => ({ name, value }));

                client.Fetch.continueRequest({ requestId: params.requestId, headers: newHeaders })
                    .catch(error => browserLogger.debug('Failed to continue paused request', { error }));
            });

            abortController.signal.throwIfAborted();
            browserLogger.verbose('Enabling request interception');
            await client.Fetch.enable({
                handleAuthRequests: false,
                patterns: [{}]
            });

            client.Target.targetCreated(async params => {
                const { targetInfo } = params;
                if (targetInfo.attached) return;

                // Even though setDiscoverTargets is called with a filter parameter,
                // not all browsers take it into account
                if (targetInfo.type !== 'page') return;

                // Try at an interval, because closeTarget sometimes doesn't resolve nor reject
                const intervalId = setInterval(async () => {
                    client.Target.getTargetInfo({ targetId: targetInfo.targetId })
                        .then(() => {
                            browserLogger.debug('Closing popup', { targetInfo });
                            return client.Target.closeTarget({ targetId: targetInfo.targetId });
                        })
                        .catch(error => {
                            browserLogger.debug('Failed to close popup', { error });
                        })
                        .finally(() => {
                            clearInterval(intervalId);
                        });
                }, 1000);
            });

            return client;
        };

        const discoverBrowsers = async () => {
            logger.verbose('Scanning for browsers');
            const catResult: string = await driver.executeScript('mobile: shell', [{
                command: 'cat',
                args: ['/proc/net/unix']
            }]);

            for (const match of catResult.matchAll(new RegExp(`@(${this._cdpPort})$`, 'gm'))) {
                const socket = match[1];
                if (socket in instances) continue;

                const port = freePorts.shift();
                if (port === undefined)
                    throw new Error('No free ports left for CDP sockets');

                const browserLogger = logger.child({ port });

                abortController.signal.throwIfAborted();
                browserLogger.verbose(`Port forwarding socket ${socket}`);
                await exec(`adb forward tcp:${port} localabstract:${socket}`);

                const client = await connectToBrowser(port);

                client.on('disconnect', async () => {
                    browserLogger.info(`Disconnected from browser`);
                    delete instances[socket];

                    browserLogger.verbose('Removing socket port forward');
                    await exec(`adb forward --remove tcp:${port}`);
                    freePorts.push(port);
                });

                const disconnect = async () => {
                    browserLogger.info('Disconnecting from browser');
                    await client.close().catch(error =>
                        browserLogger.warn('Failed to disconnect from browser', { error }));
                };

                const updatePopupDetection = async () => {
                    browserLogger.info(`${popupDetectionEnabled ? 'Enabling' : 'Disabling'} popup detection`);
                    await client.Target.setDiscoverTargets(
                        popupDetectionEnabled
                            ? { discover: true, filter: [{ type: 'page' }] }
                            : { discover: false }
                    ).catch(error =>
                        browserLogger.warn('Failed to update popup detection', { error }));
                };
                await updatePopupDetection();

                instances[socket] = { client, port, disconnect, updatePopupDetection };
            }
        };

        let discoverEnabled = true;
        const startDiscoveryLoop = async () => {
            while (discoverEnabled) {
                await discoverBrowsers().catch(error =>
                    logger.warn('Browser discovery failed', { error }));
                await sleep(1000);
            }
        };
        startDiscoveryLoop().then();

        return {
            getAllSockets: () => Object.keys(instances),
            getInstance: (socket: string) => instances[socket],
            setPopupDetectionEnabled: async (enabled: boolean) => {
                popupDetectionEnabled = enabled;
                for (const socket in instances)
                    await instances[socket].updatePopupDetection();
            },
            disconnect: async () => {
                discoverEnabled = false;
                for (const socket in instances)
                    await instances[socket].disconnect();
            }
        };
    }

    protected async _beforeTabReplacement(props: HandlerActionYield<typeof this._setupBrowser>): Promise<void> {
        const { browserControls } = props;
        await browserControls.setPopupDetectionEnabled(false);
    }

    protected async _afterTabReplacement(props: HandlerActionYield<typeof this._setupBrowser>) {
        const { browserControls } = props;
        await browserControls.setPopupDetectionEnabled(true);
    }

    protected async _getTabControls(props: HandlerActionYield<typeof this._createTabProps>): Promise<CdpTabControls> {
        const { tabInfo, logger, config, replacedPage, browserControls } = props;
        const browserInstance = browserControls.getInstance(tabInfo.socket);
        const tabLogger = logger.child({ port: browserInstance.port, tabId: tabInfo.id });

        tabLogger.debug(`Connecting to tab`, { tabInfo });
        const client = await CDP({
            port: browserInstance.port,
            local: true,
            target: tabInfo.id
        });

        const disconnect = async () => {
            tabLogger.info(`Disconnecting from tab`);
            await client.close().catch(error =>
                tabLogger.warn('Failed to disconnect from tab', { error }));
        };

        const disconnectedPromise = new Promise<void>((resolve) => {
            client.on('disconnect', async () => {
                tabLogger.info(`Disconnected from tab`);
                resolve();
            });
        });

        try {
            const tabTargetId = await client.Target.getTargetInfo().then(i => i.targetInfo.targetId);
            const results = new CdpTabResults(tabTargetId, browserInstance.port, tabLogger, tabInfo, replacedPage);
            let pageScriptsIdentifier: string;

            return {
                navigate: (url, onLoaded) => {
                    return new Promise<string>(async (resolve, reject) => {
                        const loaded = new Promise<string>(onLoaded);

                        try {
                            url = getNavigationTypeEmulationUrl(config.httpHost, config.navigationType, url);
                            results.currentPage?.logger.info(`Navigating to ${url}`);
                            const params = await client.Page.navigate({ url });

                            disconnectedPromise.then(() =>
                                reject(new NavigationError('Disconnected', url)));

                            if (params.errorText && params.errorText !== 'net::ERR_ABORTED') {
                                reject(new NavigationError(params.errorText, url));
                            } else {
                                results.currentPage?.logger.verbose(`Waiting for page load`);
                                resolve(await loaded);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });
                },
                results,
                disconnect,
                client,
                evaluate: async exp => {
                    await client.Runtime.evaluate({ expression: exp });
                },
                reloadPageScript: async (source) => {
                    results.currentPage?.logger.verbose('Reloading page scripts');

                    if (pageScriptsIdentifier)
                        await client.Page.removeScriptToEvaluateOnNewDocument({ identifier: pageScriptsIdentifier });

                    pageScriptsIdentifier = await client.Page.addScriptToEvaluateOnNewDocument({ source })
                        .then(r => r.identifier);
                }
            };
        } catch (err) {
            await disconnect();
            throw err;
        }
    }

    protected async _setupTab(props: HandlerActionYield<typeof this._addTabControls>) {
        const { tabControls: { client } } = props;

        await client.Page.enable();
        await client.Runtime.enable();
        await client.Network.enable();

        await this._setupBindings(props);
        await this._setupPageNavigationMonitoring(props);
        await this._setupPageRequestInterception(props);
        await client.Page.setDownloadBehavior({ behavior: 'deny' });
    }

    private async _setupBindings(props: HandlerActionYield<typeof this._addTabControls>) {
        const { tabControls: { client, results }, abortController, tabEvents } = props;

        abortController.signal.throwIfAborted();
        results.logger.verbose('Setting up bindings');

        for (const name of Object.values(PageBindings))
            await client.Runtime.addBinding({ name });

        client.Runtime.bindingCalled(params => {
            tabEvents.emit('bindingCalled', params.name as PageBindings, params.payload);
        });
    }

    private async _setupPageNavigationMonitoring(props: HandlerActionYield<typeof this._addTabControls>) {
        const { tabControls: { client, results }, abortController } = props;

        abortController.signal.throwIfAborted();
        results.logger.verbose('Setting up navigation monitoring');

        client.Page.frameRequestedNavigation(params => {
            if (!results.currentPage) return;
            if (params.frameId !== results.currentPage.parent.targetId) return;

            results.currentPage.addNavigation(params);
        });
    }

    private async _setupPageRequestInterception(props: HandlerActionYield<typeof this._addTabControls>) {
        const { tabControls: { client, results }, abortController } = props;

        abortController.signal.throwIfAborted();
        results.logger.verbose('Setting up request interception');

        client.Network.requestIntercepted(params => {
            const { request } = params;

            // Add web request metadata header
            request.headers[sharedConstants.webRequestMetadataHeader] =
                getRequestMetadataHeaderValue<RequestMetadata>({
                    targetId: params.frameId,
                    requestId: params.requestId,
                    isNavigation: params.isNavigationRequest,
                    currentTargetId: results.targetId,
                    listNumber: results.currentPage?.listNumber ?? 0,
                    mark: results.currentPage ? `visit-${results.currentPage.listNumber}` : 'setup'
                });

            client.Network.continueInterceptedRequest({
                interceptionId: params.interceptionId,
                headers: request.headers,
                authChallengeResponse: params.authChallenge ? { response: 'CancelAuth' } : undefined
            }).catch(error =>
                results.logger.debug('Failed to continue intercepted request', { error }));
        });

        await client.Network.setRequestInterception({
            patterns: [{ urlPattern: '*', interceptionStage: 'Request' }]
        });
    }
}