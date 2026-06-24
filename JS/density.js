// =====================================
// 贵州桥隧密度分布（民族自治地方描边）
// =====================================

(function () {

    const dom = document.getElementById("bridgeDensity");
    if (!dom) return;

    const chart = echarts.init(dom);

    const cityData = [
        ["贵阳", 106.7, 26.6, 85],
        ["遵义", 106.9, 27.7, 72],
        ["六盘水", 104.8, 26.6, 90],
        ["安顺", 105.9, 26.2, 78],
        ["毕节", 105.3, 27.3, 88],
        ["铜仁", 109.2, 27.7, 65],
        ["黔东南", 108.0, 26.5, 80],
        ["黔南", 107.5, 26.3, 82],
        ["黔西南", 104.9, 25.1, 92]
    ];

    function buildOption() {
        return {
            backgroundColor: "transparent",
            tooltip: {
                trigger: "item",
                backgroundColor: "rgba(255,255,255,0.92)",
                borderColor: "rgba(0,0,0,0.08)",
                textStyle: { color: "#1c2a24", fontSize: 11 }
            },
            geo: {
                map: "guizhou",
                roam: false,
                center: [106.7, 26.8],
                zoom: 1.35,
                itemStyle: {
                    areaColor: "#eaf0ea",
                    borderColor: "rgba(58,95,122,0.22)",
                    borderWidth: 1.2
                },
                emphasis: {
                    itemStyle: { areaColor: "#d2ddd4" }
                },
                label: { show: false },
                regions: [
                    {
                        name: "黔东南苗族侗族自治州",
                        itemStyle: {
                            borderColor: "#b06868",
                            borderWidth: 2.5,
                            borderType: "dashed",
                            shadowBlur: 4,
                            shadowColor: "rgba(176,104,104,0.25)"
                        }
                    },
                    {
                        name: "黔南布依族苗族自治州",
                        itemStyle: {
                            borderColor: "#3a5f7a",
                            borderWidth: 2.5,
                            borderType: "dashed",
                            shadowBlur: 4,
                            shadowColor: "rgba(58,95,122,0.25)"
                        }
                    },
                    {
                        name: "黔西南布依族苗族自治州",
                        itemStyle: {
                            borderColor: "#c97d55",
                            borderWidth: 2.5,
                            borderType: "dashed",
                            shadowBlur: 4,
                            shadowColor: "rgba(201,125,85,0.28)"
                        }
                    }
                ]
            },
            series: [
                {
                    type: "scatter",
                    coordinateSystem: "geo",
                    data: cityData,
                    symbolSize: (val, params) => {
                        const raw = params.value || val;
                        const density = Array.isArray(raw) ? raw[2] : 50;
                        return Math.max(density * 0.32, 10);
                    },
                    itemStyle: {
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 0.8, [
                            { offset: 0, color: "rgba(74,140,120,0.85)" },
                            { offset: 0.55, color: "rgba(58,95,122,0.45)" },
                            { offset: 1, color: "rgba(74,140,120,0.08)" }
                        ]),
                        shadowBlur: 8,
                        shadowColor: "rgba(74,140,120,0.35)"
                    },
                    label: {
                        show: true,
                        formatter: "{b}",
                        position: "right",
                        color: "#3d5048",
                        fontSize: 10,
                        fontWeight: "bold"
                    },
                    z: 2
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
                textStyle: { color: "#7a8b9a", fontSize: 13, fontWeight: "normal" }
            }
        });
    }

    function render(geoJson) {
        echarts.registerMap("guizhou", geoJson);
        chart.setOption(buildOption(), true);
        chart.resize();
    }

    function loadGeoJson() {
        return new Promise((resolve, reject) => {
            if (window.GUIZHOU_GEOJSON) {
                resolve(window.GUIZHOU_GEOJSON);
                return;
            }
            fetch("data/guizhou.json")
                .then((r) => {
                    if (!r.ok) throw new Error("fetch failed");
                    return r.json();
                })
                .then(resolve)
                .catch(reject);
        });
    }

    function init() {
        loadGeoJson()
            .then(render)
            .catch(() => showError("地图数据加载失败"));
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
                if (entry.isIntersecting) {
                    chart.resize();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(dom);
    }

})();
