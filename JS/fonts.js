(function () {
    var FONT = "Noto Serif SC, Source Han Serif SC, SimSun, serif";
    window.BRIDGE_FONT = FONT;

    window.BRIDGE_LABEL_LAYOUT = {
        hideOverlap: true,
        moveOverlap: "shiftY"
    };

    function patchEcharts() {
        if (!window.echarts || window.__bridgeFontPatched) return;
        window.__bridgeFontPatched = true;

        echarts.registerTheme("bridge", {
            textStyle: { fontFamily: FONT }
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
