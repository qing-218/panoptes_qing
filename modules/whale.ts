import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class WhaleModule extends CdpBrowserModule {
    protected readonly _cdpPort: string = 'chrome_devtools_remote';
    protected readonly _package: string = 'com.naver.whale';
    protected readonly _certType: CertificateTypes = CertificateTypes.User;
}

export default new WhaleModule();
