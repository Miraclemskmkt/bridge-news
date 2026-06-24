// =====================================
// 民族地区高质量发展雷达图 (2015 vs 2024)
// =====================================

(function () {

    const dom = document.getElementById("developmentRadar");
    if (!dom) return;

    const chart = echarts.init(dom);
    const T = window.BRIDGE_CHART || {};

    const indicators = [
        { name: "教育水平", max: 100 },
        { name: "医疗可及性", max: 100 },
        { name: "人均收入", max: 100 },
        { name: "互联网普及", max: 100 },
        { name: "文化保护", max: 100 }
    ];

    chart.setOption({
        backgroundColor: "transparent",
        title: {
            text: "2015 vs 2024 对比",
            left: "center",
            top: 12,
            textStyle: { color: "#7A7A7A", fontSize: T.subtitle || 13 }
        },
        legend: {
            top: 38,
            data: ["2015年", "2024年"],
            textStyle: { color: "#4A7C65", fontSize: T.legend || 11, fontWeight: 600 }
        },
        tooltip: {
            trigger: "item",
            backgroundColor: "rgba(255,255,255,0.94)",
            borderColor: "rgba(74, 124, 101, 0.25)",
            textStyle: { color: "#4A7C65", fontSize: T.tooltip || 13 },
            formatter: (p) => {
                const rows = indicators.map((ind, i) =>
                    `${ind.name}：${p.value[i]} 分`
                );
                return `<strong>${p.name}</strong><br/>${rows.join("<br/>")}`;
            }
        },
        radar: {
            center: ["50%", "56%"],
            radius: "55%",
            indicator: indicators,
            axisName: {
                color: "#4A7C65",
                fontSize: T.axis || 11,
                fontWeight: 600
            },
            splitLine: { lineStyle: { color: "rgba(140,191,170,0.25)" } },
            splitArea: { areaStyle: { color: ["rgba(209,231,221,0.15)", "rgba(209,231,221,0.05)"] } },
            axisLine: { lineStyle: { color: "rgba(140,191,170,0.35)" } }
        },
        series: [{
            type: "radar",
            data: [
                {
                    value: [55, 48, 42, 35, 70],
                    name: "2015年",
                    lineStyle: { color: "#8CBFAA", width: 2 },
                    itemStyle: { color: "#8CBFAA" },
                    areaStyle: { color: "rgba(140,191,170,0.25)" }
                },
                {
                    value: [82, 76, 85, 88, 78],
                    name: "2024年",
                    lineStyle: { color: "#4A7C65", width: 2.5 },
                    itemStyle: { color: "#4A7C65" },
                    areaStyle: { color: "rgba(74,124,101,0.3)" }
                }
            ]
        }]
    });

    window.addEventListener("resize", () => chart.resize());

})();
