// ======================================
// 花渔洞大桥 · 碳足迹数据山水
// 四座生态转化峰：Gaussian 叠山曲线
// ======================================

(function () {

    const dom = document.getElementById("huayudongCarbon");
    if (!dom) return;

    const T = window.BRIDGE_CHART || {};
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";

    const peaks = [
        { name: "植树造林", x: 0, height: 83, unit: "83 万棵", color: "#4A7C65" },
        { name: "停驶汽车", x: 1, height: 60, unit: "6000 辆", color: "#6D9B8B" },
        { name: "家庭省电", x: 2, height: 100, unit: "1 万户", color: "#BF8C60" },
        { name: "工业减排", x: 3, height: 28, unit: "2 个工厂", color: "#8CBFAA" }
    ];

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
            let y = 0;
            peaks.forEach((p) => {
                const dx = x - p.x;
                y += p.height * Math.exp(-dx * dx * 3.2);
            });
            points.push([x, y + 0.4]);
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

    const chart = echarts.init(dom);

    chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(255,255,255,0.96)",
            borderColor: "rgba(74, 124, 101, 0.28)",
            textStyle: { color: "#4A7C65", fontSize: T.tooltip || 13, fontFamily: FONT },
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
        grid: { left: 6, right: 6, top: 28, bottom: 28, containLabel: true },
        xAxis: {
            type: "value",
            min: -0.7,
            max: 3.7,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
                color: "#4A7C65",
                fontSize: T.axisSm || 10,
                fontWeight: 600,
                fontFamily: FONT,
                margin: 10,
                formatter(val) {
                    const p = peaks.find((d) => Math.abs(d.x - val) < 0.3);
                    return p ? p.name : "";
                }
            }
        },
        yAxis: {
            type: "value",
            max: 115,
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
                    width: 2,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: "#4A7C65" },
                        { offset: 0.35, color: "#6D9B8B" },
                        { offset: 0.65, color: "#BF8C60" },
                        { offset: 1, color: "#8CBFAA" }
                    ]),
                    shadowBlur: 16,
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
                data: peaks.map((p) => ({
                    value: [p.x, peakYAt(p.x)],
                    unit: p.unit,
                    color: p.color
                })),
                symbolSize: 0,
                silent: true,
                label: {
                    show: true,
                    position: "top",
                    distance: 6,
                    formatter(params) {
                        return params.data.unit;
                    },
                    color: "#345a4a",
                    fontSize: T.dataSm || 11,
                    fontWeight: 700,
                    fontFamily: FONT,
                    backgroundColor: "rgba(252, 248, 240, 0.92)",
                    padding: [3, 6],
                    borderRadius: 4,
                    borderColor: "rgba(74, 124, 101, 0.2)",
                    borderWidth: 1
                }
            }
        ]
    });

    function resizeChart() {
        chart.resize();
    }

    window.addEventListener("resize", resizeChart);
    window.addEventListener("load", () => setTimeout(resizeChart, 100));

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) resizeChart(); });
        }, { threshold: 0.1 }).observe(dom);
    }

})();
