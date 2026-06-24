// =====================================
// 2015-2025 各市州高速/高铁里程扩张
// 极坐标柱状图
// =====================================

(function () {

const polarDom = document.getElementById("chartPolar");
if (!polarDom) return;

const polarChart = echarts.init(polarDom);

const cities = [
    "贵阳", "遵义", "六盘水", "安顺", "毕节",
    "铜仁", "黔东南", "黔南", "黔西南"
];

const data2025 = [920, 1050, 680, 550, 890, 620, 780, 720, 650];
const data2015 = [420, 480, 280, 220, 350, 260, 310, 290, 240];

polarChart.setOption({
    backgroundColor: "transparent",
    tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderColor: "rgba(0,0,0,0.07)",
        textStyle: { color: "#1c2a24", fontSize: 9 }
    },
    legend: {
        bottom: 0,
        textStyle: { color: "#3d5048", fontSize: 8 },
        data: ["2025", "2015"],
        itemGap: 10
    },
    polar: {
        center: ["50%", "44%"],
        radius: ["22%", "68%"]
    },
    angleAxis: {
        type: "category",
        data: cities,
        axisLabel: { color: "#3d5048", fontSize: 7.5 },
        axisLine: { lineStyle: { color: "rgba(0,0,0,0.16)" } },
        splitLine: { lineStyle: { color: "rgba(0,0,0,0.04)" } }
    },
    radiusAxis: {
        axisLabel: { color: "rgba(0,0,0,0.38)", fontSize: 6.5 },
        splitLine: { lineStyle: { color: "rgba(0,0,0,0.03)" } }
    },
    series: [
        {
            name: "2025",
            type: "bar",
            data: data2025,
            coordinateSystem: "polar",
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#3a5f7a" },
                    { offset: 1, color: "#4a8c78" }
                ]),
                borderRadius: 4,
                shadowBlur: 4,
                shadowColor: "rgba(58,95,122,0.22)"
            }
        },
        {
            name: "2015",
            type: "bar",
            data: data2015,
            coordinateSystem: "polar",
            itemStyle: {
                color: "rgba(122,139,154,0.48)",
                borderRadius: 2,
                borderColor: "#7a8b9a",
                borderWidth: 1
            }
        }
    ]
});

polarChart.on("click", (params) => {
    if (["黔东南", "黔南", "黔西南"].includes(params.name)) {
        const target = document.getElementById("section-integration");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    }
});

window.addEventListener("resize", () => polarChart.resize());

})();
