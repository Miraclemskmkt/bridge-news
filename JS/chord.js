// =====================================
// 民族交融环形弦图 · 九市州人口流动（Chord Diagram）
// 文档：第五幕「按民族着色，展示交往交流交融」
// =====================================

(function () {

    const dom = document.getElementById("ethnicChord");
    if (!dom) return;

    const chart = echarts.init(dom);
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const T = window.BRIDGE_CHART || {};

    const ethnicPalette = {
        han:   { label: "汉族聚居", color: "#C5DDD2", border: "#9BB5A5" },
        miao:  { label: "苗族",     color: "#4A7C65", border: "#345a4a" },
        buyi:  { label: "布依族",   color: "#6D9B8B", border: "#527A6C" },
        dong:  { label: "侗族",     color: "#5E8A78", border: "#4A7C65" },
        multi: { label: "多民族聚居", color: "#8CBFAA", border: "#6D9B8B" }
    };

    const cities = [
        { name: "贵阳",   pop: 598.70, minorityPct: 23.4, ethnic: "han",  peoples: "汉族为主", tag: "省会 · 吸纳28.44%跨区域流动" },
        { name: "遵义",   pop: 660.67, minorityPct: 12.4, ethnic: "han",  peoples: "汉族为主", tag: "黔北枢纽" },
        { name: "六盘水", pop: 303.16, minorityPct: 42.1, ethnic: "multi", peoples: "彝族·苗族·布依族", tag: "盘兴高铁节点" },
        { name: "安顺",   pop: 247.06, minorityPct: 36.4, ethnic: "buyi", peoples: "布依族·苗族", tag: "黔中通道" },
        { name: "毕节",   pop: 689.96, minorityPct: 42.3, ethnic: "multi", peoples: "彝族·苗族·回族", tag: "人口第一大市" },
        { name: "铜仁",   pop: 329.85, minorityPct: 63.5, ethnic: "multi", peoples: "土家族·苗族·侗族", tag: "黔东门户" },
        { name: "黔东南", pop: 375.86, minorityPct: 81.6, ethnic: "miao", peoples: "苗族·侗族", tag: "自治州 · 族际通婚18.66%", autonomous: true },
        { name: "黔南",   pop: 349.44, minorityPct: 63.9, ethnic: "buyi", peoples: "布依族·苗族", tag: "自治州 · 贵南高铁走廊", autonomous: true },
        { name: "黔西南", pop: 301.51, minorityPct: 60.9, ethnic: "buyi", peoples: "布依族·苗族", tag: "自治州 · 盘兴高铁", autonomous: true }
    ];

    const popMap = Object.fromEntries(cities.map((c) => [c.name, c]));

    const flows = [
        ["贵阳", "黔东南", 120],
        ["贵阳", "黔南", 105],
        ["贵阳", "黔西南", 68],
        ["贵阳", "遵义", 82],
        ["贵阳", "毕节", 74],
        ["贵阳", "安顺", 58],
        ["贵阳", "六盘水", 54],
        ["贵阳", "铜仁", 62],
        ["遵义", "黔东南", 80],
        ["遵义", "黔南", 72],
        ["遵义", "铜仁", 52],
        ["毕节", "六盘水", 48],
        ["毕节", "黔西南", 46],
        ["安顺", "黔南", 64],
        ["铜仁", "黔东南", 130],
        ["黔东南", "黔南", 92],
        ["黔南", "黔西南", 70],
        ["六盘水", "黔西南", 56]
    ];

    const maxPop = Math.max.apply(null, cities.map((c) => c.pop));
    const minPop = Math.min.apply(null, cities.map((c) => c.pop));

    let activeEthnic = null;

    function nodeSize(pop, emphasized) {
        const base = 18 + ((pop - minPop) / (maxPop - minPop)) * 20;
        return emphasized ? base * 1.1 : base;
    }

    function isCrossEthnic(a, b) {
        return popMap[a].ethnic !== popMap[b].ethnic;
    }

    function linkStyle(source, target, value, highlightEthnic) {
        const w = Math.max(1.2, Math.sqrt(value) / 2.6);
        const srcEth = popMap[source].ethnic;
        const tgtEth = popMap[target].ethnic;
        const cross = srcEth !== tgtEth;

        if (!highlightEthnic) {
            if (cross) {
                return { width: w, color: "rgba(74,124,101,0.58)", curveness: 0.24, opacity: 0.88 };
            }
            return { width: w * 0.85, color: "rgba(140,191,170,0.32)", curveness: 0.18, opacity: 0.65 };
        }

        const touches = srcEth === highlightEthnic || tgtEth === highlightEthnic;
        const both = srcEth === highlightEthnic && tgtEth === highlightEthnic;

        if (both) {
            return { width: w * 1.35, color: ethnicPalette[highlightEthnic].border, curveness: 0.24, opacity: 0.95 };
        }
        if (touches) {
            return { width: w * 1.1, color: "rgba(74,124,101,0.72)", curveness: 0.22, opacity: 0.82 };
        }
        return { width: w * 0.6, color: "rgba(180,180,180,0.12)", curveness: 0.15, opacity: 0.2 };
    }

    function buildLegendGraphic(highlightEthnic) {
        return Object.entries(ethnicPalette).map(([key, g], i) => {
            const active = highlightEthnic === key;
            const dimLegend = highlightEthnic && !active;
            const labelW = key === "multi" ? 54 : 38;

            return {
                type: "group",
                silent: false,
                cursor: "pointer",
                info: { ethnicKey: key, legend: true },
                left: `${4 + i * 19.5}%`,
                bottom: 20,
                children: [
                    {
                        type: "rect",
                        shape: { x: -2, y: -8, width: labelW, height: 16, r: 3 },
                        style: {
                            fill: active ? "rgba(74,124,101,0.14)" : "transparent",
                            stroke: active ? g.border : "transparent",
                            lineWidth: active ? 1.2 : 0
                        }
                    },
                    {
                        type: "circle",
                        shape: { r: active ? 5 : 4 },
                        style: {
                            fill: g.color,
                            stroke: g.border,
                            lineWidth: active ? 2 : 1,
                            opacity: dimLegend ? 0.45 : 1
                        }
                    },
                    {
                        type: "text",
                        left: 10,
                        top: -5,
                        style: {
                            text: g.label,
                            fill: active ? g.border : "#4A7C65",
                            font: `${active ? "bold" : "normal"} ${T.axisSm || 10}px ${FONT}`,
                            opacity: dimLegend ? 0.5 : 1
                        }
                    }
                ]
            };
        });
    }

    function buildOption(highlightEthnic) {
        return {
            backgroundColor: "transparent",
            tooltip: {
                backgroundColor: "rgba(255,255,255,0.94)",
                borderColor: "rgba(74, 124, 101, 0.25)",
                textStyle: { color: "#4A7C65", fontSize: T.tooltipSm || 12, fontFamily: FONT },
                formatter: (p) => {
                    if (p.dataType === "node") {
                        const c = popMap[p.name];
                        const pal = ethnicPalette[c.ethnic];
                        return [
                            `<strong>${p.name}</strong>`,
                            `七普常住人口：${c.pop} 万人`,
                            `少数民族占比：${c.minorityPct}%`,
                            `世居民族：${c.peoples}`,
                            `<span style="color:${pal.color};font-weight:600">● ${pal.label}</span>`,
                            c.tag
                        ].join("<br/>");
                    }
                    if (p.dataType === "edge") {
                        const cross = isCrossEthnic(p.data.source, p.data.target);
                        return [
                            `${p.data.source} ↔ ${p.data.target}`,
                            `流动强度：${p.data.value} 万人`,
                            cross
                                ? "<span style='color:#4A7C65'>族际交融通道</span>"
                                : "同类型区域流动",
                            `<span style="color:#7A7A7A;font-size:10px">综合七普流动·通婚·高铁文旅测算</span>`
                        ].join("<br/>");
                    }
                    return "";
                }
            },
            graphic: buildLegendGraphic(highlightEthnic),
            series: [{
                type: "graph",
                layout: "circular",
                circular: { rotateLabel: true },
                left: "center",
                top: "13%",
                width: "90%",
                height: "68%",
                roam: false,
                label: {
                    show: true,
                    color: "#4A7C65",
                    fontSize: T.axis || 11,
                    fontFamily: FONT,
                    formatter: (p) => p.name
                },
                data: cities.map((c) => {
                    const pal = ethnicPalette[c.ethnic];
                    const match = !highlightEthnic || c.ethnic === highlightEthnic;

                    return {
                        name: c.name,
                        symbolSize: nodeSize(c.pop, match && !!highlightEthnic),
                        itemStyle: {
                            color: match ? pal.color : "#D8D8D8",
                            borderColor: match
                                ? (c.autonomous ? "#345a4a" : pal.border)
                                : "#E8E8E8",
                            borderWidth: match && c.autonomous ? 2.5 : match ? 1.5 : 1,
                            opacity: match ? 1 : 0.22,
                            shadowBlur: match && highlightEthnic ? 12 : match ? 5 : 0,
                            shadowColor: match ? "rgba(74,124,101,0.28)" : "transparent"
                        },
                        label: {
                            fontWeight: c.name === "贵阳" ? 700 : 400,
                            color: match ? "#4A7C65" : "#C0C0C0",
                            opacity: match ? 1 : 0.35
                        }
                    };
                }),
                links: flows.map(([source, target, value]) => ({
                    source,
                    target,
                    value,
                    lineStyle: linkStyle(source, target, value, highlightEthnic)
                })),
                emphasis: {
                    focus: "adjacency",
                    lineStyle: { width: 6, color: "#4A7C65", opacity: 0.95 },
                    itemStyle: { shadowBlur: 14, shadowColor: "rgba(74,124,101,0.32)" }
                }
            }]
        };
    }

    function applyHighlight(ethnicKey) {
        activeEthnic = activeEthnic === ethnicKey ? null : ethnicKey;
        chart.setOption(buildOption(activeEthnic), { notMerge: true });
    }

    chart.setOption(buildOption(null));

    chart.on("click", (params) => {
        if (params.componentType === "graphic" && params.info && params.info.legend) {
            applyHighlight(params.info.ethnicKey);
        }
    });

    window.addEventListener("resize", () => chart.resize());

    window.addEventListener("load", () => {
        setTimeout(() => chart.resize(), 100);
    });

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) chart.resize();
            });
        }, { threshold: 0.1 }).observe(dom);
    }

})();
