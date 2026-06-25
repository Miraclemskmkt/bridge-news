// =====================================
// 序章 · 贵州地形剖面（观赏向水墨山水）
// =====================================

(function () {

    const terrainDiv = document.getElementById("terrainProfile");
    if (!terrainDiv || typeof Plotly === "undefined") return;

    const C = {
        ink: "#4A7C65",
        pine: "#8CBFAA",
        bamboo: "#6D9B8B",
        mist: "#D1E7DD",
        deep: "#2d5a4a",
        deepInk: "#1e3d32",
        paleMist: "#e8f4ef",
        skyWarm: "#eef6f2",
        gray: "#9aaba3",
        gold: "#c9a06c",
        goldSoft: "#e8d4b8",
        paper: "#F5F2E8",
        water: "#c5ddd4"
    };
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const FONT_POETIC = "Ma Shan Zheng, Long Cang, STKaiti, KaiTi, serif";
    const T = window.BRIDGE_CHART || {};

    function hexToRgba(hex, alpha) {
        const n = parseInt(hex.slice(1), 16);
        return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
    }

    function mountainFill(yValues, fillColor) {
        return {
            x,
            y: yValues,
            type: "scatter",
            mode: "lines",
            fill: "tozeroy",
            line: { width: 0, color: "rgba(0,0,0,0)" },
            fillcolor: fillColor,
            hoverinfo: "skip"
        };
    }

    function mountainRidge(yValues, color, width, smoothing) {
        return {
            x,
            y: yValues,
            type: "scatter",
            mode: "lines",
            line: {
                width,
                color,
                shape: "spline",
                smoothing: smoothing || 1.12
            },
            hoverinfo: "skip"
        };
    }

    function ridgeSegment(xSlice, ySlice, color, width, smoothing) {
        return {
            x: xSlice,
            y: ySlice,
            type: "scatter",
            mode: "lines",
            line: {
                width,
                color,
                shape: "spline",
                smoothing: smoothing || 1.08
            },
            hoverinfo: "skip"
        };
    }

    function findPeaks(yValues, radius, minProminence) {
        const peaks = [];
        for (let i = radius; i < yValues.length - radius; i++) {
            const y = yValues[i];
            let isPeak = true;
            for (let j = i - radius; j <= i + radius; j++) {
                if (j !== i && yValues[j] >= y) {
                    isPeak = false;
                    break;
                }
            }
            if (!isPeak) continue;
            const leftMin = Math.min(...yValues.slice(i - radius, i));
            const rightMin = Math.min(...yValues.slice(i + 1, i + radius + 1));
            const prominence = y - Math.max(leftMin, rightMin);
            if (prominence >= minProminence) {
                peaks.push({ index: i, y, prominence });
            }
        }
        return peaks;
    }

    function selectPeaks(peaks, maxCount, minSpacing) {
        const sorted = [...peaks].sort((a, b) => b.prominence - a.prominence);
        const chosen = [];
        for (const peak of sorted) {
            const px = x[peak.index];
            if (chosen.some((p) => Math.abs(x[p.index] - px) < minSpacing)) continue;
            chosen.push(peak);
            if (chosen.length >= maxCount) break;
        }
        return chosen;
    }

    function crownSegment(xArr, yArr, peakIndex, crownDepth) {
        const peakY = yArr[peakIndex];
        const threshold = peakY - crownDepth;
        let start = peakIndex;
        let end = peakIndex;
        while (start > 0 && yArr[start - 1] >= threshold) start--;
        while (end < yArr.length - 1 && yArr[end + 1] >= threshold) end++;
        if (end - start < 3) return null;
        return {
            x: xArr.slice(start, end + 1),
            y: yArr.slice(start, end + 1)
        };
    }

    function peakGoldCrowns(yValues, maxPeaks, crownDepth, color, width) {
        const peaks = selectPeaks(findPeaks(yValues, 8, 3.5), maxPeaks, 14);
        const traces = [];
        peaks.forEach((peak) => {
            const seg = crownSegment(x, yValues, peak.index, crownDepth);
            if (seg) traces.push(ridgeSegment(seg.x, seg.y, color, width, 1.06));
        });
        return traces;
    }

    function goldRimUnderlay(yValues, color, width) {
        return mountainRidge(yValues, color, width, 1.1);
    }

    function mistVeil(topY, bottomY, alpha) {
        return {
            x: x.concat(x.slice().reverse()),
            y: topY.concat(bottomY.slice().reverse()),
            type: "scatter",
            mode: "lines",
            fill: "toself",
            line: { width: 0, color: "rgba(0,0,0,0)" },
            fillcolor: hexToRgba(C.mist, alpha),
            hoverinfo: "skip"
        };
    }

    function bridgeArch(cx, span, lift, baseY) {
        const xs = [];
        const ys = [];
        const steps = 28;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            xs.push(cx - span / 2 + span * t);
            ys.push(baseY + lift * 4 * t * (1 - t));
        }
        return { xs, ys };
    }

    function bridgeTrace(cx, span, lift, baseY) {
        const arc = bridgeArch(cx, span, lift, baseY);
        return [
            {
                x: arc.xs,
                y: arc.ys,
                type: "scatter",
                mode: "lines",
                line: {
                    width: 2.4,
                    color: hexToRgba(C.goldSoft, 0.1),
                    shape: "spline",
                    smoothing: 1.12
                },
                hoverinfo: "skip"
            },
            {
                x: arc.xs,
                y: arc.ys,
                type: "scatter",
                mode: "lines",
                line: {
                    width: 0.72,
                    color: hexToRgba(C.gold, 0.48),
                    shape: "spline",
                    smoothing: 1.12
                },
                hoverinfo: "skip"
            }
        ];
    }

    function birdTrace(x0, y0, size) {
        return {
            x: [x0 - size, x0, x0 + size],
            y: [y0 + size * 0.35, y0, y0 + size * 0.35],
            type: "scatter",
            mode: "lines",
            line: {
                width: 0.5,
                color: hexToRgba(C.deep, 0.18)
            },
            hoverinfo: "skip"
        };
    }

    function reflectionFill(yValues, floorY, alpha) {
        const yr = yValues.map((y) => floorY - (y - floorY) * 0.14);
        return mountainFill(yr, hexToRgba(C.water, alpha));
    }

    function computeBridgeSites(yValues, maxCount) {
        const window = 10;
        const candidates = [];

        for (let i = window; i < yValues.length - window; i++) {
            const y = yValues[i];
            let isValley = true;
            for (let j = i - window; j <= i + window; j++) {
                if (j !== i && yValues[j] <= y) {
                    isValley = false;
                    break;
                }
            }
            if (!isValley) continue;

            const leftPeak = Math.max(...yValues.slice(i - window, i));
            const rightPeak = Math.max(...yValues.slice(i + 1, i + window + 1));
            const prominence = Math.min(leftPeak, rightPeak) - y;
            if (prominence < 5) continue;

            candidates.push({ cx: x[i], baseY: y, prominence });
        }

        candidates.sort((a, b) => b.prominence - a.prominence);
        const sites = [];

        for (const c of candidates) {
            if (sites.some((s) => Math.abs(s.cx - c.cx) < 16)) continue;
            sites.push({
                cx: c.cx,
                baseY: c.baseY,
                span: Math.min(12, 7 + c.prominence * 0.28),
                lift: Math.min(7.5, 3.2 + c.prominence * 0.22)
            });
            if (sites.length >= maxCount) break;
        }

        return sites;
    }

    const POINTS = 420;
    const x = [];
    const mountainSky = [];
    const mountainFar = [];
    const mountainMidFar = [];
    const mountainMid = [];
    const mountainNear = [];
    const mountainFront = [];

    for (let i = 0; i < POINTS; i++) {
        const xv = (i / (POINTS - 1)) * 100;
        x.push(xv);
        mountainSky.push(9 + 2 * Math.sin(xv / 10.2) + 0.9 * Math.sin(xv / 4.1));
        mountainFar.push(
            15 + 3.8 * Math.sin(xv / 7.8) +
            2.1 * Math.sin(xv / 3.4) +
            0.9 * Math.sin(xv / 1.5)
        );
        mountainMidFar.push(
            21 + 5.2 * Math.sin(xv / 7.1 + 0.25) +
            2.8 * Math.sin(xv / 2.6) +
            1.3 * Math.sin(xv / 1.2)
        );
        mountainMid.push(
            28 + 6.4 * Math.sin(xv / 6.6 + 0.38) +
            3.2 * Math.sin(xv / 2.1) +
            1.5 * Math.sin(xv / 1.02)
        );
        mountainNear.push(
            34 + 7.2 * Math.sin(xv / 7.2 + 0.5) +
            3.6 * Math.sin(xv / 1.78) +
            1.9 * Math.sin(xv / 0.9)
        );
        mountainFront.push(
            40 + 8.4 * Math.sin(xv / 7.5 + 0.62) +
            4.1 * Math.sin(xv / 1.68) +
            2.2 * Math.sin(xv / 0.82) +
            1.1 * Math.sin(xv / 0.4)
        );
    }

    const BRIDGE_SITES = computeBridgeSites(mountainFront, 3);
    const WATER_FLOOR = 6;

    function buildLayout(height) {
        return {
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            height,
            margin: { l: 0, r: 0, t: 48, b: 4 },
            showlegend: false,
            xaxis: {
                range: [0, 100],
                visible: false,
                fixedrange: true
            },
            yaxis: {
                range: [0, 82],
                visible: false,
                fixedrange: true
            },
            shapes: [
                {
                    type: "rect",
                    xref: "paper",
                    yref: "paper",
                    x0: 0,
                    x1: 1,
                    y0: 0.55,
                    y1: 1,
                    fillcolor: "rgba(232, 244, 239, 0.24)",
                    line: { width: 0 },
                    layer: "below"
                },
                {
                    type: "circle",
                    xref: "paper",
                    yref: "paper",
                    x0: 0.76,
                    y0: 0.84,
                    x1: 0.94,
                    y1: 1.02,
                    fillcolor: "rgba(232, 244, 239, 0.2)",
                    line: { width: 0 },
                    layer: "below"
                },
                {
                    type: "rect",
                    xref: "paper",
                    yref: "paper",
                    x0: 0,
                    x1: 1,
                    y0: 0,
                    y1: 0.18,
                    fillcolor: "rgba(197, 221, 212, 0.12)",
                    line: { width: 0 },
                    layer: "below"
                },
                {
                    type: "rect",
                    xref: "paper",
                    yref: "paper",
                    x0: 0,
                    x1: 1,
                    y0: 0,
                    y1: 0.08,
                    fillcolor: "rgba(245, 242, 232, 0.28)",
                    line: { width: 0 },
                    layer: "below"
                }
            ],
            annotations: [
                {
                    x: 0.95,
                    y: 0.985,
                    xref: "paper",
                    yref: "paper",
                    text: "万壑千山",
                    showarrow: false,
                    xanchor: "right",
                    yanchor: "top",
                    font: {
                        size: (T.subtitle || 14) + 8,
                        color: hexToRgba(C.deep, 0.62),
                        family: FONT_POETIC
                    }
                },
                {
                    x: 0.95,
                    y: 0.895,
                    xref: "paper",
                    yref: "paper",
                    text: "一桥飞架",
                    showarrow: false,
                    xanchor: "right",
                    yanchor: "top",
                    font: {
                        size: (T.subtitle || 14) + 5,
                        color: hexToRgba(C.deep, 0.58),
                        family: FONT_POETIC
                    }
                },
                {
                    x: 0.95,
                    y: 0.805,
                    xref: "paper",
                    yref: "paper",
                    text: "云开雾散见通途",
                    showarrow: false,
                    xanchor: "right",
                    yanchor: "top",
                    font: {
                        size: (T.axis || 12) + 2,
                        color: hexToRgba(C.gray, 0.52),
                        family: FONT
                    }
                }
            ]
        };
    }

    function buildTraces() {
        const traces = [
            mountainFill(mountainSky, hexToRgba(C.paleMist, 0.4)),
            mountainFill(mountainFar, hexToRgba(C.mist, 0.36)),
            mistVeil(mountainFar, mountainSky, 0.09),
            mountainFill(mountainMidFar, hexToRgba(C.pine, 0.32)),
            mistVeil(mountainMidFar, mountainFar, 0.08),
            mountainFill(mountainMid, hexToRgba(C.pine, 0.48)),
            mistVeil(mountainMid, mountainMidFar, 0.07),
            mountainFill(mountainNear, hexToRgba(C.ink, 0.44)),
            mistVeil(mountainNear, mountainMid, 0.06),
            mountainFill(mountainFront, hexToRgba(C.deep, 0.8)),
            reflectionFill(mountainFront, WATER_FLOOR, 0.08),
            mountainRidge(mountainFar, hexToRgba(C.paper, 0.1), 0.45),
            mountainRidge(mountainMidFar, hexToRgba(C.paper, 0.14), 0.55),
            mountainRidge(mountainMid, hexToRgba(C.paper, 0.18), 0.65),
            goldRimUnderlay(mountainNear, hexToRgba(C.goldSoft, 0.07), 1.05),
            mountainRidge(mountainNear, hexToRgba(C.paper, 0.24), 0.72),
            ...peakGoldCrowns(
                mountainNear,
                2,
                2.8,
                hexToRgba(C.goldSoft, 0.22),
                0.65
            ),
            goldRimUnderlay(mountainFront, hexToRgba(C.goldSoft, 0.11), 1.15),
            mountainRidge(mountainFront, hexToRgba(C.paper, 0.3), 0.82),
            ...peakGoldCrowns(
                mountainFront,
                4,
                3.6,
                hexToRgba(C.gold, 0.38),
                0.78
            ),
            birdTrace(24, 59, 1.5),
            birdTrace(73, 55, 1.3)
        ];

        BRIDGE_SITES.forEach((site) => {
            traces.push(...bridgeTrace(site.cx, site.span, site.lift, site.baseY));
        });

        return traces;
    }

    function render() {
        const height = (window.BRIDGE_CHART_HEIGHT || function (el, fb) {
            return el?.clientHeight > 24 ? el.clientHeight : (fb || 460);
        })(terrainDiv, 360);
        Plotly.newPlot(terrainDiv, buildTraces(), buildLayout(height), {
            responsive: true,
            displayModeBar: false,
            staticPlot: true
        }).then(() => {
            Plotly.Plots.resize(terrainDiv);
            terrainDiv.classList.add("terrain-profile--ready");
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render);
    } else {
        render();
    }

    window.addEventListener("resize", () => {
        const height = (window.BRIDGE_CHART_HEIGHT || function (el, fb) {
            return el?.clientHeight > 24 ? el.clientHeight : (fb || 360);
        })(terrainDiv, 360);
        Plotly.relayout(terrainDiv, { height }).then(() => Plotly.Plots.resize(terrainDiv));
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    terrainDiv.classList.add("terrain-profile--visible");
                    Plotly.Plots.resize(terrainDiv);
                }
            });
        }, { threshold: 0.12 });
        observer.observe(terrainDiv);
    }

})();
