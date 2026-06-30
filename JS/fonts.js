(function () {
    var FONT = "Noto Serif SC, Source Han Serif SC, SimSun, serif";
    window.BRIDGE_FONT = FONT;

    window.BRIDGE_LABEL_LAYOUT = {
        hideOverlap: true,
        moveOverlap: "shiftY"
    };

    /** 全页图表字号规范：主图清晰，密集图可读 */
    window.BRIDGE_CHART = {
        font: FONT,
        axis: 12,
        axisSm: 11,
        data: 14,
        dataSm: 12,
        legend: 12,
        tooltip: 14,
        tooltipSm: 13,
        subtitle: 14,
        dense: 10,
        sourceNote: 11.5,
        sourceLine: 18,
        ink: "#4A7C65",
        gray: "#7A7A7A",
        light: "#B8B8B8"
    };

    /** 读取图表容器实际高度，供 Plotly layout 与 CSS clamp 配合 */
    window.BRIDGE_CHART_HEIGHT = function (el, fallback) {
        if (!el) return fallback || 320;
        var h = el.clientHeight;
        return h > 24 ? h : (fallback || 320);
    };

    function applyResponsiveChartTokens() {
        var w = window.innerWidth;
        var base = {
            font: FONT,
            axis: 12,
            axisSm: 11,
            data: 14,
            dataSm: 12,
            legend: 12,
            tooltip: 14,
            tooltipSm: 13,
            subtitle: 14,
            dense: 10,
            ink: "#4A7C65",
            gray: "#7A7A7A",
            light: "#B8B8B8"
        };
        if (w <= 360) {
            window.BRIDGE_CHART = Object.assign({}, base, {
                axis: 10, axisSm: 9, data: 12, dataSm: 10,
                legend: 10, subtitle: 12, dense: 9, tooltip: 12
            });
        } else if (w <= 420) {
            window.BRIDGE_CHART = Object.assign({}, base, {
                axis: 11, axisSm: 10, data: 13, dataSm: 11,
                legend: 11, subtitle: 13, dense: 9
            });
        } else {
            window.BRIDGE_CHART = base;
        }
    }

    applyResponsiveChartTokens();
    window.addEventListener("resize", applyResponsiveChartTokens);

    /** 图表数值单位格式化 */
    window.BRIDGE_FMT = {
        wanRenCi: (n) => `${n} 万人次`,
        yiYuan: (n) => `${n} 亿元`,
        wanHu: (n) => `${n} 万户`,
        qianTon: (n) => `${n} 千吨 CO₂e`,
        km: (n) => `${n} 公里`,
        yuan: (n) => `${n} 元`,
        fen: (n) => `${n} 分`,
        nian: (n) => `${n} 年`,
        pct: (n) => `${n}%`,
        ge: (n) => `${n} 个`,
        zuo: (n) => `${n} 座`,
        hu: (n) => `${n} 户`,
        ren: (n) => `${n} 人`
    };

    function patchEcharts() {
        if (!window.echarts || window.__bridgeFontPatched) return;
        window.__bridgeFontPatched = true;

        var T = window.BRIDGE_CHART;

        echarts.registerTheme("bridge", {
            textStyle: { fontFamily: FONT, fontSize: T.axis, color: T.gray },
            categoryAxis: {
                axisLabel: { fontSize: T.axis, color: T.gray },
                nameTextStyle: { fontSize: T.axis, color: T.gray }
            },
            valueAxis: {
                axisLabel: { fontSize: T.axis, color: T.light },
                nameTextStyle: { fontSize: T.axis, color: T.gray }
            },
            legend: { textStyle: { fontSize: T.legend, color: T.ink } },
            title: {
                textStyle: { fontSize: T.subtitle, color: T.gray, fontWeight: "normal" }
            },
            tooltip: {
                textStyle: { fontSize: T.tooltip, color: T.ink, fontFamily: FONT }
            }
        });

        var init = echarts.init;
        echarts.init = function (dom, theme, opts) {
            if (theme === undefined || theme === null) theme = "bridge";
            return init.call(echarts, dom, theme, opts);
        };
    }

    patchEcharts();
    document.addEventListener("DOMContentLoaded", patchEcharts);
})();
