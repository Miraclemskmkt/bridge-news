// ======================================
// 山区大跨桥梁 50 年全生命周期碳足迹对比
// ======================================

(function () {

    const dom = document.getElementById("carbonLife");
    if (!dom) return;

    const chart = echarts.init(dom);
    const labelLayout = window.BRIDGE_LABEL_LAYOUT || { hideOverlap: true, moveOverlap: "shiftY" };

    const bridges = [
        { key: "普通混凝土高桥", short: "普通混凝土\n高桥", total: 3200, tag: "传统方案" },
        { key: "绿色钢混组合高桥", short: "绿色钢混\n组合高桥", total: 2720, tag: "建材优化 · 降碳15%" },
        { key: "智能长效运维高桥", short: "智能长效\n运维高桥", total: 2100, tag: "绿色建材+数字孪生 · 降碳34%" }
    ];

    const phases = [
        { name: "建材生产", color: "#4A7C65", values: [2304, 1958, 1958] },
        { name: "现场施工", color: "#6D9B8B", values: [416, 372, 372] },
        { name: "运营养护", color: "#8CBFAA", values: [384, 326, 116] },
        { name: "拆除回收", color: "#B8D4C8", values: [96, 64, 54] }
    ];

    chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            backgroundColor: "rgba(255,255,255,0.94)",
            borderColor: "rgba(74, 124, 101, 0.25)",
            textStyle: { color: "#4A7C65", fontSize: 11 },
            formatter: (items) => {
                if (!items || !items.length) return "";
                const idx = items[0].dataIndex;
                const bridge = bridges[idx];
                let html = `${bridge.key}<br/><span style="color:#7A7A7A;font-size:10px">${bridge.tag}</span><br/>`;
                let sum = 0;
                items.forEach((p) => {
                    sum += p.value;
                    html += `${p.marker}${p.seriesName}：${p.value} 千吨 CO₂e<br/>`;
                });
                html += `<strong>全周期合计：${bridge.total} 千吨 CO₂e</strong>`;
                return html;
            }
        },
        legend: {
            bottom: 4,
            itemWidth: 10,
            itemHeight: 8,
            itemGap: 8,
            textStyle: { color: "#7A7A7A", fontSize: 9 },
            data: phases.map((p) => p.name)
        },
        grid: {
            left: 8,
            right: 8,
            top: 28,
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
                fontSize: 8,
                lineHeight: 13,
                interval: 0,
                margin: 8
            }
        },
        yAxis: {
            type: "value",
            name: "千吨 CO₂e",
            nameTextStyle: { color: "#7A7A7A", fontSize: 9, padding: [0, 0, 0, 4] },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
                lineStyle: { color: "rgba(140, 191, 170, 0.14)", type: "dashed" }
            },
            axisLabel: {
                color: "#B8B8B8",
                fontSize: 8
            }
        },
        series: phases.map((phase) => ({
            name: phase.name,
            type: "bar",
            barMaxWidth: 14,
            barGap: "18%",
            data: phase.values.map((v) => ({
                value: v,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: phase.color },
                        { offset: 1, color: phase.color + "aa" }
                    ]),
                    borderRadius: [4, 4, 0, 0]
                }
            })),
            labelLayout,
            label: {
                show: true,
                position: "top",
                fontSize: 7,
                color: "#4A7C65",
                formatter: (p) => (p.value >= 200 ? p.value : "")
            },
            emphasis: { focus: "series" }
        })),
        graphic: bridges.map((b, i) => ({
            type: "text",
            left: `${20 + i * 30}%`,
            top: 10,
            style: {
                text: `合计 ${b.total}`,
                fill: "#4A7C65",
                font: "bold 9px Noto Serif SC, SimSun, serif",
                textAlign: "center"
            }
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
