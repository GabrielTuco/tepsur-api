import puppeteer from "puppeteer";

export async function generatePDF({ url }: { url: string }) {
    const browser = await puppeteer.launch({
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
