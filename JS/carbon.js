// ======================================
// 山区大跨桥梁 50 年全生命周期碳足迹对比
// ======================================

(function () {

    const dom = document.getElementById("carbonLife");
    if (!dom) return;

    const chart = echarts.init(dom);
    const T = window.BRIDGE_CHART || {};

    const bridges = [
        { key: "普通混凝土高桥", short: "普通混凝土\n高桥", total: 3200, tag: "传统方案" },
        { key: "绿色钢混组合高桥", short: "绿色钢混\n组合高桥", total: 2720, tag: "建材优化 · 降碳15%" },
        { key: "智能长效运维高桥", short: "智能长效\n运维高桥", total: 2100, tag: "绿色建材+数字孪生 · 降碳34%" }
    ];

    const phases = [
        { name: "建材生产", color: "#4A7C65", values: [2304, 1958, 1958] },
        { name: "现场施工", color: "#5E8A78", values: [416, 372, 372] },
        { name: "运营养护", color: "#7AA892", values: [384, 326, 116] },
        { name: "拆除回收", color: "#A3C4B5", values: [96, 64, 54] }
    ];

    function phaseBarColor(color) {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color },
            { offset: 1, color: color + "d9" }
        ]);
    }

    chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            backgroundColor: "rgba(255,255,255,0.94)",
            borderColor: "rgba(74, 124, 101, 0.25)",
            textStyle: { color: "#4A7C65", fontSize: T.tooltip || 13 },
            formatter: (items) => {
                if (!items || !items.length) return "";
                const idx = items[0].dataIndex;
                const bridge = bridges[idx];
                let html = `${bridge.key}<br/><span style="color:#7A7A7A;font-size:11px">${bridge.tag}</span><br/>`;
                items.forEach((p) => {
                    html += `${p.marker}${p.seriesName}：${p.value} 千吨 CO₂e<br/>`;
                });
                html += `<strong>全周期合计：${bridge.total} 千吨 CO₂e</strong>`;
                return html;
            }
        },
        legend: {
            bottom: 4,
            itemWidth: 12,
            itemHeight: 10,
            itemGap: 10,
            textStyle: { color: "#7A7A7A", fontSize: T.legend || 11 },
            data: phases.map((p) => ({
                name: p.name,
                icon: "roundRect",
                itemStyle: { color: p.color, borderColor: p.color }
            }))
        },
        grid: {
            left: 8,
            right: 8,
            top: 16,
            bottom: 52,
            containLabel: true
        },
        xAxis: {
            type: "category",
            data: bridges.map((b) => b.short),
            axisLine: { lineStyle: { color: "rgba(184, 184, 184, 0.65)" } },
            axisTick: { show: false },
            axisLabel: {
                color: "#4A7C65",
                fontSize: T.axis || 11,
                fontWeight: 600,
                lineHeight: 15,
                interval: 0,
                margin: 8
            }
        },
        yAxis: {
            type: "value",
            name: "千吨 CO₂e",
            nameTextStyle: { color: "#7A7A7A", fontSize: T.axis || 11, padding: [0, 0, 0, 4] },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
                lineStyle: { color: "rgba(140, 191, 170, 0.14)", type: "dashed" }
            },
            axisLabel: {
                color: "#B8B8B8",
                fontSize: T.axisSm || 10
            }
        },
        series: phases.map((phase) => ({
            name: phase.name,
            type: "bar",
            color: phase.color,
            barMaxWidth: 16,
            barGap: "18%",
            data: phase.values.map((v) => ({
                value: v,
                itemStyle: {
                    color: phaseBarColor(phase.color),
                    borderColor: phase.color,
                    borderWidth: 0.5,
                    borderRadius: [4, 4, 0, 0]
                }
            })),
            label: { show: false },
            emphasis: { focus: "series" }
        }))
    });

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
