// =====================================
// 榕江「村超」里程碑演进与文旅综合收入气泡时间轴图
// 对应 之前/14.“村超经济”时间轴+泡泡图.py
// =====================================

(function () {

    const dom = document.getElementById("villageSuper");
    if (!dom) return;

    const C = {
        ink: "#4A7C65",
        pine: "#8CBFAA",
        gray: "#7A7A7A",
        line: "#B8B8B8",
        grid: "#E5E2D8",
        paper: "#F5F2E8"
    };

    const times = ["2023-05", "2023-07", "2024-02", "2024-06", "2025-05", "2025-11"];

    const milestones = [
        "村超揭幕破圈",
        "总决赛现象级爆火",
        "新春赛民俗交融",
        "全国美食赛开幕",
        "国际交流赛拓展",
        "两周年常态化运营"
    ];

    const descriptions = [
        "村超揭幕战开启，厦蓉高速迎来第一波客流高峰",
        "总决赛盛况空前，全网爆火带动跨省大众文旅流量",
        "新春赛与跨年村超举办，少数民族传统文化深度交融",
        "全国美食赛开幕，舌尖经济与多元产业外溢效应显著",
        "国际村超交流赛举办，技术与文化输出拓展「一带一路」",
        "两周年成果总结，常态化、产业化运营成效持续彰显"
    ];

    const tourists = [150, 340, 210, 450, 580, 776];
    const income = [12.5, 38.2, 24.5, 52.3, 68.1, 91.76];

    const maxIncome = Math.max(...income);
    const sizeref = (2 * maxIncome) / (70 * 70);

    const customdata = descriptions.map((desc, i) => [desc, income[i]]);

    const traces = [
        {
            x: times,
            y: tourists,
            mode: "lines",
            line: { color: C.line, width: 1.5, dash: "dash" },
            hoverinfo: "skip",
            showlegend: false
        },
        {
            x: times,
            y: tourists,
            mode: "markers",
            marker: {
                size: income,
                sizemode: "area",
                sizeref: sizeref,
                color: C.pine,
                line: { color: C.ink, width: 1.5 }
            },
            text: milestones,
            customdata: customdata,
            hovertemplate:
                "<b>%{text}</b><br>时间: %{x}<br>接待游客: %{y} 万人次<br>旅游收入: %{customdata[1]} 亿元<br>%{customdata[0]}<extra></extra>",
            showlegend: false
        }
    ];

    const annotations = times.map((t, i) => ({
        x: t,
        y: tourists[i],
        text: `<b>${milestones[i]}</b><br>游客: ${tourists[i]}万<br>收入: ${income[i]}亿`,
        showarrow: true,
        arrowhead: 1,
        arrowcolor: C.gray,
        ax: 0,
        ay: i % 2 === 0 ? -55 : 55,
        font: { color: C.ink, size: 9, family: "Noto Serif SC, Source Han Serif SC, SimSun, serif" },
        bgcolor: C.paper,
        bordercolor: C.line,
        borderwidth: 0.5
    }));

    const layout = {
        title: {
            text: "榕江「村超」里程碑演进与文旅综合收入气泡时间轴图",
            font: { size: 14, color: C.ink, family: "Noto Serif SC, Source Han Serif SC, SimSun, serif" },
            x: 0.05,
            y: 0.97,
            xanchor: "left"
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        height: 560,
        margin: { l: 55, r: 30, t: 70, b: 55 },
        showlegend: false,
        xaxis: {
            title: { text: "时间轴 (年-月)", font: { size: 11, color: C.gray } },
            tickfont: { color: C.gray, size: 10 },
            gridcolor: C.grid,
            linecolor: C.line,
            mirror: true
        },
        yaxis: {
            title: { text: "单期接待游客量 (万人次)", font: { size: 11, color: C.gray } },
            tickfont: { color: C.gray, size: 10 },
            gridcolor: C.grid,
            linecolor: C.line,
            mirror: true
        },
        annotations: annotations
    };

    Plotly.newPlot(dom, traces, layout, {
        responsive: true,
        displayModeBar: false
    });

    window.addEventListener("resize", () => {
        Plotly.Plots.resize(dom);
    });

})();
