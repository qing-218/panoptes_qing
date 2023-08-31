import { interceptBefore } from './utils/interceptMethodUtils.js';
import sharedConstants from './common/constants.json';
import WebViewAutomator from './models/WebViewAutomator.js';
import { getRequestMetadataHeaderValue } from './common/metadataHeaderUtils.js';

Java.perform(function() {
    const WebViewManager = Java.use('com.uc.browser.webwindow.webview.g');
    const NetworkDelegate = Java.use('com.uc.browser.webwindow.webview.g$a');
    const WebViewClient = Java.use('com.uc.browser.webwindow.WebWindowController$g');
    const WebChromeClient = Java.use('com.uc.browser.webwindow.WebWindowController$d');

    interceptBefore(NetworkDelegate.onBeforeSendRequest, function(webView, req) {
        req.setHeader(sharedConstants.webRequestMetadataHeader, getRequestMetadataHeaderValue({ mark: 'web' }));
    });

    const automator = new WebViewAutomator();
    interceptBefore(WebViewManager.f, automator.registerWebView.bind(automator));
    interceptBefore(WebViewClient.onPageStarted, automator.handlePageStarted.bind(automator));
    interceptBefore(WebViewClient.onReceivedError, automator.handleDeprecatedReceivedError.bind(automator));
    WebChromeClient.onJsAlert.implementation = automator.handleJsAlert.bind(automator);
});