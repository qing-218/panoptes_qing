📦
1172 /ucChina.js.map
1245 /ucChina.js
176 /common/constants.json
195 /common/fridaMessages.js.map
10 /common/fridaMessages.js
567 /common/metadataHeaderUtils.js.map
301 /common/metadataHeaderUtils.js
1257 /models/TaskRunnable.js.map
1220 /models/TaskRunnable.js
4516 /models/WebViewAutomator.js.map
5689 /models/WebViewAutomator.js
3818 /node_modules/@frida/base64-js/index.js
↻ base64-js
55789 /node_modules/@frida/buffer/index.js
↻ node:buffer
2221 /node_modules/@frida/ieee754/index.js
↻ ieee754
871 /utils/interceptMethodUtils.js.map
628 /utils/interceptMethodUtils.js
769 /utils/messageUtils.js.map
396 /utils/messageUtils.js
✄
{"version":3,"file":"ucChina.js","sourceRoot":"/home/jpegioudis/Documents/Projects/BrowserTracking/browserMitm/fridaModules/","sources":["ucChina.js"],"names":[],"mappings":"AAAA,OAAO,EAAE,eAAe,EAAE,MAAM,iCAAiC,CAAC;AAClE,OAAO,eAAe,MAAM,yBAAyB,CAAC;AACtD,OAAO,gBAAgB,MAAM,8BAA8B,CAAC;AAC5D,OAAO,EAAE,6BAA6B,EAAE,MAAM,iCAAiC,CAAC;AAEhF,IAAI,CAAC,OAAO,CAAC;IACT,MAAM,cAAc,GAAG,IAAI,CAAC,GAAG,CAAC,oCAAoC,CAAC,CAAC;IACtE,MAAM,eAAe,GAAG,IAAI,CAAC,GAAG,CAAC,sCAAsC,CAAC,CAAC;IACzE,MAAM,aAAa,GAAG,IAAI,CAAC,GAAG,CAAC,gDAAgD,CAAC,CAAC;IACjF,MAAM,eAAe,GAAG,IAAI,CAAC,GAAG,CAAC,gDAAgD,CAAC,CAAC;IAEnF,eAAe,CAAC,eAAe,CAAC,mBAAmB,EAAE,UAAS,OAAO,EAAE,GAAG;QACtE,GAAG,CAAC,SAAS,CAAC,eAAe,CAAC,wBAAwB,EAAE,6BAA6B,CAAC,EAAE,IAAI,EAAE,KAAK,EAAE,CAAC,CAAC,CAAC;IAC5G,CAAC,CAAC,CAAC;IAEH,MAAM,SAAS,GAAG,IAAI,gBAAgB,EAAE,CAAC;IACzC,eAAe,CAAC,cAAc,CAAC,CAAC,EAAE,SAAS,CAAC,eAAe,CAAC,IAAI,CAAC,SAAS,CAAC,CAAC,CAAC;IAC7E,eAAe,CAAC,aAAa,CAAC,aAAa,EAAE,SAAS,CAAC,iBAAiB,CAAC,IAAI,CAAC,SAAS,CAAC,CAAC,CAAC;IAC1F,eAAe,CAAC,aAAa,CAAC,eAAe,EAAE,SAAS,CAAC,6BAA6B,CAAC,IAAI,CAAC,SAAS,CAAC,CAAC,CAAC;IACxG,eAAe,CAAC,SAAS,CAAC,cAAc,GAAG,SAAS,CAAC,aAAa,CAAC,IAAI,CAAC,SAAS,CAAC,CAAC;AACvF,CAAC,CAAC,CAAC"}
✄
import { interceptBefore } from './utils/interceptMethodUtils.js';
import sharedConstants from './common/constants.json';
import WebViewAutomator from './models/WebViewAutomator.js';
import { getRequestMetadataHeaderValue } from './common/metadataHeaderUtils.js';
Java.perform(function () {
    const WebViewManager = Java.use('com.uc.browser.webwindow.webview.g');
    const NetworkDelegate = Java.use('com.uc.browser.webwindow.webview.g$a');
    const WebViewClient = Java.use('com.uc.browser.webwindow.WebWindowController$g');
    const WebChromeClient = Java.use('com.uc.browser.webwindow.WebWindowController$d');
    interceptBefore(NetworkDelegate.onBeforeSendRequest, function (webView, req) {
        req.setHeader(sharedConstants.webRequestMetadataHeader, getRequestMetadataHeaderValue({ mark: 'web' }));
    });
    const automator = new WebViewAutomator();
    interceptBefore(WebViewManager.f, automator.registerWebView.bind(automator));
    interceptBefore(WebViewClient.onPageStarted, automator.handlePageStarted.bind(automator));
    interceptBefore(WebViewClient.onReceivedError, automator.handleDeprecatedReceivedError.bind(automator));
    WebChromeClient.onJsAlert.implementation = automator.handleJsAlert.bind(automator);
});
✄
const d = {
    "webRequestMetadataHeader": "x-metadata-o7ywrozi7pmfrvsm8v67rodw4dn8is"
};
export default d;
export const webRequestMetadataHeader = d.webRequestMetadataHeader;
✄
{"version":3,"file":"fridaMessages.js","sourceRoot":"/home/jpegioudis/Documents/Projects/BrowserTracking/browserMitm/fridaModules/","sources":["common/fridaMessages.ts"],"names":[],"mappings":""}
✄
export {};
✄
{"version":3,"file":"metadataHeaderUtils.js","sourceRoot":"/home/jpegioudis/Documents/Projects/BrowserTracking/browserMitm/fridaModules/","sources":["common/metadataHeaderUtils.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,MAAM,EAAE,MAAM,aAAa,CAAC;AAMrC,MAAM,UAAU,6BAA6B,CAAgC,KAAQ;IACjF,OAAO,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,SAAS,CAAC,KAAK,EAAE,IAAI,EAAE,CAAC,CAAC,EAAE,MAAM,CAAC,CAAC,QAAQ,CAAC,QAAQ,CAAC,CAAC;AAClF,CAAC;AAED,MAAM,UAAU,0BAA0B,CAAgC,KAAa;IACnF,OAAO,IAAI,CAAC,KAAK,CAAC,MAAM,CAAC,IAAI,CAAC,KAAK,EAAE,QAAQ,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,CAAC,CAAC;AACrE,CAAC"}
✄
import { Buffer } from 'node:buffer';
export function getRequestMetadataHeaderValue(value) {
    return Buffer.from(JSON.stringify(value, null, 4), 'utf8').toString('base64');
}
export function parseRequestMetadataHeader(value) {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
}
✄
{"version":3,"file":"TaskRunnable.js","sourceRoot":"/home/jpegioudis/Documents/Projects/BrowserTracking/browserMitm/fridaModules/","sources":["models/TaskRunnable.ts"],"names":[],"mappings":"AASA,MAAM,CAAC,OAAO,OAAO,YAAY;IAW7B;QAHQ,WAAM,GAA+B,EAAE,CAAC;QAI5C,MAAM,IAAI,GAAG,IAAI,CAAC;QAClB,IAAI,CAAC,aAAa,GAAG,IAAI,CAAC,aAAa,CAAC;YACpC,IAAI,EAAE,0BAA0B;YAChC,UAAU,EAAE,CAAC,IAAI,CAAC,GAAG,CAAC,oBAAoB,CAAC,CAAC;YAC5C,OAAO,EAAE;gBACL,KAAK,EAAE;oBACH,MAAM,IAAI,GAAG,IAAI,CAAC,MAAM,CAAC,IAAI,CAAC,QAAQ,EAAE,CAAC,CAAC;oBAC1C,IAAI;wBACA,IAAI,CAAC,OAAO,CAAC,IAAI,CAAC,QAAQ,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC,CAAC;qBAC5C;oBAAC,OAAO,GAAG,EAAE;wBACV,IAAI,CAAC,MAAM,CAAC,GAAG,CAAC,CAAC;qBACpB;4BAAS;wBACN,OAAO,IAAI,CAAC,MAAM,CAAC,IAAI,CAAC,QAAQ,EAAE,CAAC,CAAC;qBACvC;gBACL,CAAC;aACJ;SACJ,CAAC,CAAC;IACP,CAAC;IA1BD,MAAM,KAAK,QAAQ;;QACf,MAAA,IAAI,CAAC,SAAS,oCAAd,IAAI,CAAC,SAAS,GAAK,IAAI,YAAY,EAAE,EAAC;QACtC,OAAO,IAAI,CAAC,SAAS,CAAC;IAC1B,CAAC;IAyBD,KAAK,CAAI,MAAoB,EAAE,QAAyB;QACpD,OAAO,IAAI,OAAO,CAAI,CAAC,OAAO,EAAE,MAAM,EAAE,EAAE;YACtC,MAAM,QAAQ,GAAG,IAAI,CAAC,aAAa,CAAC,IAAI,EAAE,CAAC;YAC3C,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,QAAQ,EAAE,CAAC,GAAG,EAAE,MAAM,EAAE,QAAQ,EAAE,OAAO,EAAE,MAAM,EAAE,CAAC;YACzE,MAAM,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;QAC1B,CAAC,CAAC,CAAC;IACP,CAAC;CACJ"}
✄
export default class TaskRunnable {
    constructor() {
        this._tasks = {};
        const self = this;
        this._TaskRunnable = Java.registerClass({
            name: `com.example.TaskRunnable`,
            implements: [Java.use('java.lang.Runnable')],
            methods: {
                'run': function () {
                    const task = self._tasks[this.hashCode()];
                    try {
                        task.resolve(task.callback(task.target));
                    }
                    catch (err) {
                        task.reject(err);
                    }
                    finally {
                        delete self._tasks[this.hashCode()];
                    }
                }
            }
        });
    }
    static get instance() {
        var _a;
        (_a = this._instance) !== null && _a !== void 0 ? _a : (this._instance = new TaskRunnable());
        return this._instance;
    }
    runAs(target, callback) {
        return new Promise((resolve, reject) => {
            const runnable = this._TaskRunnable.$new();
            this._tasks[runnable.hashCode()] = { target, callback, resolve, reject };
            target.post(runnable);
        });
    }
}
✄
{"version":3,"file":"WebViewAutomator.js","sourceRoot":"/home/jpegioudis/Documents/Projects/BrowserTracking/browserMitm/fridaModules/","sources":["models/WebViewAutomator.ts"],"names":[],"mappings":";;;;;;;;;AAAA,OAAO,YAAY,MAAM,mBAAmB,CAAC;AAC7C,OAAO,EAAE,SAAS,EAAE,UAAU,EAAE,MAAM,0BAA0B,CAAC;AAGjE,MAAM,+BAA+B,GAAG,+DAA+D,CAAC;AAExG,MAAM,YAAY;IAAlB;QACI,aAAQ,GAA2B,EAAE,CAAC;QACtC,YAAO,GAA2B,EAAE,CAAC;IACzC,CAAC;CAAA;AAED,6CAA6C;AAC7C,+GAA+G;AAC/G,6EAA6E;AAC7E,yEAAyE;AAEzE,MAAM,CAAC,OAAO,OAAO,gBAAgB;IAIjC;QAHQ,cAAS,GAAiC,EAAE,CAAC;QAC7C,eAAU,GAAiC,EAAE,CAAC;QAGlD,SAAS,CAAC,SAAS,EAAE,GAAS,EAAE;YAC5B,MAAM,IAAI,GAAkB,EAAE,CAAC;YAC/B,KAAK,MAAM,EAAE,IAAI,IAAI,CAAC,SAAS,EAAE;gBAC7B,MAAM,OAAO,GAAG,IAAI,CAAC,SAAS,CAAC,EAAE,CAAC,CAAC;gBACnC,IAAI,CAAC,IAAI,CAAC,MAAM,YAAY,CAAC,QAAQ,CAAC,KAAK,CAAc,OAAO,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC;oBACpE,EAAE;oBACF,GAAG,EAAE,CAAC,CAAC,MAAM,EAAE;oBACf,KAAK,EAAE,CAAC,CAAC,QAAQ,EAAE;iBACtB,CAAC,CAAC,CAAC,CAAC;aACR;YAED,OAAO,CAAC,EAAE,IAAI,EAAE,EAAE,IAAI,CAAC,CAAC;QAC5B,CAAC,CAAA,CAAC,CAAC;QAEH,SAAS,CAAC,UAAU,EAAE,CAAM,MAAM,EAAC,EAAE;YACjC,MAAM,YAAY,CAAC,QAAQ,CAAC,KAAK,CAC7B,IAAI,CAAC,SAAS,CAAC,MAAM,CAAC,KAAK,CAAC,EAC5B,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,OAAO,CAAC,MAAM,CAAC,GAAG,CAAC,CAC7B,CAAC;YACF,OAAO,CAAC,IAAI,EAAE,IAAI,CAAC,CAAC;QACxB,CAAC,CAAA,CAAC,CAAC;QAEH,SAAS,CAAC,SAAS,EAAE,CAAM,MAAM,EAAC,EAAE;YAChC,IAAI,CAAC,UAAU,CAAC,MAAM,CAAC,KAAK,CAAC,GAAG,IAAI,YAAY,EAAE,CAAC;YACnD,OAAO,CAAC,IAAI,EAAE,IAAI,CAAC,CAAC;QACxB,CAAC,CAAA,CAAC,CAAC;QAEH,SAAS,CAAC,YAAY,EAAE,CAAM,MAAM,EAAC,EAAE;YACnC,OAAO,IAAI,CAAC,UAAU,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;YACrC,OAAO,CAAC,IAAI,EAAE,IAAI,CAAC,CAAC;QACxB,CAAC,CAAA,CAAC,CAAC;QAEH,SAAS,CAAC,iBAAiB,EAAE,CAAM,MAAM,EAAC,EAAE;YACxC,IAAI,CAAC,UAAU,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,GAAG;yBACzC,MAAM,CAAC,IAAI;2BACT,+BAA+B;6BAC7B,MAAM,CAAC,IAAI;;;;aAI3B,CAAC;YAEF,OAAO,CAAC,IAAI,EAAE,IAAI,CAAC,CAAC;QACxB,CAAC,CAAA,CAAC,CAAC;QAEH,SAAS,CAAC,kCAAkC,EAAE,CAAM,MAAM,EAAC,EAAE;YACzD,MAAM,UAAU,GAAG,IAAI,CAAC,GAAG,EAAE,CAAC,QAAQ,EAAE,CAAC;YACzC,IAAI,CAAC,UAAU,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,OAAO,CAAC,UAAU,CAAC,GAAG,MAAM,CAAC,MAAM,CAAC;YAElE,OAAO,CAAC,EAAE,UAAU,EAAE,EAAE,IAAI,CAAC,CAAC;QAClC,CAAC,CAAA,CAAC,CAAC;QAEH,SAAS,CAAC,qCAAqC,EAAE,CAAM,MAAM,EAAC,EAAE;YAC5D,OAAO,IAAI,CAAC,UAAU,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,OAAO,CAAC,MAAM,CAAC,UAAU,CAAC,CAAC;YAChE,OAAO,CAAC,IAAI,EAAE,IAAI,CAAC,CAAC;QACxB,CAAC,CAAA,CAAC,CAAC;QAEH,SAAS,CAAC,UAAU,EAAE,CAAM,MAAM,EAAC,EAAE;YACjC,MAAM,YAAY,CAAC,QAAQ,CAAC,KAAK,CAC7B,IAAI,CAAC,SAAS,CAAC,MAAM,CAAC,KAAK,CAAC,EAC5B,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,kBAAkB,CAAC,MAAM,CAAC,UAAU,EAAE,IAAI,CAAC,CACrD,CAAC;YACF,OAAO,CAAC,IAAI,EAAE,IAAI,CAAC,CAAC;QACxB,CAAC,CAAA,CAAC,CAAC;IACP,CAAC;IAEO,oBAAoB,CAAC,OAAqB;QAC9C,MAAM,EAAE,GAAG,OAAO,CAAC,QAAQ,EAAE,CAAC,QAAQ,EAAE,CAAC;QACzC,OAAO,EAAE,IAAI,IAAI,CAAC,UAAU,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC;IAC3C,CAAC;IAED,eAAe,CAAC,OAAqB;QACjC,IAAI,CAAC,OAAO;YAAE,OAAO;QACrB,IAAI,CAAC,SAAS,CAAC,OAAO,CAAC,QAAQ,EAAE,CAAC,GAAG,IAAI,CAAC,MAAM,CAAC,OAAO,CAAC,CAAC;IAC9D,CAAC;IAED,iBAAiB,CAAC,OAAqB,EAAE,GAAW;QAChD,MAAM,KAAK,GAAG,IAAI,CAAC,oBAAoB,CAAC,OAAO,CAAC,CAAC;QACjD,IAAI,CAAC,KAAK;YAAE,OAAO;QAEnB,MAAM,MAAM,GAAG,MAAM,CAAC,MAAM,CAAC,IAAI,CAAC,UAAU,CAAC,KAAK,CAAC,CAAC,QAAQ,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,GAAG,IAAI;cACzE,MAAM,CAAC,MAAM,CAAC,IAAI,CAAC,UAAU,CAAC,KAAK,CAAC,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;QAE/D,OAAO,CAAC,kBAAkB,CAAC,MAAM,EAAE,IAAI,CAAC,CAAC;QACzC,UAAU,CAAC,WAAW,EAAE,EAAE,GAAG,EAAE,KAAK,EAAE,CAAC,CAAC;IAC5C,CAAC;IAED,mBAAmB,CAAC,OAAqB,EAAE,OAAqB,EAAE,KAAmB;QACjF,IAAI,CAAC,OAAO,CAAC,cAAc,EAAE;YAAE,OAAO;QAEtC,MAAM,KAAK,GAAG,IAAI,CAAC,oBAAoB,CAAC,OAAO,CAAC,CAAC;QACjD,IAAI,CAAC,KAAK;YAAE,OAAO;QAEnB,UAAU,CAAC,eAAe,EAAE;YACxB,KAAK;YACL,SAAS,EAAE,KAAK,CAAC,cAAc,EAAE,CAAC,QAAQ,EAAE;YAC5C,GAAG,EAAE,OAAO,CAAC,MAAM,EAAE,CAAC,QAAQ,EAAE;SACnC,CAAC,CAAC;IACP,CAAC;IAED,6BAA6B,CAAC,OAAqB,EAAE,SAAiB,EAAE,WAAmB,EAAE,UAAkB;QAC3G,MAAM,KAAK,GAAG,IAAI,CAAC,oBAAoB,CAAC,OAAO,CAAC,CAAC;QACjD,IAAI,CAAC,KAAK;YAAE,OAAO;QAEnB,UAAU,CAAC,eAAe,EAAE;YACxB,KAAK;YACL,SAAS,EAAE,WAAW;YACtB,GAAG,EAAE,UAAU;SAClB,CAAC,CAAC;IACP,CAAC;IAED,aAAa,CAAC,OAAqB,EAAE,GAAW,EAAE,OAAe,EAAE,MAAoB;QACnF,MAAM,CAAC,OAAO,EAAE,CAAC;QACjB,IAAI,CAAC,OAAO,CAAC,UAAU,CAAC,+BAA+B,CAAC;YAAE,OAAO,IAAI,CAAC;QAEtE,MAAM,KAAK,GAAG,IAAI,CAAC,oBAAoB,CAAC,OAAO,CAAC,CAAC;QACjD,IAAI,CAAC,KAAK;YAAE,OAAO,IAAI,CAAC;QAExB,MAAM,OAAO,GAAG,IAAI,CAAC,KAAK,CAAC,OAAO,CAAC,SAAS,CAAC,+BAA+B,CAAC,MAAM,CAAC,CAAC,CAAC;QACtF,UAAU,CAAC,eAAe,kCAAO,OAAO,KAAE,KAAK,IAAG,CAAC;QAEnD,OAAO,IAAI,CAAC;IAChB,CAAC;CACJ"}
✄
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import TaskRunnable from './TaskRunnable.js';
import { onRequest, raiseEvent } from '../utils/messageUtils.js';
const bindingCalledAlertMessagePrefix = 'iISPGXd8Mq3z3tYoNLRfyX56OtpGnLzNmmPZNlRqeABYZ6j91jZKTqjgEG9d_';
class ConnectedTab {
    constructor() {
        this.bindings = {};
        this.scripts = {};
    }
}
//To send messages from the website to frida,
//addJavascriptInterface can't work, as it is impossible to add the @JavascriptInterface annotation with frida,
//onConsoleMessage doesn't seem to fire reliably on UC International edition,
//so an alert is shown with a special prefix and is handled by onJsAlert.
export default class WebViewAutomator {
    constructor() {
        this._webViews = {};
        this._connected = {};
        onRequest('GetTabs', () => __awaiter(this, void 0, void 0, function* () {
            const tabs = [];
            for (const id in this._webViews) {
                const webView = this._webViews[id];
                tabs.push(yield TaskRunnable.instance.runAs(webView, v => ({
                    id,
                    url: v.getUrl(),
                    title: v.getTitle()
                })));
            }
            return [{ tabs }, null];
        }));
        onRequest('Navigate', (params) => __awaiter(this, void 0, void 0, function* () {
            yield TaskRunnable.instance.runAs(this._webViews[params.tabId], v => v.loadUrl(params.url));
            return [null, null];
        }));
        onRequest('Connect', (params) => __awaiter(this, void 0, void 0, function* () {
            this._connected[params.tabId] = new ConnectedTab();
            return [null, null];
        }));
        onRequest('Disconnect', (params) => __awaiter(this, void 0, void 0, function* () {
            delete this._connected[params.tabId];
            return [null, null];
        }));
        onRequest('RegisterBinding', (params) => __awaiter(this, void 0, void 0, function* () {
            this._connected[params.tabId].bindings[params.name] = `
                window.${params.name} = payload => {
                  alert("${bindingCalledAlertMessagePrefix}" + JSON.stringify({
                    name: "${params.name}",
                    payload
                  }));
                };
            `;
            return [null, null];
        }));
        onRequest('AddScriptToEvaluateOnNewDocument', (params) => __awaiter(this, void 0, void 0, function* () {
            const identifier = Date.now().toString();
            this._connected[params.tabId].scripts[identifier] = params.source;
            return [{ identifier }, null];
        }));
        onRequest('RemoveScriptToEvaluateOnNewDocument', (params) => __awaiter(this, void 0, void 0, function* () {
            delete this._connected[params.tabId].scripts[params.identifier];
            return [null, null];
        }));
        onRequest('Evaluate', (params) => __awaiter(this, void 0, void 0, function* () {
            yield TaskRunnable.instance.runAs(this._webViews[params.tabId], v => v.evaluateJavascript(params.expression, null));
            return [null, null];
        }));
    }
    _getTabIdIfConnected(webView) {
        const id = webView.hashCode().toString();
        return id in this._connected ? id : '';
    }
    registerWebView(webView) {
        if (!webView)
            return;
        this._webViews[webView.hashCode()] = Java.retain(webView);
    }
    handlePageStarted(webView, url) {
        const tabId = this._getTabIdIfConnected(webView);
        if (!tabId)
            return;
        const script = Object.values(this._connected[tabId].bindings).join('\n') + '\n'
            + Object.values(this._connected[tabId].scripts).join('\n');
        webView.evaluateJavascript(script, null);
        raiseEvent('Navigated', { url, tabId });
    }
    handleReceivedError(webView, request, error) {
        if (!request.isForMainFrame())
            return;
        const tabId = this._getTabIdIfConnected(webView);
        if (!tabId)
            return;
        raiseEvent('LoadingFailed', {
            tabId,
            errorText: error.getDescription().toString(),
            url: request.getUrl().toString()
        });
    }
    handleDeprecatedReceivedError(webView, errorCode, description, failingUrl) {
        const tabId = this._getTabIdIfConnected(webView);
        if (!tabId)
            return;
        raiseEvent('LoadingFailed', {
            tabId,
            errorText: description,
            url: failingUrl
        });
    }
    handleJsAlert(webView, url, message, result) {
        result.confirm();
        if (!message.startsWith(bindingCalledAlertMessagePrefix))
            return true;
        const tabId = this._getTabIdIfConnected(webView);
        if (!tabId)
            return true;
        const binding = JSON.parse(message.substring(bindingCalledAlertMessagePrefix.length));
        raiseEvent('BindingCalled', Object.assign(Object.assign({}, binding), { tabId }));
        return true;
    }
}
✄
const lookup = []
const revLookup = []

const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (let i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  const len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  let validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  const placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
export function byteLength (b64) {
  const lens = getLens(b64)
  const validLen = lens[0]
  const placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

export function toByteArray (b64) {
  const lens = getLens(b64)
  const validLen = lens[0]
  const placeHoldersLen = lens[1]

  const arr = new Uint8Array(_byteLength(b64, validLen, placeHoldersLen))

  let curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  const len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  let i
  for (i = 0; i < len; i += 4) {
    const tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    const tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    const tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  const output = []
  for (let i = start; i < end; i += 3) {
    const tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

export function fromByteArray (uint8) {
  const len = uint8.length
  const extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  const parts = []
  const maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    const tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    const tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

✄
/*!
 * The buffer module from node.js, for Frida.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

import * as base64 from 'base64-js'
import * as ieee754 from 'ieee754'

export const config = {
  INSPECT_MAX_BYTES: 50
}

const K_MAX_LENGTH = 0x7fffffff
export { K_MAX_LENGTH as kMaxLength }

Buffer.TYPED_ARRAY_SUPPORT = true

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

export function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (value instanceof ArrayBuffer ||
      (value && value.buffer instanceof ArrayBuffer)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (value instanceof SharedArrayBuffer ||
      (value && value.buffer instanceof SharedArrayBuffer)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (arrayView instanceof Uint8Array) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || Number.isNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

export function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (a instanceof Uint8Array) a = Buffer.from(a, a.offset, a.byteLength)
  if (b instanceof Uint8Array) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (buf instanceof Uint8Array) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) {
          buf = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
        }
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a frida-compile context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = config.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
Buffer.prototype[Symbol.for('nodejs.util.inspect.custom')] = Buffer.prototype.inspect

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (target instanceof Uint8Array) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (Number.isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (Number.isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
}

Buffer.prototype.readBigUInt64BE = function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
}

Buffer.prototype.readBigInt64BE = function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
}

Buffer.prototype.writeBigUInt64BE = function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
}

Buffer.prototype.writeBigInt64BE = function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target) {
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

export default {
  config,
  kMaxLength: K_MAX_LENGTH,
  Buffer,
  SlowBuffer
}

✄
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

export function read (buffer, offset, isLE, mLen, nBytes) {
  let e, m
  const eLen = (nBytes * 8) - mLen - 1
  const eMax = (1 << eLen) - 1
  const eBias = eMax >> 1
  let nBits = -7
  let i = isLE ? (nBytes - 1) : 0
  const d = isLE ? -1 : 1
  let s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  while (nBits > 0) {
    e = (e * 256) + buffer[offset + i]
    i += d
    nBits -= 8
  }

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  while (nBits > 0) {
    m = (m * 256) + buffer[offset + i]
    i += d
    nBits -= 8
  }

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

export function write (buffer, value, offset, isLE, mLen, nBytes) {
  let e, m, c
  let eLen = (nBytes * 8) - mLen - 1
  const eMax = (1 << eLen) - 1
  const eBias = eMax >> 1
  const rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  let i = isLE ? 0 : (nBytes - 1)
  const d = isLE ? 1 : -1
  const s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  while (mLen >= 8) {
    buffer[offset + i] = m & 0xff
    i += d
    m /= 256
    mLen -= 8
  }

  e = (e << mLen) | m
  eLen += mLen
  while (eLen > 0) {
    buffer[offset + i] = e & 0xff
    i += d
    e /= 256
    eLen -= 8
  }

  buffer[offset + i - d] |= s * 128
}

✄
{"version":3,"file":"interceptMethodUtils.js","sourceRoot":"/home/jpegioudis/Documents/Projects/BrowserTracking/browserMitm/fridaModules/","sources":["utils/interceptMethodUtils.js"],"names":[],"mappings":"AAAA,MAAM,UAAU,eAAe,CAAC,MAAM,EAAE,QAAQ;IAC5C,MAAM,CAAC,cAAc,GAAG;QACpB,QAAQ,CAAC,KAAK,CAAC,IAAI,EAAE,SAAS,CAAC,CAAC;QAChC,OAAO,MAAM,CAAC,KAAK,CAAC,IAAI,EAAE,SAAS,CAAC,CAAC;IACzC,CAAC,CAAC;AACN,CAAC;AAED,MAAM,UAAU,cAAc,CAAC,MAAM,EAAE,QAAQ;IAC3C,MAAM,CAAC,cAAc,GAAG;QACpB,MAAM,MAAM,GAAG,MAAM,CAAC,KAAK,CAAC,IAAI,EAAE,SAAS,CAAC,CAAC;QAC7C,QAAQ,CAAC,IAAI,CAAC,IAAI,EAAE,GAAG,SAAS,CAAC,CAAC;QAClC,OAAO,MAAM,CAAC;IAClB,CAAC,CAAC;AACN,CAAC;AAED,MAAM,UAAU,eAAe,CAAC,MAAM,EAAE,QAAQ;IAC5C,MAAM,CAAC,cAAc,GAAG;QACpB,MAAM,MAAM,GAAG,MAAM,CAAC,KAAK,CAAC,IAAI,EAAE,SAAS,CAAC,CAAC;QAC7C,QAAQ,CAAC,IAAI,CAAC,IAAI,EAAE,MAAM,CAAC,CAAC;QAC5B,OAAO,MAAM,CAAC;IAClB,CAAC,CAAC;AACN,CAAC"}
✄
export function interceptBefore(method, callback) {
    method.implementation = function () {
        callback.apply(this, arguments);
        return method.apply(this, arguments);
    };
}
export function interceptAfter(method, callback) {
    method.implementation = function () {
        const result = method.apply(this, arguments);
        callback.call(this, ...arguments);
        return result;
    };
}
export function interceptResult(method, callback) {
    method.implementation = function () {
        const result = method.apply(this, arguments);
        callback.call(this, result);
        return result;
    };
}
✄
{"version":3,"file":"messageUtils.js","sourceRoot":"/home/jpegioudis/Documents/Projects/BrowserTracking/browserMitm/fridaModules/","sources":["utils/messageUtils.ts"],"names":[],"mappings":"AAEA,MAAM,CAAC,MAAM,UAAU,GAAG,CACtB,KAAQ,EACR,MAAsB,EACtB,IAAkB,EACd,EAAE;IACN,IAAI,CAAC,EAAE,KAAK,EAAE,MAAM,EAAgB,EAAE,IAAI,CAAC,CAAC;AAChD,CAAC,CAAC;AAMF,MAAM,UAAU,SAAS,CAAyC,MAAS,EAAE,OAA0B;IACnG,MAAM,gBAAgB,GAAG,CAAC,OAAqB,EAAE,IAAwB,EAAE,EAAE;QACzE,OAAO,CAAC,OAAO,CAAC,MAAM,EAAE,IAAI,CAAC,CAAC,IAAI,CAAC,GAAG,CAAC,EAAE;YACrC,IAAI,CAAC,EAAE,EAAE,EAAE,OAAO,CAAC,EAAE,EAAE,MAAM,EAAE,GAAG,CAAC,CAAC,CAAC,EAAmB,EAAE,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC;QACtE,CAAC,CAAC,CAAC;QAEH,IAAI,CAAC,MAAM,EAAE,gBAAgB,CAAC,CAAC;IACnC,CAAC,CAAC;IACF,IAAI,CAAC,MAAM,EAAE,gBAAgB,CAAC,CAAC;AACnC,CAAC"}
✄
export const raiseEvent = (event, params, data) => {
    send({ event, params }, data);
};
export function onRequest(method, handler) {
    const recursiveHandler = (payload, data) => {
        handler(payload.params, data).then(res => {
            send({ id: payload.id, params: res[0] }, res[1]);
        });
        recv(method, recursiveHandler);
    };
    recv(method, recursiveHandler);
}