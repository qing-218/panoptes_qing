import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class SamsungModule extends CdpBrowserModule {
    protected readonly _cdpPort: string = 'Terrace_devtools_remote';
    protected readonly _package: string = 'com.sec.android.app.sbrowser';
    protected readonly _certType: CertificateTypes = CertificateTypes.System;
}

export default new SamsungModule();
