// =====================================
// 序章 · 贵州地形剖面 + 桥隧密度带
// =====================================

(function () {

    const terrainDiv = document.getElementById("terrainProfile");
    if (!terrainDiv || typeof Plotly === "undefined") return;

    const C = {
        ink: "#4A7C65",
        pine: "#8CBFAA",
        mist: "#D1E7DD",
        deep: "#3a7262",
        gray: "#7A7A7A",
        grayLight: "#B8B8B8",
        gold: "#bf8c60",
        paper: "#F5F2E8",
        buyi: "#3a5f7a"
    };
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const T = window.BRIDGE_CHART || {};

    function mulberry32(seed) {
        return function () {
            seed |= 0;
            seed = (seed + 0x6d2b79f5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function hexToRgba(hex, alpha) {
        const n = parseInt(hex.slice(1), 16);
        return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
    }

    function interp(xi, xs, ys) {
        if (xi <= xs[0]) return ys[0];
        if (xi >= xs[xs.length - 1]) return ys[ys.length - 1];
        const step = xs[1] - xs[0];
        const idx = (xi - xs[0]) / step;
        const i = Math.floor(idx);
        const f = idx - i;
        return ys[i] + f * (ys[i + 1] - ys[i]);
    }

    function smooth(arr, w) {
        return arr.map((_, i) => {
            let sum = 0;
            let n = 0;
            for (let j = i - w; j <= i + w; j++) {
                if (j >= 0 && j < arr.length) {
                    sum += arr[j];
                    n++;
                }
            }
            return sum / n;
        });
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

    function mountainRidge(yValues, color, width) {
        return {
            x,
            y: yValues,
            type: "scatter",
            mode: "lines",
            line: { width, color, shape: "spline", smoothing: 1.15 },
            hoverinfo: "skip"
        };
    }

    const POINTS = 280;
    const x = [];
    const mountainSky = [];
    const mountainFar = [];
    const mountainMid = [];
    const mountainFront = [];

    for (let i = 0; i < POINTS; i++) {
        const xv = (i / (POINTS - 1)) * 100;
        x.push(xv);
        mountainSky.push(14 + 3 * Math.sin(xv / 8) + 1.8 * Math.sin(xv / 3.2));
        mountainFar.push(20 + 5 * Math.sin(xv / 6.5) + 2.8 * Math.sin(xv / 2.8) + 1.2 * Math.sin(xv / 1.1));
        mountainMid.push(28 + 7 * Math.sin(xv / 7.2 + 0.35) + 3.6 * Math.sin(xv / 2.1) + 1.8 * Math.sin(xv / 0.95));
        mountainFront.push(
            36 + 9 * Math.sin(xv / 7.8 + 0.55) +
            4.5 * Math.sin(xv / 1.75) +
            2.2 * Math.sin(xv / 0.82) +
            1.4 * Math.sin(xv / 0.45)
        );
    }

    const BINS = 52;
    const bridgeDensity = new Array(BINS).fill(0);
    const tunnelDensity = new Array(BINS).fill(0);
    const rng = mulberry32(42);

    for (let i = 0; i < 32000; i++) {
        const bx = rng() * 100;
        const bin = Math.min(BINS - 1, Math.floor(bx / 100 * BINS));
        bridgeDensity[bin]++;
    }

    for (let i = 0; i < 2800; i++) {
        const tx = rng() * 100;
        const bin = Math.min(BINS - 1, Math.floor(tx / 100 * BINS));
        tunnelDensity[bin]++;
    }

    const bridgeSmooth = smooth(bridgeDensity, 2);
    const tunnelSmooth = smooth(tunnelDensity, 1);
    const maxBridge = Math.max.apply(null, bridgeSmooth);
    const maxTunnel = Math.max.apply(null, tunnelSmooth);

    const binStep = 100 / BINS;
    const binXs = [];
    const densityTop = [];
    const densityBase = [];

    for (let i = 0; i < BINS; i++) {
        const cx = (i + 0.5) * binStep;
        binXs.push(cx);
        const base = interp(cx, x, mountainFront);
        densityBase.push(base);
        densityTop.push(base + (bridgeSmooth[i] / maxBridge) * 18);
    }

    const densityFillX = binXs.concat(binXs.slice().reverse());
    const densityFillY = densityTop.concat(densityBase.slice().reverse());

    const tunnelXs = [];
    const tunnelYs = [];
    const tunnelSizes = [];
    const tunnelStemsX = [];
    const tunnelStemsY = [];

    for (let i = 0; i < BINS; i++) {
        if (tunnelSmooth[i] < maxTunnel * 0.07) continue;
        const cx = (i + 0.5) * binStep;
        const peakY = interp(cx, x, mountainMid);
        tunnelXs.push(cx);
        tunnelYs.push(peakY - 3);
        tunnelSizes.push(5 + (tunnelSmooth[i] / maxTunnel) * 8);
        tunnelStemsX.push(cx, cx, null);
        tunnelStemsY.push(peakY - 3, Math.max(2, peakY - 14), null);
    }

    function buildLayout(height) {
        return {
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            height,
            margin: { l: 4, r: 4, t: 52, b: 8 },
            showlegend: false,
            xaxis: {
                range: [0, 100],
                visible: false,
                fixedrange: true
            },
            yaxis: {
                range: [0, 72],
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
                    fillcolor: "rgba(209,231,221,0.14)",
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
                    y1: 0.22,
                    fillcolor: "rgba(245,242,232,0.35)",
                    line: { width: 0 },
                    layer: "below"
                },
                {
                    type: "line",
                    xref: "paper",
                    yref: "y",
                    x0: 0,
                    x1: 1,
                    y0: 0,
                    y1: 0,
                    line: { color: hexToRgba(C.ink, 0.12), width: 1.2 },
                    layer: "below"
                }
            ],
            annotations: [
                {
                    x: 0.03,
                    y: 1.02,
                    xref: "paper",
                    yref: "paper",
                    text: "山的宿命 · 桥的答卷",
                    showarrow: false,
                    xanchor: "left",
                    yanchor: "bottom",
                    font: {
                        size: T.subtitle || 16,
                        color: C.ink,
                        family: FONT
                    },
                    bgcolor: hexToRgba(C.paper, 0.82),
                    bordercolor: hexToRgba(C.ink, 0.14),
                    borderwidth: 1,
                    borderpad: 8
                },
                {
                    x: 0.03,
                    y: 0.965,
                    xref: "paper",
                    yref: "paper",
                    text: "92.5% 山地丘陵 · 3.2 万座桥 · 2800 座隧道",
                    showarrow: false,
                    xanchor: "left",
                    yanchor: "bottom",
                    font: {
                        size: T.axisSm || 11,
                        color: C.gray,
                        family: FONT
                    }
                },
                {
                    x: 0.97,
                    y: 0.97,
                    xref: "paper",
                    yref: "paper",
                    text: "▬ 桥梁密度带",
                    showarrow: false,
                    xanchor: "right",
                    yanchor: "bottom",
                    font: {
                        size: T.axisSm || 11,
                        color: C.ink,
                        family: FONT
                    },
                    bgcolor: hexToRgba(C.paper, 0.75),
                    borderpad: 4
                },
                {
                    x: 0.97,
                    y: 0.915,
                    xref: "paper",
                    yref: "paper",
                    text: "● 隧道分布",
                    showarrow: false,
                    xanchor: "right",
                    yanchor: "bottom",
                    font: {
                        size: T.axisSm || 11,
                        color: C.buyi,
                        family: FONT
                    },
                    bgcolor: hexToRgba(C.paper, 0.75),
                    borderpad: 4
                }
            ]
        };
    }

    function buildTraces() {
        return [
            mountainFill(mountainSky, hexToRgba(C.mist, 0.42)),
            mountainFill(mountainFar, hexToRgba(C.mist, 0.62)),
            mountainFill(mountainMid, hexToRgba(C.pine, 0.78)),
            mountainFill(mountainFront, hexToRgba(C.ink, 0.88)),
            mountainRidge(mountainFront, hexToRgba(C.paper, 0.42), 1.4),
            mountainRidge(mountainMid, hexToRgba(C.paper, 0.18), 0.8),
            {
                x: densityFillX,
                y: densityFillY,
                type: "scatter",
                mode: "lines",
                fill: "toself",
                line: { width: 0, color: "rgba(0,0,0,0)" },
                fillcolor: hexToRgba(C.ink, 0.22),
                hoverinfo: "skip"
            },
            {
                x: binXs,
                y: densityTop,
                type: "scatter",
                mode: "lines",
                line: {
                    width: 2,
                    color: hexToRgba(C.ink, 0.72),
                    shape: "spline",
                    smoothing: 1.1
                },
                hoverinfo: "skip"
            },
            {
                x: binXs,
                y: densityTop.map((v, i) => v + 0.6),
                type: "scatter",
                mode: "lines",
                line: {
                    width: 1,
                    color: hexToRgba(C.gold, 0.35),
                    shape: "spline",
                    smoothing: 1.1
                },
                hoverinfo: "skip"
            },
            {
                x: tunnelStemsX,
                y: tunnelStemsY,
                type: "scatter",
                mode: "lines",
                line: { width: 0.8, color: hexToRgba(C.buyi, 0.22), dash: "dot" },
                hoverinfo: "skip"
            },
            {
                x: tunnelXs,
                y: tunnelYs,
                mode: "markers",
                type: "scatter",
                marker: {
                    size: tunnelSizes,
                    color: hexToRgba(C.paper, 0.95),
                    opacity: 0.92,
                    line: { width: 1.4, color: C.buyi },
                    symbol: "circle"
                },
                hoverinfo: "skip"
            }
        ];
    }

    function render() {
        const height = Math.max(terrainDiv.clientHeight || 0, 400);
        Plotly.newPlot(terrainDiv, buildTraces(), buildLayout(height), {
            responsive: true,
            displayModeBar: false,
            staticPlot: true
        }).then(() => Plotly.Plots.resize(terrainDiv));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render);
    } else {
        render();
    }

    window.addEventListener("resize", () => Plotly.Plots.resize(terrainDiv));

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) Plotly.Plots.resize(terrainDiv);
            });
        }, { threshold: 0.1 });
        observer.observe(terrainDiv);
    }

})();
