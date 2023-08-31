import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class DolphinModule extends CdpBrowserModule {
    protected readonly _package: string = 'mobi.mgeek.TunnyBrowser';
    protected readonly _cdpPort: string = 'webview_devtools_remote_[0-9]+';
    protected readonly _certType: CertificateTypes = CertificateTypes.System;

    //Set FLAG_ACTIVITY_BROUGHT_TO_FRONT, without it the current tab is navigated, instead of a new tab being created
    protected readonly _openTabFlags: number = 0x00400000;

}

export default new DolphinModule();
