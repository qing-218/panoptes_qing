import winston from 'winston';
import BasePageResults from './BasePageResults.js';
import BaseTabInfo from './BaseTabInfo.js';

export default abstract class BaseTabResults<
    TabInfo extends BaseTabInfo,
    PageResults extends BasePageResults<TabInfo, any>,
> {
    public constructor(
        public readonly logger: winston.Logger,
        public readonly tabInfo: TabInfo,
        protected _currentPage: PageResults | null
    ) {

    }

    get currentPage() {
        return this._currentPage;
    }

    abstract newVisit(listNumber: number, url: URL, visitNumber: number): PageResults;
}

