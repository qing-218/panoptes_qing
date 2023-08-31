import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class MintModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.mi.globalbrowser.mini';
    protected readonly _cdpPort: string = 'webview_devtools_remote_.+';
    protected readonly _certType: CertificateTypes = CertificateTypes.System;
}

export default new MintModule();
