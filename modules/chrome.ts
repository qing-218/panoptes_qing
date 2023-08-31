import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class ChromeModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.android.chrome';
    protected readonly _cdpPort: string = 'chrome_devtools_remote';
    protected readonly _certType: CertificateTypes = CertificateTypes.User;

    // async getTargetId(driver: WebdriverIO.Browser): Promise<string> {
    //     const acceptButton = await driver.$('id=com.android.chrome:id/terms_accept');
    //     const noThanksButton = await driver.$('id=com.android.chrome:id/negative_button');
    //     const searchBox = await driver.$('id=com.android.chrome:id/search_box_text');
    //
    //     // Accept statistics
    //     await acceptButton.waitForExist();
    //     await acceptButton.click();
    //
    //     // Decline sync
    //     await noThanksButton.click();
    //
    //     // Wait for home page to load
    //     await searchBox.waitForExist({ timeout: 10000 });
    // }
}

export default new ChromeModule();