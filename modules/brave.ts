import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class BraveModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.brave.browser';
    protected readonly _cdpPort: string = 'chrome_devtools_remote';
    protected readonly _certType: CertificateTypes = CertificateTypes.User;
}

export default new BraveModule();