// ======================================
// 花渔洞大桥 · 碳足迹数据山水
// 四座生态转化峰：Gaussian 叠山曲线 · 响应式
// ======================================

(function () {

    const dom = document.getElementById("huayudongCarbon");
    if (!dom) return;

    const T = window.BRIDGE_CHART || {};
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const MOBILE_BP = 520;
    const TINY_BP = 380;

    const peaks = [
        { name: "植树造林", short: "造林", x: 0, height: 83, unit: "83 万棵", color: "#4A7C65" },
        { name: "停驶汽车", short: "汽车", x: 1, height: 60, unit: "6000 辆", color: "#6D9B8B" },
        { name: "家庭省电", short: "省电", x: 2, height: 100, unit: "1 万户", color: "#BF8C60" },
        { name: "工业减排", short: "减排", x: 3, height: 28, unit: "2 个工厂", color: "#8CBFAA" }
    ];

    function getLayout() {
        const w = dom.clientWidth > 0 ? dom.clientWidth : window.innerWidth;
        const tiny = w <= TINY_BP || window.innerWidth <= TINY_BP;
        const mobile = w <= MOBILE_BP || window.innerWidth <= MOBILE_BP;
        return { w, tiny, mobile, mode: tiny ? "tiny" : mobile ? "mobile" : "desktop" };
    }

    function peakYAt(x) {
        let y = 0;
        peaks.forEach((p) => {
            const dx = x - p.x;
            y += p.height * Math.exp(-dx * dx * 3.2);
        });
        return y + 0.4;
    }

    function buildMountainCurve() {
        const points = [];
        for (let x = -1; x <= 4; x += 0.06) {
            points.push([x, peakYAt(x)]);
        }
        return points;
    }

    function nearestPeak(x) {
        let best = peaks[0];
        let min = Infinity;
        peaks.forEach((p) => {
            const d = Math.abs(p.x - x);
            if (d < min) {
                min = d;
                best = p;
            }
        });
        return min < 0.55 ? best : null;
    }

    function labelPosition(index, layout) {
        if (layout.tiny) return "top";
        if (layout.mobile) return index % 2 === 0 ? "top" : "bottom";
        return "top";
    }

    function labelDistance(index, layout) {
        if (layout.tiny) return 4;
        if (layout.mobile) return index % 2 === 0 ? 5 : 4;
        return 6;
    }

    function buildOption() {
        const layout = getLayout();
        const axisFont = layout.tiny
            ? Math.max(T.dense || 8, 8)
            : layout.mobile
                ? Math.max(T.axisSm || 9, 9)
                : (T.axisSm || 10);
        const dataFont = layout.tiny
            ? Math.max(T.dense || 8, 8)
            : layout.mobile
                ? Math.max(T.dataSm || 9, 9)
                : (T.dataSm || 11);
        const tooltipFont = layout.tiny ? Math.max(T.tooltipSm || 11, 11) : (T.tooltip || 13);

        const grid = layout.tiny
            ? { left: 4, right: 4, top: 36, bottom: 8, containLabel: true }
            : layout.mobile
                ? { left: 2, right: 2, top: 32, bottom: 36, containLabel: true }
                : { left: 6, right: 6, top: 28, bottom: 28, containLabel: true };

        const xMin = layout.tiny ? -0.55 : layout.mobile ? -0.65 : -0.7;
        const xMax = layout.tiny ? 3.55 : layout.mobile ? 3.65 : 3.7;

        return {
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                confine: true,
                backgroundColor: "rgba(255,255,255,0.96)",
                borderColor: "rgba(74, 124, 101, 0.28)",
                textStyle: { color: "#4A7C65", fontSize: tooltipFont, fontFamily: FONT },
                formatter(items) {
                    const p = items && items[0];
                    if (!p || !p.data) return "";
                    const hit = nearestPeak(p.data[0]);
                    if (hit) {
                        return [
                            `<strong>${hit.name}</strong>`,
                            `相当于 <span style="color:${hit.color};font-weight:800;">${hit.unit}</span>`,
                            `<span style="color:#7A7A7A;font-size:11px;">1.5 万吨碳减排等量换算</span>`
                        ].join("<br/>");
                    }
                    return `叠山高度 ${p.data[1].toFixed(1)}% · 碳转化路径`;
                }
            },
            grid,
            xAxis: {
                type: "value",
                min: xMin,
                max: xMax,
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: {
                    show: !layout.tiny,
                    color: "#4A7C65",
                    fontSize: axisFont,
                    fontWeight: 600,
                    fontFamily: FONT,
                    margin: layout.mobile ? 8 : 10,
                    rotate: layout.mobile && !layout.tiny ? 32 : 0,
                    interval: 0,
                    hideOverlap: true,
                    overflow: "break",
                    width: layout.mobile ? 44 : 56,
                    formatter(val) {
                        const p = peaks.find((d) => Math.abs(d.x - val) < 0.3);
                        if (!p) return "";
                        return layout.mobile ? p.short : p.name;
                    }
                }
            },
            yAxis: {
                type: "value",
                max: layout.mobile ? 120 : 115,
                show: false
            },
            series: [
                {
                    name: "碳减排山体",
                    type: "line",
                    data: buildMountainCurve(),
                    smooth: 0.42,
                    symbol: "none",
                    lineStyle: {
                        width: layout.tiny ? 1.5 : 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: "#4A7C65" },
                            { offset: 0.35, color: "#6D9B8B" },
                            { offset: 0.65, color: "#BF8C60" },
                            { offset: 1, color: "#8CBFAA" }
                        ]),
                        shadowBlur: layout.mobile ? 10 : 16,
                        shadowColor: "rgba(74, 124, 101, 0.2)"
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(140, 191, 170, 0.38)" },
                            { offset: 0.35, color: "rgba(209, 231, 221, 0.22)" },
                            { offset: 0.7, color: "rgba(245, 242, 232, 0.08)" },
                            { offset: 1, color: "rgba(245, 242, 232, 0)" }
                        ])
                    },
                    animationDuration: 2200,
                    animationEasing: "cubicOut"
                },
                {
                    name: "生态标注",
                    type: "scatter",
                    data: peaks.map((p, i) => {
                        const pos = labelPosition(i, layout);
                        const dist = labelDistance(i, layout);
                        return {
                            value: [p.x, peakYAt(p.x)],
                            unit: p.unit,
                            name: p.name,
                            color: p.color,
                            label: {
                                show: true,
                                position: pos,
                                distance: dist,
                                formatter: layout.tiny ? `${p.name}\n${p.unit}` : p.unit,
                                color: "#345a4a",
                                fontSize: dataFont,
                                fontWeight: 700,
                                fontFamily: FONT,
                                lineHeight: layout.tiny ? 13 : 14,
                                backgroundColor: "rgba(252, 248, 240, 0.92)",
                                padding: layout.tiny ? [3, 5] : layout.mobile ? [2, 5] : [3, 6],
                                borderRadius: 4,
                                borderColor: "rgba(74, 124, 101, 0.2)",
                                borderWidth: 1,
                                overflow: "break",
                                width: layout.tiny
                                    ? Math.min(72, Math.round(layout.w * 0.2))
                                    : layout.mobile
                                        ? Math.min(64, Math.round(layout.w * 0.18))
                                        : undefined
                            }
                        };
                    }),
                    symbolSize: 0,
                    silent: true,
                    label: { show: false }
                }
            ]
        };
    }

    const chart = echarts.init(dom);
    let lastMode = getLayout().mode;

    function render() {
        const layout = getLayout();
        if (layout.mode !== lastMode) {
            lastMode = layout.mode;
            chart.setOption(buildOption(), true);
        } else {
            chart.setOption(buildOption());
        }
        chart.resize();
    }

    let resizeTimer;

    function scheduleRender() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(render, 100);
    }

    render();

    window.addEventListener("resize", scheduleRender);
    window.addEventListener("load", () => setTimeout(render, 120));
    window.addEventListener("orientationchange", () => setTimeout(render, 200));

    if ("ResizeObserver" in window) {
        new ResizeObserver(scheduleRender).observe(dom);
    }

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) scheduleRender(); });
        }, { threshold: 0.1 }).observe(dom);
    }

})();
