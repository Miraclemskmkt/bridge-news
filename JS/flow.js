// =====================================
// 出山入海 Flow Map · 地理底图 + 客流分级流线
// =====================================

(function () {

    const dom = document.getElementById("flowMap");
    if (!dom) return;

    const C = {
        ink: "#4A7C65",
        bamboo: "#6D9B8B",
        pine: "#8CBFAA",
        mist: "#D1E7DD",
        paper: "#F5F2E8",
        gold: "#bf8c60",
        goldSoft: "#e8d4bc",
        gray: "#7A7A7A",
        light: "#B8B8B8",
        blue: "#3a5f7a"
    };

    const VB = { w: 560, h: 540 };
    const MARGIN = { top: 48, right: 36, bottom: 46, left: 36 };
    const NODE_SCALE = 1.18;
    const LEGEND = { w: 188, h: 158, inset: 6, bottom: 10 };
    /** 不对称视野：西侧/南侧/北侧留出境箭头空间，贵州整体偏右上 */
    const GEO = { minLng: 101.7, maxLng: 109.55, minLat: 23.1, maxLat: 29.55 };

    /** 示意节点贴外缘，避开左下角图例区 */
    const SCHEMATIC_GEO = {
        tengchong: [101.88, 26.75],
        vietnam: [105.6, 23.22],
        germany: [102.05, 29.42],
        belarus: [103.2, 28.78]
    };

    /** 节点标签微调（避免相邻节点字重叠） */
    const NODE_LABEL = {
        xingyi: { anchor: "end", dx: -10, dy: -6 },
        qxn: { anchor: "start", dx: 10, dy: 8 }
    };

    /** 流线弯曲度（符号保证箭头终段指向目标方位） */
    const FLOW_BEND = {
        "guiyang-tengchong": -0.11,
        "beipan-tengchong": -0.09,
        "guiyang-vietnam": 0.07,
        "guiyang-germany": -0.07,
        "guiyang-belarus": 0.06
    };

    const TIER_WIDTH = { 1: 5, 2: 3.1, 3: 1.6 };
    const TIER_STROKE = { 1: C.ink, 2: C.bamboo, 3: C.pine };
    const TIER_OPACITY = { 1: 0.92, 2: 0.8, 3: 0.68 };

    /** 固定地理锚点（底图标注，与节点 geo 一致） */
    const ANCHOR_IDS = ["huajiang", "beipan", "pingtang", "guiyang", "tengchong"];
    const ANCHOR_LABELS = {
        huajiang: "花江峡谷大桥",
        beipan: "北盘江大桥",
        pingtang: "平塘特大桥",
        guiyang: "贵阳陆港",
        tengchong: "腾冲口岸"
    };

    const nodes = {
        huajiang: {
            type: "origin", geo: [105.58, 25.62], r: 20,
            name: "花江峡谷大桥",
            goods: "关岭牛 · 贞丰花椒 · 本地农产",
            notes: ["肉牛年交易 30 万头", "通车两月车流 16 万辆"]
        },
        beipan: {
            type: "origin", geo: [105.68, 25.82], r: 15,
            name: "北盘江大桥",
            goods: "大豆油 · 葡萄 · 五金",
            notes: ["32.55 吨大豆油出口缅甸", "水城商户增长八成"]
        },
        pingtang: {
            type: "origin", geo: [107.02, 25.76], r: 13,
            name: "平塘特大桥",
            goods: "茶叶 · 刺梨 · 文旅加工品",
            notes: []
        },
        guiyang: {
            type: "hub", geo: [106.68, 26.55], size: 28,
            name: "贵阳国际陆港",
            notes: [
                "2025 年集装箱 2.3 万标箱",
                "累计开通 40 余条对外通道",
                "全年班列 400+ 列"
            ]
        },
        guanling: { type: "hub", geo: [105.55, 25.88], size: 16, name: "关岭肉牛交易市场", notes: ["投资 2822.4 万元", "日交易 3000 头"] },
        xingyi: { type: "hub", geo: [104.88, 25.08], display: [104.58, 25.32], size: 12, name: "兴义中转", label: { position: "top" }, notes: ["民族县域集散"] },
        libo: { type: "hub", geo: [107.88, 25.38], size: 11, name: "荔波中转", notes: ["民族县域集散"] },
        qdn: { type: "domestic", geo: [108.52, 26.58], r: 8, name: "黔东南\n消费市场" },
        qnan: { type: "domestic", geo: [107.52, 26.08], r: 8, name: "黔南\n消费市场" },
        qxn: { type: "domestic", geo: [104.90, 25.09], display: [105.22, 24.72], r: 8, name: "黔西南\n消费市场", label: { position: "bottom" } },
        tengchong: { type: "port", geo: [98.32, 25.28], size: 10, name: "腾冲猴桥", sub: "缅甸口岸" },
        vietnam: { type: "port", geo: [106.2, 21.6], size: 9, name: "越南口岸", sub: "人造草坪等" },
        germany: { type: "port", geo: [109.35, 28.2], size: 8, name: "德国", sub: "五金出口" },
        belarus: { type: "port", geo: [109.55, 26.8], size: 8, name: "白俄罗斯", sub: "新能源车" }
    };

    const flows = [
        { from: "huajiang", to: "guiyang", tier: 1 },
        { from: "beipan", to: "guiyang", tier: 1 },
        { from: "guiyang", to: "tengchong", tier: 2 },
        { from: "guiyang", to: "vietnam", tier: 2 },
        { from: "beipan", to: "tengchong", tier: 2 },
        { from: "guiyang", to: "germany", tier: 2 },
        { from: "guiyang", to: "belarus", tier: 2 },
        { from: "huajiang", to: "guanling", tier: 3 },
        { from: "pingtang", to: "libo", tier: 3 },
        { from: "pingtang", to: "guiyang", tier: 3 },
        { from: "pingtang", to: "xingyi", tier: 3 },
        { from: "guiyang", to: "qdn", tier: 3 },
        { from: "guiyang", to: "qnan", tier: 3 },
        { from: "guiyang", to: "qxn", tier: 3 },
        { from: "xingyi", to: "qxn", tier: 3 },
        { from: "libo", to: "qnan", tier: 3 }
    ].sort((a, b) => b.tier - a.tier);

    const footnotes = [
        { label: "桥通路费变化佐证", text: "北盘江 8 小时绕行→2 小时直达，物流成本大幅下降；" },
        { label: "产业增收摘要", text: "北盘江带动 2 万人脱贫，村民人均增收 2.1 万元；" },
        { kind: "narrative", text: "万山阻隔时代货难出山，万桥贯通后黔货奔赴全国、远销海外。" }
    ];

    const SOURCE = "数据来源：贵州省交通运输厅、贵阳国际陆港运营统计、六盘水市政府、关岭县统计局、《桥见黔程万里》专题调研资料。";

    /** 国境示意：西缅、南越，贵州偏右上 */
    const BORDER_LINE = [
        [101.85, 29.5], [101.9, 28.0], [102.05, 26.8], [103.2, 25.4],
        [105.2, 23.7], [107.8, 23.35], [109.5, 23.7], [109.55, 26.6], [109.5, 29.4], [101.85, 29.5]
    ];

    const SEA_OUTLINE = [
        [104.6, 23.28], [106.6, 23.1], [107.8, 23.5], [106.0, 23.68], [104.6, 23.28]
    ];

    function esc(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function plotSize() {
        return {
            w: VB.w - MARGIN.left - MARGIN.right,
            h: VB.h - MARGIN.top - MARGIN.bottom
        };
    }

    function project(lng, lat) {
        const { w, h } = plotSize();
        return {
            x: MARGIN.left + ((lng - GEO.minLng) / (GEO.maxLng - GEO.minLng)) * w,
            y: MARGIN.top + ((GEO.maxLat - lat) / (GEO.maxLat - GEO.minLat)) * h
        };
    }

    function nodeCoords(id, node) {
        if (SCHEMATIC_GEO[id]) return SCHEMATIC_GEO[id];
        if (node.display) return node.display;
        return node.geo;
    }

    function legendBox() {
        const left = MARGIN.left + LEGEND.inset;
        const top = VB.h - MARGIN.bottom - LEGEND.h - LEGEND.bottom;
        return { left, top, right: left + LEGEND.w, bottom: top + LEGEND.h };
    }

    function layoutNodes() {
        Object.keys(nodes).forEach((id) => {
            const n = nodes[id];
            if (!n.geo) return;
            const [lng, lat] = nodeCoords(id, n);
            const p = project(lng, lat);
            n.x = p.x;
            n.y = p.y;
        });
    }

    function layoutFlowLabels() {
        const tc = nodes.tengchong;
        const de = nodes.germany;
        const leg = legendBox();
        return [
            {
                x: Math.max(leg.right + 10, tc.x + 28),
                y: VB.h - 38,
                lines: ["西部陆海新通道累计班列 659 列", "货值 16.8 亿元"]
            },
            {
                x: Math.max(MARGIN.left + 8, Math.min(de.x - 6, leg.left - 4)),
                y: Math.max(MARGIN.top + 18, de.y + 46),
                lines: ["中欧班列 74 列", "货值 17.36 亿元"]
            }
        ];
    }

    function flowBend(fromId, toId, x1, y1, x2, y2, tier) {
        const key = `${fromId}-${toId}`;
        if (FLOW_BEND[key] != null) return FLOW_BEND[key];
        const dx = x2 - x1;
        const mag = tier === 1 ? 0.1 : tier === 2 ? 0.13 : 0.16;
        return mag * (dx >= 0 ? 1 : -1);
    }

    function flowPath(x1, y1, x2, y2, bend) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cx = mx - dy * bend;
        const cy = my + dx * bend;
        return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }

    function nodeAnchor(id) {
        return { x: nodes[id].x, y: nodes[id].y };
    }

    function lngLatPath(coords, closed) {
        if (!coords.length) return "";
        let d = "";
        coords.forEach((pt, i) => {
            const p = project(pt[0], pt[1]);
            d += `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
        });
        return closed ? d + "Z" : d;
    }

    function ringToPath(ring, step) {
        if (!ring || ring.length < 3) return "";
        const pts = [];
        for (let i = 0; i < ring.length; i += step) pts.push(ring[i]);
        const last = ring[ring.length - 1];
        const tail = pts[pts.length - 1];
        if (!tail || tail[0] !== last[0] || tail[1] !== last[1]) pts.push(last);
        let d = "";
        pts.forEach((pt, i) => {
            const p = project(pt[0], pt[1]);
            d += `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
        });
        return d + "Z";
    }

    function pathsFromGeoJson(geoJson) {
        const cityPaths = [];
        const provinceRings = [];

        geoJson.features.forEach((feature) => {
            const geom = feature.geometry;
            const polys = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
            polys.forEach((poly) => {
                const ring = poly[0];
                const step = Math.max(1, Math.floor(ring.length / 48));
                cityPaths.push(ringToPath(ring, step));
                provinceRings.push(ring);
            });
        });

        return { cityPaths, provincePaths: cityPaths };
    }

    function buildDefs() {
        return `
            <defs>
                <linearGradient id="flow-bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${C.paper}"/>
                    <stop offset="100%" stop-color="rgba(234,240,234,0.35)"/>
                </linearGradient>
                <radialGradient id="origin-fill" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stop-color="${C.goldSoft}"/>
                    <stop offset="100%" stop-color="rgba(191,140,96,0.35)"/>
                </radialGradient>
                <linearGradient id="hub-fill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${C.mist}"/>
                    <stop offset="100%" stop-color="rgba(109,155,139,0.35)"/>
                </linearGradient>
                <filter id="node-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(74,124,101,0.22)"/>
                </filter>
                <marker id="flow-arrow-1" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="${C.ink}"/>
                </marker>
                <marker id="flow-arrow-2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="${C.bamboo}"/>
                </marker>
                <marker id="flow-arrow-3" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                    <path d="M0,0 L7,2.5 L0,5 Z" fill="${C.pine}"/>
                </marker>
                <marker id="flow-arrow-sm" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <path d="M0,0 L6,2.5 L0,5 Z" fill="${C.ink}"/>
                </marker>
            </defs>
        `;
    }

    function drawMapFrame() {
        const { w, h } = plotSize();
        const x = MARGIN.left;
        const y = MARGIN.top;
        return `
            <rect x="0" y="0" width="${VB.w}" height="${VB.h}" fill="url(#flow-bg)"/>
            <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="rgba(234,240,234,0.12)" stroke="none"/>
        `;
    }

    function drawBaseMap(geoJson) {
        const { cityPaths } = geoJson ? pathsFromGeoJson(geoJson) : { cityPaths: [] };
        const border = lngLatPath(BORDER_LINE, false);
        const sea = lngLatPath(SEA_OUTLINE, true);

        const cityLines = cityPaths.map((d) =>
            `<path d="${d}" fill="none" stroke="${C.light}" stroke-width="0.45" opacity="0.42"/>`
        ).join("");

        const provinceFill = cityPaths.length
            ? cityPaths.map((d) =>
                `<path d="${d}" fill="rgba(140,191,170,0.06)" stroke="${C.bamboo}" stroke-width="0.75" opacity="0.5"/>`
            ).join("")
            : "";

        return `
            <g class="flow-map__base" aria-hidden="true">
                <path d="${sea}" fill="rgba(140,191,170,0.04)" stroke="${C.light}" stroke-width="0.45" opacity="0.38"/>
                <path d="${border}" fill="none" stroke="${C.light}" stroke-width="0.55" stroke-dasharray="4 3" opacity="0.48"/>
                ${provinceFill}
                ${cityLines}
                <text x="${project(107.2, 26.8).x}" y="${project(107.2, 26.8).y}" text-anchor="middle" class="flow-map__geo-region">贵州省</text>
                <text x="${project(102.15, 26.9).x}" y="${project(102.15, 26.9).y}" text-anchor="middle" class="flow-map__geo-region">缅甸方向</text>
                <text x="${project(105.8, 23.45).x}" y="${project(105.8, 23.45).y + 12}" text-anchor="middle" class="flow-map__geo-region">东南亚（示意）</text>
                <text x="${project(102.35, 29.25).x}" y="${project(102.35, 29.25).y - 6}" text-anchor="middle" class="flow-map__geo-region">欧洲（示意）</text>
            </g>
        `;
    }

    function drawGeoAnchors() {
        return ANCHOR_IDS.map((id) => {
            const n = nodes[id];
            const label = ANCHOR_LABELS[id];
            const anchorY = n.y - (id === "guiyang" ? 24 : id === "tengchong" ? 16 : 18);
            return `
                <g class="flow-map__geo-anchor-group">
                    <circle cx="${n.x}" cy="${n.y}" r="2.2" fill="none" stroke="${C.gray}" stroke-width="0.8" opacity="0.7"/>
                    <line x1="${n.x - 3}" y1="${n.y}" x2="${n.x + 3}" y2="${n.y}" stroke="${C.gray}" stroke-width="0.6" opacity="0.55"/>
                    <line x1="${n.x}" y1="${n.y - 3}" x2="${n.x}" y2="${n.y + 3}" stroke="${C.gray}" stroke-width="0.6" opacity="0.55"/>
                    <text x="${n.x}" y="${anchorY}" text-anchor="middle" class="flow-map__geo-anchor">${esc(label)}</text>
                </g>
            `;
        }).join("");
    }

    function drawFlows() {
        return `<g class="flow-map__flows">${flows.map((f) => {
            const a = nodeAnchor(f.from);
            const b = nodeAnchor(f.to);
            const bend = flowBend(f.from, f.to, a.x, a.y, b.x, b.y, f.tier);
            return `<path d="${flowPath(a.x, a.y, b.x, b.y, bend)}" fill="none" stroke="${TIER_STROKE[f.tier]}" stroke-width="${TIER_WIDTH[f.tier]}" stroke-linecap="round" marker-end="url(#flow-arrow-${f.tier})" opacity="${TIER_OPACITY[f.tier]}"/>`;
        }).join("")}</g>`;
    }

    function nodeDisplayName(id) {
        const n = nodes[id];
        return (ANCHOR_LABELS[id] && id !== "guiyang") ? ANCHOR_LABELS[id] : n.name.replace("\n", " ");
    }

    function nodeTooltipHtml(id) {
        const n = nodes[id];
        if (!n) return "";
        const title = id === "guiyang" ? n.name : nodeDisplayName(id);
        let html = `<strong>${esc(title)}</strong>`;
        if (n.notes && n.notes.length) {
            html += `<ul>${n.notes.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
        } else if (n.goods) {
            html += `<p>${esc(n.goods)}</p>`;
        } else if (n.sub) {
            html += `<p>${esc(n.sub)}</p>`;
        }
        return html;
    }

    function nodeHasTooltip(id) {
        const n = nodes[id];
        return !!(n && ((n.notes && n.notes.length) || n.goods || n.sub));
    }

    function bindNodeTooltips(board) {
        const canvas = board.querySelector(".flow-map__canvas");
        if (!canvas) return;

        const tip = document.createElement("div");
        tip.className = "flow-map__tooltip";
        tip.setAttribute("role", "tooltip");
        tip.hidden = true;
        canvas.appendChild(tip);

        function placeTip(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            let left = clientX - rect.left + 10;
            let top = clientY - rect.top - 8;
            tip.hidden = false;
            const tw = tip.offsetWidth;
            const th = tip.offsetHeight;
            if (left + tw > rect.width - 4) left = clientX - rect.left - tw - 10;
            if (top + th > rect.height - 4) top = rect.height - th - 4;
            if (top < 4) top = 4;
            tip.style.left = `${left}px`;
            tip.style.top = `${top}px`;
        }

        canvas.querySelectorAll(".flow-map__node-hit").forEach((hit) => {
            const id = hit.closest("[data-node-id]")?.dataset.nodeId;
            if (!id || !nodeHasTooltip(id)) return;

            hit.style.cursor = "pointer";

            hit.addEventListener("mouseenter", (e) => {
                tip.innerHTML = nodeTooltipHtml(id);
                hit.closest(".flow-map__node")?.classList.add("is-active");
                placeTip(e.clientX, e.clientY);
            });

            hit.addEventListener("mousemove", (e) => {
                placeTip(e.clientX, e.clientY);
            });

            hit.addEventListener("mouseleave", () => {
                tip.hidden = true;
                hit.closest(".flow-map__node")?.classList.remove("is-active");
            });
        });
    }

    function nodeLabelPos(id, n, labelY, size, r) {
        const lay = NODE_LABEL[id] || {};
        const pos = n.label?.position;
        let x = n.x;
        let y = labelY;
        let anchor = lay.anchor || "middle";

        if (pos === "top") {
            y = n.y - (n.type === "hub" ? size / 2 : r) - 10;
        } else if (pos === "left") {
            x = n.x - (n.type === "hub" ? size / 2 : r) - 8;
            anchor = "end";
        } else if (pos === "right") {
            x = n.x + (n.type === "hub" ? size / 2 : r) + 8;
            anchor = "start";
        }

        return {
            x: x + (lay.dx || 0),
            y: y + (lay.dy || 0),
            anchor: lay.anchor || anchor
        };
    }

    function drawNode(id) {
        const n = nodes[id];
        const isAnchor = ANCHOR_IDS.includes(id);
        let shape = "";
        let labelY = n.y + 4;
        const r = n.r ? n.r * NODE_SCALE : 0;
        const size = n.size ? n.size * NODE_SCALE : 0;

        if (n.type === "origin") {
            shape = `<g filter="url(#node-glow)"><circle cx="${n.x}" cy="${n.y}" r="${r}" fill="url(#origin-fill)" stroke="${C.gold}" stroke-width="1.4"/><circle cx="${n.x}" cy="${n.y}" r="${Math.max(4, r * 0.26)}" fill="${C.ink}" opacity="0.85"/></g>`;
            labelY = n.y + r + 14;
        } else if (n.type === "hub") {
            const h = size;
            const main = id === "guiyang";
            shape = `<g filter="url(#node-glow)"><rect x="${n.x - h / 2}" y="${n.y - h / 2}" width="${h}" height="${h}" rx="3" fill="url(#hub-fill)" stroke="${main ? C.ink : C.bamboo}" stroke-width="${main ? 1.6 : 1.2}"/></g>`;
            labelY = n.y + h / 2 + 14;
        } else if (n.type === "domestic") {
            shape = `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${C.mist}" stroke="${C.pine}" stroke-width="1.2" opacity="0.9"/>`;
            labelY = n.y + r + 12;
        } else if (n.type === "port") {
            const s = size;
            shape = `<g filter="url(#node-glow)"><path d="M ${n.x},${n.y - s} L ${n.x + s},${n.y} L ${n.x},${n.y + s} L ${n.x - s},${n.y} Z" fill="rgba(191,140,96,0.2)" stroke="${C.blue}" stroke-width="1.2"/></g>`;
            labelY = n.y + s + 14;
        }

        let nameBlock = "";
        if (!isAnchor) {
            const lines = n.name.split("\n");
            const lp = nodeLabelPos(id, n, labelY, size, r);
            nameBlock = `<text x="${lp.x}" y="${lp.y}" text-anchor="${lp.anchor}" class="flow-map__node-name">${lines.map((line, i) => `<tspan x="${lp.x}" dy="${i === 0 ? 0 : 12}">${esc(line)}</tspan>`).join("")}</text>`;
        }

        const hit = nodeHasTooltip(id) ? nodeHitArea(id) : "";

        return `<g class="flow-map__node" data-node-id="${id}">${hit}${shape}${nameBlock}</g>`;
    }

    function nodeHitArea(id) {
        const n = nodes[id];
        const r = n.r ? n.r * NODE_SCALE : 0;
        const size = n.size ? n.size * NODE_SCALE : 0;
        if (n.type === "origin") {
            return `<circle class="flow-map__node-hit" cx="${n.x}" cy="${n.y}" r="${r + 14}" fill="transparent"/>`;
        }
        if (n.type === "hub") {
            const pad = 12;
            const h = size + pad * 2;
            return `<rect class="flow-map__node-hit" x="${n.x - size / 2 - pad}" y="${n.y - size / 2 - pad}" width="${h}" height="${h}" fill="transparent"/>`;
        }
        if (n.type === "domestic") {
            return `<circle class="flow-map__node-hit" cx="${n.x}" cy="${n.y}" r="${r + 12}" fill="transparent"/>`;
        }
        const pad = 12;
        return `<circle class="flow-map__node-hit" cx="${n.x}" cy="${n.y}" r="${size + pad}" fill="transparent"/>`;
    }

    function drawLegend() {
        const leg = legendBox();
        return `
            <g class="flow-map__legend-box" transform="translate(${leg.left}, ${leg.top})">
                <rect class="flow-map__legend-bg" x="0" y="0" width="${LEGEND.w}" height="${LEGEND.h}" rx="6"/>
                <text x="10" y="22" class="flow-map__legend-title">图例</text>
                <circle cx="22" cy="40" r="8" fill="url(#origin-fill)" stroke="${C.gold}" stroke-width="1"/>
                <text x="38" y="44" class="flow-map__legend-item">圆形 · 产地</text>
                <rect x="15" y="54" width="14" height="14" rx="2" fill="url(#hub-fill)" stroke="${C.bamboo}" stroke-width="1"/>
                <text x="38" y="65" class="flow-map__legend-item">方形 · 中转枢纽</text>
                <path d="M 22,82 L 28,88 L 22,94 L 16,88 Z" fill="rgba(191,140,96,0.2)" stroke="${C.blue}" stroke-width="0.9"/>
                <text x="38" y="91" class="flow-map__legend-item">菱形 · 海外口岸</text>
                <line x1="10" y1="108" x2="34" y2="108" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>
                <text x="40" y="112" class="flow-map__legend-item">粗 · 大宗</text>
                <line x1="10" y1="122" x2="34" y2="122" stroke="${C.bamboo}" stroke-width="2.6" stroke-linecap="round"/>
                <text x="40" y="126" class="flow-map__legend-item">中 · 跨区</text>
                <line x1="10" y1="136" x2="34" y2="136" stroke="${C.pine}" stroke-width="1.4" stroke-linecap="round" marker-end="url(#flow-arrow-sm)"/>
                <text x="40" y="140" class="flow-map__legend-item">细 · 内销</text>
            </g>
        `;
    }

    function drawFlowLabels() {
        const blocks = layoutFlowLabels();
        return blocks.map((block) => {
            const w = 182;
            const lineGap = 13;
            const h = 12 + block.lines.length * lineGap;
            const lines = block.lines.map((line, i) =>
                `<tspan x="${block.x}" dy="${i === 0 ? 0 : lineGap}">${esc(line)}</tspan>`
            ).join("");
            return `<g><rect x="${block.x - 6}" y="${block.y - 12}" width="${w}" height="${h}" rx="3" fill="rgba(245,242,232,0.92)" stroke="${C.mist}" stroke-width="0.5"/><text x="${block.x}" y="${block.y}" class="flow-map__flow-note">${lines}</text></g>`;
        }).join("");
    }

    function buildSvg(geoJson) {
        layoutNodes();
        const nodeIds = Object.keys(nodes);
        return `
            <svg class="flow-map__svg" viewBox="0 0 ${VB.w} ${VB.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="出山入海货物流向图">
                ${buildDefs()}
                ${drawMapFrame()}
                ${drawBaseMap(geoJson)}
                ${drawGeoAnchors()}
                ${drawFlows()}
                ${nodeIds.map(drawNode).join("")}
                ${drawFlowLabels()}
                ${drawLegend()}
            </svg>
        `;
    }

    function buildFootnotes() {
        return footnotes.map((item) => {
            if (item.kind === "narrative") {
                return `<p class="flow-map__note flow-map__note--narrative">${esc(item.text)}</p>`;
            }
            return `<p class="flow-map__note"><span class="flow-map__note-label">${esc(item.label)}：</span>${esc(item.text)}</p>`;
        }).join("");
    }

    function renderBoard(geoJson) {
        dom.className = "flow-map-board";
        dom.innerHTML = `
            <div class="flow-map__canvas">${buildSvg(geoJson)}</div>
            <div class="flow-map__footnotes" aria-label="图表解读">${buildFootnotes()}</div>
            <footer class="flow-map__source">${esc(SOURCE)}</footer>
        `;
        bindNodeTooltips(dom);
    }

    function loadGeoJson() {
        return new Promise((resolve, reject) => {
            if (window.GUIZHOU_GEOJSON) {
                resolve(window.GUIZHOU_GEOJSON);
                return;
            }
            fetch("data/guizhou.json")
                .then((r) => (r.ok ? r.json() : Promise.reject()))
                .then(resolve)
                .catch(reject);
        });
    }

    function init() {
        loadGeoJson()
            .then((geo) => renderBoard(geo))
            .catch(() => renderBoard(null));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
