// =====================================
// 3.2万座桥像素阵列组成贵州轮廓
// =====================================

const pixelDom = document.getElementById("bridgePixel");
const pixelChart = echarts.init(pixelDom);

// 贵州轮廓近似边界点（经纬度）
const guizhouOutline = [
    [104.0, 28.8], [104.5, 29.2], [105.2, 29.0], [106.0, 28.5],
    [107.0, 28.0], [108.0, 27.5], [108.5, 27.0], [109.0, 26.5],
    [109.2, 26.0], [109.0, 25.5], [108.5, 25.0], [107.5, 24.8],
    [106.5, 24.5], [105.5, 24.8], [104.5, 25.2], [104.0, 25.8],
    [103.8, 26.5], [103.9, 27.2], [104.0, 28.0], [104.0, 28.8]
];

function pointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    return inside;
}

const bridgePixels = [];
const minLng = 103.5, maxLng = 109.5, minLat = 24.3, maxLat = 29.5;

while (bridgePixels.length < 32000) {
    const lng = minLng + Math.random() * (maxLng - minLng);
    const lat = minLat + Math.random() * (maxLat - minLat);
    if (pointInPolygon(lng, lat, guizhouOutline)) {
        bridgePixels.push([lng, lat, 2010 + Math.floor(Math.random() * 16)]);
    }
}

pixelChart.setOption({
    backgroundColor: "transparent",
    title: [
        {
            text: "3.2万座桥的贵州",
            left: "center",
            top: 20,
            textStyle: { color: "#4A7C65", fontSize: 28 }
        },
        {
            text: "每一座桥，都是大地上的一个像素",
            left: "center",
            top: 58,
            textStyle: { color: "#7A7A7A", fontSize: 14 }
        }
    ],
    tooltip: {
        formatter: (p) => `建成年份：${p.value[2]}`
    },
    xAxis: {
        min: minLng, max: maxLng,
        show: false
    },
    yAxis: {
        min: minLat, max: maxLat,
        show: false
    },
    visualMap: {
        min: 2010,
        max: 2025,
        orient: "horizontal",
        left: "center",
        bottom: 20,
        text: ["新", "旧"],
        textStyle: { color: "#4A7C65" },
        inRange: {
            color: ["#D1E7DD", "#8CBFAA", "#6D9B8B", "#4A7C65"]
        }
    },
    series: [
        {
            type: "line",
            data: guizhouOutline,
            lineStyle: { color: "#4A7C65", width: 2 },
            symbol: "none",
            z: 1
        },
        {
            type: "scatter",
            data: bridgePixels,
            symbolSize: 2,
            itemStyle: { opacity: 0.7 },
            z: 2
        }
    ]
});

window.addEventListener("resize", () => pixelChart.resize());
