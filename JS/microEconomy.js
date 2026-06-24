// =====================================
// 特色微观经济产业看板
// 分区布局：账本柱状图 + 脱贫/旅游 KPI 卡片
// =====================================

(function () {

    const dom = document.getElementById("microPanel1");
    if (!dom) return;

    const C = {
        ink: "#4A7C65",
        bamboo: "#6D9B8B",
        gray: "#7A7A7A",
        light: "#B8B8B8",
        line: "#B8B8B8"
    };

    const metrics = ["通行时间", "单趟收入"];
    const beforeBridge = [8.5, 8.0];
    const afterBridge = [2.0, 20.0];

    const beforeText = beforeBridge.map((x, i) =>
        i === 0 ? `${x}h` : `${Math.round(x * 100)}元`
    );
    const afterText = afterBridge.map((x, i) =>
        i === 0 ? `<${x}h` : `${Math.round(x * 100)}元`
    );

    const traces = [
        {
            type: "bar",
            name: "建桥前",
            x: metrics,
            y: beforeBridge,
            text: beforeText,
            textposition: "inside",
            insidetextanchor: "middle",
            textfont: { color: "#fff", size: 11 },
            marker: { color: C.light, line: { color: C.gray, width: 0.5 } },
            hovertemplate: "建桥前 · %{x}<br><b>%{text}</b><extra></extra>",
            width: 0.36
        },
        {
            type: "bar",
            name: "建桥后",
            x: metrics,
            y: afterBridge,
            text: afterText,
            textposition: "inside",
            insidetextanchor: "middle",
            textfont: { color: "#fff", size: 11 },
            marker: { color: C.ink, line: { color: C.bamboo, width: 0.5 } },
            hovertemplate: "建桥后 · %{x}<br><b>%{text}</b><extra></extra>",
            width: 0.36
        }
    ];

    const layout = {
        font: { family: "Noto Serif SC, Source Han Serif SC, SimSun, serif" },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        barmode: "group",
        bargap: 0.32,
        bargroupgap: 0.14,
        height: 196,
        margin: { l: 4, r: 4, t: 4, b: 28 },
        showlegend: false,
        xaxis: {
            tickfont: { size: 10, color: C.ink },
            tickangle: 0,
            showgrid: false,
            linecolor: C.line,
            fixedrange: true
        },
        yaxis: {
            range: [0, 22],
            showticklabels: false,
            showgrid: false,
            zeroline: false,
            showline: false,
            fixedrange: true
        }
    };

    Plotly.newPlot(dom, traces, layout, {
        responsive: true,
        displayModeBar: false
    });

    window.addEventListener("resize", () => {
        Plotly.Plots.resize(dom);
    });

})();
