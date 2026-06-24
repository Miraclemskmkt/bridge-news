// =====================================
// 市州十年通车里程变化（9宫格小多图）
// =====================================

(function () {

const smallMultiplesDom = document.getElementById("smallMultiples");
if (!smallMultiplesDom) return;

const smallMultiplesChart = echarts.init(smallMultiplesDom);
const T = window.BRIDGE_CHART || {};

const cities = [
    "贵阳", "遵义", "六盘水", "安顺", "毕节",
    "铜仁", "黔东南", "黔南", "黔西南"
];

const years = ["2015", "2017", "2019", "2021", "2023", "2025"];

const baseMileage = [420, 380, 210, 260, 340, 290, 310, 300, 280];

const gridPositions = [
    { left: "4%", top: "8%", width: "28%", height: "24%" },
    { left: "36%", top: "8%", width: "28%", height: "24%" },
    { left: "68%", top: "8%", width: "28%", height: "24%" },
    { left: "4%", top: "36%", width: "28%", height: "24%" },
    { left: "36%", top: "36%", width: "28%", height: "24%" },
    { left: "68%", top: "36%", width: "28%", height: "24%" },
    { left: "4%", top: "64%", width: "28%", height: "24%" },
    { left: "36%", top: "64%", width: "28%", height: "24%" },
    { left: "68%", top: "64%", width: "28%", height: "24%" }
];

const grids = [];
const xAxes = [];
const yAxes = [];
const series = [];

cities.forEach((city, i) => {

    const data = years.map((_, j) =>
        Math.round(baseMileage[i] + j * (18 + i * 2) + Math.sin(i + j) * 8)
    );

    grids.push({
        ...gridPositions[i],
        containLabel: true
    });

    xAxes.push({
        type: "category",
        gridIndex: i,
        data: years,
        axisLabel: {
            fontSize: T.axisSm || 11,
            color: "#7A7A7A",
            formatter: (v) => `${v}年`
        },
        axisLine: { lineStyle: { color: "#B8B8B8" } }
    });

    yAxes.push({
        type: "value",
        gridIndex: i,
        name: city,
        nameTextStyle: { color: "#4A7C65", fontSize: T.dataSm || 12, fontWeight: "bold" },
        nameLocation: "end",
        axisLabel: {
            fontSize: T.axisSm || 11,
            color: "#7A7A7A"
        },
        splitLine: { lineStyle: { color: "rgba(140,191,170,0.12)" } }
    });

    series.push({
        type: "line",
        xAxisIndex: i,
        yAxisIndex: i,
        data: data,
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        lineStyle: { color: "#4A7C65", width: 2 },
        itemStyle: { color: "#6D9B8B" },
        areaStyle: {
            color: {
                type: "linear",
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: "rgba(140,191,170,0.35)" },
                    { offset: 1, color: "rgba(140,191,170,0.02)" }
                ]
            }
        }
    });

});

smallMultiplesChart.setOption({
    backgroundColor: "transparent",
    tooltip: {
        trigger: "axis",
        textStyle: { fontSize: T.tooltipSm || 12, color: "#4A7C65" },
        formatter: (items) => {
            if (!items || !items.length) return "";
            const idx = items[0].axisIndex;
            const city = cities[idx];
            let html = `<strong>${city}</strong> · ${items[0].axisValue}年<br/>`;
            items.forEach((it) => {
                html += `通车里程：${it.value} 公里<br/>`;
            });
            return html;
        }
    },
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series: series
});

window.addEventListener("resize", () => smallMultiplesChart.resize());

})();
