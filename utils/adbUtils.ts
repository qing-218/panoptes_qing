export async function openInBrowser(driver: WebdriverIO.Browser, browserPackage: string, url: string, flags: number = 0) {
    await driver.executeScript('mobile: shell', [{
        command: 'am',
        args: [
            'start', '-W',
            '-a', 'android.intent.action.VIEW',
            '-d', url,
            '-f', flags.toString(),
            browserPackage
        ]
    }]);
}