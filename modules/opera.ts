import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class OperaModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.opera.browser';
    protected readonly _cdpPort: string = 'com.opera.browser.devtools';
    protected readonly _certType: CertificateTypes = CertificateTypes.System;

    // async getTargetId(driver: WebdriverIO.Browser): Promise<string> {
    //     const skipButton = await driver.$('id=com.opera.browser:id/skip_button');
    //     const allowButton = await driver.$('id=com.opera.browser:id/allow_button');
    //     const urlBar = await driver.$('id=com.opera.browser:id/url_field');
    //     const goButton = await driver.$('id=com.opera.browser:id/right_state_button');
    //
    //     await skipButton.waitForExist({ timeout: 10000 });
    //     await skipButton.click();
    //
    //     await allowButton.click();
    //
    //     await urlBar.click();
    //     await urlBar.setValue('about:blank');
    //
    //     await goButton.click();
    // }
}

export default new OperaModule();
