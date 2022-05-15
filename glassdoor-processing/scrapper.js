import puppeteer from "puppeteer";

import AccountParser from './accountParser.js'

const processGlassDoorAccount = async (username, password, downloadPath) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.glassdoor.com/index.htm');

    console.log('Stage 1 - login');

    const [signInButton] = await page.$x("//button[contains(., 'Sign In')]");
    await signInButton.click();
    try {
        await page.waitForSelector('#modalUserEmail')
        await page.waitForSelector('#modalUserPassword')
        await page.waitForSelector('.gd-ui-button')
        await page.type('input#modalUserEmail', username, { delay: 10 })
        await page.type('input#modalUserPassword', password, { delay: 10 })
        await page.click('button[name="submit"]');
        await page.waitForNavigation();
    } catch {
        console.log(`Failed to login with provided credentials !!  ${username}, ${password}`);
        throw new Error('Failed to login with provided credentials !!')
    }

    console.log('Stage 2 - go to profile section');
    page.goto('https://www.glassdoor.com/member/profile/index.htm')

    await page.waitForNavigation();

    console.log('Stage 3 - get page content');
    const html = await page.content()

    console.log('Stage 4 - parse content to account object');
    const ap = new AccountParser(html);

    try {
        console.log('Stage 5 - download pdf at ' + downloadPath);
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath
        });

        await page.goto('https://www.glassdoor.com/member/profile/resumePdf.htm')

    } catch (error) {
        console.error(error.message);
    }

    page.close();

    return ap.getAccount();
}

export default processGlassDoorAccount;




