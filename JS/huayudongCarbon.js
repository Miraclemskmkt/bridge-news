// ======================================
// 花渔洞大桥 · 碳足迹数据山水
// 四座生态转化峰：Gaussian 叠山 + 标注散点
// ======================================

(function () {

    const dom = document.getElementById("huayudongCarbon");
    if (!dom) return;

    const T = window.BRIDGE_CHART || {};
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";

    const peaks = [
        { name: "植树造林", x: 0, height: 83, unit: "83 万棵", color: "#4A7C65" },
        { name: "停驶汽车", x: 1, height: 60, unit: "6000 辆", color: "#BF8C60" },
        { name: "家庭省电", x: 2, height: 100, unit: "1 万户", color: "#6D9B8B" },
        { name: "工业减排", x: 3, height: 28, unit: "2 个工厂", color: "#8F3F3F" }
    ];

    function buildMountainCurve() {
        const points = [];
        for (let x = -1; x <= 4; x += 0.08) {
            let y = 0;
            peaks.forEach((p) => {
                const dx = x - p.x;
                y += p.height * Math.exp(-dx * dx * 3.2);
            });
            points.push([x, y + 0.5]);
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
        return min < 0.6 ? best : null;
    }

    const chart = echarts.init(dom);

    chart.setOption({
        backgroundColor: "transparent",
        title: {
            text: "碳足迹 · 数据山水",
            subtext: "花渔洞大桥 · 1.5 万吨碳排放的生态群山",
            left: "center",
            top: 6,
            textStyle: {
                color: "#4A7C65",
                fontSize: T.subtitle || 14,
                fontWeight: 600,
                fontFamily: FONT,
                letterSpacing: 2
            },
            subtextStyle: {
                color: "#7A7A7A",
                fontSize: T.axisSm || 10,
                fontFamily: FONT
            }
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(255,255,255,0.96)",
            borderColor: "rgba(74, 124, 101, 0.25)",
            textStyle: { color: "#4A7C65", fontSize: T.tooltip || 13, fontFamily: FONT },
            formatter(items) {
                const p = items && items[0];
                if (!p || !p.data) return "";
                const hit = nearestPeak(p.data[0]);
                if (hit) {
                    return `<strong>${hit.name}</strong><br/>相当于 <span style="color:${hit.color};font-weight:700;">${hit.unit}</span>`;
                }
                return `叠山高度 ${p.data[1].toFixed(1)}% · 碳转化路径`;
            }
        },
        grid: { left: 8, right: 8, top: 56, bottom: 36, containLabel: true },
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
                fontFamily: FONT,
                formatter(val) {
                    const p = peaks.find((d) => Math.abs(d.x - val) < 0.3);
                    return p ? p.name : "";
                }
            }
        },
        yAxis: {
            type: "value",
            max: 110,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: "rgba(140, 191, 170, 0.16)", type: "dashed" } },
            axisLabel: {
                color: "#B8B8B8",
                fontSize: T.axisSm || 10,
                formatter: "{value}%"
            }
        },
        series: [
            {
                name: "碳减排山体",
                type: "line",
                data: buildMountainCurve(),
                smooth: true,
                symbol: "none",
                lineStyle: {
                    width: 2.5,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: "#4A7C65" },
                        { offset: 0.33, color: "#BF8C60" },
                        { offset: 0.66, color: "#6D9B8B" },
                        { offset: 1, color: "#8F3F3F" }
                    ]),
                    shadowBlur: 12,
                    shadowColor: "rgba(74, 124, 101, 0.18)"
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(140, 191, 170, 0.28)" },
                        { offset: 0.45, color: "rgba(209, 231, 221, 0.12)" },
                        { offset: 1, color: "rgba(245, 242, 232, 0)" }
                    ])
                }
            },
            {
                name: "生态标注",
                type: "scatter",
                data: peaks.map((p) => ({
                    value: [p.x, p.height + 2],
                    unit: p.unit,
                    name: p.name,
                    color: p.color
                })),
                symbol: "pin",
                symbolSize: 22,
                itemStyle: {
                    color(params) {
                        return params.data.color;
                    },
                    borderColor: "#fff",
                    borderWidth: 1.5,
                    shadowBlur: 10,
                    shadowColor: "rgba(74, 124, 101, 0.25)"
                },
                label: {
                    show: true,
                    position: "top",
                    distance: 10,
                    formatter(params) {
                        return params.data.unit;
                    },
                    color: "#4A7C65",
                    fontSize: T.dataSm || 11,
                    fontWeight: 700,
                    fontFamily: FONT
                },
                emphasis: { scale: 1.35 }
            }
        ],
        graphic: [{
            type: "text",
            left: "center",
            bottom: 6,
            style: {
                text: "1.5 万吨碳排放 · 四大生态转化路径",
                fill: "#7A7A7A",
                fontSize: T.axisSm || 10,
                fontFamily: FONT,
                textAlign: "center"
            }
        }]
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
