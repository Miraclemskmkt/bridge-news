// ======================================
// 一个人的账本 · 跨越式哑铃图
// 对应 之前/6.“一个人的账本”跨越式哑铃图.py
// ======================================

(function () {

    const dom = document.getElementById("incomeDumbbell");
    if (!dom) return;

    const C = {
        pine: "#8CBFAA",
        ink: "#4A7C65",
        gray: "#7A7A7A",
        line: "#B8B8B8",
        grid: "#EFECE1",
        paper: "#F5F2E8",
        white: "#F5F2E8"
    };

    function lineTrace(x0, x1, xaxis, yaxis) {
        return {
            x: [x0, x1],
            y: [0, 0],
            mode: "lines",
            line: { color: C.pine, width: 8 },
            hoverinfo: "skip",
            showlegend: false,
            xaxis,
            yaxis
        };
    }

    function pointTrace(x, main, sub, isAfter, textPos, xaxis, yaxis) {
        return {
            x: [x],
            y: [0],
            mode: "markers+text",
            marker: {
                color: isAfter ? C.ink : C.gray,
                size: isAfter ? 18 : 16,
                line: { color: C.white, width: 2 }
            },
            text: [`${main}<br>${sub}`],
            textposition: textPos,
            textfont: {
                size: isAfter ? 12 : 11,
                color: isAfter ? C.ink : C.gray,
                family: "Noto Serif SC, Source Han Serif SC, SimSun, serif"
            },
            hoverinfo: "skip",
            showlegend: false,
            xaxis,
            yaxis
        };
    }

    const traces = [
        lineTrace(800, 2000, "x", "y"),
        pointTrace(800, "800 元", "桥通前", false, "top left", "x", "y"),
        pointTrace(2000, "2000 元", "桥通后", true, "top right", "x", "y"),

        lineTrace(12000, 14970, "x2", "y2"),
        pointTrace(12000, "12000 元", "2024年", false, "top left", "x2", "y2"),
        pointTrace(14970, "14970 元", "2025年", true, "top right", "x2", "y2"),

        lineTrace(120, 2, "x3", "y3"),
        pointTrace(120, "120 分钟", "大桥开通前 (2小时)", false, "top right", "x3", "y3"),
        pointTrace(2, "2 分钟", "开通后 (时空压缩)", true, "top left", "x3", "y3")
    ];

    const axisStyle = {
        showgrid: true,
        gridcolor: C.grid,
        linecolor: C.line,
        tickfont: { color: C.gray, size: 10 },
        zeroline: false
    };

    const yAxisStyle = {
        range: [-0.5, 0.5],
        showticklabels: false,
        showgrid: false,
        zeroline: false,
        fixedrange: true
    };

    const layout = {
        title: {
            text: "第二幕：桥见经济 · 「一个人的账本」跨越式变迁<br><span style='font-size:12px;color:#7A7A7A;'>从微观账本透视世界级高桥带来的个体财富增收与时空压缩效益</span>",
            x: 0.03,
            y: 0.98,
            xanchor: "left",
            font: { size: 15, color: C.ink, family: "Noto Serif SC, Source Han Serif SC, SimSun, serif" }
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        height: 680,
        margin: { t: 110, b: 40, l: 40, r: 20 },
        font: { family: "Noto Serif SC, Source Han Serif SC, SimSun, serif" },
        grid: {
            rows: 3,
            columns: 1,
            pattern: "independent",
            roworder: "top to bottom",
            ygap: 0.14
        },
        xaxis: { ...axisStyle, range: [300, 2500] },
        yaxis: { ...yAxisStyle, anchor: "x" },
        xaxis2: { ...axisStyle, range: [10000, 17000] },
        yaxis2: { ...yAxisStyle, anchor: "x2" },
        xaxis3: { ...axisStyle, range: [-25, 155] },
        yaxis3: { ...yAxisStyle, anchor: "x3" },
        annotations: [
            {
                text: "<b>① 货车司机单趟收入变迁 (微观个体账本)</b>",
                xref: "x domain", yref: "y domain",
                x: 0, y: 1.25, xanchor: "left", yanchor: "bottom",
                showarrow: false,
                font: { size: 12, color: C.ink }
            },
            {
                text: "<b>单趟收益跃升 +150.0%</b>",
                xref: "x", yref: "y",
                x: 1400, y: -0.22,
                showarrow: false,
                font: { size: 11, color: C.ink }
            },
            {
                text: "<b>② 核心产区椒农人均年收入 (产业增收账本)</b>",
                xref: "x2 domain", yref: "y2 domain",
                x: 0, y: 1.25, xanchor: "left", yanchor: "bottom",
                showarrow: false,
                font: { size: 12, color: C.ink }
            },
            {
                text: "<b>年收入增长 +24.8%</b>",
                xref: "x2", yref: "y2",
                x: 13485, y: -0.22,
                showarrow: false,
                font: { size: 11, color: C.ink }
            },
            {
                text: "<b>③ 关岭至贞丰跨峡谷货运耗时 (时空压缩时效)</b>",
                xref: "x3 domain", yref: "y3 domain",
                x: 0, y: 1.25, xanchor: "left", yanchor: "bottom",
                showarrow: false,
                font: { size: 12, color: C.ink }
            },
            {
                text: "<b>跨峡时效提升 60 倍 (耗时缩短 -98.3%)</b>",
                xref: "x3", yref: "y3",
                x: 61, y: -0.22,
                showarrow: false,
                font: { size: 11, color: C.ink }
            }
        ]
    };

    Plotly.newPlot(dom, traces, layout, {
        responsive: true,
        displayModeBar: false
    });

    window.addEventListener("resize", () => {
        Plotly.Plots.resize(dom);
    });

})();
