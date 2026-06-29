// =====================================
// 三大桥梁经济流量桑基图
// 桥 → 产业 → 市场
// =====================================

(function () {

    const dom = document.getElementById("sankeyBridge");
    if (!dom) return;

    const chart = echarts.init(dom);
    const T = window.BRIDGE_CHART || {};
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";

    const nodes = [
        { name: "花江峡谷大桥", depth: 0, itemStyle: { color: "#4a8c78" } },
        { name: "北盘江大桥", depth: 0, itemStyle: { color: "#3a5f7a" } },
        { name: "平塘特大桥", depth: 0, itemStyle: { color: "#bf8c60" } },
        { name: "肉牛养殖", depth: 1, itemStyle: { color: "#c97d55" } },
        { name: "花椒种植", depth: 1, itemStyle: { color: "#b06868" } },
        { name: "茶叶加工", depth: 1, itemStyle: { color: "#7c6eaa" } },
        { name: "物流运输", depth: 1, itemStyle: { color: "#5a8ab5" } },
        { name: "旅游服务", depth: 1, itemStyle: { color: "#c08060" } },
        { name: "省内市场", depth: 2, itemStyle: { color: "#7a8b9a" } },
        { name: "国内市场", depth: 2, itemStyle: { color: "#5c6e65" } },
        { name: "海外市场", depth: 2, itemStyle: { color: "#1c2a24" } }
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

    function edgeValue(params) {
        return params.data && params.data.value != null ? params.data.value : params.value;
    }

    function edgeLabelText(params) {
        const v = edgeValue(params);
        return v != null ? `${v}亿` : "";
    }

    function nodeLabelText(params) {
        const v = params.value != null ? params.value : "";
        return v ? `${params.name}\n${v}亿` : params.name;
    }

    chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "item",
            backgroundColor: "rgba(255,255,255,0.92)",
            borderColor: "rgba(0,0,0,0.08)",
            textStyle: { color: "#1c2a24", fontSize: T.tooltip || 13, fontFamily: FONT },
            formatter: (p) => {
                if (p.dataType === "edge") {
                    return `${p.data.source} → ${p.data.target}<br/>流量：${p.data.value} 亿元`;
                }
                const v = p.value != null ? `<br/>汇总流量：${p.value} 亿元` : "";
                return `${p.name}${v}`;
            }
        },
        graphic: [{
            type: "text",
            right: 6,
            bottom: 2,
            style: {
                text: "单位：亿元 · 相对流量",
                fill: "#7a7a7a",
                font: `600 ${T.dense || 9}px ${FONT}`,
                textAlign: "right"
            },
            silent: true
        }],
        series: [{
            type: "sankey",
            layout: "none",
            nodeAlign: "justify",
            left: "4%",
            right: "6%",
            top: 12,
            bottom: 18,
            nodeWidth: 12,
            nodeGap: 10,
            draggable: false,
            emphasis: { focus: "adjacency" },
            label: {
                show: true,
                color: "#1c2a24",
                fontSize: T.dense || 9,
                fontWeight: 600,
                fontFamily: FONT,
                lineHeight: 13,
                formatter: nodeLabelText
            },
            edgeLabel: {
                show: true,
                position: "inside",
                color: "#1c2a24",
                fontSize: (T.dense || 9) - 1,
                fontWeight: 700,
                fontFamily: FONT,
                formatter: edgeLabelText
            },
            labelLayout: window.BRIDGE_LABEL_LAYOUT || { hideOverlap: true, moveOverlap: "shiftY" },
            lineStyle: {
                color: "gradient",
                curveness: 0.5,
                opacity: 0.32,
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
