import puppeteer, { Browser } from "puppeteer";
import yargs from "yargs";

export const argv = yargs(process.argv.slice(2))
    .options({
        develop: { type: "boolean" },
    })
    .parseSync();

export async function generatePDF({ url }: { url: string }) {
    let browser: Browser;

    if (!!argv.develop) {
        browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: {
                width: 500,
                height: 750,
                deviceScaleFactor: 1,
                isMobile: true,
                hasTouch: false,
                isLandscape: false,
            },
        });
    } else {
        browser = await puppeteer.connect({
            browserWSEndpoint:
                "wss://browserless-production-cc28.up.railway.app/",
            // headless: "new",
            defaultViewport: {
                width: 500,
                height: 750,
                deviceScaleFactor: 1,
                isMobile: true,
                hasTouch: false,
                isLandscape: false,
            },
        });
    }

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "networkidle0",
    });

    await page.emulateMediaType("screen");

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            left: "0.5cm",
            top: "1cm",
            right: "0.5cm",
            bottom: "1cm",
        },
    });
    await browser.close();

    return pdf;
}
