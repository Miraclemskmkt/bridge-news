// =====================================
// 民族地区高质量发展雷达图 (2015 vs 2024) · 响应式
// =====================================

(function () {

    const dom = document.getElementById("developmentRadar");
    if (!dom) return;

    const chart = echarts.init(dom);
    const T = window.BRIDGE_CHART || {};
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const MOBILE_BP = 520;
    const TINY_BP = 380;

    const INDICATORS_FULL = [
        { name: "教育水平", max: 100 },
        { name: "医疗可及性", max: 100 },
        { name: "人均收入", max: 100 },
        { name: "互联网普及", max: 100 },
        { name: "文化保护", max: 100 }
    ];

    const INDICATORS_MOBILE = [
        { name: "教育", max: 100 },
        { name: "医疗", max: 100 },
        { name: "收入", max: 100 },
        { name: "互联", max: 100 },
        { name: "文化", max: 100 }
    ];

    const DATA_2015 = [55, 48, 42, 35, 70];
    const DATA_2024 = [82, 76, 85, 88, 78];

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

    function getIndicators(layout) {
        if (layout.mobile) return INDICATORS_MOBILE;
        return INDICATORS_FULL;
    }

    function buildOption() {
        const layout = getLayout();
        const indicators = getIndicators(layout);
        const titleSize = layout.tiny ? 10 : layout.mobile ? 11 : (T.subtitle || 13);
        const legendSize = layout.tiny ? Math.max(T.dense || 8, 9) : layout.mobile ? Math.max(T.legend || 10, 10) : (T.legend || 11);
        const axisSize = layout.tiny ? Math.max(T.dense || 8, 9) : layout.mobile ? Math.max(T.axisSm || 10, 10) : (T.axis || 11);
        const tooltipSize = layout.tiny ? Math.max(T.tooltipSm || 11, 11) : (T.tooltip || 13);
        const lineW2015 = layout.tiny ? 1.5 : 2;
        const lineW2024 = layout.tiny ? 2 : 2.5;
        const symbolSize = layout.tiny ? 4 : layout.mobile ? 5 : 6;

        return {
            backgroundColor: "transparent",
            title: {
                text: "2015 vs 2024 对比",
                left: "center",
                top: layout.tiny ? 4 : layout.mobile ? 6 : 12,
                textStyle: {
                    color: "#7A7A7A",
                    fontSize: titleSize,
                    fontFamily: FONT,
                    fontWeight: 500
                }
            },
            legend: layout.mobile
                ? {
                    bottom: layout.tiny ? 2 : 4,
                    left: "center",
                    orient: "horizontal",
                    itemGap: layout.tiny ? 14 : 18,
                    itemWidth: layout.tiny ? 14 : 16,
                    itemHeight: layout.tiny ? 8 : 10,
                    data: ["2015年", "2024年"],
                    textStyle: {
                        color: "#4A7C65",
                        fontSize: legendSize,
                        fontWeight: 600,
                        fontFamily: FONT
                    }
                }
                : {
                    top: 38,
                    left: "center",
                    data: ["2015年", "2024年"],
                    textStyle: {
                        color: "#4A7C65",
                        fontSize: legendSize,
                        fontWeight: 600,
                        fontFamily: FONT
                    }
                },
            tooltip: {
                trigger: "item",
                confine: true,
                backgroundColor: "rgba(255,255,255,0.94)",
                borderColor: "rgba(74, 124, 101, 0.25)",
                textStyle: {
                    color: "#4A7C65",
                    fontSize: tooltipSize,
                    fontFamily: FONT
                },
                formatter: (p) => {
                    const rows = INDICATORS_FULL.map((ind, i) =>
                        `${ind.name}：${p.value[i]} 分`
                    );
                    return `<strong>${p.name}</strong><br/>${rows.join("<br/>")}`;
                }
            },
            radar: {
                center: layout.tiny
                    ? ["50%", "46%"]
                    : layout.mobile
                        ? ["50%", "48%"]
                        : ["50%", "56%"],
                radius: layout.tiny ? "36%" : layout.mobile ? "40%" : "55%",
                indicator: indicators,
                axisName: {
                    color: "#4A7C65",
                    fontSize: axisSize,
                    fontWeight: 600,
                    fontFamily: FONT,
                    padding: layout.tiny ? [1, 3] : [2, 4],
                    overflow: "break",
                    width: layout.tiny ? 36 : layout.mobile ? 44 : undefined
                },
                splitLine: { lineStyle: { color: "rgba(140,191,170,0.25)" } },
                splitArea: {
                    areaStyle: {
                        color: ["rgba(209,231,221,0.15)", "rgba(209,231,221,0.05)"]
                    }
                },
                axisLine: { lineStyle: { color: "rgba(140,191,170,0.35)" } }
            },
            series: [{
                type: "radar",
                symbolSize,
                data: [
                    {
                        value: DATA_2015,
                        name: "2015年",
                        lineStyle: { color: "#8CBFAA", width: lineW2015 },
                        itemStyle: { color: "#8CBFAA" },
                        areaStyle: { color: "rgba(140,191,170,0.25)" }
                    },
                    {
                        value: DATA_2024,
                        name: "2024年",
                        lineStyle: { color: "#4A7C65", width: lineW2024 },
                        itemStyle: { color: "#4A7C65" },
                        areaStyle: { color: "rgba(74,124,101,0.3)" }
                    }
                ]
            }]
        };
    }

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
            entries.forEach((e) => {
                if (e.isIntersecting) scheduleRender();
            });
        }, { threshold: 0.1 }).observe(dom);
    }

})();
