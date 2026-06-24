// ======================================
// 桥—民族村寨连线图（固定布局 · 统一色阶）
// ======================================

(function () {

    const dom = document.getElementById("bridgeVillage");
    if (!dom) return;

    const chart = echarts.init(dom);
    const labelLayout = window.BRIDGE_LABEL_LAYOUT || { hideOverlap: true, moveOverlap: "shiftY" };

    const PALETTE = {
        bridge: { fill: "#4A7C65", border: "#3d6b55", line: "#6D9B8B" },
        village: { fill: "#6D9B8B", border: "#5a8678", line: "#8CBFAA" },
        tourism: { fill: "#8CBFAA", border: "#6D9B8B", line: "#8CBFAA" }
    };

    const categories = [
        { name: "桥梁", itemStyle: { color: PALETTE.bridge.fill, borderColor: PALETTE.bridge.border } },
        { name: "民族村寨", itemStyle: { color: PALETTE.village.fill, borderColor: PALETTE.village.border } },
        { name: "旅游节点", itemStyle: { color: PALETTE.tourism.fill, borderColor: PALETTE.tourism.border } }
    ];

    const nodes = [
        { name: "花江峡谷大桥", x: 168, y: 48, symbolSize: 38, category: 0, label: { position: "top" } },
        { name: "坝陵河大桥", x: 72, y: 98, symbolSize: 38, category: 0, label: { position: "left" } },
        { name: "平塘特大桥", x: 262, y: 98, symbolSize: 38, category: 0, label: { position: "right" } },
        { name: "花江镇", x: 132, y: 128, symbolSize: 30, category: 1, label: { position: "bottom" } },
        { name: "关岭", x: 82, y: 162, symbolSize: 30, category: 1, label: { position: "left" } },
        { name: "贞丰", x: 202, y: 162, symbolSize: 30, category: 1, label: { position: "right" } },
        { name: "西江千户苗寨", x: 96, y: 212, symbolSize: 30, category: 1, label: { position: "left" } },
        { name: "肇兴侗寨", x: 228, y: 212, symbolSize: 30, category: 1, label: { position: "right" } },
        { name: "天空之桥服务区", x: 262, y: 168, symbolSize: 30, category: 2, label: { position: "bottom" } },
        { name: "榕江", x: 88, y: 278, symbolSize: 30, category: 1, label: { position: "left" } },
        { name: "村超", x: 178, y: 252, symbolSize: 32, category: 2, label: { position: "bottom" } }
    ];

    const links = [
        { source: "花江峡谷大桥", target: "花江镇" },
        { source: "花江峡谷大桥", target: "关岭" },
        { source: "花江峡谷大桥", target: "贞丰" },
        { source: "坝陵河大桥", target: "关岭" },
        { source: "坝陵河大桥", target: "西江千户苗寨" },
        { source: "平塘特大桥", target: "天空之桥服务区" },
        { source: "平塘特大桥", target: "肇兴侗寨" },
        { source: "榕江", target: "村超" },
        { source: "村超", target: "西江千户苗寨" },
        { source: "村超", target: "肇兴侗寨" }
    ];

    chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "item",
            backgroundColor: "rgba(255,255,255,0.94)",
            borderColor: "rgba(74, 124, 101, 0.25)",
            textStyle: { color: "#4A7C65", fontSize: 11 }
        },
        legend: {
            bottom: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { color: "#7A7A7A", fontSize: 9 }
        },
        series: [{
            type: "graph",
            layout: "none",
            roam: false,
            draggable: false,
            categories,
            data: nodes.map((n) => ({
                ...n,
                fixed: true,
                itemStyle: {
                    color: categories[n.category].itemStyle.color,
                    borderColor: categories[n.category].itemStyle.borderColor,
                    borderWidth: 1.2,
                    shadowBlur: 6,
                    shadowColor: "rgba(74, 124, 101, 0.15)"
                },
                label: {
                    show: true,
                    position: n.label.position,
                    color: "#4A7C65",
                    fontSize: 9,
                    fontWeight: 600,
                    distance: 5,
                    backgroundColor: "rgba(245, 242, 232, 0.82)",
                    padding: [1, 3],
                    borderRadius: 2
                }
            })),
            links: links.map((l) => ({
                ...l,
                lineStyle: {
                    color: "rgba(109, 155, 139, 0.55)",
                    width: 1.5,
                    curveness: 0.12,
                    opacity: 0.75
                }
            })),
            edgeSymbol: ["none", "none"],
            labelLayout,
            emphasis: {
                focus: "adjacency",
                lineStyle: { width: 2, color: "#4A7C65" },
                itemStyle: { shadowBlur: 10, shadowColor: "rgba(74, 124, 101, 0.25)" }
            },
            z: 1
        }]
    });

    window.addEventListener("resize", () => chart.resize());

    window.addEventListener("load", () => {
        setTimeout(() => chart.resize(), 100);
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) chart.resize();
            });
        }, { threshold: 0.1 });
        observer.observe(dom);
    }

})();
