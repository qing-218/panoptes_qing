import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class KiwiModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.kiwibrowser.browser';
    protected readonly _cdpPort: string = 'chrome_devtools_remote';
    protected readonly _certType: CertificateTypes = CertificateTypes.User;
}

export default new KiwiModule();