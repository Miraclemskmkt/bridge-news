// =====================================
// Terrain Profile
// 序章｜贵州地形剖面叠加密度图
// =====================================

(function () {

    const terrainDiv = document.getElementById("terrainProfile");
    if (!terrainDiv || typeof Plotly === "undefined") return;

    const GREEN_DARK = "#4A7C65";
    const GREEN_MAIN = "#8CBFAA";
    const GREEN_LIGHT = "#D1E7DD";
    const GRAY = "#7A7A7A";
    const GRAY_LIGHT = "#B8B8B8";

    function mulberry32(seed) {
        return function () {
            seed |= 0;
            seed = (seed + 0x6d2b79f5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function randn(rng, mean, std) {
        let u = 0;
        let v = 0;
        while (u === 0) u = rng();
        while (v === 0) v = rng();
        const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        return mean + z * std;
    }

    function hexToRgba(hex, alpha) {
        const n = parseInt(hex.slice(1), 16);
        const r = (n >> 16) & 255;
        const g = (n >> 8) & 255;
        const b = n & 255;
        return `rgba(${r},${g},${b},${alpha})`;
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

    const POINTS = 3000;
    const x = [];
    const mountainFar = [];
    const mountainMid = [];
    const mountainFront = [];

    for (let i = 0; i < POINTS; i++) {
        const xv = (i / (POINTS - 1)) * 100;
        x.push(xv);
        mountainFar.push(20 + 5 * Math.sin(xv / 6) + 3 * Math.sin(xv / 2.5));
        mountainMid.push(28 + 8 * Math.sin(xv / 7) + 4 * Math.sin(xv / 2));
        mountainFront.push(35 + 10 * Math.sin(xv / 8) + 5 * Math.sin(xv / 1.8));
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

    const rng = mulberry32(42);
    const bridgeX = [];
    const bridgeY = [];
    const tunnelX = [];
    const tunnelY = [];

    for (let i = 0; i < 32000; i++) {
        const bx = rng() * 100;
        bridgeX.push(bx);
        bridgeY.push(interp(bx, x, mountainFront) + randn(rng, 4, 2));
    }

    for (let i = 0; i < 2800; i++) {
        const tx = rng() * 100;
        tunnelX.push(tx);
        tunnelY.push(interp(tx, x, mountainMid) - rng() * 3);
    }

    const bridgeXPlot = bridgeX.filter((_, i) => i % 4 === 0);
    const bridgeYPlot = bridgeY.filter((_, i) => i % 4 === 0);

    const chartHeight = Math.max(terrainDiv.clientHeight || 0, 380);

    const layout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        height: chartHeight,
        margin: { l: 8, r: 8, t: 36, b: 8 },
        showlegend: false,
        xaxis: {
            range: [0, 100],
            visible: false,
            fixedrange: true
        },
        yaxis: {
            range: [0, 65],
            visible: false,
            fixedrange: true
        },
        annotations: [
            {
                x: 2,
                y: 58,
                xref: "x",
                yref: "y",
                text: "山的宿命 · 桥的答卷",
                showarrow: false,
                xanchor: "left",
                font: { size: 18, color: GREEN_DARK, family: "Microsoft YaHei, PingFang SC, sans-serif" }
            },
            {
                x: 2,
                y: 53,
                xref: "x",
                yref: "y",
                text: "92.5% 山地丘陵 · 3.2万座桥 · 2800座隧道",
                showarrow: false,
                xanchor: "left",
                font: { size: 11, color: GRAY, family: "Microsoft YaHei, PingFang SC, sans-serif" }
            },
            {
                x: 78,
                y: 45,
                xref: "x",
                yref: "y",
                text: "32000+ Bridges",
                showarrow: false,
                xanchor: "left",
                font: { size: 13, color: GREEN_DARK, family: "Microsoft YaHei, PingFang SC, sans-serif" }
            },
            {
                x: 78,
                y: 40,
                xref: "x",
                yref: "y",
                text: "2800 Tunnels",
                showarrow: false,
                xanchor: "left",
                font: { size: 13, color: GRAY, family: "Microsoft YaHei, PingFang SC, sans-serif" }
            }
        ]
    };

    const traces = [
        mountainTrace(mountainFar, hexToRgba(GREEN_LIGHT, 0.72)),
        mountainTrace(mountainMid, hexToRgba(GREEN_MAIN, 0.78)),
        mountainTrace(mountainFront, hexToRgba(GREEN_DARK, 0.82)),
        {
            x: tunnelX,
            y: tunnelY,
            mode: "markers",
            type: "scatter",
            marker: {
                size: 3,
                color: GRAY_LIGHT,
                opacity: 0.55
            },
            hoverinfo: "skip"
        },
        {
            x: bridgeXPlot,
            y: bridgeYPlot,
            mode: "markers",
            type: "scatter",
            marker: {
                size: 2,
                color: GREEN_DARK,
                opacity: 0.32
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
