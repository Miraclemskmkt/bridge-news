// =====================================
// 民族交融环形弦图 · 九市州人口流动（Chord Diagram · 响应式）
// 文档：第五幕「按民族着色，展示交往交流交融」
// =====================================

(function () {

    const dom = document.getElementById("ethnicChord");
    if (!dom) return;

    const chart = echarts.init(dom);
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const T = window.BRIDGE_CHART || {};
    const MOBILE_BP = 520;
    const TINY_BP = 380;

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
    let lastMode = "";

    function getLayout() {
        const w = dom.clientWidth > 0 ? dom.clientWidth : window.innerWidth;
        const tiny = w <= TINY_BP || window.innerWidth <= TINY_BP;
        const mobile = w <= MOBILE_BP || window.innerWidth <= MOBILE_BP;
        return {
            w,
            tiny,
            mobile,
            mode: tiny ? "tiny" : mobile ? "mobile" : "desktop"
        };
    }

    function nodeSize(pop, emphasized, layout) {
        const scale = layout.tiny ? 0.68 : layout.mobile ? 0.78 : 1;
        const base = 18 + ((pop - minPop) / (maxPop - minPop)) * 20;
        return Math.max(10, (emphasized ? base * 1.1 : base) * scale);
    }

    function isCrossEthnic(a, b) {
        return popMap[a].ethnic !== popMap[b].ethnic;
    }

    function linkStyle(source, target, value, highlightEthnic, layout) {
        const lineScale = layout.tiny ? 0.85 : layout.mobile ? 0.92 : 1;
        const w = Math.max(1, Math.sqrt(value) / 2.6 * lineScale);
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

    function legendGroup(key, g, i, highlightEthnic, layout) {
        const active = highlightEthnic === key;
        const dimLegend = highlightEthnic && !active;
        const fs = layout.tiny ? Math.max(T.dense || 8, 8) : layout.mobile ? Math.max(T.axisSm || 9, 9) : (T.axisSm || 10);
        const labelW = key === "multi" ? (layout.tiny ? 56 : layout.mobile ? 50 : 54) : (layout.tiny ? 42 : 38);
        const circleR = layout.tiny ? 3.5 : active ? 5 : 4;

        return {
            type: "group",
            silent: false,
            cursor: "pointer",
            info: { ethnicKey: key, legend: true },
            children: [
                {
                    type: "rect",
                    shape: { x: -2, y: -8, width: labelW, height: layout.tiny ? 14 : 16, r: 3 },
                    style: {
                        fill: active ? "rgba(74,124,101,0.14)" : "transparent",
                        stroke: active ? g.border : "transparent",
                        lineWidth: active ? 1.2 : 0
                    }
                },
                {
                    type: "circle",
                    shape: { r: circleR },
                    style: {
                        fill: g.color,
                        stroke: g.border,
                        lineWidth: active ? 2 : 1,
                        opacity: dimLegend ? 0.45 : 1
                    }
                },
                {
                    type: "text",
                    left: layout.tiny ? 8 : 10,
                    top: layout.tiny ? -4 : -5,
                    style: {
                        text: g.label,
                        fill: active ? g.border : "#4A7C65",
                        font: `${active ? "bold" : "normal"} ${fs}px ${FONT}`,
                        opacity: dimLegend ? 0.5 : 1
                    }
                }
            ]
        };
    }

    function buildLegendGraphic(highlightEthnic, layout) {
        const entries = Object.entries(ethnicPalette);

        if (layout.mobile) {
            const cols = layout.tiny ? 2 : 3;
            const colW = layout.tiny ? 48 : 31;
            return entries.map(([key, g], i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const group = legendGroup(key, g, i, highlightEthnic, layout);
                group.left = `${3 + col * colW}%`;
                group.bottom = layout.tiny
                    ? (row === 0 ? 36 : row === 1 ? 18 : 2)
                    : (row === 0 ? 28 : 10);
                return group;
            });
        }

        return entries.map(([key, g], i) => {
            const group = legendGroup(key, g, i, highlightEthnic, layout);
            group.left = `${3 + i * 19}%`;
            group.bottom = 18;
            return group;
        });
    }

    function renderDataSpec() {
        const specDom = document.getElementById("ethnicChordData");
        if (!specDom) return;

        const totalPop = cities.reduce((s, c) => s + c.pop, 0);
        const topFlow = flows.reduce((best, f) => f[2] > best[2] ? f : best, flows[0]);
        const guiYangOut = flows
            .filter(([a]) => a === "贵阳")
            .reduce((s, [, , v]) => s + v, 0);
        const crossCount = flows.filter(([a, b]) => isCrossEthnic(a, b)).length;
        const autonomous = cities.filter((c) => c.autonomous);
        const qdn = popMap["黔东南"];

        const channelStories = [
            {
                title: "黔东侗乡轴",
                pair: `${topFlow[0]} ↔ ${topFlow[1]}`,
                value: topFlow[2],
                text: `全网最强族际通道，铜仁与黔东南之间的 <strong>${topFlow[2]} 万人</strong> 流动，把土家族·苗族·侗族聚居的黔东门户与苗侗自治州紧紧织入同一张网。`
            },
            {
                title: "省会南向磁极",
                pair: "贵阳 → 黔东南",
                value: flows.find((f) => f[0] === "贵阳" && f[1] === "黔东南")[2],
                text: `省会贵阳（<strong>598.70 万</strong>常住人口）向黔东南形成约 <strong>120 万人</strong> 常态化通道，连同黔南、黔西南方向连线，吸纳全省约 <strong>28.44%</strong> 跨区域流动。`
            },
            {
                title: "贵广文旅走廊",
                pair: "黔东南 ↔ 黔南",
                value: flows.find((f) => f[0] === "黔东南" && f[1] === "黔南")[2],
                text: `黔东南与黔南之间 <strong>92 万人</strong> 流动，与贵广、贵南高铁走廊同向——侗乡苗寨的节庆、研学与通婚往来，在桥上完成「交往交流交融」。`
            }
        ];

        const maxFlowVal = topFlow[2];
        const channelsHtml = channelStories.map((ch) => `
            <article class="ethnic-chord-spec__channel">
                <header class="ethnic-chord-spec__channel-head">
                    <span class="ethnic-chord-spec__channel-tag">${ch.title}</span>
                    <span class="ethnic-chord-spec__channel-pair">${ch.pair}</span>
                </header>
                <div class="ethnic-chord-spec__channel-bar" aria-hidden="true">
                    <span style="width:${Math.round(ch.value / maxFlowVal * 100)}%"></span>
                </div>
                <p class="ethnic-chord-spec__channel-text">${ch.text}</p>
            </article>
        `).join("");

        const autonomousHtml = autonomous.map((c) =>
            `<span class="ethnic-chord-spec__pill ethnic-chord-spec__pill--${c.ethnic}" title="${c.peoples} · 少数民族占比 ${c.minorityPct}%">${c.name}<em>${c.minorityPct}%</em></span>`
        ).join("");

        specDom.innerHTML = `
            <div class="ethnic-chord-spec">
                <p class="ethnic-chord-spec__lead">
                    九市州七普常住人口合计约 <strong>${totalPop.toFixed(2)} 万人</strong>。环形网络中，<strong>深色连线</strong>标示族际交融通道（共 ${crossCount} 条），浅色为同类型区域流动——当北盘江、花江峡谷等桥梁连通布依与苗族山寨，人口不再困于峡谷，而是在桥上完成通婚、赶集与文旅往来。
                </p>
                <div class="ethnic-chord-spec__insight">
                    <p class="ethnic-chord-spec__insight-label">民族聚居版图</p>
                    <p class="ethnic-chord-spec__insight-text">
                        <strong>${qdn.name}</strong>少数民族占比达 <strong>${qdn.minorityPct}%</strong>（${qdn.peoples}），族际通婚抽样 <strong>18.66%</strong>；三个自治州与盘兴、贵南高铁节点，构成当代「桥上成婚」的地理底图。
                    </p>
                    <div class="ethnic-chord-spec__pills">${autonomousHtml}</div>
                </div>
                <div class="ethnic-chord-spec__channels">${channelsHtml}</div>
                <p class="ethnic-chord-spec__story">
                    同第五幕所述：桥通之前「送亲翻山一早上」，桥通之后「两分钟跨过峡谷」。贵阳向外辐射通道合计约 <strong>${guiYangOut} 万人</strong>；遵义—贵阳 <strong>82 万人</strong> 同域联结撑起黔北枢纽，毕节—六盘水 <strong>48 万人</strong> 流动则锚定乌蒙山多民族混居带的内部循环——深色连线勾勒贵州「三交」的流动轮廓。
                </p>
                <p class="ethnic-chord-spec__source">数据来源：第七次全国人口普查贵州分册、族际通婚抽样调查、省交通运输厅文旅统计</p>
            </div>
        `;
    }

    function buildOption(highlightEthnic) {
        const layout = getLayout();
        const labelSize = layout.tiny
            ? Math.max(T.dense || 8, 8)
            : layout.mobile
                ? Math.max(T.axisSm || 9, 9)
                : (T.axis || 11);
        const tooltipSize = layout.tiny ? Math.max(T.tooltipSm || 11, 11) : (T.tooltipSm || 12);

        return {
            backgroundColor: "transparent",
            tooltip: {
                confine: true,
                backgroundColor: "rgba(255,255,255,0.94)",
                borderColor: "rgba(74, 124, 101, 0.25)",
                textStyle: { color: "#4A7C65", fontSize: tooltipSize, fontFamily: FONT },
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
                                : "同类型区域流动"
                        ].join("<br/>");
                    }
                    return "";
                }
            },
            graphic: buildLegendGraphic(highlightEthnic, layout),
            series: [{
                type: "graph",
                layout: "circular",
                circular: { rotateLabel: !layout.tiny },
                left: "center",
                top: layout.tiny ? "14%" : layout.mobile ? "16%" : "24%",
                width: layout.tiny ? "84%" : layout.mobile ? "86%" : "90%",
                height: layout.tiny ? "50%" : layout.mobile ? "52%" : "59%",
                roam: false,
                label: {
                    show: true,
                    color: "#4A7C65",
                    fontSize: labelSize,
                    fontFamily: FONT,
                    formatter: (p) => p.name,
                    distance: layout.tiny ? 2 : layout.mobile ? 3 : 4
                },
                labelLayout: {
                    hideOverlap: true,
                    moveOverlap: "shiftY"
                },
                data: cities.map((c) => {
                    const pal = ethnicPalette[c.ethnic];
                    const match = !highlightEthnic || c.ethnic === highlightEthnic;

                    return {
                        name: c.name,
                        symbolSize: nodeSize(c.pop, match && !!highlightEthnic, layout),
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
                    lineStyle: linkStyle(source, target, value, highlightEthnic, layout)
                })),
                emphasis: {
                    focus: "adjacency",
                    lineStyle: { width: layout.tiny ? 4 : 6, color: "#4A7C65", opacity: 0.95 },
                    itemStyle: { shadowBlur: 14, shadowColor: "rgba(74,124,101,0.32)" }
                }
            }]
        };
    }

    function render() {
        const layout = getLayout();
        if (layout.mode !== lastMode) {
            lastMode = layout.mode;
            chart.setOption(buildOption(activeEthnic), { notMerge: true });
        } else {
            chart.setOption(buildOption(activeEthnic), { notMerge: true });
        }
        chart.resize();
    }

    function applyHighlight(ethnicKey) {
        activeEthnic = activeEthnic === ethnicKey ? null : ethnicKey;
        render();
    }

    let resizeTimer;

    function scheduleRender() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(render, 100);
    }

    render();
    renderDataSpec();

    chart.on("click", (params) => {
        if (params.componentType === "graphic" && params.info && params.info.legend) {
            applyHighlight(params.info.ethnicKey);
        }
    });

    window.addEventListener("resize", scheduleRender);
    window.addEventListener("load", () => setTimeout(render, 120));
    window.addEventListener("orientationchange", () => setTimeout(render, 200));

    if ("ResizeObserver" in window) {
        new ResizeObserver(scheduleRender).observe(dom);
    }

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) scheduleRender();
            });
        }, { threshold: 0.1 }).observe(dom);
    }

})();
