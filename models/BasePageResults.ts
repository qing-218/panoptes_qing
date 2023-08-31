import winston from 'winston';
import path from 'node:path';
import {
    currentResultsSymlinkName,
    cwdNames,
    getWebsiteResultsDirName,
    resultNames,
    websiteResultNames
} from '../constants/files.js';
import fsSync from 'node:fs';
import { consoleTransport, defaultLogLevel, fileLogFormat } from '../utils/logUtils.js';
import fs from 'node:fs/promises';
import _ from 'lodash';
import BaseTabResults from './BaseTabResults.js';
import BaseTabInfo from './BaseTabInfo.js';

interface INavigation {
    [key: string]: any;

    url: string;
}

export default class BasePageResults<
    TabInfo extends BaseTabInfo,
    TabResults extends BaseTabResults<TabInfo, any>
> {
    public readonly logger: winston.Logger;
    private _navigations: INavigation[] = [];
    private _pageScriptOutput: Record<string, string[]> = {};
    private _isOpen = true;
    private _isPageScriptExecuted = false;
    private _finishUrl = '';
    private _errorCode = '';

    protected get _dirPath() {
        return path.join(
            cwdNames.resultsDir, currentResultsSymlinkName,
            resultNames.websitesDir, getWebsiteResultsDirName(this.listNumber, this.url.host, this.visitNumber)
        );
    }

    protected _getLoggerDefaultMeta(): any {
        return { tabId: this.parent.tabInfo.id, listNumber: this.listNumber };
    }

    constructor(
        public readonly parent: TabResults,
        public readonly listNumber: number,
        public readonly url: URL,
        public readonly visitNumber: number
    ) {
        parent.logger.verbose('Creating directory for visit', { dirPath: this._dirPath });
        fsSync.mkdirSync(this._dirPath, { recursive: true });

        const logFilePath = path.join(this._dirPath, websiteResultNames.visitLogFile);
        parent.logger.verbose('Creating log file for visit', { logFilePath });
        this.logger = winston.createLogger({
            level: defaultLogLevel,
            defaultMeta: this._getLoggerDefaultMeta(),
            transports: [
                consoleTransport,
                new winston.transports.File({
                    format: fileLogFormat,
                    filename: logFilePath
                })
            ]
        });
    }

    protected static _formatJson<T>(object: T) {
        return JSON.stringify(
            object,
            (key, value) => (value instanceof Set ? [...value] : value),
            2
        );
    }

    protected _saveFile<T>(fileName: string, object: T) {
        return fs.writeFile(
            path.join(this._dirPath, fileName),
            BasePageResults._formatJson(object)
        );
    }

    public finished(url: string, errorCode: string = '') {
        if (errorCode)
            this.logger.warn(`Failed to visit website. Error code: ${errorCode}`);
        else
            this.logger.info('Website loaded successfully');

        this._finishUrl = url;
        this._errorCode = errorCode;
    }

    public addNavigation(nav: INavigation) {
        if (_.last(this._navigations)?.url == nav.url) return;
        this._navigations.push(nav);
    }

    public addScriptLog(entryString: string) {
        const entry = JSON.parse(entryString);
        const namespaceLogs = (this._pageScriptOutput[entry.namespace] ??= []);
        delete entry.namespace;
        namespaceLogs.push(entry);
    }

    public markPageScriptExecuted() {
        let isFirstExecution = !this._isPageScriptExecuted;
        this._isPageScriptExecuted = true;
        return isFirstExecution;
    }

    private _closeIfOpen() {
        if (!this._isOpen) return false;
        this._isOpen = false;
        return true;
    }

    async scrapIfOpen() {
        if (!this._closeIfOpen()) return;
        await this._scrap();
    }

    async saveIfOpen() {
        if (!this._closeIfOpen()) return;
        await this._save();
    }

    protected async _scrap() {
        this.logger.close();

        this.parent.logger.verbose('Deleting visit directory', { listNumber: this.listNumber });
        await fs.rm(this._dirPath, { force: true, recursive: true });
    }

    protected async _save(extraMetadata: any = {}) {
        this.logger.verbose('Saving navigations file');
        await this._saveFile(websiteResultNames.navigationsFile, this._navigations);

        this.logger.verbose('Saving page script output file');
        await this._saveFile(websiteResultNames.pageScriptsFile, this._pageScriptOutput);

        this.logger.verbose('Saving metadata file');
        await this._saveFile(websiteResultNames.metadataFile, {
            ...extraMetadata,
            listNumber: this.listNumber,
            visitNumber: this.visitNumber,
            url: this.url,
            tabId: this.parent.tabInfo.id,
            errorCode: this._errorCode,
            finishUrl: this._finishUrl
        });

        this.logger.verbose('Closing log file');
        this.logger.close();
    }
}