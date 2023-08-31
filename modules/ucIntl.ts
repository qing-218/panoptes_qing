import { WebViewBrowserModule } from '../models/WebViewBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class UcIntlModule extends WebViewBrowserModule {
    protected readonly _package: string = 'com.UCMobile.intl';
    protected readonly _certType: CertificateTypes = CertificateTypes.System;
    protected readonly _fridaModuleName: string = 'ucIntl.js';
}


export default new UcIntlModule();
