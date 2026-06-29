// =====================================
// 桥梁养护资金 21.24 亿元投向
// 数据：《2024 年贵州省交通运输行业发展统计公报》等
// =====================================

(function () {

    const T = window.BRIDGE_CHART || {};
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";

    const tooltipStyle = {
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "rgba(74, 124, 101, 0.25)",
        textStyle: { color: "#4A7C65", fontSize: T.tooltip || 13, fontFamily: FONT, lineHeight: 20 }
    };

    const TOTAL = 21.24;

    const mainSplit = [
        {
            name: "干线公路养护工程",
            value: 12.13,
            pct: "57.1%",
            desc: "干线公路养护工程投入"
        },
        {
            name: "农村公路配套养护",
            value: 8.41,
            pct: "39.6%",
            desc: "农村公路配套养护工程"
        },
        {
            name: "桥梁专项修复",
            value: 0.7,
            pct: "3.3%",
            desc: "农村公路桥梁、干线桥梁修复"
        }
    ];

    const splitColors = ["#4A7C65", "#6D9B8B", "#8CBFAA"];

    function splitTooltip(params) {
        const row = mainSplit[params.dataIndex];
        return [
            `<strong>${row.name}</strong>`,
            `金额：${row.value} 亿元（${row.pct}）`,
            row.desc,
            `<span style="color:#B8B8B8;font-size:11px">2024 省级交通养护 · 公路养护+桥梁修复专项合计 ${TOTAL} 亿元</span>`
        ].join("<br/>");
    }

    const roseDom = document.getElementById("maintenanceRose");
    if (!roseDom) return;

    const roseChart = echarts.init(roseDom);

    roseChart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "item",
            ...tooltipStyle,
            formatter: splitTooltip
        },
        legend: {
            bottom: 4,
            itemWidth: 12,
            itemHeight: 10,
            itemGap: 10,
            textStyle: { color: "#4A7C65", fontSize: T.legend || 11, fontFamily: FONT }
        },
        series: [{
            type: "pie",
            radius: ["42%", "68%"],
            center: ["50%", "46%"],
            avoidLabelOverlap: true,
            itemStyle: {
                borderRadius: 6,
                borderColor: "rgba(255,255,255,0.65)",
                borderWidth: 1.5
            },
            label: {
                show: true,
                color: "#4A7C65",
                fontSize: T.dataSm || 11,
                fontWeight: 600,
                fontFamily: FONT,
                formatter: (p) => `${p.name}\n${p.value} 亿元`
            },
            labelLine: {
                length: 12,
                length2: 10,
                lineStyle: { color: "rgba(109,155,139,0.55)" }
            },
            emphasis: {
                scale: true,
                scaleSize: 6
            },
            data: mainSplit.map((d, i) => ({
                name: d.name,
                value: d.value,
                itemStyle: { color: splitColors[i] }
            }))
        }],
        graphic: [{
            type: "text",
            left: "center",
            top: "40%",
            style: {
                text: `${TOTAL} 亿元`,
                fill: "#4A7C65",
                font: `bold ${T.data || 13}px ${FONT}`,
                textAlign: "center"
            }
        }, {
            type: "text",
            left: "center",
            top: "48%",
            style: {
                text: "2024 省级养护",
                fill: "#7A7A7A",
                font: `${T.axisSm || 10}px ${FONT}`,
                textAlign: "center"
            }
        }]
    });

    window.addEventListener("resize", () => roseChart.resize());

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) roseChart.resize();
            });
        }, { threshold: 0.1 }).observe(roseDom);
    }

})();
