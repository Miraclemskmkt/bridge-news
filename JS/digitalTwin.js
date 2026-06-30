// ======================================
// 数字孪生·云端桥梁智能体检系统
// 参考国风蓝图：左传感剖面 · 中垂直中台 · 右价值看板
// ======================================

(function () {

    const C = {
        ink: "#4A7C65",
        bamboo: "#6D9B8B",
        pine: "#8CBFAA",
        mist: "#B8D4C8",
        gray: "#7A7A7A"
    };

    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const STACK_BP = 680;
    const MOBILE_BP = 520;
    const TINY_BP = 380;

    const DESKTOP_SENSORS = [
        {
            x: 52, y: 24,
            color: C.bamboo,
            label: "主缆 217 根\n智慧光纤光栅索",
            lx: 20, ly: 10,
            labelPosition: "right"
        },
        {
            x: 62, y: 38,
            color: C.pine,
            label: "钢箱梁 800+\n分布式传感点位",
            lx: 18, ly: 34,
            labelPosition: "right"
        },
        {
            x: 38, y: 48,
            color: C.ink,
            label: "索塔旁 14 级\n强风气象监测站",
            lx: 16, ly: 58,
            labelPosition: "right"
        },
        {
            x: 72, y: 54,
            color: C.mist,
            label: "桥面车载\n监测点",
            lx: 22, ly: 82,
            labelPosition: "right"
        }
    ];

    const MOBILE_SENSORS = [
        {
            x: 28, y: 22,
            color: C.bamboo,
            label: "主缆 217 根\n智慧光纤光栅索",
            lx: 3, ly: 8,
            labelPosition: "right"
        },
        {
            x: 72, y: 26,
            color: C.pine,
            label: "钢箱梁 800+\n分布式传感点位",
            lx: 52, ly: 8,
            labelPosition: "left"
        },
        {
            x: 26, y: 60,
            color: C.ink,
            label: "索塔旁 14 级\n强风气象监测站",
            lx: 3, ly: 72,
            labelPosition: "right"
        },
        {
            x: 74, y: 64,
            color: C.mist,
            label: "桥面车载\n监测点",
            lx: 52, ly: 76,
            labelPosition: "left"
        }
    ];

    const STACKED_SENSORS = [
        {
            x: 22, y: 26,
            color: C.bamboo,
            label: "主缆 217 根\n智慧光纤光栅索",
            lx: 4, ly: 10,
            labelPosition: "right"
        },
        {
            x: 78, y: 30,
            color: C.pine,
            label: "钢箱梁 800+\n分布式传感点位",
            lx: 56, ly: 10,
            labelPosition: "left"
        },
        {
            x: 20, y: 58,
            color: C.ink,
            label: "索塔旁 14 级\n强风气象监测站",
            lx: 4, ly: 68,
            labelPosition: "right"
        },
        {
            x: 80, y: 62,
            color: C.mist,
            label: "桥面车载\n监测点",
            lx: 56, ly: 72,
            labelPosition: "left"
        }
    ];

    const TINY_SENSORS = [
        {
            x: 50, y: 14,
            color: C.bamboo,
            label: "主缆 217 根 · 智慧光纤光栅索",
            lx: 4, ly: 2,
            labelPosition: "right"
        },
        {
            x: 50, y: 32,
            color: C.pine,
            label: "钢箱梁 800+ 分布式传感点位",
            lx: 4, ly: 24,
            labelPosition: "right"
        },
        {
            x: 50, y: 52,
            color: C.ink,
            label: "索塔旁 14 级强风气象监测站",
            lx: 4, ly: 44,
            labelPosition: "right"
        },
        {
            x: 50, y: 72,
            color: C.mist,
            label: "桥面车载监测点",
            lx: 4, ly: 64,
            labelPosition: "right"
        }
    ];

    function getMapEl() {
        return document.getElementById("twinBridgeMap");
    }

    function getTwinContext() {
        const mapEl = getMapEl();
        const mapW = mapEl && mapEl.clientWidth > 0 ? mapEl.clientWidth : window.innerWidth;
        const rootW = document.getElementById("digitalTwin")?.clientWidth || window.innerWidth;
        const refW = Math.min(mapW, rootW);

        const stacked = refW <= STACK_BP || window.innerWidth <= STACK_BP;
        const mobile = refW <= MOBILE_BP || window.innerWidth <= MOBILE_BP;
        const tiny = refW <= TINY_BP || window.innerWidth <= TINY_BP;

        return { stacked, mobile, tiny, mapW: refW };
    }

    function getSensors(ctx) {
        if (ctx.tiny) return TINY_SENSORS;
        if (ctx.mobile) return MOBILE_SENSORS;
        if (ctx.stacked) return STACKED_SENSORS;
        return DESKTOP_SENSORS;
    }

    function getModeKey(ctx) {
        if (ctx.tiny) return "tiny";
        if (ctx.mobile) return "mobile";
        if (ctx.stacked) return "stacked";
        return "desktop";
    }

    function labelMetrics(ctx) {
        const T = window.BRIDGE_CHART || {};
        const w = ctx.mapW;
        if (ctx.tiny) {
            return {
                fontSize: Math.max(9, Math.min(10, Math.round(w * 0.026))),
                lineHeight: 13,
                labelWidth: Math.min(108, Math.round(w * 0.44)),
                padding: [3, 5]
            };
        }
        if (ctx.mobile) {
            return {
                fontSize: Math.max(10, Math.min(11, Math.round(w * 0.025))),
                lineHeight: 14,
                labelWidth: Math.min(96, Math.round(w * 0.36)),
                padding: [4, 6]
            };
        }
        if (ctx.stacked) {
            return {
                fontSize: Math.max(10, Math.min(11, Math.round(w * 0.024))),
                lineHeight: 14,
                labelWidth: Math.min(88, Math.round(w * 0.24)),
                padding: [4, 6]
            };
        }
        return {
            fontSize: T.axisSm || 11,
            lineHeight: 14,
            labelWidth: 78,
            padding: [4, 7]
        };
    }

    function buildOption() {
        const ctx = getTwinContext();
        const sensors = getSensors(ctx);
        const lm = labelMetrics(ctx);
        const symbolSize = ctx.tiny ? 6 : ctx.mobile || ctx.stacked ? 7 : 7;
        const grid = ctx.tiny
            ? { left: 6, right: 6, top: 4, bottom: 4 }
            : ctx.mobile || ctx.stacked
                ? { left: 4, right: 4, top: 6, bottom: 6 }
                : { left: 6, right: 4, top: 4, bottom: 4 };

        const flowTargetX = ctx.tiny ? 88 : ctx.mobile ? 90 : 92;

        const flowLines = sensors.map((s) => ({
            coords: [[s.x, s.y], [flowTargetX, s.y - (ctx.tiny ? 2 : 4)]]
        }));

        const labelLines = sensors.map((s) => ({
            coords: [[s.x, s.y], [s.lx + (ctx.mobile ? 6 : 6), s.ly + 5]]
        }));

        return {
            backgroundColor: "transparent",
            grid: grid,
            xAxis: { min: 0, max: 100, show: false },
            yAxis: { min: 0, max: 100, show: false, inverse: true },
            series: [
                {
                    type: "lines",
                    coordinateSystem: "cartesian2d",
                    silent: true,
                    lineStyle: { color: C.pine, width: 1, type: "dashed", opacity: 0.55, curveness: 0.12 },
                    data: labelLines
                },
                {
                    type: "lines",
                    coordinateSystem: "cartesian2d",
                    silent: true,
                    effect: {
                        show: true,
                        symbol: "arrow",
                        symbolSize: ctx.tiny ? 3 : ctx.mobile ? 4 : 5,
                        color: C.bamboo,
                        trailLength: 0
                    },
                    lineStyle: { color: C.bamboo, width: ctx.tiny ? 1 : 1.2, opacity: 0.75, curveness: 0.08 },
                    data: flowLines
                },
                {
                    type: "scatter",
                    symbolSize: symbolSize,
                    data: sensors.map((s) => ({
                        value: [s.x, s.y],
                        itemStyle: { color: s.color, borderColor: "#fff", borderWidth: 1.5 }
                    })),
                    silent: true,
                    z: 2
                },
                {
                    type: "scatter",
                    symbolSize: 0,
                    data: sensors.map((s) => ({
                        value: [s.lx, s.ly],
                        label: {
                            show: true,
                            position: s.labelPosition || "right",
                            distance: ctx.tiny ? 1 : 2,
                            formatter: s.label,
                            color: "#345a4a",
                            fontSize: lm.fontSize,
                            lineHeight: lm.lineHeight,
                            fontFamily: FONT,
                            fontWeight: 500,
                            backgroundColor: "rgba(245,242,232,0.94)",
                            padding: lm.padding,
                            borderRadius: 6,
                            borderColor: "rgba(74,124,101,0.42)",
                            borderWidth: 1,
                            overflow: "break",
                            width: lm.labelWidth
                        }
                    })),
                    label: { show: false },
                    silent: true,
                    z: 3
                }
            ]
        };
    }

    function initBridgeMap() {
        const dom = getMapEl();
        if (!dom) return;

        const chart = echarts.init(dom);
        chart.setOption(buildOption());

        dom._chart = chart;
        const ctx = getTwinContext();
        dom._twinMode = getModeKey(ctx);
        syncRootLayout(ctx);
    }

    function syncRootLayout(ctx) {
        const root = document.getElementById("digitalTwin");
        if (!root) return;
        root.classList.toggle("twin-blueprint--stacked", ctx.stacked);
    }

    function refreshBridgeMap() {
        const dom = getMapEl();
        if (!dom || !dom._chart) return;

        const ctx = getTwinContext();
        syncRootLayout(ctx);

        const mode = getModeKey(ctx);
        if (dom._twinMode !== mode) {
            dom._twinMode = mode;
        }
        dom._chart.setOption(buildOption(), true);
        dom._chart.resize();
    }

    let resizeTimer;

    function scheduleRefresh() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refreshBridgeMap, 100);
    }

    function init() {
        const root = document.getElementById("digitalTwin");
        if (!root) return;
        initBridgeMap();

        const bgImg = root.querySelector(".twin-bg-img");
        if (bgImg) {
            if (bgImg.complete) scheduleRefresh();
            else bgImg.addEventListener("load", scheduleRefresh);
        }

        window.addEventListener("resize", scheduleRefresh);
        window.addEventListener("load", () => setTimeout(scheduleRefresh, 120));
        window.addEventListener("orientationchange", () => setTimeout(scheduleRefresh, 200));

        const mapEl = getMapEl();
        if (mapEl && "ResizeObserver" in window) {
            const ro = new ResizeObserver(scheduleRefresh);
            ro.observe(mapEl);
            if (root) ro.observe(root);
        }
        if (root && "IntersectionObserver" in window) {
            new IntersectionObserver((entries) => {
                entries.forEach((e) => { if (e.isIntersecting) scheduleRefresh(); });
            }, { threshold: 0.08 }).observe(root);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
