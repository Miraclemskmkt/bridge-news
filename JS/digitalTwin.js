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
    const MOBILE_BP = 520;

    const DESKTOP_SENSORS = [
        {
            x: 52, y: 24,
            color: C.bamboo,
            label: "主缆 217 根\n智慧光纤光栅索",
            lx: 20, ly: 10
        },
        {
            x: 62, y: 38,
            color: C.pine,
            label: "钢箱梁 800+\n分布式传感点位",
            lx: 18, ly: 34
        },
        {
            x: 38, y: 48,
            color: C.ink,
            label: "索塔旁 14 级\n强风气象监测站",
            lx: 16, ly: 58
        },
        {
            x: 72, y: 54,
            color: C.mist,
            label: "桥面车载\n监测点",
            lx: 22, ly: 82
        }
    ];

    const MOBILE_SENSORS = [
        {
            x: 46, y: 20,
            color: C.bamboo,
            label: "主缆 217 根\n智慧光纤光栅索",
            lx: 3, ly: 4
        },
        {
            x: 78, y: 28,
            color: C.pine,
            label: "钢箱梁 800+\n分布式传感点位",
            lx: 54, ly: 4
        },
        {
            x: 30, y: 54,
            color: C.ink,
            label: "索塔旁 14 级\n强风气象监测站",
            lx: 3, ly: 72
        },
        {
            x: 80, y: 58,
            color: C.mist,
            label: "桥面车载\n监测点",
            lx: 54, ly: 72
        }
    ];

    function isMobileTwin() {
        return window.innerWidth <= MOBILE_BP;
    }

    function getSensors() {
        return isMobileTwin() ? MOBILE_SENSORS : DESKTOP_SENSORS;
    }

    function buildOption() {
        const T = window.BRIDGE_CHART || {};
        const mobile = isMobileTwin();
        const sensors = getSensors();
        const fontSize = mobile ? Math.max(T.axisSm || 10, 10) : (T.axisSm || 11);
        const lineHeight = mobile ? 16 : 14;
        const symbolSize = mobile ? 8 : 7;
        const grid = mobile
            ? { left: 2, right: 2, top: 4, bottom: 4 }
            : { left: 6, right: 4, top: 4, bottom: 4 };

        const flowLines = sensors.map((s) => ({
            coords: [[s.x, s.y], [mobile ? 90 : 92, s.y - 4]]
        }));

        const labelLines = sensors.map((s) => ({
            coords: [[s.x, s.y], [s.lx + (mobile ? 8 : 6), s.ly + 5]]
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
                        symbolSize: mobile ? 4 : 5,
                        color: C.bamboo,
                        trailLength: 0
                    },
                    lineStyle: { color: C.bamboo, width: 1.2, opacity: 0.75, curveness: 0.08 },
                    data: flowLines
                },
                {
                    type: "scatter",
                    symbolSize: symbolSize,
                    data: sensors.map((s) => ({
                        value: [s.x, s.y],
                        itemStyle: { color: s.color, borderColor: "#fff", borderWidth: 1.5 }
                    })),
                    silent: true
                },
                {
                    type: "scatter",
                    symbolSize: 0,
                    data: sensors.map((s) => [s.lx, s.ly]),
                    label: {
                        show: true,
                        position: "right",
                        distance: 2,
                        formatter: (p) => sensors[p.dataIndex].label,
                        color: "#345a4a",
                        fontSize: fontSize,
                        lineHeight: lineHeight,
                        fontFamily: FONT,
                        fontWeight: 500,
                        backgroundColor: "rgba(245,242,232,0.94)",
                        padding: mobile ? [5, 8] : [4, 7],
                        borderRadius: 6,
                        borderColor: "rgba(74,124,101,0.42)",
                        borderWidth: 1
                    },
                    silent: true
                }
            ]
        };
    }

    function initBridgeMap() {
        const dom = document.getElementById("twinBridgeMap");
        if (!dom) return;

        const chart = echarts.init(dom);
        chart.setOption(buildOption());

        dom._chart = chart;
        dom._twinMode = isMobileTwin() ? "mobile" : "desktop";
    }

    function refreshBridgeMap() {
        const dom = document.getElementById("twinBridgeMap");
        if (!dom || !dom._chart) return;

        const mode = isMobileTwin() ? "mobile" : "desktop";
        if (dom._twinMode !== mode) {
            dom._twinMode = mode;
        }
        dom._chart.setOption(buildOption(), true);
        dom._chart.resize();
    }

    function resizeAll() {
        refreshBridgeMap();
    }

    function init() {
        if (!document.getElementById("digitalTwin")) return;
        initBridgeMap();
        const bgImg = document.querySelector("#digitalTwin .twin-bg-img");
        if (bgImg) {
            if (bgImg.complete) resizeAll();
            else bgImg.addEventListener("load", resizeAll);
        }
        window.addEventListener("resize", resizeAll);
        window.addEventListener("load", () => setTimeout(resizeAll, 120));
        if ("IntersectionObserver" in window) {
            const root = document.getElementById("digitalTwin");
            new IntersectionObserver((entries) => {
                entries.forEach((e) => { if (e.isIntersecting) resizeAll(); });
            }, { threshold: 0.08 }).observe(root);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
