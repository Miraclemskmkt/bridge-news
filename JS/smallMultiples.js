// =====================================
// 市州十年通车里程变化（9宫格小多图）
// =====================================

const smallMultiplesDom = document.getElementById("smallMultiples");
const smallMultiplesChart = echarts.init(smallMultiplesDom);

const cities = [
    "贵阳", "遵义", "六盘水", "安顺", "毕节",
    "铜仁", "黔东南", "黔南", "黔西南"
];

const years = ["2015", "2017", "2019", "2021", "2023", "2025"];

const baseMileage = [420, 380, 210, 260, 340, 290, 310, 300, 280];

const gridPositions = [
    { left: "4%", top: "14%", width: "28%", height: "22%" },
    { left: "36%", top: "14%", width: "28%", height: "22%" },
    { left: "68%", top: "14%", width: "28%", height: "22%" },
    { left: "4%", top: "40%", width: "28%", height: "22%" },
    { left: "36%", top: "40%", width: "28%", height: "22%" },
    { left: "68%", top: "40%", width: "28%", height: "22%" },
    { left: "4%", top: "66%", width: "28%", height: "22%" },
    { left: "36%", top: "66%", width: "28%", height: "22%" },
    { left: "68%", top: "66%", width: "28%", height: "22%" }
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
        axisLabel: { fontSize: 9, color: "#7A7A7A" },
        axisLine: { lineStyle: { color: "#B8B8B8" } }
    });

    yAxes.push({
        type: "value",
        gridIndex: i,
        name: city,
        nameTextStyle: { color: "#4A7C65", fontSize: 11, fontWeight: "bold" },
        nameLocation: "end",
        axisLabel: { fontSize: 9, color: "#7A7A7A" },
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
    title: [
        {
            text: "市州十年通车里程变化",
            left: "center",
            top: 20,
            textStyle: { color: "#4A7C65", fontSize: 28 }
        },
        {
            text: "9市州高速里程小多图（公里）",
            left: "center",
            top: 58,
            textStyle: { color: "#7A7A7A", fontSize: 14 }
        }
    ],
    tooltip: { trigger: "axis" },
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series: series
});

window.addEventListener("resize", () => smallMultiplesChart.resize());
