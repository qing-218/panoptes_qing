import BaseTabResults from './BaseTabResults.js';
import BasePageResults from './BasePageResults.js';
import Incompatible from './Incompatible.js';
import BaseTabInfo from './BaseTabInfo.js';

export default interface BaseTabControls<
    TabInfo extends BaseTabInfo,
    PageResults extends BasePageResults<TabInfo, TabResults>,
    TabResults extends BaseTabResults<TabInfo, PageResults>
> extends Incompatible<'BaseTabControls'> {
    navigate: (url: string, onLoaded: (handler: (url: string) => void) => () => void) => Promise<string>;
    results: TabResults;
    disconnect: () => Promise<void>;
    evaluate: (expression: string) => Promise<void>;
    reloadPageScript: (source: string) => Promise<void>;
}