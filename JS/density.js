// =====================================
// 贵州 9 市州骨干路网桥隧比 · 条形图 + 分级填色地图
// =====================================

(function () {

    const dom = document.getElementById("bridgeDensity");
    if (!dom) return;

    const chart = echarts.init(dom);
    const T = window.BRIDGE_CHART || {};
    const labelLayout = window.BRIDGE_LABEL_LAYOUT || { hideOverlap: true, moveOverlap: "shiftY" };

    const SOURCE_NOTE =
        "数据来源：贵州省交通运输厅2024年度交通运输统计公报、省政府盘兴高铁通车新闻发布会、中铁二院铁路线路设计环评文件、贵州省公共资源交易中心高速项目招标公示、贵州日报、天眼新闻官方报道。";

    const TIERS = {
        extreme: { label: "极高桥隧比区域", color: "#4A7C65", min: 90 },
        high: { label: "高桥隧比区域", color: "#6D9B8B", min: 70 },
        medium: { label: "中桥隧比区域", color: "#8CBFAA", min: 50 },
        low: { label: "低桥隧比区域", color: "#D1E7DD", min: 0 }
    };

    const regions = [
        { short: "黔西南州", mapName: "黔西南布依族苗族自治州", value: 90.66, display: "90.66%", tier: "extreme", autonomous: true },
        { short: "黔南州", mapName: "黔南布依族苗族自治州", value: 90.5, display: "90%+", tier: "extreme", autonomous: true },
        { short: "黔东南州", mapName: "黔东南苗族侗族自治州", value: 90.5, display: "90%+", tier: "extreme", autonomous: true },
        { short: "安顺市", mapName: "安顺市", value: 72, display: "72%", tier: "high", autonomous: false },
        { short: "贵阳市", mapName: "贵阳市", value: 70, display: "70%", tier: "high", autonomous: false },
        { short: "六盘水市", mapName: "六盘水市", value: 69.46, display: "69.46%", tier: "high", autonomous: false },
        { short: "遵义市", mapName: "遵义市", value: 58, display: "58%", tier: "medium", autonomous: false },
        { short: "铜仁市", mapName: "铜仁市", value: 58.6, display: "58.6%", tier: "medium", autonomous: false },
        { short: "毕节市", mapName: "毕节市", value: 38, display: "<40%", tier: "low", autonomous: false }
    ];

    function tierColor(tier, gradient) {
        const base = TIERS[tier].color;
        if (!gradient) return base;
        return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: base + "88" },
            { offset: 0.55, color: base + "cc" },
            { offset: 1, color: base }
        ]);
    }

    const TIER_SHORT = { extreme: "极高", high: "高", medium: "中", low: "低" };

    function regionTooltip(row, rank) {
        const auto = row.autonomous ? " · 自治州" : "";
        return `${row.short}${auto}  ${row.display}  ${TIER_SHORT[row.tier]}  第${rank}位`;
    }

    function buildOption() {
        const barOrder = [...regions].sort((a, b) => b.value - a.value);
        const rankMap = Object.fromEntries(barOrder.map((r, i) => [r.short, i + 1]));

        const mapData = regions.map((r) => ({
            name: r.mapName,
            value: r.value,
            itemStyle: {
                areaColor: TIERS[r.tier].color,
                borderColor: "rgba(74, 124, 101, 0.45)",
                borderWidth: 0.9
            }
        }));

        return {
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                    shadowStyle: { color: "rgba(74, 124, 101, 0.06)" }
                },
                confine: true,
                backgroundColor: "rgba(255,255,255,0.97)",
                borderColor: "rgba(74, 124, 101, 0.25)",
                borderWidth: 0.5,
                padding: [2, 6],
                className: "bridge-density-tip",
                extraCssText: "border-radius:2px;box-shadow:0 1px 4px rgba(74,124,101,0.1);",
                textStyle: { color: "#4A7C65", fontSize: T.axisSm || 11, lineHeight: 15 },
                formatter: (items) => {
                    if (!items || !items.length) return null;
                    const p = items[0];
                    if (p.seriesType !== "bar") return null;
                    const row = regions.find((r) => r.short === p.name);
                    if (!row) return null;
                    return regionTooltip(row, rankMap[row.short]);
                }
            },
            legend: {
                show: true,
                orient: "horizontal",
                left: 4,
                right: "50%",
                bottom: 28,
                itemWidth: 12,
                itemHeight: 8,
                itemGap: 8,
                textStyle: { color: "#7A7A7A", fontSize: T.legend || 11 },
                data: ["极高", "高", "中", "低"].map((k, i) => {
                    const keys = ["extreme", "high", "medium", "low"];
                    return {
                        name: k,
                        icon: "roundRect",
                        itemStyle: { color: TIERS[keys[i]].color }
                    };
                }),
                formatter: (name) => {
                    const map = { 极高: "极高", 高: "高", 中: "中", 低: "低" };
                    return map[name] || name;
                }
            },
            grid: {
                left: 2,
                right: "50%",
                top: 4,
                bottom: 48,
                containLabel: true
            },
            xAxis: {
                type: "value",
                max: 100,
                name: "%",
                nameLocation: "end",
                nameGap: 6,
                nameTextStyle: { color: "#B8B8B8", fontSize: T.axisSm || 10 },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: {
                    color: "#B8B8B8",
                    fontSize: T.axisSm || 10,
                    margin: 4
                }
            },
            yAxis: {
                type: "category",
                inverse: true,
                data: barOrder.map((r) => r.short),
                axisLine: { lineStyle: { color: "rgba(184, 184, 184, 0.65)", width: 0.8 } },
                axisTick: { show: false },
                axisLabel: {
                    color: "#7A7A7A",
                    fontSize: T.axis || 11,
                    fontWeight: 600,
                    margin: 4,
                    width: 58,
                    overflow: "truncate"
                }
            },
            series: [
                {
                    name: "桥隧比",
                    type: "bar",
                    tooltip: { show: true },
                    data: barOrder.map((r) => ({
                        name: r.short,
                        value: r.value,
                        itemStyle: {
                            color: tierColor(r.tier, true),
                            borderRadius: [0, 10, 10, 0],
                            shadowColor: "rgba(74, 124, 101, 0.15)",
                            shadowBlur: 4,
                            shadowOffsetX: 1
                        }
                    })),
                    barWidth: 11,
                    barCategoryGap: "34%",
                    labelLayout,
                    label: {
                        show: true,
                        position: "insideRight",
                        distance: 4,
                        formatter: (params) => {
                            const row = regions.find((r) => r.short === params.name);
                            if (!row) return "";
                            const tone = row.tier === "low" ? "d" : "l";
                            if (row.autonomous) {
                                return `{${tone}|${row.display}}{b|桥}`;
                            }
                            return `{${tone}|${row.display}}`;
                        },
                        rich: {
                            l: { color: "#F5F2E8", fontSize: T.dataSm || 11, fontWeight: 600 },
                            d: { color: "#4A7C65", fontSize: T.dataSm || 11, fontWeight: 600 },
                            b: {
                                color: "#4A7C65",
                                fontSize: 11,
                                fontFamily: "Ma Shan Zheng, STKaiti, KaiTi, serif",
                                padding: [0, 0, 0, 1]
                            }
                        }
                    },
                    z: 2
                },
                {
                    name: "map",
                    type: "map",
                    map: "guizhou",
                    roam: false,
                    silent: false,
                    tooltip: { show: false },
                    layoutCenter: ["75%", "44%"],
                    layoutSize: "48%",
                    aspectScale: 0.86,
                    data: mapData,
                    label: { show: false },
                    itemStyle: {
                        areaColor: "#eaf0ea",
                        borderColor: "rgba(74, 124, 101, 0.3)",
                        borderWidth: 0.8
                    },
                    emphasis: {
                        focus: "self",
                        label: {
                            show: true,
                            color: "#4A7C65",
                            fontSize: T.axisSm || 10,
                            fontWeight: 700,
                            formatter: (params) => {
                                const row = regions.find((r) => r.mapName === params.name);
                                return row ? `${row.short} ${row.display}` : params.name;
                            }
                        },
                        itemStyle: {
                            borderColor: "#4A7C65",
                            borderWidth: 1.6,
                            shadowBlur: 6,
                            shadowColor: "rgba(74, 124, 101, 0.25)"
                        }
                    },
                    z: 1
                }
            ],
            graphic: [
                {
                    type: "text",
                    left: "52%",
                    top: "6%",
                    style: {
                        text: "市州桥隧比分级示意",
                        fill: "#7A7A7A",
                        font: `600 ${T.axisSm || 10}px Noto Serif SC, SimSun, serif`,
                        textAlign: "left"
                    }
                },
                {
                    type: "text",
                    left: 4,
                    right: "50%",
                    bottom: 2,
                    style: {
                        text: SOURCE_NOTE,
                        fill: "#B8B8B8",
                        font: "8px Noto Serif SC, SimSun, serif",
                        textAlign: "left",
                        lineHeight: 11
                    }
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
                if (entry.isIntersecting) chart.resize();
            });
        }, { threshold: 0.1 });
        observer.observe(dom);
    }

})();
