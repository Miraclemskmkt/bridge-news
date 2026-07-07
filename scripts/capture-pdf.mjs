import { writeFileSync } from "fs";
import { join } from "path";
import { PDFDocument } from "pdf-lib";
import {
    root,
    startServer,
    launchBrowser,
    preparePage,
    captureScrollSlices,
    MAX_PDF_PAGE_PX
} from "./lib/export-page.mjs";

const OUT = join(root, "桥见黔程万里.pdf");

const server = await startServer();
const browser = await launchBrowser();
const page = await browser.newPage();

try {
    await preparePage(page);

    const { buffers, totalHeight, sliceCount } = await captureScrollSlices(page);

    const pdfDoc = await PDFDocument.create();
    const slices = [];
    let pageWidth = 0;
    let pageHeightSum = 0;

    for (const pngBuffer of buffers) {
        const image = await pdfDoc.embedPng(pngBuffer);
        const w = image.width;
        const h = image.height;

        if (w > MAX_PDF_PAGE_PX) {
            throw new Error(
                `Slice width ${w}px exceeds PDF limit ${MAX_PDF_PAGE_PX}px — reduce DEVICE_SCALE`
            );
        }

        slices.push(image);
        pageWidth = Math.max(pageWidth, w);
        pageHeightSum += h;
    }

    // 所有分片上下拼接到同一页，消除多页 PDF 之间的白边
    const pdfPage = pdfDoc.addPage([pageWidth, pageHeightSum]);
    let y = pageHeightSum;
    for (const image of slices) {
        y -= image.height;
        pdfPage.drawImage(image, {
            x: 0,
            y,
            width: image.width,
            height: image.height
        });
    }

    const pdfBytes = await pdfDoc.save();
    const candidates = [
        OUT,
        OUT.replace(/\.pdf$/i, "-new.pdf"),
        OUT.replace(/\.pdf$/i, `-${Date.now()}.pdf`)
    ];
    let saved = false;
    for (const path of candidates) {
        try {
            writeFileSync(path, pdfBytes);
            console.log(`Saved: ${path}`);
            saved = true;
            break;
        } catch (err) {
            if (err?.code !== "EBUSY") throw err;
        }
    }
    if (!saved) throw new Error("无法写入 PDF，请关闭已打开的 PDF 文件后重试");
    console.log(
        `1 page (stitched ${sliceCount} slices) · scroll ${totalHeight}px · ${pageWidth}×${pageHeightSum}px · ${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB`
    );
} finally {
    await browser.close();
    server.close();
}
