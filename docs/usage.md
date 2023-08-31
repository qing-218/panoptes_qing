## Usage

### Configuration

The results are organized in folders, by browser. So the first step is to create a new directory for the browser that
you'll use for the crawl. To do that, enter the 'browsers' directory, which is located inside the project's root
directory, and make a copy of the 'template' directory, giving it a meaningful name.

Entering the directory you created, you should find an 'index.ts' and a 'websites.txt' file. If doing an automated
crawl, edit the 'websites.txt'
file to include the websites to crawl (If a website doesn't start with 'http(s)://', 
'http://' will be assumed). Next, open the 'index.ts' file; it should look like this:

```typescript
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
```

The pre-configured browser is chrome. On the first line, you can change 'chrome.js' to any other browser module in
the '[modules](../modules)' directory, replacing its .ts extension with .js. To start a crawl, 'Browser.crawl' is
called, with a configuration object as an argument. Here are the available options:

- **pageLoadTimeout**: The maximum amount of time (in milliseconds) to wait for a website to load or fail to load
- **waitAfterLoadTimeout**: The amount of time (in milliseconds) to stay on a website after it loads or fails to load,
  before moving on to the next one
- **setupType**: Enables or disables setup wizard automation, when the app is to be reset to factory settings
    - **NoReset**: Do not reset the app to factory settings
    - **Manual**: Reset the app to factory settings and let the operator do the setup
    - **Automatic**: Reset the app to factory settings and automate the setup (Must be supported by the browser
      module)
- **openTabCount**: The number of tabs to open and use for the crawl. If set to 0, the operator must manually create
  tabs and select them to be used (this is the only way to crawl using incognito tabs)
- **automaticCrawl**: If set to true, the crawler automatically visits the websites contained in 'websites.txt'. If set
  to false, the operator can either manually input an address to visit through the console, or press enter to load the
  next website of 'websites.txt'.
- **navigationType**: The type of navigation to emulate
    - **Direct**: The user typed the url in the address bar
    - **Link**: The user clicked a link
    - **Http302**: The server returned a 302 status code
    - **Meta**: The website contained a meta refresh tag
- **blankingDuration**: The amount of time (in milliseconds) to stay on a blank page between website visits. This is
  done to improve the separation of traces of sequential website visits.
- **httpHost**: The ip or domain that the HTTP server is hosted at. For most browsers, '127.0.0.1' works fine. For QQ,
  you want to set it to the
  local ip of the computer running the crawler.
- **crawlDuration**: The maximum amount of time (in milliseconds) to wait for a crawl to complete, before it is stopped.
  If set to 0, no limit is placed on the crawl duration.
- **pageLoadType**: The event after which, a website crawl is considered complete
    - **ContentLoadedEvent**: The
      document [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
      event
    - **LoadEvent**: The window [load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) event
    - **Script**: A script inside the page, or an injected script, called the window.notifyLoaded function

### Crawling

> Ensure that the debian container is started, as outlined in the [setup guide](./setup.md)

For the crawl, you will need four terminal tabs/windows, all of them on the project's root directory.

On the three tabs/windows, run `npm run appium`, `npm run proxy` and `npm run frida` respectively.
For small crawls, you can use `npm run proxy -- -g` instead, to
start the proxy in gui mode. This is not recommended for large crawls as it uses vastly more memory (and remember
that the proxy runs on the android device itself).

On the fourth tab/window, run `npm run start -- BROWSER_DIR`, where BROWSER_DIR is the path of the directory you created
for the browser. 
At any point you can press Ctrl + C to stop the crawl, and it will be resumed on the next run.
To start a new crawl instead of resuming the previous one, delete the 'current' symlink, inside the 
'results' directory, inside the browser's directory.

After the crawl is done, you should have this directory structure:

```
<browser>/
	config.ts
	websites.txt
	results/
		current/ -> <latest id>-<latest part>/
   		<id>-<part>/									
   			combined.flows
   			crawlLog.txt
   			metadata.json
   			websites.txt
   			websites/
   				<number>-<hostname>-<visit>/
   					metadata.json				
   					visitLog.txt
   					navigations.json
   					pageScripts.json

```

The 'combined.flows' file is in mitmproxy's binary format, and contains both the native and website requests. The
website requests are marked, and have a comment containing metadata.
