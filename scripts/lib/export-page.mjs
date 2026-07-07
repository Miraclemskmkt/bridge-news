import puppeteer from "puppeteer";
import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const root = join(__dirname, "../..");
export const PORT = 8765;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2"
};

export function startServer() {
    return new Promise((resolve) => {
        const server = createServer((req, res) => {
            const raw = decodeURIComponent((req.url || "/").split("?")[0]);
            const rel = raw === "/" ? "index.html" : raw.replace(/^\//, "");
            const file = join(root, rel);
            if (!file.startsWith(root) || !existsSync(file)) {
                res.writeHead(404);
                res.end("Not found");
                return;
            }
            res.writeHead(200, {
                "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream"
            });
            res.end(readFileSync(file));
        });
        server.listen(PORT, "127.0.0.1", () => resolve(server));
    });
}

export async function launchBrowser() {
    const opts = { headless: true };
    for (const channel of ["msedge", "chrome"]) {
        try {
            return await puppeteer.launch({ ...opts, channel });
        } catch {
            /* try next */
        }
    }
    return puppeteer.launch(opts);
}

/** 920px 视口 · 触发 900px 断点，与宽屏浏览一致 */
export const VIEWPORT_WIDTH = 920;
export const DEVICE_SCALE = 2;

/** PDF 单页最大约 14400pt；按 deviceScaleFactor 反推 CSS 切片高度 */
export const MAX_PDF_PAGE_PX = 14000;
export const SLICE_CSS_HEIGHT = Math.floor(MAX_PDF_PAGE_PX / DEVICE_SCALE) - 100;

/** 离屏 Canvas 无法完整截屏的图表，导出前冻结为透明 PNG */
const FREEZE_CHART_IDS = ["worldBridge", "bridgePixel"];

async function waitForChartReady(page, chartId) {
    await page.waitForFunction(
        (id) => {
            const el = document.getElementById(id);
            const inst = window.echarts?.getInstanceByDom(el);
            if (!inst) return false;

            const geo = inst.getOption()?.geo;
            const comp = Array.isArray(geo) ? geo[0] : geo;
            const series = inst.getOption()?.series;
            const s0 = Array.isArray(series) ? series[0] : series;

            if (id === "worldBridge") {
                return comp?.map === "world";
            }
            if (id === "bridgePixel") {
                return comp?.map === "guizhou" && (s0?.data?.length ?? 0) >= 32000;
            }
            return !!comp?.map || (s0?.data?.length ?? 0) > 0;
        },
        { timeout: 90000 },
        chartId
    );
}

export async function preparePage(page, urlPath = "/index.html") {
    await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: 900,
        deviceScaleFactor: DEVICE_SCALE
    });
    await page.emulateMediaType("screen");

    await page.goto(`http://127.0.0.1:${PORT}${urlPath}`, {
        waitUntil: "load",
        timeout: 180000
    });

    await page.waitForFunction(
        () => window.echarts && window.Plotly,
        { timeout: 90000 }
    );
    await page.evaluateHandle("document.fonts.ready");
    await waitForImages(page);
    await scrollAndWarmCharts(page);
    await warmAllCharts(page);

    for (const chartId of FREEZE_CHART_IDS) {
        await waitForChartReady(page, chartId);
        await freezeChartForExport(page, chartId);
    }

    await page.addStyleTag({
        content: `
            .particles-container,
            .bridge-silhouette-fixed {
                display: none !important;
            }
            html, body {
                overflow: visible !important;
            }
            .main-wrapper {
                box-shadow: none !important;
                padding-bottom: 48px !important;
                background-repeat: no-repeat, repeat-y !important;
                background-size: 100% auto, 100% auto !important;
            }
            /* 桥旅业态 · 仅消除 PDF 截图位移，不改布局 */
            .bridge-tourism-wall {
                overflow: visible !important;
            }
            .bridge-tour-card,
            .bridge-tour-card--lift,
            .bridge-tour-card--lift:hover,
            .bridge-tour-card--primary:hover {
                transform: none !important;
            }
            .bridge-tourism-wall__aux-scroll {
                -webkit-mask-image: none !important;
                mask-image: none !important;
            }
            .export-frozen-chart {
                background: transparent !important;
            }
        `
    });

    await page.evaluate(async () => {
        const wall = document.querySelector(".bridge-tourism-wall");
        if (wall) {
            wall.scrollIntoView({ block: "center" });
            await new Promise((r) => setTimeout(r, 400));
        }
    });

    await page.evaluate(async () => {
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
    });
}

async function waitForImages(page) {
    await page.evaluate(async () => {
        const loadImage = (src) =>
            new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = src;
            });

        const imgEls = [...document.querySelectorAll("img")];
        await Promise.all(
            imgEls.map(async (img) => {
                if (!img.complete) {
                    await new Promise((resolve) => {
                        img.addEventListener("load", resolve, { once: true });
                        img.addEventListener("error", resolve, { once: true });
                    });
                }
                try {
                    await img.decode();
                } catch {
                    /* ignore */
                }
            })
        );

        const bgUrls = new Set([
            "images/footer-bg.png",
            "images/news-strip-bg.png",
            "images/hero-cover.png"
        ]);
        for (const el of document.querySelectorAll("[style*='background']")) {
            const bg = getComputedStyle(el).backgroundImage;
            for (const match of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
                bgUrls.add(match[1]);
            }
        }
        const wrapperBg = getComputedStyle(document.querySelector(".main-wrapper")).backgroundImage;
        for (const match of wrapperBg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
            bgUrls.add(match[1]);
        }
        await Promise.all(
            [...bgUrls].map((src) => loadImage(new URL(src, location.href).href))
        );
    });
}

export async function forceRenderCharts(page) {
    await page.evaluate(async () => {
        window.dispatchEvent(new Event("resize"));

        if (window.echarts) {
            document.querySelectorAll("div, canvas").forEach((el) => {
                const inst = window.echarts.getInstanceByDom(el);
                if (!inst) return;
                const w = el.clientWidth || el.offsetWidth;
                const h = el.clientHeight || el.offsetHeight;
                if (w < 2 || h < 2) return;
                try {
                    inst.resize();
                } catch {
                    /* ignore zero-size canvases */
                }
            });
        }

        document.querySelectorAll(".echarts, .chart-large, .chart-container").forEach((el) => {
            if (el.clientWidth >= 2 && el.clientHeight >= 2) {
                el.dispatchEvent(new Event("resize"));
            }
        });

        if (window.Plotly) {
            document.querySelectorAll(".js-plotly-plot").forEach((el) => {
                if (el.clientWidth < 2 || el.clientHeight < 2) return;
                try {
                    window.Plotly.Plots.resize(el);
                } catch {
                    /* ignore */
                }
            });
        }

        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        await new Promise((r) => setTimeout(r, 350));
    });
}

async function freezeChartForExport(page, chartId) {
    await page.evaluate((id) => {
        document.getElementById(id)?.scrollIntoView({ block: "center" });
    }, chartId);
    await new Promise((r) => setTimeout(r, 500));

    const frozen = await page.evaluate(async (id) => {
        const dom = document.getElementById(id);
        const inst = window.echarts?.getInstanceByDom(dom);
        if (!inst || !dom) return false;

        const w = dom.clientWidth || dom.offsetWidth;
        const h = dom.clientHeight || dom.offsetHeight;
        if (w < 2 || h < 2) return false;

        try {
            inst.resize({ width: w, height: h });

            const opt = inst.getOption();
            inst.setOption({ animation: false }, { silent: true });

            if (opt?.series?.length) {
                inst.setOption(
                    {
                        animation: false,
                        series: opt.series.map((s) => {
                            const next = { ...s, animation: false, animationDuration: 0 };
                            if (next.effect) next.effect = { ...next.effect, show: false };
                            if (next.rippleEffect) {
                                next.rippleEffect = { ...next.rippleEffect, number: 0 };
                            }
                            if (next.type === "effectScatter") {
                                next.showEffectOn = "none";
                            }
                            if (next.type === "scatter") {
                                next.progressive = 0;
                                next.progressiveThreshold = 50000;
                            }
                            return next;
                        })
                    },
                    { replaceMerge: ["series"] }
                );
            }

            inst.resize({ width: w, height: h });
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
            await new Promise((r) => setTimeout(r, 800));

            const url = inst.getDataURL({
                type: "png",
                pixelRatio: window.devicePixelRatio || 2,
                backgroundColor: "transparent"
            });

            const img = document.createElement("img");
            img.src = url;
            img.alt = "";
            img.style.cssText = `display:block;width:100%;height:${h}px;background:transparent;`;
            img.className = "export-frozen-chart";
            inst.dispose();
            dom.replaceChildren(img);
            dom.dataset.exportFrozen = "1";
            return true;
        } catch {
            return false;
        }
    }, chartId);

    if (!frozen) {
        console.warn(`[pdf] freeze failed: #${chartId}`);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));
}

async function warmAllCharts(page) {
    const selectors = [
        "#heroWall",
        "#terrainProfile",
        "#chartPolar",
        "#bridgeDensity",
        "#microPanel1",
        "#incomeDumbbell",
        "#flowMap",
        "#sankeyBridge",
        "#incomeStep",
        "#bridgeVillage",
        "#villageSuper",
        "#digitalTwin",
        "#twinBridgeMap",
        "#carbonLife",
        "#maintenanceRose",
        "#huayudongCarbon",
        "#ethnicChord",
        "#developmentRadar",
        "#worldBridge",
        "#bridgePixel",
        "#builderWordcloud"
    ];

    for (const sel of selectors) {
        const handle = await page.$(sel);
        if (!handle) continue;
        await page.evaluate((s) => {
            document.querySelector(s)?.scrollIntoView({ block: "center" });
        }, sel);
        await new Promise((r) => setTimeout(r, 420));
        await forceRenderCharts(page);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 500));
    await forceRenderCharts(page);
}
async function scrollAndWarmCharts(page) {
    await page.evaluate(async () => {
        const step = Math.max(window.innerHeight * 0.75, 280);
        const max = document.documentElement.scrollHeight;
        for (let y = 0; y <= max; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 480));
        }
        window.scrollTo(0, max);
        await new Promise((r) => setTimeout(r, 600));
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 600));
    });

    await forceRenderCharts(page);
}

/** 纵向分片截图，避免 fullPage 超高图超出 PDF 单页上限导致截断/重复 */
export async function captureScrollSlices(page) {
    const totalHeight = await page.evaluate(() =>
        Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        )
    );

    const buffers = [];
    for (let y = 0; y < totalHeight; y += SLICE_CSS_HEIGHT) {
        const clipHeight = Math.min(SLICE_CSS_HEIGHT, totalHeight - y);

        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
        await forceRenderCharts(page);
        await new Promise((r) => setTimeout(r, 280));

        buffers.push(
            await page.screenshot({
                type: "png",
                clip: { x: 0, y, width: VIEWPORT_WIDTH, height: clipHeight },
                captureBeyondViewport: true
            })
        );
    }

    return { buffers, totalHeight, sliceCount: buffers.length };
}
