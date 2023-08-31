import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class EdgeModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.microsoft.emmx';
    protected readonly _cdpPort: string = 'chrome_devtools_remote';
    protected readonly _certType: CertificateTypes = CertificateTypes.System;
}

export default new EdgeModule();