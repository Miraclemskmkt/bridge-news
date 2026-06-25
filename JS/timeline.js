// =====================================
// 村超经济气泡时间轴 · 分层多模块版
// =====================================

(function () {

    const dom = document.getElementById("villageSuper");
    if (!dom) return;

    const INK = "#4A7C65";
    const GRAY = "#7A7A7A";
    const LINE = "#B8B8B8";
    const GRID = "#E5E2D8";

    const years = [
        {
            year: 2023,
            tourists: 760,
            income: 84,
            keyword: "初步出圈",
            lines: [
                "全年游客：760 万人次",
                "年度旅游收入：84 亿元",
                "新增经营主体：2764 户",
                "配套消费：夜间消费 4.48 亿元｜农产线下销售 6.26 亿元"
            ],
            side: "赛事周期 5-10 月客流 519 万人次，赛事收入 59.86 亿元"
        },
        {
            year: 2024,
            tourists: 1169.24,
            income: 130.7,
            keyword: "流量峰值",
            lines: [
                "全年游客：1169.24 万人次",
                "年度旅游总收入：130.7 亿元",
                "赛事直接带动收入：108 亿元",
                "配套业态：新增民宿 358 家｜餐饮营收 13.41 亿元",
                "农产品电商：农产网销 7.08 亿元"
            ],
            side: "当年累计返乡创业者新增 800 人，带动 4000 人就近就业"
        },
        {
            year: 2025,
            tourists: 1038.68,
            income: 118,
            keyword: "稳定长效发展",
            lines: [
                "全年游客：1038.68 万人次",
                "全年旅游收入：118 亿元",
                "1-11 月同比：游客 +10.93%、收入 +10.44%",
                "配套存量：全县床位 1.2 万余个、四星酒店 8 家"
            ],
            side: "三年累计返乡创业者 2000 余人，返乡项目年产值 1.2 亿元"
        }
    ];

    const summaryMain = [
        "出圈三年累计游客：2750 万人次",
        "三年累计旅游综合收入：312 亿元",
        "三年累计新增经营主体：9759 户",
        "累计带动本地就近就业：6000 人"
    ];

    const summaryFlow = [
        "覆盖全国省级行政区：34 个",
        "外省参赛球队总量：1750 + 支",
        "累计跨省游客：1237.5 万人次",
        "常态化省外游客占比：40%–55%"
    ];

    const footerRow1 = "本地世居参与民族 20 余个；到访游客覆盖全国 56 个民族；参赛涉及 62 个国家外籍球员";
    const footerRow2 = "年度民族文化展演超 100 场；多民族混合参赛队伍 137 支";

    const maxTourists = Math.max.apply(null, years.map((y) => y.tourists));
    const CHART_SCALE = 0.92;

    function bubbleR(tourists, maxR) {
        return maxR * Math.sqrt(tourists / maxTourists);
    }

    function buildSvg() {
        const W = Math.round(292 * CHART_SCALE);
        const H = Math.round(252 * CHART_SCALE);
        const padL = Math.round(34 * CHART_SCALE);
        const padR = Math.round(6 * CHART_SCALE);
        const padT = Math.round(38 * CHART_SCALE);
        const padB = Math.round(22 * CHART_SCALE);
        const maxR = Math.round(22 * CHART_SCALE);
        const tagH = Math.round(16 * CHART_SCALE);
        const tagPad = Math.round(6 * CHART_SCALE);
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;
        const yMax = 140;
        const xSlots = years.map((_, i) => padL + (plotW / 2) + (i - 1) * (plotW / 3));

        function yScale(v) {
            return padT + plotH - (v / yMax) * plotH;
        }

        let svg = `<svg class="cunchao-timeline__svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;

        for (let tick = 0; tick <= yMax; tick += 20) {
            const y = yScale(tick);
            const isAxis = tick === 0;
            svg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="${isAxis ? LINE : GRID}" stroke-width="${isAxis ? 1 : 0.6}" ${isAxis ? "" : 'stroke-dasharray="3 3"'}"/>`;
            svg += `<text x="${padL - 6}" y="${y + 3}" text-anchor="end" class="cunchao-timeline__tick">${tick}</text>`;
        }

        svg += `<text x="${padL - 6}" y="${padT - 18}" text-anchor="end" class="cunchao-timeline__ylabel">收入（亿元）</text>`;
        svg += `<line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="${LINE}" stroke-width="1"/>`;

        years.forEach((item, i) => {
            const cx = xSlots[i];
            const cy = yScale(item.income);
            const r = bubbleR(item.tourists, maxR);
            const tagW = item.keyword.length * Math.round(7.5 * CHART_SCALE) + Math.round(12 * CHART_SCALE);
            const tagX = cx - tagW / 2;

            svg += `<line x1="${cx}" y1="${padT - tagPad}" x2="${cx}" y2="${padT + plotH}" stroke="${GRID}" stroke-width="0.6" stroke-dasharray="3 3"/>`;
            svg += `<rect x="${tagX}" y="${tagPad}" width="${tagW}" height="${tagH}" rx="1" fill="none" stroke="${LINE}" stroke-width="0.8"/>`;
            svg += `<text x="${cx}" y="${tagPad + tagH - 3}" text-anchor="middle" class="cunchao-timeline__tag">${item.keyword}</text>`;

            svg += `<g class="cunchao-bubble-hit" data-index="${i}">`;
            svg += `<circle class="cunchao-bubble" cx="${cx}" cy="${cy}" r="${r}" fill="#F5F2E8" stroke="${INK}" stroke-width="1"/>`;
            svg += `<circle cx="${cx}" cy="${cy}" r="1.8" fill="${INK}" pointer-events="none"/>`;
            svg += `</g>`;

            svg += `<text x="${cx}" y="${padT + plotH + 13}" text-anchor="middle" class="cunchao-timeline__year">${item.year}年</text>`;
        });

        svg += `<text x="${padL + plotW / 2}" y="${H - 2}" text-anchor="middle" class="cunchao-timeline__xlabel">发展年份</text>`;
        svg += "</svg>";
        return svg;
    }

    function tooltipHtml(item) {
        const rows = item.lines.map((l) => `<li>${l}</li>`).join("");
        return `<strong>${item.year} · ${item.keyword}</strong><ul>${rows}</ul>`;
    }

    function bindTooltips(centerEl) {
        const tip = document.createElement("div");
        tip.className = "cunchao-timeline__tooltip";
        tip.setAttribute("role", "tooltip");
        tip.hidden = true;
        centerEl.appendChild(tip);

        const svg = centerEl.querySelector(".cunchao-timeline__svg");
        const hits = centerEl.querySelectorAll(".cunchao-bubble-hit");

        function placeTip(clientX, clientY) {
            const rect = centerEl.getBoundingClientRect();
            let left = clientX - rect.left + 12;
            let top = clientY - rect.top - 10;
            tip.hidden = false;
            const tw = tip.offsetWidth;
            const th = tip.offsetHeight;
            if (left + tw > rect.width - 4) left = clientX - rect.left - tw - 12;
            if (top + th > rect.height - 4) top = rect.height - th - 4;
            if (top < 4) top = 4;
            tip.style.left = `${left}px`;
            tip.style.top = `${top}px`;
        }

        hits.forEach((hit) => {
            const item = years[Number(hit.dataset.index)];

            hit.addEventListener("mouseenter", (e) => {
                tip.innerHTML = tooltipHtml(item);
                hit.querySelector(".cunchao-bubble").classList.add("is-active");
                placeTip(e.clientX, e.clientY);
            });

            hit.addEventListener("mousemove", (e) => {
                placeTip(e.clientX, e.clientY);
            });

            hit.addEventListener("mouseleave", () => {
                tip.hidden = true;
                hit.querySelector(".cunchao-bubble").classList.remove("is-active");
            });
        });

        svg.querySelectorAll(".cunchao-bubble-hit").forEach((g) => {
            g.style.cursor = "pointer";
        });
    }

    const leftHtml = years.map((y) =>
        `<div class="cunchao-timeline__side-item"><span class="cunchao-timeline__side-year">${y.year}年</span><p>${y.side}</p></div>`
    ).join("");

    const summaryMainHtml = summaryMain.map((t) => `<li>${t}</li>`).join("");
    const summaryFlowHtml = summaryFlow.map((t) => `<li>${t}</li>`).join("");

    dom.className = "chart-container chart-container--bubble cunchao-timeline";
    dom.innerHTML = `
        <header class="cunchao-timeline__header" aria-label="图表标题区"></header>
        <div class="cunchao-timeline__body">
            <div class="cunchao-timeline__chart-row">
                <aside class="cunchao-timeline__left" aria-label="年度细分信息">${leftHtml}</aside>
                <div class="cunchao-timeline__center">
                    <p class="cunchao-timeline__axis-title">年度旅游综合收入</p>
                    ${buildSvg()}
                </div>
            </div>
            <div class="cunchao-timeline__summary" aria-label="三年累计总览">
                <div class="cunchao-timeline__panel">
                    <h4 class="cunchao-timeline__panel-title">三年累计经济总数据</h4>
                    <ul class="cunchao-timeline__panel-list">${summaryMainHtml}</ul>
                </div>
                <div class="cunchao-timeline__panel">
                    <h4 class="cunchao-timeline__panel-title">跨区域客流数据</h4>
                    <ul class="cunchao-timeline__panel-list">${summaryFlowHtml}</ul>
                </div>
            </div>
        </div>
        <footer class="cunchao-timeline__footer">
            <p class="cunchao-timeline__footer-row">${footerRow1}</p>
            <div class="cunchao-timeline__footer-divider"></div>
            <p class="cunchao-timeline__footer-row">${footerRow2}</p>
        </footer>
    `;

    bindTooltips(dom.querySelector(".cunchao-timeline__center"));

})();
