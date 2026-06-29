// ======================================
// 桥—民族村寨连线图（官方客流分级 · 固定布局）
// ======================================

(function () {

    const dom = document.getElementById("bridgeVillage");
    if (!dom) return;

    const chart = echarts.init(dom);
    const T = window.BRIDGE_CHART || {};
    const labelLayout = window.BRIDGE_LABEL_LAYOUT || { hideOverlap: true, moveOverlap: "shiftY" };

    const PALETTE = {
        bridge: { fill: "#4A7C65", border: "#3d6b55" },
        rail: { fill: "#3a5f7a", border: "#2c4f68" },
        village: { fill: "#6D9B8B", border: "#5a8678" },
        villageCore: { fill: "#8CBFAA", border: "#6D9B8B" }
    };

    const TIER_WIDTH = { 1: 4.2, 2: 2.6, 3: 1.3 };
    const TIER_COLOR = { 1: "#4A7C65", 2: "#6D9B8B", 3: "#8CBFAA" };
    const TIER_LABEL = { 1: "一级·百万级", 2: "二级·数十万级", 3: "三级·十万级" };
    const TIER_BADGE = { 1: "一级·百万", 2: "二级·数十万", 3: "三级·十万" };

    /** 图例距容器底边（px）：数值越小越贴底，越大越靠上 */
    const legendBottom = 18;
    const tierLegendBottom = 2;

    const categories = [
        { name: "桥梁", itemStyle: { color: PALETTE.bridge.fill, borderColor: PALETTE.bridge.border } },
        { name: "高铁桥梁群", itemStyle: { color: PALETTE.rail.fill, borderColor: PALETTE.rail.border } },
        { name: "民族村寨", itemStyle: { color: PALETTE.village.fill, borderColor: PALETTE.village.border } }
    ];

    const nodes = [
        {
            name: "花江峡谷大桥",
            x: 158, y: 42, symbolSize: 40, category: 0,
            label: { position: "top" },
            tip: [
                "2026 春节 9 天接待游客超 30 万人次",
                "驶入车辆 7 万辆 · 外省游客占比超 50%",
                "关岭—贞丰 2 小时缩短至 2 分钟",
                "沿线 31 个民族村寨受益 · 酒店入住率 +24%"
            ]
        },
        {
            name: "坝陵河大桥",
            x: 98, y: 88, symbolSize: 36, category: 0,
            label: { position: "left" },
            tip: [
                "桥旅项目一年半接待游客超 10 万人次",
                "年综合营收 1600 万元 · 极限体验游客 3 万+",
                "370 米吉尼斯最高商业蹦极",
                "每年带动周边村寨旅游经济约 5000 万元"
            ]
        },
        {
            name: "平塘特大桥",
            x: 228, y: 88, symbolSize: 40, category: 0,
            label: { position: "right" },
            tip: [
                "截至 2025 年 11 月累计接待游客超 520 万人次",
                "2025 年年接待 140 万人次以上",
                "全国唯一交通强国桥旅融合示范项目 · 国家 4A 级",
                "沿线 31 个民族村寨同步振兴 · 入住率 +25%"
            ]
        },
        {
            name: "贵广高铁桥梁群",
            x: 160, y: 140, symbolSize: 34, category: 1,
            label: { position: "right" },
            tip: [
                "从江站 2025 全年发送旅客 119 万人次",
                "日均开行动车 38 趟",
                "串联粤港澳大湾区与黔东南侗乡"
            ]
        },
        {
            name: "沪昆高铁桥梁群",
            x: 138, y: 138, symbolSize: 34, category: 1,
            label: { position: "left" },
            tip: [
                "贵广高铁开通首月西江高铁游客占比 12.8%",
                "整体客流同比增长 49.37%",
                "串联沪昆走廊与黔东苗乡"
            ]
        },
        {
            name: "花江村",
            x: 128, y: 98, symbolSize: 30, category: 2,
            label: { position: "bottom" },
            ethnic: "布依族",
            tip: [
                "贞丰平街乡小花江 · 布依族核心寨",
                "民宿 16 家开业、14 家在建 · 餐饮 5 家",
                "40 余名外出村民返乡创业"
            ]
        },
        {
            name: "科力寨",
            x: 188, y: 98, symbolSize: 26, category: 2,
            label: { position: "bottom" },
            ethnic: "布依·仡佬混居",
            tip: [
                "关岭花江镇科力寨",
                "布依、仡佬混居 · 花江峡谷直连村寨"
            ]
        },
        {
            name: "坝陵河苗寨群",
            x: 105, y: 158, symbolSize: 28, category: 2,
            label: { position: "left" },
            ethnic: "苗族·布依族",
            tip: [
                "坝陵河两岸苗、布依村寨",
                "国际低空跳伞赛辐射民宿、民俗接待",
                "催生 10 余家精品民宿"
            ]
        },
        {
            name: "平里河村",
            x: 208, y: 168, symbolSize: 32, category: 2,
            label: { position: "right" },
            ethnic: "布依·苗·汉",
            tip: [
                "平塘平里河多民族村寨",
                "研学线路直达 · 全年 718 场、3.4 万人",
                "红石榴民族团结步道串联村寨"
            ]
        },
        {
            name: "肇兴侗寨",
            x: 200, y: 205, symbolSize: 34, category: 2,
            label: { position: "right" },
            ethnic: "侗族",
            tip: [
                "2014 高铁开通前年游客 6 万 → 2025 年 151 万",
                "客流增幅约 25 倍",
                "大湾区游客占比 16% · 停留 2.8 天"
            ]
        },
        {
            name: "西江千户苗寨",
            x: 118, y: 188, symbolSize: 34, category: 2,
            label: { position: "left" },
            ethnic: "苗族",
            tip: [
                "2015 高铁通车前年约 250 万 → 2023 年 464.89 万",
                "增幅 86%",
                "高铁通车前外出务工 80% → 2025 年降至 10%"
            ]
        },
        {
            name: "台江长滩苗寨",
            x: 160, y: 190, symbolSize: 24, category: 2,
            label: { position: "bottom" },
            ethnic: "苗族",
            tip: [
                "高铁观景台年均接待游客 10 万+",
                "省内、跨省研学与民族文化观光为主"
            ]
        },
        {
            name: "荔波瑶山古寨",
            x: 248, y: 208, symbolSize: 24, category: 2,
            label: { position: "bottom" },
            ethnic: "瑶族",
            tip: [
                "桥旅融合支线村寨",
                "年接待十万级 · 民族文旅观光"
            ]
        }
    ];

    const links = [
        { source: "花江峡谷大桥", target: "花江村", tier: 1, note: "单节点年接待≥100 万人次" },
        { source: "花江峡谷大桥", target: "科力寨", tier: 2, note: "花江峡谷两岸直连村寨" },
        { source: "平塘特大桥", target: "平里河村", tier: 1, note: "桥旅示范 · 年接待百万级" },
        { source: "贵广高铁桥梁群", target: "肇兴侗寨", tier: 1, note: "151 万人次/年 · 25 倍增长" },
        { source: "坝陵河大桥", target: "坝陵河苗寨群", tier: 2, note: "年接待 30 万—100 万人次" },
        { source: "沪昆高铁桥梁群", target: "西江千户苗寨", tier: 2, note: "年接待 30 万—100 万人次" },
        { source: "贵广高铁桥梁群", target: "台江长滩苗寨", tier: 3, note: "高铁观景台支线 · 年 10 万+" },
        { source: "平塘特大桥", target: "荔波瑶山古寨", tier: 3, note: "桥旅融合支线 · 年＜30 万人次" }
    ];

    const nodeMap = Object.fromEntries(nodes.map((n) => [n.name, n]));
    const categoryNames = ["桥梁", "高铁桥梁群", "民族村寨"];

    function nodeTooltip(name) {
        const n = nodeMap[name];
        if (!n) return name;
        const ethnic = n.ethnic ? `<br/><span style="color:#7A7A7A;font-size:11px">${n.ethnic}</span>` : "";
        const lines = (n.tip || []).map((t) => `<div style="font-size:11px;color:#555;margin-top:2px">· ${t}</div>`).join("");
        return `<strong>${name}</strong>${ethnic}${lines}`;
    }

    function linkTooltip(source, target) {
        const link = links.find((l) => l.source === source && l.target === target);
        if (!link) return `${source} → ${target}`;
        return `<strong>${source} → ${target}</strong><br/><span style="color:#4A7C65;font-size:12px">${TIER_LABEL[link.tier]}</span><br/><span style="color:#7A7A7A;font-size:11px">${link.note}</span>`;
    }

    function renderDataSpec() {
        const specDom = document.getElementById("bridgeVillageData");
        if (!specDom) return;

        const tierGroups = [1, 2, 3].map((tier) => ({
            tier,
            items: links.filter((l) => l.tier === tier)
        }));

        const tierRows = tierGroups.map(({ tier, items }) => {
            if (!items.length) return "";
            const chips = items.map((l) =>
                `<span class="bridge-village-data__chip bridge-village-data__chip--link bridge-village-data__chip--tier-${l.tier}" title="${l.note}">${l.source} → ${l.target}</span>`
            ).join("");
            return `
                <div class="bridge-village-data__row bridge-village-data__row--tier-${tier}">
                    <span class="bridge-village-data__badge">${TIER_BADGE[tier]}</span>
                    <div class="bridge-village-data__chips">${chips}</div>
                </div>`;
        }).join("");

        const nodeGroups = categoryNames.map((name, i) => {
            const group = nodes.filter((n) => n.category === i);
            if (!group.length) return "";
            const chips = group.map((n) => {
                const meta = n.ethnic ? `<em>${n.ethnic}</em>` : "";
                const tip = (n.tip || []).join(" · ");
                return `<span class="bridge-village-data__chip bridge-village-data__chip--node bridge-village-data__chip--cat-${i}" title="${tip}">${n.name}${meta}</span>`;
            }).join("");
            return `
                <div class="bridge-village-data__row bridge-village-data__row--cat-${i}">
                    <span class="bridge-village-data__badge bridge-village-data__badge--cat bridge-village-data__badge--cat-${i}">${name}</span>
                    <div class="bridge-village-data__chips">${chips}</div>
                </div>`;
        }).join("");

        specDom.innerHTML = `
            <div class="bridge-village-data__panel">
                <div class="bridge-village-data__section">
                    <p class="bridge-village-data__section-label">客流连线</p>
                    ${tierRows}
                </div>
                <div class="bridge-village-data__section bridge-village-data__section--nodes">
                    <p class="bridge-village-data__section-label">节点分布</p>
                    ${nodeGroups}
                </div>
            </div>
        `;
    }

    chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "item",
            confine: true,
            padding: [6, 8],
            borderWidth: 0.5,
            backgroundColor: "rgba(255,255,255,0.97)",
            borderColor: "rgba(74, 124, 101, 0.28)",
            textStyle: { color: "#4A7C65", fontSize: T.tooltipSm || 13, lineHeight: 18 },
            className: "bridge-village-tip",
            formatter: (p) => {
                if (p.dataType === "edge") {
                    return linkTooltip(p.data.source, p.data.target);
                }
                if (p.dataType === "node") {
                    return nodeTooltip(p.name);
                }
                return p.name || "";
            }
        },
        legend: {
            bottom: legendBottom,
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 14,
            textStyle: { color: "#7A7A7A", fontSize: T.legend || 11, fontWeight: 600 }
        },
        graphic: [
            {
                type: "group",
                left: 8,
                bottom: tierLegendBottom,
                children: [
                    { type: "line", shape: { x1: 0, y1: 0, x2: 22, y2: 0 }, style: { stroke: TIER_COLOR[1], lineWidth: 4, lineCap: "round" } },
                    { type: "text", style: { text: "一级·百万级", x: 26, y: 3, fill: "#7A7A7A", font: `${T.dense || 9}px Noto Serif SC, SimSun, serif`, textBaseline: "middle" } },
                    { type: "line", shape: { x1: 88, y1: 0, x2: 110, y2: 0 }, style: { stroke: TIER_COLOR[2], lineWidth: 2.6, lineCap: "round" } },
                    { type: "text", style: { text: "二级·数十万", x: 114, y: 3, fill: "#7A7A7A", font: `${T.dense || 9}px Noto Serif SC, SimSun, serif`, textBaseline: "middle" } },
                    { type: "line", shape: { x1: 186, y1: 0, x2: 208, y2: 0 }, style: { stroke: TIER_COLOR[3], lineWidth: 1.3, lineCap: "round" } },
                    { type: "text", style: { text: "三级·十万级", x: 212, y: 3, fill: "#7A7A7A", font: `${T.dense || 9}px Noto Serif SC, SimSun, serif`, textBaseline: "middle" } }
                ]
            }
        ],
        series: [{
            type: "graph",
            layout: "none",
            roam: false,
            draggable: false,
            categories,
            data: nodes.map((n) => {
                const isRail = n.category === 1;
                const pal = isRail ? PALETTE.rail : n.category === 0 ? PALETTE.bridge : PALETTE.village;
                const isCore = ["肇兴侗寨", "西江千户苗寨", "花江村", "平里河村"].includes(n.name);
                return {
                    name: n.name,
                    x: n.x,
                    y: n.y,
                    symbolSize: n.symbolSize,
                    category: n.category,
                    fixed: true,
                    itemStyle: {
                        color: isCore && n.category === 2 ? PALETTE.villageCore.fill : pal.fill,
                        borderColor: pal.border,
                        borderWidth: n.category === 0 ? 1.6 : 1.2,
                        shadowBlur: n.category === 0 ? 8 : 5,
                        shadowColor: "rgba(74, 124, 101, 0.18)"
                    },
                    label: {
                        show: true,
                        position: n.label.position,
                        color: "#4A7C65",
                        fontSize: n.symbolSize >= 32 ? (T.axis || 11) : (T.axisSm || 10),
                        fontWeight: 700,
                        distance: 5,
                        backgroundColor: "rgba(245, 242, 232, 0.88)",
                        padding: [1, 4],
                        borderRadius: 2
                    }
                };
            }),
            links: links.map((l) => ({
                source: l.source,
                target: l.target,
                lineStyle: {
                    color: TIER_COLOR[l.tier],
                    width: TIER_WIDTH[l.tier],
                    curveness: 0.14,
                    opacity: l.tier === 1 ? 0.88 : l.tier === 2 ? 0.72 : 0.58
                }
            })),
            edgeSymbol: ["none", "arrow"],
            edgeSymbolSize: [0, 8],
            labelLayout,
            emphasis: {
                focus: "adjacency",
                lineStyle: { opacity: 0.95 },
                itemStyle: { shadowBlur: 12, shadowColor: "rgba(74, 124, 101, 0.28)" }
            },
            z: 1
        }]
    });

    renderDataSpec();

    window.addEventListener("resize", () => chart.resize());

    window.addEventListener("load", () => {
        setTimeout(() => chart.resize(), 100);
    });

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) chart.resize();
            });
        }, { threshold: 0.1 }).observe(dom);
    }

})();
