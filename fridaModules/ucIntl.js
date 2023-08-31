import { interceptBefore, interceptResult } from './utils/interceptMethodUtils.js';
import sharedConstants from './common/constants.json';
import WebViewAutomator from './models/WebViewAutomator.js';
import { getRequestMetadataHeaderValue } from './common/metadataHeaderUtils.js';

Java.perform(function() {
    const WebViewManager = Java.use('com.uc.browser.c4.g$a');
    const NetworkDelegate = Java.use('com.uc.browser.c4.h.a.e');
    const WebViewClient = Java.use('com.uc.browser.d4.h1$i0');
    const WebChromeClient = Java.use('com.uc.browser.d4.h1$g0');

    interceptBefore(NetworkDelegate.onBeforeSendRequest, req => {
        req.setHeader(sharedConstants.webRequestMetadataHeader, getRequestMetadataHeaderValue({ mark: 'web' }));
    });

    const automator = new WebViewAutomator();
    interceptResult(WebViewManager.a, automator.registerWebView.bind(automator));
    interceptBefore(WebViewClient.onPageStarted, automator.handlePageStarted.bind(automator));
    interceptBefore(WebViewClient.onReceivedError, automator.handleReceivedError.bind(automator));
    WebChromeClient.onJsAlert.implementation = automator.handleJsAlert.bind(automator);
});
