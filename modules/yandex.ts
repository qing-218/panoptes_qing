import CdpBrowserModule from '../models/CdpBrowserModule.js';
import CertificateTypes from '../constants/CertificateTypes.js';

class YandexModule extends CdpBrowserModule {
    protected readonly _package: string = 'com.yandex.browser';
    protected readonly _cdpPort: string = 'yandex_devtools_remote';
    protected readonly _certType: CertificateTypes = CertificateTypes.User;

    // async skipTutorial(driver: WebdriverIO.Browser): Promise<void> {
    //     const closeTutorialButton = await driver.$('id=com.yandex.browser:id/tutorial_close_button');
    //     const closePopupButton = await driver.$('id=com.yandex.browser:id/bro_popup_cross_icon');
    //     const locationOkButton = await driver.$('id=com.yandex.browser:id/snackbar_action_button');
    //
    //     await closeTutorialButton.waitForExist();
    //     await closeTutorialButton.click();
    //
    //     await closePopupButton.waitForExist({ timeout: 10000 });
    //     await closePopupButton.click();
    //
    //     await locationOkButton.click();
    // }
    //
    // async enableUsbDebugging(driver: WebdriverIO.Browser): Promise<void> {
    //     const menuButton = await driver.$('~menu');
    //     const settingsButton = await driver.$('~Settings');
    //     const usbDebuggingToggle = await driver.$('~Debug web pages over USB');
    //     const backButton = await driver.$('~Navigate up');
    //
    //     await menuButton.waitForExist({ timeout: 10000 });
    //     await menuButton.click();
    //     await settingsButton.click();
    //     await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).flingToEnd(5)').catch(() => null);
    //
    //     await usbDebuggingToggle.click();
    //     await backButton.click();
    // }
    //
    // async showWebview(driver: WebdriverIO.Browser): Promise<void> {
    //     const searchBarButton = await driver.$('~type query or url\nsearch or site');
    //     const searchBarField = await driver.$('id=com.yandex.browser:id/suggest_omnibox_query_edit');
    //     const navigateButton = await driver.$('id=com.yandex.browser:id/suggest_omnibox_action_button');
    //
    //     await searchBarButton.click();
    //     await searchBarField.setValue('about:blank');
    //     await navigateButton.click();
    // }

    // async getTargetId(driver: WebdriverIO.Browser): Promise<string> {
    //     await this.skipTutorial(driver);
    //     await this.enableUsbDebugging(driver);
    //     await this.showWebview(driver);
    // }
}

export default new YandexModule();