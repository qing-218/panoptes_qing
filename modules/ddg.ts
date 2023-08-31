import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class DdgModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.duckduckgo.mobile.android';
    protected readonly _cdpPort: string = 'webview_devtools_remote_.+';
    protected readonly _certType: CertificateTypes = CertificateTypes.System;
}

export default new DdgModule();
