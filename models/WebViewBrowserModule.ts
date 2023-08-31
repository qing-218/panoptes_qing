import WebViewClient, { MessageHandler } from './WebViewClient.js';
import BaseBrowserModule from './BaseBrowserModule.js';
import { FridaEvents } from '../common/fridaMessages.js';
import { getNavigationTypeEmulationUrl } from '../utils/httpServerUtils.js';
import PageBindings from '../constants/PageBindings.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { rootPath, rootNames } from '../constants/files.js';
import { HandlerActionYield } from '../utils/handlerUtils.js';
import NavigationError from './NavigationError.js';
import BaseBrowserControls from './BaseBrowserControls.js';
import BaseTabControls from './BaseTabControls.js';
import BaseTabInfo from './BaseTabInfo.js';
import BasePageResults from './BasePageResults.js';
import BaseTabResults from './BaseTabResults.js';

type WebViewTabInfo = BaseTabInfo;

type WebViewPageResults = BasePageResults<WebViewTabInfo, WebViewTabResults>;

class WebViewTabResults extends BaseTabResults<WebViewTabInfo, WebViewPageResults> {
    newVisit(listNumber: number, url: URL, visitNumber: number): WebViewPageResults {
        return this._currentPage = new BasePageResults(this, listNumber, url, visitNumber);
    }
}

interface WebViewBrowserControls extends BaseBrowserControls {
    client: WebViewClient;
}

interface WebViewTabControls extends BaseTabControls<WebViewTabInfo, WebViewPageResults, WebViewTabResults> {

}

export abstract class WebViewBrowserModule extends BaseBrowserModule<
    WebViewTabInfo,
    WebViewPageResults, WebViewTabResults,
    WebViewBrowserControls, WebViewTabControls
> {
    protected abstract readonly _fridaModuleName: string;
    protected readonly _browserSetupBeforeAppSetup: boolean = true;

    protected async _getBrowserControls(props: HandlerActionYield<typeof this._attachToApp>): Promise<WebViewBrowserControls> {
        const { session, logger, abortController } = props;

        abortController.signal.throwIfAborted();
        logger.info('Reading frida module source');
        const modulePath = path.join(rootPath, rootNames.fridaModulesDir, this._fridaModuleName);
        const source = await fs.readFile(modulePath, { encoding: 'utf-8' });

        abortController.signal.throwIfAborted();
        logger.info('Creating frida module');
        const script = await session.createScript(source, {}, abortController.cancellable);

        abortController.signal.throwIfAborted();
        logger.info('Starting frida module client');
        const client = WebViewClient.init(script, logger);

        abortController.signal.throwIfAborted();
        logger.info('Loading frida module');
        await script.load(abortController.cancellable);

        return {
            client: client.instance,
            disconnect: async () => {
                logger.info('Stopping frida module client');
                client.unregisterSignals();

                logger.info('Unloading frida module');
                await script.unload();
            }
        };
    }

    protected _getTabs(props: HandlerActionYield<typeof this._setupBrowser>): Promise<WebViewTabInfo[]> {
        return props.browserControls.client.send('GetTabs', null).then(p => p.tabs);
    }

    protected async _getTabControls(props: HandlerActionYield<typeof this._createTabProps>): Promise<WebViewTabControls> {
        const { tabInfo, replacedPage, logger, abortController, config, browserControls: { client } } = props;
        const tabLogger = logger.child({ tabId: tabInfo.id });

        abortController.signal.throwIfAborted();
        tabLogger.verbose(`Connecting to tab`);
        await client.send('Connect', { tabId: tabInfo.id });

        const disconnect = async () => {
            tabLogger.info(`Disconnecting from tab`);
            await client.send('Disconnect', { tabId: tabInfo.id });
        };

        try {
            const results = new WebViewTabResults(tabLogger, tabInfo, replacedPage);
            let pageScriptsIdentifier: string;

            return {
                async navigate(url, onLoaded) {
                    const loaded = new Promise<string>((resolve, reject) => {
                        const errorHandler: MessageHandler<FridaEvents['LoadingFailed']> = params => {
                            if (params.tabId !== tabInfo.id) return;
                            if (params.errorText === 'net::ERR_ABORTED') return;

                            reject(new NavigationError(params.errorText, params.url));
                            unsubscribeLoad();
                        };

                        client.on('LoadingFailed', errorHandler);
                        const unsubscribeLoad = onLoaded(url => {
                            resolve(url);
                            client.off('LoadingFailed', errorHandler);
                        });
                    });

                    url = getNavigationTypeEmulationUrl(config.httpHost, config.navigationType, url);
                    results.currentPage?.logger.info(`Navigating to ${url}`);
                    await client.send('Navigate', { tabId: tabInfo.id, url });

                    results.currentPage?.logger.verbose(`Waiting for page load`);
                    return await loaded;
                },
                disconnect,
                results,
                evaluate: async expression => {
                    await client.send('Evaluate', { tabId: tabInfo.id, expression });
                },
                reloadPageScript: async (source) => {
                    results.currentPage?.logger.verbose('Reloading page scripts');

                    if (pageScriptsIdentifier)
                        await client.send('RemoveScriptToEvaluateOnNewDocument',
                            { identifier: pageScriptsIdentifier, tabId: results.tabInfo.id });

                    await client.send('AddScriptToEvaluateOnNewDocument',
                        { tabId: results.tabInfo.id, source });
                }
            };
        } catch (err) {
            await disconnect();
            throw err;
        }
    }

    protected async _setupTab(props: HandlerActionYield<typeof this._addTabControls>) {
        await this._setupBindings(props);
        await this._setupPageNavigationMonitoring(props);
    }

    private async _setupBindings(props: HandlerActionYield<typeof this._addTabControls>) {
        const { tabControls: { results }, abortController, browserControls: { client }, tabEvents } = props;

        abortController.signal.throwIfAborted();
        results.logger.verbose('Setting up bindings');

        for (const name of Object.values(PageBindings))
            await client.send('RegisterBinding', { tabId: results.tabInfo.id, name });

        client.on('BindingCalled', params => {
            if (params.tabId !== results.tabInfo.id) return;
            tabEvents.emit('bindingCalled', params.name as PageBindings, params.payload);
        });
    }

    private async _setupPageNavigationMonitoring(props: HandlerActionYield<typeof this._addTabControls>) {
        const { tabControls: { results }, abortController, browserControls: { client } } = props;

        abortController.signal.throwIfAborted();
        results.logger.verbose('Setting up navigation monitoring');

        client.on('Navigated', params => {
            if (!results.currentPage) return;
            if (params.tabId !== results.tabInfo.id) return;

            results.currentPage.addNavigation({ url: params.url });
        });
    }
}
