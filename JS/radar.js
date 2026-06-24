// =====================================
// 民族地区高质量发展雷达图 (2015 vs 2024)
// =====================================

const radarDom = document.getElementById("developmentRadar");
const radarChart = echarts.init(radarDom);

const indicators = [
    { name: "教育水平", max: 100 },
    { name: "医疗可及性", max: 100 },
    { name: "人均收入", max: 100 },
    { name: "互联网普及", max: 100 },
    { name: "文化保护", max: 100 }
];

radarChart.setOption({
    backgroundColor: "transparent",
    title: [
        {
            text: "民族地区高质量发展",
            left: "center",
            top: 20,
            textStyle: { color: "#4A7C65", fontSize: 28 }
        },
        {
            text: "2015 vs 2024 对比",
            left: "center",
            top: 58,
            textStyle: { color: "#7A7A7A", fontSize: 14 }
        }
    ],
    legend: {
        top: 90,
        data: ["2015", "2024"],
        textStyle: { color: "#4A7C65" }
    },
    radar: {
        center: ["50%", "58%"],
        radius: "55%",
        indicator: indicators,
        axisName: { color: "#4A7C65" },
        splitLine: { lineStyle: { color: "rgba(140,191,170,0.25)" } },
        splitArea: { areaStyle: { color: ["rgba(209,231,221,0.15)", "rgba(209,231,221,0.05)"] } },
        axisLine: { lineStyle: { color: "rgba(140,191,170,0.35)" } }
    },
    series: [{
        type: "radar",
        data: [
            {
                value: [55, 48, 42, 35, 70],
                name: "2015",
                lineStyle: { color: "#8CBFAA", width: 2 },
                itemStyle: { color: "#8CBFAA" },
                areaStyle: { color: "rgba(140,191,170,0.25)" }
            },
            {
                value: [82, 76, 85, 88, 78],
                name: "2024",
                lineStyle: { color: "#4A7C65", width: 2 },
                itemStyle: { color: "#4A7C65" },
                areaStyle: { color: "rgba(74,124,101,0.3)" }
            }
        ]
    }]
});

window.addEventListener("resize", () => radarChart.resize());
