import frida, { SessionDetachedHandler } from 'frida';
import winston from 'winston';
import IConfig from './IConfig.js';
import CrawlAbortController, { CrawlAbortError, SigAbortError } from './CrawlAbortController.js';
import BaseTabResults from './BaseTabResults.js';
import { consoleReadline, consoleTransport, defaultLogLevel, fileLogFormat } from '../utils/logUtils.js';
import { openInBrowser } from '../utils/adbUtils.js';
import { getBlankPageUrl, startHttpServer } from '../utils/httpServerUtils.js';
import { sleep } from '../utils/delayUtils.js';
import { indentLines } from '../utils/stringUtils.js';
import { execScript } from '../utils/execUtils.js';
import createProxyClient from '../utils/proxyUtils.js';
import path from 'node:path';
import { currentResultsSymlinkName, cwdNames, getResultsDirName, resultNames } from '../constants/files.js';
import { Capabilities, Options } from '@wdio/types';
import SetupTypes from '../constants/SetupTypes.js';
import { remote } from 'webdriverio';
import FridaDetachedError from './FridaDetachedError.js';
import { addHttpPrefix } from '../utils/urlUtils.js';
import fs from 'node:fs/promises';
import BrowserCrashedError from './BrowserCrashedError.js';
import PageBindings from '../constants/PageBindings.js';
import TypedEventEmitter from 'typed-emitter';
import EventEmitter from 'node:events';
import AsyncPageBindings from '../constants/AsyncPageBindings.js';
import packageJson from '../package.json' assert { type: 'json' };
import {
    createHandler,
    getNoopAction,
    HandlerActionNext,
    HandlerActionReturn,
    HandlerActionYield,
    NoopHandler
} from '../utils/handlerUtils.js';
import CertificateTypes from '../constants/CertificateTypes.js';
import NavigationError from './NavigationError.js';
import BasePageResults from './BasePageResults.js';
import BaseBrowserControls from './BaseBrowserControls.js';
import BaseTabControls from './BaseTabControls.js';
import BaseTabInfo from './BaseTabInfo.js';

type TabEvents = {
    'bindingCalled': (name: PageBindings, payload: string) => void
}

interface ICrawlMetadata {
    id: string,
    part: number,
    description: string,
    formatVersion: number
}

interface Browser {
    crawl: (config: IConfig) => Promise<void>;
}

const tabToString = (tab: BaseTabInfo) =>
    `Id: ${tab.id}\nUrl: ${tab.url}\nTitle: ${tab.title}`;

// noinspection JSUnusedLocalSymbols
export default abstract class BaseBrowserModule<
    TabInfo extends BaseTabInfo,
    PageResults extends BasePageResults<TabInfo, TabResults>,
    TabResults extends BaseTabResults<TabInfo, PageResults>,
    BrowserControls extends BaseBrowserControls,
    TabControls extends BaseTabControls<TabInfo, PageResults, TabResults>,
> implements Browser {
    protected abstract readonly _package: string;
    protected abstract readonly _browserSetupBeforeAppSetup: boolean;

    protected readonly _certType: CertificateTypes = CertificateTypes.None;
    protected readonly _openTabFlags: number = 0;
    protected readonly _proxyBeforeAppSetup: boolean = true;

    private static _isCrawling = false;

    // Can't use the abstract keyword, because then the compiler complains about 'this' being used in the props type
    protected async _getBrowserControls(props: HandlerActionYield<typeof this._attachToApp>): Promise<BrowserControls> {
        throw new Error('This method is abstract');
    }

    protected async _getTabControls(props: HandlerActionYield<typeof this._createTabProps>): Promise<TabControls> {
        throw new Error('This method is abstract');
    }

    protected async _getTabs(props: HandlerActionYield<typeof this._setupBrowser>): Promise<TabInfo[]> {
        throw new Error('This method is abstract');
    }

    protected async _automaticAppSetup(props: HandlerActionYield<typeof this._attachToApp>) {
        throw new Error('This method is abstract');
    }

    protected async _beforeTabReplacement(props: HandlerActionYield<typeof this._setupBrowser>) {

    }

    protected async _setupTab(props: HandlerActionYield<typeof this._addTabControls>) {

    }

    protected async _afterTabReplacement(props: HandlerActionYield<typeof this._setupBrowser>) {

    }


    public async crawl(config: IConfig) {
        if (BaseBrowserModule._isCrawling) throw new Error('Only one crawl allowed at a time.');
        BaseBrowserModule._isCrawling = true;

        // @formatter:off
        await (
            createHandler(this._prepareResultsDir,
            createHandler(this._printConfig,
            createHandler(this._installCertificate,
            createHandler(this._startHttpServer,
            createHandler(this._startProxyClient,
            createHandler(this._enableCrashRecovery,
            createHandler(this._startAppiumDriver,
            createHandler(this._spawnApp,
            createHandler(this._attachToApp,
            createHandler(this._loadFridaScripts,
            createHandler(this._prepareBrowserSetup,
            createHandler(this._browserSetupBeforeAppSetup ? this._setupBrowser : getNoopAction(),
            createHandler(this._proxyBeforeAppSetup ? this._configureIpTables : getNoopAction(),
            createHandler(this._resumeApp,
            createHandler(this._setupApp,
            createHandler(this._proxyBeforeAppSetup ? getNoopAction(): this._configureIpTables,
            createHandler(this._setupBrowser,
            createHandler(this._setupTabs,
            createHandler(this._setupCrawl,
            createHandler(config.automaticCrawl ? this._automaticCrawl : this._manualCrawl,
            NoopHandler
        ))))))))))))))))))))).handle.call(this, config);
        //@formatter:on

        BaseBrowserModule._isCrawling = false;
    }

    protected async* _prepareResultsDir(config: IConfig) {
        const oldResultsDirPath = path.join(cwdNames.resultsDir, currentResultsSymlinkName);

        console.log('Reading last crawled number');
        const lastNumberCrawled = await fs.readFile(
            path.join(oldResultsDirPath, resultNames.lastNumberCrawledFile),
            { encoding: 'utf8' }
        ).then(content => parseInt(content)).catch(() => null);

        console.log('Generating crawl metadata');
        const formatVersion = parseInt(packageJson.version.split('.')[0]);
        const metadata: ICrawlMetadata = lastNumberCrawled != null
            ? await fs.readFile(path.join(oldResultsDirPath, resultNames.metadataFile), { encoding: 'utf8' })
                .then(current => {
                    const metadata = JSON.parse(current);
                    if (metadata.formatVersion !== formatVersion)
                        throw new Error('Cannot resume crawl as it was started with an older crawler version');

                    metadata.part++;
                    return metadata;
                })
            : {
                id: new Date().toISOString(),
                part: 1,
                description: await consoleReadline.question('Crawl description: '),
                formatVersion
            };

        console.log('Creating results directory');
        const newResultsDirName = getResultsDirName(this.constructor.name, metadata.id, metadata.part);
        const newResultsDirPath = path.join(cwdNames.resultsDir, newResultsDirName);
        await fs.mkdir(newResultsDirPath, { recursive: true });

        console.log('Creating crawl logger');
        const logger = winston.createLogger({
            level: defaultLogLevel,
            transports: [
                consoleTransport,
                new winston.transports.File({
                    filename: path.join(newResultsDirPath, resultNames.crawlLogFile),
                    format: fileLogFormat
                })
            ]
        });

        logger.verbose('Making website list copy');
        await fs.cp(
            lastNumberCrawled != null
                ? path.join(oldResultsDirPath, resultNames.websiteListFile)
                : cwdNames.websiteListFile,
            path.join(newResultsDirPath, resultNames.websiteListFile),
            { dereference: true }
        );

        logger.verbose('Writing metadata');
        await fs.writeFile(
            path.join(newResultsDirPath, resultNames.metadataFile),
            JSON.stringify(metadata, null, 2)
        );

        logger.verbose('Writing last crawled number');
        await fs.writeFile(
            path.join(newResultsDirPath, resultNames.lastNumberCrawledFile),
            lastNumberCrawled?.toString() ?? '0'
        );

        logger.verbose('Updating current symlink');
        try {
            await fs.unlink(oldResultsDirPath);
        } catch (err) {
            const nodeErr = err as NodeJS.ErrnoException;
            if (nodeErr.code !== 'ENOENT') throw err;
        }
        await fs.symlink(newResultsDirName, oldResultsDirPath, 'dir');

        const abortController = new CrawlAbortController();
        try {
            yield { logger, config, abortController };
        } catch (err) {
            logger.error('Stopping crawl because of error', { error: err });
        }

        logger.info('Done');

        if (!(abortController.signal.reason instanceof SigAbortError)) return;
        process.exit();
    }

    protected async* _printConfig(props: HandlerActionYield<typeof this._prepareResultsDir>) {
        const { logger, abortController, config } = props;
        abortController.signal.throwIfAborted();
        logger.info('Crawler configuration: ');

        logger.info(`Browser package: ${this._package}`);
        logger.info(`Page load timeout: ${config.pageLoadTimeout}ms`);
        logger.info(`Delay after load: ${config.waitAfterLoadDuration}ms`);
        logger.info(`Setup type: ${config.setupType}`);
        logger.info(`Create tab count: ${config.openTabCount}`);
        logger.info(`Is crawl automatic: ${config.automaticCrawl}`);
        logger.info(`Navigation type: ${config.navigationType}`);
        logger.info(`Crawl duration: ${config.crawlDuration}ms`);

        yield props;
    }

    protected async* _installCertificate(props: HandlerActionYield<typeof this._prepareResultsDir>) {
        const { logger, abortController } = props;
        abortController.signal.throwIfAborted();
        logger.info('Installing certificate');
        await execScript({ filePath: 'install-cert.sh' }, this._certType);

        yield props;
    }

    protected async* _startHttpServer(props: HandlerActionYield<typeof this._prepareResultsDir>) {
        const { abortController, logger } = props;

        abortController.signal.throwIfAborted();
        logger.info(`Starting http server`);
        const stopServer = await startHttpServer();

        try {
            yield props;
        } finally {
            logger.info('Stopping http server');
            await stopServer();
        }
    }

    protected async* _startProxyClient(props: HandlerActionYield<typeof this._prepareResultsDir>) {
        const { abortController, logger } = props;

        abortController.signal.throwIfAborted();
        logger.info('Starting proxy client');
        const proxy = await createProxyClient('ws://127.0.0.1:3001');

        try {
            yield props;
        } finally {
            logger.info('Stopping proxy client');
            await proxy.close();

            logger.info('Transferring flows');
            await execScript(
                { filePath: 'get-addon-file.sh' },
                'combined.flows',
                path.resolve(cwdNames.resultsDir, currentResultsSymlinkName, resultNames.combinedFlowsFile)
            );
        }
    }

    protected async* _enableCrashRecovery(props: HandlerActionYield<typeof this._prepareResultsDir>) {
        const { abortController, logger } = props;

        while (true) {
            try {
                yield props;
                break;
            } catch (err) {
                if (abortController.signal.reason instanceof CrawlAbortError) throw err;
                logger.warn('Restarting crawl because of error', { error: err });
                abortController.reset();
            }
        }
    }

    protected async* _startAppiumDriver(props: HandlerActionYield<typeof this._prepareResultsDir>) {
        const { config, abortController, logger } = props;

        const options: Options.WebdriverIO = {
            port: 4723,
            logLevel: 'error',
            capabilities: {
                'platformName': 'Android',
                'appium:autoGrantPermissions': true,
                'appium:noReset': config.setupType === SetupTypes.NoReset,
                'appium:newCommandTimeout': 0,
                'appium:automationName': 'UiAutomator2',
                'appium:deviceName': 'Android',
                'appium:appPackage': this._package,
                'appium:autoLaunch': false
            } as Capabilities.Capabilities
        };

        abortController.signal.throwIfAborted();
        logger.info('Starting appium driver');
        const driver = await remote(options);

        try {
            yield Object.assign(props, { driver });
        } finally {
            logger.info('Stopping appium');
            await driver.deleteSession();
        }
    }

    protected async* _spawnApp(props: HandlerActionYield<typeof this._startAppiumDriver>) {
        const { logger, abortController } = props;

        abortController.signal.throwIfAborted();
        logger.info('Getting adb device');
        const device = await frida.getUsbDevice({}, abortController.cancellable);

        abortController.signal.throwIfAborted();
        logger.info('Spawning app');
        const pid = await device.spawn(
            this._package,
            { stdio: frida.Stdio.Inherit },
            abortController.cancellable
        );

        try {
            yield Object.assign(props, { device, pid });
        } finally {
            logger.info('Killing app');
            await device.kill(pid).catch(error =>
                logger.warn('Couldn\'t kill app', { error }));
        }
    }

    protected async* _attachToApp(props: HandlerActionYield<typeof this._spawnApp>) {
        const { logger, abortController, device, pid } = props;

        abortController.signal.throwIfAborted();
        logger.info('Attaching to app');
        const session = await device.attach(pid, {}, abortController.cancellable);

        const detachHandler: SessionDetachedHandler = (reason, crash) =>
            abortController.abort(new FridaDetachedError(reason, crash));
        session.detached.connect(detachHandler);

        try {
            yield Object.assign(props, { session });
        } finally {
            logger.info('Detaching from app');
            session.detached.disconnect(detachHandler);
            await session.detach();
        }
    }

    protected async* _loadFridaScripts(props: HandlerActionYield<typeof this._attachToApp>) {
        const { logger, abortController, session } = props;

        abortController.signal.throwIfAborted();
        logger.info('Loading frida scripts');

        const loadedScripts: frida.Script[] = [];
        const scriptFiles = await fs.readdir(cwdNames.fridaScriptsDir);
        for (const scriptFile of scriptFiles.sort()) {
            const scriptPath = path.join(cwdNames.fridaScriptsDir, scriptFile);
            const scriptSource = await fs.readFile(scriptPath, { encoding: 'utf-8' });
            const script = await session.createScript(scriptSource, {}, abortController.cancellable);

            await script.load(abortController.cancellable);
            loadedScripts.push(script);
        }

        const unload = async () => {
            if (abortController.signal.reason instanceof BrowserCrashedError) return;

            logger.info('Unloading frida scripts');
            for (const script of loadedScripts)
                await script.unload();
        };

        try {
            yield props;
        } finally {
            await unload();
        }
    }

    protected async* _prepareBrowserSetup(props: HandlerActionYield<typeof this._attachToApp>) {
        yield Object.assign(props, { browserControls: null as (BrowserControls | null) });
    }

    protected async* _setupBrowser(props: HandlerActionYield<typeof this._prepareBrowserSetup>) {
        const { abortController, logger, browserControls: _currentBrowserControls } = props;

        abortController.signal.throwIfAborted();
        logger.info('Connecting to browser');

        const createBrowserControls = _currentBrowserControls == null;
        const browserControls = createBrowserControls ? await this._getBrowserControls(props) : _currentBrowserControls;
        const disconnect = () => {
            if (!createBrowserControls) return;
            if (abortController.signal.reason instanceof BrowserCrashedError) return;

            logger.info('Disconnecting from browser');
            return browserControls.disconnect().catch(error =>
                logger.warn('Failed to disconnect from browser', { error }));
        };

        try {
            yield Object.assign(props, { browserControls });
        } finally {
            await disconnect();
        }
    }

    protected async* _configureIpTables(props: HandlerActionYield<typeof this._prepareBrowserSetup>) {
        const { logger, abortController } = props;
        abortController.signal.throwIfAborted();
        logger.info('Configuring iptables');
        await execScript({ filePath: 'config-iptables.sh' }, this._package);

        try {
            yield props;
        } finally {
            logger.info('Clearing iptables configuration');
            await execScript({ filePath: 'config-iptables.sh' }, 'reset');
        }
    }

    protected async* _resumeApp(props: HandlerActionYield<typeof this._prepareBrowserSetup>) {
        const { logger, abortController, device, pid } = props;

        abortController.signal.throwIfAborted();
        logger.info('Resuming app');
        await device.resume(pid, abortController.cancellable);

        yield props;
    }

    protected async* _setupApp(props: HandlerActionYield<typeof this._prepareBrowserSetup>) {
        const { config, abortController, logger } = props;

        if (config.crawlDuration > 0) {
            logger.info('Scheduling crawl abort');
            setTimeout(() => {
                abortController.abort(new CrawlAbortError('Reached configured crawl duration'));
            }, config.crawlDuration);
        }

        if (config.setupType === SetupTypes.Automatic)
            await this._automaticAppSetup(props);
        else
            await this._manualAppSetup(props);

        yield props;
    }

    protected async* _createTabProps(
        props: HandlerActionYield<typeof this._setupBrowser>,
        tabInfo: TabInfo,
        replacedPage: PageResults | null = null
    ) {
        const tab: {
            controls: TabControls,
            events: TypedEventEmitter<TabEvents>,
            disableBindingHandling: () => void
        } = yield { ...props, tabInfo, replacedPage };

        return tab;
    }

    protected async* _addTabEvents(props: HandlerActionYield<typeof this._createTabProps>) {
        const tabEvents = new EventEmitter() as TypedEventEmitter<TabEvents>;
        const tab: HandlerActionNext<typeof this._createTabProps> = yield Object.assign(props, { tabEvents });
        return tab;
    }

    protected async* _addTabControls(props: HandlerActionYield<typeof this._addTabEvents>) {
        const tabControls = await this._getTabControls(props);
        const tab: HandlerActionNext<typeof this._addTabEvents> = yield Object.assign(props, { tabControls });
        return tab;
    }

    protected async* _enableBindingHandling(props: HandlerActionYield<typeof this._addTabControls>) {
        const { driver, tabControls, tabEvents } = props;

        const asyncBindingHandler = async (name: string, args: unknown[]) => {
            switch (name) {
                case AsyncPageBindings.SendKeys:
                    await driver.keys(args as string[]);
                    break;
                case AsyncPageBindings.MarkPageScriptExecuted:
                    return tabControls.results.currentPage?.markPageScriptExecuted();
                default:
                    throw new Error('Async binding not found');
            }
        };

        const bindingHandler = async (name: string, payload: string) => {
            switch (name) {
                case PageBindings.ScriptLog:
                    tabControls.results.currentPage?.addScriptLog(payload);
                    break;
                case PageBindings.AsyncBindingRequest:
                    const { id, name, args } = JSON.parse(payload);
                    const respond = (response: unknown) => tabControls.evaluate(
                        `asyncBindingHandlers[${id}](${JSON.stringify(response)});`);

                    try {
                        const result = await asyncBindingHandler(name, args);
                        await respond({ result });
                    } catch (err) {
                        await respond({ error: err instanceof Error ? err.message : 'Unknown error' });
                    }

                    break;
            }
        };

        tabEvents.on('bindingCalled', bindingHandler);
        yield props;

        return {
            controls: tabControls,
            events: tabEvents,
            disableBindingHandling: () => {
                tabEvents.off('bindingCalled', bindingHandler);
            }
        };
    }

    protected async* _callSetupTab(props: HandlerActionYield<typeof this._addTabControls>) {
        await this._setupTab(props);
        yield props;
    }

    protected async* _setupTabs(props: HandlerActionYield<typeof this._setupBrowser>) {
        const { abortController, logger } = props;

        const tabs: HandlerActionReturn<typeof this._createTabProps>[] = [];
        const replacementQueue: number[] = [];
        let replaceFinishedPromise = Promise.resolve();

        //@formatter:off
        const setupTab = (
            createHandler(this._createTabProps,
            createHandler(this._addTabEvents,
            createHandler(this._addTabControls,
            createHandler(this._enableBindingHandling,
            createHandler(this._callSetupTab,
            NoopHandler
        )))))).handle.bind(this);
        //@formatter:on

        const getTabIndex = (id: string) =>
            tabs.findIndex(t => t.controls.results.tabInfo.id === id);

        const processReplacementQueue = async () => {
            while (replacementQueue.length) {
                await this._beforeTabReplacement(props);
                while (replacementQueue.length) {
                    const index = replacementQueue[0];
                    tabs[index] = await setupTab(
                        props,
                        await this._openTab(props),
                        tabs[index].controls.results.currentPage
                    );

                    replacementQueue.shift();
                }
                await this._afterTabReplacement(props);
            }
        };

        try {
            yield Object.assign(props, {
                hasTab: (id: string) => (getTabIndex(id) >= 0),
                addTab: async (tab: TabInfo) => {
                    tabs.unshift(await setupTab(props, tab));
                },
                replaceTab: (index: number) => {
                    if (replacementQueue.push(index) === 1)
                        replaceFinishedPromise = processReplacementQueue();

                    return replaceFinishedPromise;
                },
                getTabCount: () => tabs.length,
                getTabControls: (index: number) => tabs[index].controls,
                getTabEvents: (index: number) => tabs[index].events
            });
        } finally {
            if (!(abortController.signal.reason instanceof BrowserCrashedError)) {
                for (const tab of tabs) {
                    await tab.controls.disconnect().catch(error =>
                        logger.warn('Failed to disconnect from tab', { error }));
                }
            }

            for (const tab of tabs) {
                await tab.controls.results.currentPage?.scrapIfOpen();
                tab.disableBindingHandling();
            }
        }
    }

    protected async* _setupCrawl(props: HandlerActionYield<typeof this._setupTabs>) {
        const { abortController, config, logger, getTabCount, getTabControls, getTabEvents, replaceTab } = props;

        await this._beforeTabReplacement(props);
        if (props.config.openTabCount)
            await this._openTabs(props);
        else
            await this._showTabPrompt(props);

        if (!getTabCount()) {
            logger.info('No tabs selected. Exiting...');
            return;
        }
        await this._afterTabReplacement(props);

        const currentResultsDirPath = path.join(cwdNames.resultsDir, currentResultsSymlinkName);
        const lastNumberCrawledFilePath = path.join(currentResultsDirPath, resultNames.lastNumberCrawledFile);
        const websiteListFilePath = path.join(currentResultsDirPath, resultNames.websiteListFile);

        abortController.signal.throwIfAborted();
        logger.verbose('Reading last number crawled file');
        let lastNumberCrawled = await fs.readFile(lastNumberCrawledFilePath, { encoding: 'utf8' })
            .then(content => parseInt(content));

        async function* getRemainingWebsiteList() {
            abortController.signal.throwIfAborted();
            logger.verbose('Opening website list file');
            const websiteListFile = await fs.open(websiteListFilePath);

            let listNumber = 0;
            for await (const website of websiteListFile.readLines()) {
                if (++listNumber <= lastNumberCrawled) continue;
                yield [listNumber, website] as [number, string];
            }
        }

        const getVisitFunction = (index: number) => async (listNumber: number, website: string) => {
            const url = addHttpPrefix(website);
            const navigate = (url: string) => {
                const controls = getTabControls(index);
                const events = getTabEvents(index);

                const blankPageUrl = getBlankPageUrl(config.httpHost);

                const onLoaded = (handler: (url: string) => void) => {
                    if (url.startsWith(blankPageUrl)) {
                        handler(url);
                        return () => { };
                    }

                    const dispose = () =>
                        events.off('bindingCalled', bindingHandler);

                    const bindingHandler = (name: string, payload: string) => {
                        if (name !== PageBindings.PageLoaded) return;
                        if (payload.startsWith(blankPageUrl)) return;

                        handler(payload);
                        dispose();
                    };

                    events.on('bindingCalled', bindingHandler);
                    return dispose;
                };

                const navigation = controls.navigate(url, onLoaded);
                const timeout = abortController.signal.cancelIfAborted(sleep(config.pageLoadTimeout))
                    .then(() => Promise.reject(new NavigationError('Timeout', url)));
                return Promise.race([navigation, timeout]);
            };

            let visitNumber = 1;
            const getResults = async () => {
                const controls = getTabControls(index);
                const results = controls.results.newVisit(listNumber, new URL(url), visitNumber++);

                const pageScript = await this._getPageScript(props);
                await controls.reloadPageScript(pageScript);

                try {
                    const loadedUrl = await navigate(url);
                    results.finished(loadedUrl);
                } catch (error) {
                    if (!(error instanceof NavigationError)) {
                        results.logger.debug('Unexpected navigation error', { error });
                        results.finished('', 'Unexpected');

                        await results.saveIfOpen();
                        throw error;
                    }
                    results.finished(error.url, error.code);
                }
                return results;
            };

            let results: PageResults;
            try {
                results = await getResults();
            } catch (error) {
                await replaceTab(index);
                results = await getResults(); // If it fails a second time, restart whole browser
            }

            return async () => {
                try {
                    await navigate(getBlankPageUrl(config.httpHost));
                    await abortController.signal.cancelIfAborted(sleep(config.blankingDuration));
                } catch (error) {
                    results.logger.warn(`Failed to visit blank website`, { error });
                }

                await results.saveIfOpen();
                if (listNumber > lastNumberCrawled) {
                    lastNumberCrawled = listNumber;

                    logger.verbose('Writing last number crawled file');
                    await fs.writeFile(lastNumberCrawledFilePath, lastNumberCrawled.toString());
                }
            };
        };

        yield Object.assign(props, {
            visitFunctions: Array.from(
                { length: getTabCount() },
                (_, index) => getVisitFunction(index)
            ),
            getRemainingWebsiteList
        });

        logger.verbose('Deleting last number crawled file');
        await fs.rm(lastNumberCrawledFilePath);
    }

    protected async* _manualCrawl(props: HandlerActionYield<typeof this._setupCrawl>) {
        const { abortController, visitFunctions: [visit], logger, getRemainingWebsiteList } = props;

        let endVisit: (() => Promise<void>) | undefined;
        let manualVisitIndex = -1;
        const remainingWebsiteList = getRemainingWebsiteList();

        while (true) {
            logger.verbose('Showing url prompt');
            const input = await consoleReadline.question(
                'Enter website to visit, "exit" to exit, or press enter to visit the next website in the list: ',
                { signal: abortController.signal }
            );

            await endVisit?.();

            if (input === 'exit') break;
            if (!!input) {
                endVisit = await visit(manualVisitIndex--, input);
                continue;
            }

            const nextWebsite = await remainingWebsiteList.next();
            if (nextWebsite.done) break;

            const [listNumber, website] = nextWebsite.value;
            endVisit = await visit(listNumber, website);
        }

        yield props;
    }

    protected async* _automaticCrawl(props: HandlerActionYield<typeof this._setupCrawl>) {
        const { logger, visitFunctions, abortController, config, getRemainingWebsiteList } = props;

        const runningVisits = visitFunctions.map((f, i) => Promise.resolve(i));
        for await (const [listNumber, website] of getRemainingWebsiteList()) {
            const tabIndex = await Promise.race(runningVisits);
            runningVisits[tabIndex] = visitFunctions[tabIndex](listNumber, website)
                .then(async saveResults => {
                    await abortController.signal.cancelIfAborted(sleep(config.waitAfterLoadDuration));
                    await saveResults();

                    return tabIndex;
                });
        }

        logger.verbose('Waiting for running visits');
        await Promise.all(runningVisits);

        yield props;
    }


    private async _openTab(props: HandlerActionYield<typeof this._setupBrowser>): Promise<TabInfo> {
        const { driver, abortController, config, logger } = props;
        const url = getBlankPageUrl(config.httpHost, Date.now().toString());

        abortController.signal.throwIfAborted();
        logger.info(`Opening crawl tab ${url}`);
        await openInBrowser(driver, this._package, url, this._openTabFlags);

        while (true) {
            const tabs = await this._getTabs(props);
            const tab = tabs.find(t => t.url.startsWith(url));
            if (tab) {
                const { width, height } = await driver.getWindowSize();
                await driver.touchAction([{ action: 'tap', x: width / 2, y: height / 2 }]);
                return tab;
            }

            await abortController.signal.cancelIfAborted(sleep(1000));
        }
    }

    private async _openTabs(props: HandlerActionYield<typeof this._setupTabs>) {
        const { config, addTab } = props;

        for (let i = 1; i <= config.openTabCount; i++)
            await addTab(await this._openTab(props));
    }

    private async _showTabPrompt(props: HandlerActionYield<typeof this._setupTabs>) {
        const { logger, abortController, addTab, hasTab } = props;

        while (true) {
            const tabs = await this._getTabs(props)
                .then(tabs => tabs.filter(t => !hasTab(t.id)));

            logger.verbose('Showing tab selection prompt');
            console.log('Tabs:');
            for (let i = 0; i < tabs.length; i++)
                console.log(indentLines(`Number: ${i}\n${tabToString(tabs[i])}`));

            const input = await consoleReadline.question(
                'Enter the number of the tab to select, "stop" to stop adding tabs, or press enter to refresh: ',
                { signal: abortController.signal }
            );

            if (!input) continue;
            if (input === 'stop') break;

            const number = /^\d+$/.test(input) ? +input : -1;
            if (number < 0 || number >= tabs.length) {
                console.log('Invalid tab number');
                continue;
            }

            await addTab(tabs[number]);
        }
    }

    private async _manualAppSetup(props: HandlerActionYield<typeof this._attachToApp>) {
        const { abortController, logger } = props;

        logger.verbose('Showing app ready prompt');
        await consoleReadline.question(
            'Please press enter when the app is ready: ',
            { signal: abortController.signal }
        );
    }

    private async _getPageScript(props: HandlerActionYield<typeof this._prepareResultsDir>) {
        const { config } = props;
        const scriptFiles = await fs.readdir(cwdNames.pageScriptsDir);

        let combinedSource: string = '';
        for (const scriptFile of scriptFiles.sort()) {
            const source = await fs.readFile(path.join(cwdNames.pageScriptsDir, scriptFile), { encoding: 'utf-8' });
            combinedSource += `{${source}}\n`;
        }

        return `(async function pageScript() {
            if (self !== top) return;
            if (window.config) return;
            
            window.config = ${JSON.stringify(config)};
            ${combinedSource}
        })();`;
    }
}
