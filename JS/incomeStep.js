// =====================================
// 贵州省及民族自治县农村居民人均可支配收入增长趋势图
// 对应 之前/13.贵州省及民族自治县农村居民人均可支配收入增长趋势图.py
// =====================================

(function () {

    const dom = document.getElementById("incomeStep");
    if (!dom) return;

    const T = window.BRIDGE_CHART || {};

    const C = {
        ink: "#4A7C65",
        pine: "#8CBFAA",
        gray: "#7A7A7A",
        grid: "#EAE5D9"
    };

    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

    const provinceIncome = [8090, 8869, 9716, 10756, 11642, 12856, 13707, 14817, 15856, 19000];

    const minorityIncome = [7500, 8500, 9300, 10500, 11200, 12600, 13500, 14600, 15600, 18800];

    const traces = [
        {
            x: years,
            y: provinceIncome,
            mode: "lines+markers",
            name: "全省农村常住居民平均水平",
            line: { color: C.ink, width: 3 },
            marker: { size: 8, symbol: "circle", color: C.ink },
            hovertemplate: "<b>全省平均</b><br>年份: %{x}年<br>收入: %{y} 元<extra></extra>"
        },
        {
            x: years,
            y: minorityIncome,
            mode: "lines+markers",
            name: "十一大民族自治县居民均值",
            line: { color: C.pine, width: 3 },
            marker: { size: 8, symbol: "diamond", color: C.pine },
            hovertemplate: "<b>少数民族自治县均值</b><br>年份: %{x}年<br>收入: %{y} 元<extra></extra>"
        }
    ];

    const layout = {
        font: {
            size: T.axis || 11,
            color: C.gray,
            family: "Noto Serif SC, Source Han Serif SC, SimSun, serif"
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        height: 400,
        margin: { l: 52, r: 48, t: 36, b: 44 },
        legend: {
            orientation: "h",
            yanchor: "bottom",
            y: 1.02,
            xanchor: "right",
            x: 1,
            font: { size: T.legend || 11 }
        },
        xaxis: {
            type: "linear",
            tickmode: "array",
            tickvals: years,
            ticktext: years.map((y) => `${y}年`),
            showgrid: true,
            gridcolor: C.grid,
            linecolor: C.gray,
            linewidth: 0.8,
            ticks: "outside",
            tickcolor: C.gray,
            tickfont: { size: T.axisSm || 10 }
        },
        yaxis: {
            showgrid: true,
            gridcolor: C.grid,
            linecolor: C.gray,
            linewidth: 0.8,
            title: {
                text: "人均支配收入 (元)",
                font: { size: 11, color: C.gray }
            },
            ticks: "outside",
            tickcolor: C.gray,
            tickfont: { size: T.axisSm || 10 }
        },
        annotations: [
            {
                x: 2016, y: provinceIncome[0],
                text: ` ${provinceIncome[0]}元`,
                xanchor: "right", yanchor: "bottom",
                showarrow: false,
                font: { color: C.ink, size: 10 }
            },
            {
                x: 2016, y: minorityIncome[0],
                text: ` ${minorityIncome[0]}元`,
                xanchor: "right", yanchor: "top",
                showarrow: false,
                font: { color: C.pine, size: 10 }
            },
            {
                x: 2025, y: provinceIncome[9],
                text: ` ${provinceIncome[9]}元 `,
                xanchor: "left", yanchor: "bottom",
                showarrow: false,
                font: { color: C.ink, size: 11 }
            },
            {
                x: 2025, y: minorityIncome[9],
                text: ` ${minorityIncome[9]}元 `,
                xanchor: "left", yanchor: "top",
                showarrow: false,
                font: { color: C.pine, size: 11 }
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
