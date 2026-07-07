import { join } from "path";
import {
    root,
    startServer,
    launchBrowser,
    preparePage
} from "./lib/export-page.mjs";

const OUT = join(root, "桥见黔程万里-整页长图.png");

const server = await startServer();
const browser = await launchBrowser();
const page = await browser.newPage();

try {
    await preparePage(page);
    await page.screenshot({ path: OUT, fullPage: true, type: "png", captureBeyondViewport: true });
    console.log(`Saved: ${OUT}`);
} finally {
    await browser.close();
    server.close();
}
