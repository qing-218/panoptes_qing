import TaskRunnable from './TaskRunnable.js';
import { onRequest, raiseEvent } from '../utils/messageUtils.js';
import { IWebViewTab } from '../common/fridaMessages.js';

const bindingCalledAlertMessagePrefix = 'iISPGXd8Mq3z3tYoNLRfyX56OtpGnLzNmmPZNlRqeABYZ6j91jZKTqjgEG9d_';

class ConnectedTab {
    bindings: Record<string, string> = {};
    scripts: Record<string, string> = {};
}

//To send messages from the website to frida,
//addJavascriptInterface can't work, as it is impossible to add the @JavascriptInterface annotation with frida,
//onConsoleMessage doesn't seem to fire reliably on UC International edition,
//so an alert is shown with a special prefix and is handled by onJsAlert.

export default class WebViewAutomator {
    private _webViews: Record<string, Java.Wrapper> = {};
    private _connected: Record<string, ConnectedTab> = {};

    constructor() {
        onRequest('GetTabs', async () => {
            const tabs: IWebViewTab[] = [];
            for (const id in this._webViews) {
                const webView = this._webViews[id];
                tabs.push(await TaskRunnable.instance.runAs<IWebViewTab>(webView, v => ({
                    id,
                    url: v.getUrl(),
                    title: v.getTitle()
                })));
            }

            return [{ tabs }, null];
        });

        onRequest('Navigate', async params => {
            await TaskRunnable.instance.runAs(
                this._webViews[params.tabId],
                v => v.loadUrl(params.url)
            );
            return [null, null];
        });

        onRequest('Connect', async params => {
            this._connected[params.tabId] = new ConnectedTab();
            return [null, null];
        });

        onRequest('Disconnect', async params => {
            delete this._connected[params.tabId];
            return [null, null];
        });

        onRequest('RegisterBinding', async params => {
            this._connected[params.tabId].bindings[params.name] = `
                window.${params.name} = payload => {
                  alert("${bindingCalledAlertMessagePrefix}" + JSON.stringify({
                    name: "${params.name}",
                    payload
                  }));
                };
            `;

            return [null, null];
        });

        onRequest('AddScriptToEvaluateOnNewDocument', async params => {
            const identifier = Date.now().toString();
            this._connected[params.tabId].scripts[identifier] = params.source;

            return [{ identifier }, null];
        });

        onRequest('RemoveScriptToEvaluateOnNewDocument', async params => {
            delete this._connected[params.tabId].scripts[params.identifier];
            return [null, null];
        });

        onRequest('Evaluate', async params => {
            await TaskRunnable.instance.runAs(
                this._webViews[params.tabId],
                v => v.evaluateJavascript(params.expression, null)
            );
            return [null, null];
        });
    }

    private _getTabIdIfConnected(webView: Java.Wrapper): string {
        const id = webView.hashCode().toString();
        return id in this._connected ? id : '';
    }

    registerWebView(webView: Java.Wrapper) {
        if (!webView) return;
        this._webViews[webView.hashCode()] = Java.retain(webView);
    }

    handlePageStarted(webView: Java.Wrapper, url: string) {
        const tabId = this._getTabIdIfConnected(webView);
        if (!tabId) return;

        const script = Object.values(this._connected[tabId].bindings).join('\n') + '\n'
            + Object.values(this._connected[tabId].scripts).join('\n');

        webView.evaluateJavascript(script, null);
        raiseEvent('Navigated', { url, tabId });
    }

    handleReceivedError(webView: Java.Wrapper, request: Java.Wrapper, error: Java.Wrapper) {
        if (!request.isForMainFrame()) return;

        const tabId = this._getTabIdIfConnected(webView);
        if (!tabId) return;

        raiseEvent('LoadingFailed', {
            tabId,
            errorText: error.getDescription().toString(),
            url: request.getUrl().toString()
        });
    }

    handleDeprecatedReceivedError(webView: Java.Wrapper, errorCode: number, description: string, failingUrl: string) {
        const tabId = this._getTabIdIfConnected(webView);
        if (!tabId) return;

        raiseEvent('LoadingFailed', {
            tabId,
            errorText: description,
            url: failingUrl
        });
    }

    handleJsAlert(webView: Java.Wrapper, url: string, message: string, result: Java.Wrapper): true {
        result.confirm();
        if (!message.startsWith(bindingCalledAlertMessagePrefix)) return true;

        const tabId = this._getTabIdIfConnected(webView);
        if (!tabId) return true;

        const binding = JSON.parse(message.substring(bindingCalledAlertMessagePrefix.length));
        raiseEvent('BindingCalled', { ...binding, tabId });

        return true;
    }
}
