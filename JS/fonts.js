(function () {
    var FONT = "Noto Serif SC, Source Han Serif SC, SimSun, serif";
    window.BRIDGE_FONT = FONT;

    window.BRIDGE_LABEL_LAYOUT = {
        hideOverlap: true,
        moveOverlap: "shiftY"
    };

    /** 全页图表字号规范：主图清晰，密集图克制 */
    window.BRIDGE_CHART = {
        font: FONT,
        axis: 11,
        axisSm: 10,
        data: 13,
        dataSm: 11,
        legend: 11,
        tooltip: 13,
        tooltipSm: 12,
        subtitle: 13,
        dense: 9,
        ink: "#4A7C65",
        gray: "#7A7A7A",
        light: "#B8B8B8"
    };

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
