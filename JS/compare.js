// ======================================
// 中国景区桥游客量对比 · 横向条形图
// ======================================

(function () {

    const dom = document.getElementById("tourismCompare");
    if (!dom) return;

    const chart = echarts.init(dom);
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const T = window.BRIDGE_CHART || {};

    const bridges = [
        {
            name: "平塘天空之桥",
            value: 460,
            group: "gz",
            metric: "累计 460 万人次（2020—2026.01）",
            extra: "2025 国庆单日峰值 2.8 万人次",
            source: "平塘县政府"
        },
        {
            name: "荔波小七孔",
            value: 450,
            group: "gz",
            metric: "2025 全年景区 450 万人次（核心打卡桥全覆盖客流）",
            extra: "",
            source: "《2025 年贵州文旅核心指标表》"
        },
        {
            name: "花江峡谷大桥",
            value: 130,
            group: "gz",
            metric: "通车半年累计 130 万人次",
            extra: "2025 国庆 22.1 万 · 2026 春节 27 万 · 单日峰值 4.1 万",
            source: "人民日报"
        },
        {
            name: "张家界玻璃桥",
            value: 120,
            group: "out",
            metric: "2023 年全年 120 万人次",
            extra: "旺季单日峰值 3.2 万人次",
            source: "慈利县政府"
        },
        {
            name: "武汉长江大桥",
            value: 95,
            group: "out",
            metric: "年观光 95 万人次",
            extra: "",
            source: "武汉市文旅局、新浪文旅"
        },
        {
            name: "南京长江大桥",
            value: 88,
            group: "out",
            metric: "观光步道年 88 万人次",
            extra: "",
            source: "南京文旅平台"
        },
        {
            name: "兰州中山桥",
            value: 72,
            group: "out",
            metric: "年观光 72 万人次",
            extra: "",
            source: "黄河风情线运营公开统计"
        },
        {
            name: "北盘江第一桥",
            value: 38,
            group: "gz",
            metric: "年均观桥 38 万人次",
            extra: "",
            source: "贵州省政府"
        },
        {
            name: "坝陵河大桥",
            value: 25,
            group: "gz",
            metric: "桥梁博物馆年均研学观光 25 万人次",
            extra: "",
            source: "贵州省文旅厅"
        }
    ].sort((a, b) => b.value - a.value);

    const gzColor = "#4A7C65";
    const outColor = "#8CBFAA";

    function barColor(group) {
        if (group === "gz") {
            return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#6D9B8B" },
                { offset: 1, color: gzColor }
            ]);
        }
        return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#A3C4B5" },
            { offset: 1, color: outColor }
        ]);
    }

    chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            backgroundColor: "rgba(255,255,255,0.96)",
            borderColor: "rgba(74, 124, 101, 0.3)",
            padding: [12, 16],
            textStyle: { color: "#4A7C65", fontSize: T.tooltip || 13, fontFamily: FONT, lineHeight: 22 },
            formatter: (items) => {
                if (!items || !items.length) return "";
                const row = bridges[items[0].dataIndex];
                const groupLabel = row.group === "gz" ? "贵州桥旅桥梁" : "省外网红景观桥";
                let html = `<strong style="font-size:14px">${row.name}</strong><br/><span style="color:#7A7A7A">${groupLabel}</span><br/>${row.metric}`;
                if (row.extra) html += `<br/>${row.extra}`;
                html += `<br/><span style="color:#B8B8B8;font-size:11px">来源：${row.source}</span>`;
                return html;
            }
        },
        legend: {
            bottom: 6,
            itemWidth: 14,
            itemHeight: 14,
            itemGap: 24,
            textStyle: { color: "#4A7C65", fontSize: T.legend || 11, fontFamily: FONT, fontWeight: 600 },
            data: [
                { name: "贵州桥梁", icon: "roundRect", itemStyle: { color: gzColor } },
                { name: "省外桥梁", icon: "roundRect", itemStyle: { color: outColor } }
            ]
        },
        grid: {
            left: 8,
            right: 52,
            top: 16,
            bottom: 40,
            containLabel: true
        },
        xAxis: {
            type: "value",
            max: 500,
            name: "万人次",
            nameLocation: "end",
            nameGap: 8,
            nameTextStyle: { color: "#7A7A7A", fontSize: T.axis || 11, fontFamily: FONT, fontWeight: 600 },
            splitLine: {
                lineStyle: { color: "rgba(140,191,170,0.22)", type: "dashed" }
            },
            axisLine: { lineStyle: { color: "rgba(184,184,184,0.6)" } },
            axisTick: { show: false },
            axisLabel: {
                color: "#7A7A7A",
                fontSize: T.axisSm || 10,
                fontFamily: FONT,
                margin: 10
            }
        },
        yAxis: {
            type: "category",
            inverse: true,
            data: bridges.map((d) => d.name),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: "#4A7C65",
                fontSize: T.axis || 11,
                fontFamily: FONT,
                fontWeight: 700,
                width: 92,
                overflow: "break",
                lineHeight: 16
            }
        },
        series: [{
            type: "bar",
            data: bridges.map((d) => ({
                value: d.value,
                itemStyle: {
                    color: barColor(d.group),
                    borderRadius: [0, 10, 10, 0],
                    shadowColor: "rgba(74,124,101,0.2)",
                    shadowBlur: 8,
                    shadowOffsetX: 2
                }
            })),
            barWidth: 18,
            barCategoryGap: "32%",
            label: {
                show: true,
                position: "right",
                distance: 8,
                formatter: (p) => `${p.value} 万人次`,
                color: "#4A7C65",
                fontSize: T.data || 13,
                fontWeight: 700,
                fontFamily: FONT
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 12,
                    shadowColor: "rgba(74,124,101,0.35)"
                }
            },
            z: 2
        }]
    });

    window.addEventListener("resize", () => chart.resize());

    window.addEventListener("load", () => {
        setTimeout(() => chart.resize(), 100);
    });

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) chart.resize();
            });
        }, { threshold: 0.1 }).observe(dom);
    }

})();
