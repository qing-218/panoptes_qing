import Browser from '../../modules/chrome.js';
import SetupTypes from '../../constants/SetupTypes.js';
import NavigationTypes from '../../constants/NavigationTypes.js';
import PageLoadTypes from '../../constants/PageLoadTypes.js';

Browser.crawl({
    pageLoadTimeout: 60 * 1000,
    waitAfterLoadDuration: 5 * 1000,
    setupType: SetupTypes.NoReset,
    automaticCrawl: false,
    openTabCount: 1,
    navigationType: NavigationTypes.Direct,
    blankingDuration: 3 * 1000,
    httpHost: '127.0.0.1',
    crawlDuration: 0,
    pageLoadType: PageLoadTypes.LoadEvent
});
