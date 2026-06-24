// =====================================
// 贵州桥梁技术"走出去"世界连线图
// =====================================

const worldDom = document.getElementById("worldBridge");
const worldChart = echarts.init(worldDom);

const guiyang = { name: "贵州", coord: [106.5, 26.5] };

const projects = [
    { name: "巴基斯坦", coord: [70, 30] },
    { name: "老挝", coord: [102, 18] },
    { name: "柬埔寨", coord: [105, 12] },
    { name: "孟加拉国", coord: [90, 24] }
];

const lineData = projects.map(p => ({
    coords: [guiyang.coord, p.coord]
}));

worldChart.setOption({
    backgroundColor: "transparent",
    title: [
        {
            text: "桥见世界",
            left: "center",
            top: 20,
            textStyle: { color: "#4A7C65", fontSize: 28 }
        },
        {
            text: "贵州桥梁工程技术「走出去」项目分布",
            left: "center",
            top: 58,
            textStyle: { color: "#7A7A7A", fontSize: 14 }
        }
    ],
    tooltip: { trigger: "item" },
    xAxis: {
        min: 60, max: 120,
        show: false
    },
    yAxis: {
        min: 8, max: 45,
        show: false
    },
    series: [
        {
            type: "lines",
            coordinateSystem: "cartesian2d",
            data: lineData,
            lineStyle: {
                color: "#4A7C65",
                width: 1.5,
                opacity: 0.55,
                curveness: 0.25
            },
            effect: {
                show: true,
                period: 4,
                trailLength: 0.15,
                symbol: "arrow",
                symbolSize: 6,
                color: "#6D9B8B"
            },
            z: 1
        },
        {
            type: "effectScatter",
            data: [
                { name: guiyang.name, value: guiyang.coord },
                ...projects.map(p => ({ name: p.name, value: p.coord }))
            ],
            symbolSize: (val, params) => params.name === "贵州" ? 18 : 12,
            itemStyle: {
                color: (params) => params.name === "贵州" ? "#4A7C65" : "#6D9B8B"
            },
            label: {
                show: true,
                position: "top",
                color: "#4A7C65",
                fontSize: 12
            },
            rippleEffect: { scale: 3.5 },
            z: 2
        }
    ]
});

window.addEventListener("resize", () => worldChart.resize());
