import { WebViewBrowserModule } from '../models/WebViewBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class UcChinaModule extends WebViewBrowserModule {
    protected readonly _fridaModuleName: string = 'ucChina.js';
    protected readonly _package: string = 'com.UCMobile';
    protected readonly _certType: CertificateTypes = CertificateTypes.User;
}

export default new UcChinaModule();
