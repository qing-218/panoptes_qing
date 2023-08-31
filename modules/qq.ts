import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class QQModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.tencent.mtt';
    protected readonly _cdpPort: string = 'webview_devtools_remote_.+';
    protected readonly _certType: CertificateTypes = CertificateTypes.User;
}

export default new QQModule();
