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

    const policyFunds = [
        {
            name: "十四五农村公路日常养护累计",
            value: 33.5,
            note: "含大量村道小桥管护"
        },
        {
            name: "2021—2024 车购税危桥补助",
            value: 21.03,
            note: "安防危桥补助资金"
        },
        {
            name: "省级每年农村公路固定预算",
            value: 5,
            note: "年度固定安排"
        },
        {
            name: "2024 公路桥梁专项修复",
            value: 0.7,
            note: "年度桥梁修复专项"
        }
    ].sort((a, b) => b.value - a.value);

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

    function policyTooltip(params) {
        const row = policyFunds[params.dataIndex];
        return [
            `<strong>${row.name}</strong>`,
            `金额：${row.value} 亿元`,
            row.note
        ].join("<br/>");
    }

    // -------------------------------------
    // 21.24 亿元三分结构（环形图）
    // -------------------------------------

    const roseDom = document.getElementById("maintenanceRose");
    if (roseDom) {
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
    }

    // -------------------------------------
    // 配套桥梁养护政策资金（横向条形图）
    // -------------------------------------

    const treeDom = document.getElementById("maintenanceTree");
    if (!treeDom) return;

    const treeChart = echarts.init(treeDom);

    const maxVal = Math.max.apply(null, policyFunds.map((d) => d.value));

    treeChart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            ...tooltipStyle,
            formatter: (items) => {
                if (!items || !items.length) return "";
                return policyTooltip(items[0]);
            }
        },
        grid: {
            left: 8,
            right: 48,
            top: 12,
            bottom: 8,
            containLabel: true
        },
        xAxis: {
            type: "value",
            max: Math.ceil(maxVal / 5) * 5,
            name: "亿元",
            nameLocation: "end",
            nameGap: 6,
            nameTextStyle: { color: "#7A7A7A", fontSize: T.axisSm || 10, fontFamily: FONT },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: "rgba(140,191,170,0.15)", type: "dashed" } },
            axisLabel: {
                color: "#B8B8B8",
                fontSize: T.axisSm || 10,
                fontFamily: FONT
            }
        },
        yAxis: {
            type: "category",
            inverse: true,
            data: policyFunds.map((d) => d.name),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: "#4A7C65",
                fontSize: T.axisSm || 10,
                fontWeight: 600,
                fontFamily: FONT,
                width: 108,
                overflow: "break",
                lineHeight: 14
            }
        },
        series: [{
            type: "bar",
            data: policyFunds.map((d, i) => ({
                value: d.value,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: i === 0 ? "#6D9B8B" : "#8CBFAA" },
                        { offset: 1, color: i === 0 ? "#4A7C65" : "#6D9B8B" }
                    ]),
                    borderRadius: [0, 8, 8, 0],
                    shadowColor: "rgba(74,124,101,0.15)",
                    shadowBlur: 4,
                    shadowOffsetX: 1
                }
            })),
            barWidth: 16,
            barCategoryGap: "36%",
            label: {
                show: true,
                position: "right",
                distance: 6,
                formatter: "{c} 亿元",
                color: "#4A7C65",
                fontSize: T.dataSm || 11,
                fontWeight: 700,
                fontFamily: FONT
            },
            emphasis: { focus: "series" }
        }]
    });

    window.addEventListener("resize", () => treeChart.resize());

    if ("IntersectionObserver" in window) {
        [roseDom, treeDom].forEach((el) => {
            if (!el) return;
            new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        echarts.getInstanceByDom(el)?.resize();
                    }
                });
            }, { threshold: 0.1 }).observe(el);
        });
    }

})();
