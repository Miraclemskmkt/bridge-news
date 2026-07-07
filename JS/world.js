// =====================================
// 贵州桥梁技术「走出去」· 方位地图 + 流动连线
// =====================================

(function () {

    const dom = document.getElementById("worldBridge");
    if (!dom) return;

    const chart = echarts.init(dom);
    const T = window.BRIDGE_CHART || {};

    const guizhou = { name: "贵州", coord: [106.71, 26.57] };

    const projects = [
        { name: "巴基斯坦", coord: [69.3, 30.4] },
        { name: "孟加拉国", coord: [90.4, 23.7] },
        { name: "老挝", coord: [102.6, 18.2] },
        { name: "柬埔寨", coord: [104.9, 12.6] }
    ];

    const highlightCountries = ["China", "Pakistan", "Bangladesh", "Laos", "Cambodia"];

    function buildOption() {
        const lineData = projects.map((p, i) => ({
            name: `${guizhou.name} → ${p.name}`,
            coords: [guizhou.coord, p.coord],
            lineStyle: {
                curveness: 0.18 + i * 0.06,
                color: "#8CBFAA",
                width: 2,
                opacity: 0.72
            }
        }));

        const scatterData = [
            {
                name: guizhou.name,
                value: guizhou.coord.concat([100]),
                label: { position: "left" }
            },
            ...projects.map((p) => ({
                name: p.name,
                value: p.coord.concat([60]),
                label: { position: "right" }
            }))
        ];

        return {
            backgroundColor: "transparent",
            tooltip: {
                trigger: "item",
                backgroundColor: "rgba(255,255,255,0.94)",
                borderColor: "rgba(74, 124, 101, 0.25)",
                textStyle: { color: "#4A7C65", fontSize: T.tooltip || 13 },
                formatter: (p) => {
                    if (p.seriesType === "lines") return p.name;
                    if (p.name === guizhou.name) return "贵州 · 桥梁技术输出地";
                    return `${p.name} · 一带一路合作项目`;
                }
            },
            geo: {
                map: "world",
                roam: false,
                /* 五国全貌：西南中国—南亚—东南亚，适中缩放 */
                boundingCoords: [[58, 40], [126, 8]],
                center: [90, 23],
                zoom: 1.55,
                aspectScale: 0.82,
                layoutCenter: ["50%", "50%"],
                layoutSize: "94%",
                itemStyle: {
                    areaColor: "rgba(234, 240, 234, 0.4)",
                    borderColor: "rgba(74, 124, 101, 0.2)",
                    borderWidth: 0.65
                },
                emphasis: { disabled: true },
                label: { show: false },
                regions: highlightCountries.map((name) => ({
                    name,
                    itemStyle: {
                        areaColor: name === "China"
                            ? "rgba(140, 191, 170, 0.45)"
                            : "rgba(109, 155, 139, 0.28)",
                        borderColor: "rgba(74, 124, 101, 0.5)",
                        borderWidth: name === "China" ? 1.1 : 0.9
                    }
                }))
            },
            series: [
                {
                    name: "技术输出流向",
                    type: "lines",
                    coordinateSystem: "geo",
                    zlevel: 2,
                    data: lineData,
                    effect: {
                        show: true,
                        period: 5,
                        trailLength: 0.14,
                        symbol: "arrow",
                        symbolSize: 7,
                        color: "#4A7C65"
                    },
                    lineStyle: {
                        color: "#8CBFAA",
                        width: 1.8,
                        opacity: 0.65,
                        curveness: 0.22
                    }
                },
                {
                    name: "项目节点",
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    zlevel: 3,
                    data: scatterData,
                    symbolSize: (val, params) => (params.name === guizhou.name ? 16 : 11),
                    showEffectOn: "render",
                    rippleEffect: {
                        brushType: "stroke",
                        scale: 3.2,
                        period: 4
                    },
                    itemStyle: {
                        color: (params) => (params.name === guizhou.name ? "#4A7C65" : "#6D9B8B"),
                        shadowBlur: 10,
                        shadowColor: "rgba(74, 124, 101, 0.35)"
                    },
                    label: {
                        show: true,
                        formatter: "{b}",
                        color: "#4A7C65",
                        fontSize: T.axis || 11,
                        fontWeight: 600,
                        distance: 8,
                        backgroundColor: "rgba(245, 242, 232, 0.85)",
                        padding: [2, 4],
                        borderRadius: 3
                    },
                    labelLayout: window.BRIDGE_LABEL_LAYOUT || { hideOverlap: true, moveOverlap: "shiftY" }
                }
            ]
        };
    }

    function showError(msg) {
        chart.setOption({
            backgroundColor: "transparent",
            title: {
                text: msg,
                left: "center",
                top: "middle",
                textStyle: { color: "#7A7A7A", fontSize: 13, fontWeight: "normal" }
            }
        });
    }

    function loadWorldMap() {
        const sources = [
            "data/world.json",
            "https://geo.datav.aliyun.com/areas_v3/bound/world.json",
            "https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json"
        ];

        function tryFetch(i) {
            if (i >= sources.length) {
                return Promise.reject(new Error("map load failed"));
            }
            return fetch(sources[i])
                .then((r) => {
                    if (!r.ok) throw new Error("fetch failed");
                    return r.json();
                })
                .catch(() => tryFetch(i + 1));
        }

        return tryFetch(0);
    }

    function render(geoJson) {
        echarts.registerMap("world", geoJson);
        chart.setOption(buildOption(), true);
        chart.resize();
    }

    function init() {
        loadWorldMap()
            .then(render)
            .catch(() => showError("世界地图加载失败，请检查网络后刷新"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.addEventListener("resize", () => chart.resize());

    window.addEventListener("load", () => {
        setTimeout(() => chart.resize(), 100);
        setTimeout(() => chart.resize(), 500);
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
