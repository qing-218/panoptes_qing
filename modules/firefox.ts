import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class FirefoxModule extends CdpBrowserModule {
    protected readonly _package: string = 'org.mozilla.firefox';
    protected readonly _cdpPort: string = 'firefox_devtools_remote';
    protected readonly _certType: CertificateTypes = CertificateTypes.System;
}

export default new FirefoxModule();
