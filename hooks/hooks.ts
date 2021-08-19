import { After } from '@cucumber/cucumber';
import { browser } from 'protractor';

After(async function takeScreenshotAfterTest() {
    const screenshot = await browser.takeScreenshot();
    const decodedImage = Buffer.from(screenshot.replace(/^data:image\/png;base64,/, ''), 'base64');
    this.attach(decodedImage, 'image/png');
});
