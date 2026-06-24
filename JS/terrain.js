// =====================================
// 序章 · 贵州地形剖面 + 桥隧密度带
// =====================================

(function () {

    const terrainDiv = document.getElementById("terrainProfile");
    if (!terrainDiv || typeof Plotly === "undefined") return;

    const GREEN_DARK = "#4A7C65";
    const GREEN_MAIN = "#8CBFAA";
    const GREEN_LIGHT = "#D1E7DD";
    const GRAY = "#7A7A7A";
    const GRAY_LIGHT = "#B8B8B8";
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";

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

    const POINTS = 240;
    const x = [];
    const mountainFar = [];
    const mountainMid = [];
    const mountainFront = [];

    for (let i = 0; i < POINTS; i++) {
        const xv = (i / (POINTS - 1)) * 100;
        x.push(xv);
        mountainFar.push(18 + 4 * Math.sin(xv / 6) + 2.5 * Math.sin(xv / 2.5));
        mountainMid.push(26 + 6 * Math.sin(xv / 7 + 0.3) + 3 * Math.sin(xv / 2));
        mountainFront.push(32 + 7 * Math.sin(xv / 8 + 0.5) + 3.5 * Math.sin(xv / 1.8));
    }

    function mountainTrace(yValues, fillColor) {
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

    const BINS = 48;
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
        densityTop.push(base + (bridgeSmooth[i] / maxBridge) * 16);
    }

    const densityFillX = binXs.concat(binXs.slice().reverse());
    const densityFillY = densityTop.concat(densityBase.slice().reverse());

    const tunnelXs = [];
    const tunnelYs = [];
    const tunnelSizes = [];

    for (let i = 0; i < BINS; i++) {
        if (tunnelSmooth[i] < maxTunnel * 0.08) continue;
        const cx = (i + 0.5) * binStep;
        tunnelXs.push(cx);
        tunnelYs.push(interp(cx, x, mountainMid) - 2.5);
        tunnelSizes.push(4 + (tunnelSmooth[i] / maxTunnel) * 7);
    }

    const chartHeight = Math.max(terrainDiv.clientHeight || 0, 380);

    const layout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        height: chartHeight,
        margin: { l: 8, r: 8, t: 40, b: 12 },
        showlegend: false,
        xaxis: {
            range: [0, 100],
            visible: false,
            fixedrange: true
        },
        yaxis: {
            range: [0, 62],
            visible: false,
            fixedrange: true
        },
        annotations: [
            {
                x: 2,
                y: 56,
                xref: "x",
                yref: "y",
                text: "山的宿命 · 桥的答卷",
                showarrow: false,
                xanchor: "left",
                font: { size: 16, color: GREEN_DARK, family: FONT }
            },
            {
                x: 2,
                y: 51,
                xref: "x",
                yref: "y",
                text: "92.5% 山地丘陵 · 3.2 万座桥 · 2800 座隧道",
                showarrow: false,
                xanchor: "left",
                font: { size: 11, color: GRAY, family: FONT }
            },
            {
                x: 72,
                y: 48,
                xref: "x",
                yref: "y",
                text: "▬ 桥梁密度带",
                showarrow: false,
                xanchor: "left",
                font: { size: 10, color: GREEN_DARK, family: FONT }
            },
            {
                x: 72,
                y: 43,
                xref: "x",
                yref: "y",
                text: "● 隧道分布",
                showarrow: false,
                xanchor: "left",
                font: { size: 10, color: GRAY, family: FONT }
            }
        ]
    };

    const traces = [
        mountainTrace(mountainFar, hexToRgba(GREEN_LIGHT, 0.7)),
        mountainTrace(mountainMid, hexToRgba(GREEN_MAIN, 0.76)),
        mountainTrace(mountainFront, hexToRgba(GREEN_DARK, 0.85)),
        {
            x: densityFillX,
            y: densityFillY,
            type: "scatter",
            mode: "lines",
            fill: "toself",
            line: { width: 0, color: "rgba(0,0,0,0)" },
            fillcolor: hexToRgba(GREEN_DARK, 0.28),
            hoverinfo: "skip"
        },
        {
            x: binXs,
            y: densityTop,
            type: "scatter",
            mode: "lines",
            line: { width: 1.5, color: hexToRgba(GREEN_DARK, 0.55) },
            hoverinfo: "skip"
        },
        {
            x: tunnelXs,
            y: tunnelYs,
            mode: "markers",
            type: "scatter",
            marker: {
                size: tunnelSizes,
                color: GRAY_LIGHT,
                opacity: 0.72,
                line: { width: 0.5, color: GRAY }
            },
            hoverinfo: "skip"
        }
    ];

    Plotly.newPlot(terrainDiv, traces, layout, {
        responsive: true,
        displayModeBar: false
    }).then(() => {
        Plotly.Plots.resize(terrainDiv);
    });

    window.addEventListener("resize", () => {
        Plotly.Plots.resize(terrainDiv);
    });

})();
