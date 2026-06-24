// =====================================
// 三大桥梁经济流量桑基图
// 桥 → 产业 → 市场
// =====================================

(function () {

    const dom = document.getElementById("sankeyBridge");
    if (!dom) return;

    const chart = echarts.init(dom);
    const T = window.BRIDGE_CHART || {};

    const nodes = [
        { name: "花江峡谷大桥", itemStyle: { color: "#4a8c78" } },
        { name: "北盘江大桥", itemStyle: { color: "#3a5f7a" } },
        { name: "平塘特大桥", itemStyle: { color: "#bf8c60" } },
        { name: "肉牛养殖", itemStyle: { color: "#c97d55" } },
        { name: "花椒种植", itemStyle: { color: "#b06868" } },
        { name: "茶叶加工", itemStyle: { color: "#7c6eaa" } },
        { name: "物流运输", itemStyle: { color: "#5a8ab5" } },
        { name: "旅游服务", itemStyle: { color: "#c08060" } },
        { name: "省内市场", itemStyle: { color: "#7a8b9a" } },
        { name: "国内市场", itemStyle: { color: "#5c6e65" } },
        { name: "海外市场", itemStyle: { color: "#1c2a24" } }
    ];

    const links = [
        { source: "花江峡谷大桥", target: "肉牛养殖", value: 38 },
        { source: "花江峡谷大桥", target: "花椒种植", value: 25 },
        { source: "花江峡谷大桥", target: "物流运输", value: 30 },
        { source: "北盘江大桥", target: "肉牛养殖", value: 20 },
        { source: "北盘江大桥", target: "茶叶加工", value: 28 },
        { source: "北盘江大桥", target: "旅游服务", value: 35 },
        { source: "平塘特大桥", target: "旅游服务", value: 42 },
        { source: "平塘特大桥", target: "物流运输", value: 22 },
        { source: "平塘特大桥", target: "茶叶加工", value: 18 },
        { source: "肉牛养殖", target: "省内市场", value: 30 },
        { source: "肉牛养殖", target: "国内市场", value: 22 },
        { source: "肉牛养殖", target: "海外市场", value: 6 },
        { source: "花椒种植", target: "国内市场", value: 18 },
        { source: "花椒种植", target: "海外市场", value: 7 },
        { source: "茶叶加工", target: "国内市场", value: 30 },
        { source: "茶叶加工", target: "海外市场", value: 16 },
        { source: "物流运输", target: "省内市场", value: 25 },
        { source: "物流运输", target: "国内市场", value: 20 },
        { source: "物流运输", target: "海外市场", value: 7 },
        { source: "旅游服务", target: "省内市场", value: 28 },
        { source: "旅游服务", target: "国内市场", value: 35 },
        { source: "旅游服务", target: "海外市场", value: 14 }
    ];

    chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "item",
            backgroundColor: "rgba(255,255,255,0.92)",
            borderColor: "rgba(0,0,0,0.08)",
            textStyle: { color: "#1c2a24", fontSize: T.tooltip || 13 },
            formatter: (p) => {
                if (p.dataType === "edge") {
                    return `${p.data.source} → ${p.data.target}<br/>流量：${p.value} 亿元`;
                }
                return p.name;
            }
        },
        series: [{
            type: "sankey",
            layout: "none",
            left: "2%",
            right: "2%",
            top: 8,
            bottom: 8,
            nodeWidth: 14,
            nodeGap: 12,
            draggable: false,
            emphasis: { focus: "adjacency" },
            label: {
                color: "#1c2a24",
                fontSize: T.axisSm || 10,
                fontWeight: 600
            },
            labelLayout: window.BRIDGE_LABEL_LAYOUT || { hideOverlap: true, moveOverlap: "shiftY" },
            lineStyle: {
                color: "gradient",
                curveness: 0.5,
                opacity: 0.28,
                borderColor: "rgba(58,95,122,0.06)",
                borderWidth: 0.4
            },
            data: nodes,
            links: links
        }]
    });

    window.addEventListener("resize", () => chart.resize());

    window.addEventListener("load", () => {
        setTimeout(() => chart.resize(), 200);
    });

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) chart.resize();
            });
        }, { threshold: 0.1 }).observe(dom);
    }

})();
