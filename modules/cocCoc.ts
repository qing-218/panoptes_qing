import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class CocCocModule extends CdpBrowserModule {
    protected readonly _cdpPort: string = 'chrome_devtools_remote';
    protected readonly _package: string = 'com.coccoc.trinhduyet';
    protected readonly _certType: CertificateTypes = CertificateTypes.User;
}

export default new CocCocModule();
