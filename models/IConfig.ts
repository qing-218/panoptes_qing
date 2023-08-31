import SetupTypes from '../constants/SetupTypes.js';
import NavigationTypes from '../constants/NavigationTypes.js';
import PageLoadTypes from '../constants/PageLoadTypes.js';

export default interface IConfig {
    pageLoadTimeout: number;
    waitAfterLoadDuration: number;
    blankingDuration: number;
    setupType: SetupTypes;
    openTabCount: number;
    automaticCrawl: boolean;
    navigationType: NavigationTypes;
    crawlDuration: number;
    httpHost: string;
    pageLoadType: PageLoadTypes;
}
