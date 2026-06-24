// =====================================
// 养护资金流向：玫瑰图 + 市州饼图 + 桥型柱状图
// 合并 桥(1).html chartRose 与 养护资金投向
// =====================================

(function () {

    const tooltipStyle = {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderColor: "rgba(0,0,0,0.08)",
        textStyle: { color: "#1c2a24", fontSize: 11 }
    };

    // -------------------------------------
    // 玫瑰图（养护类型分布）
    // -------------------------------------

    const roseDom = document.getElementById("maintenanceRose");
    if (roseDom) {
        const roseChart = echarts.init(roseDom);

        const roseData = [
            { name: "悬索桥养护", value: 5.8 },
            { name: "斜拉桥养护", value: 4.2 },
            { name: "拱桥养护", value: 3.5 },
            { name: "梁桥养护", value: 2.8 },
            { name: "智能监测", value: 2.1 },
            { name: "数字孪生", value: 1.6 },
            { name: "巡检机器人", value: 0.9 },
            { name: "其他", value: 0.54 }
        ];

        const roseColors = [
            "#3a5f7a", "#4a8c78", "#bf8c60", "#c97d55",
            "#b06868", "#7c6eaa", "#5a8ab5", "#7a8b9a"
        ];

        roseChart.setOption({
            backgroundColor: "transparent",
            tooltip: { trigger: "item", ...tooltipStyle },
            legend: {
                bottom: 0,
                textStyle: { color: "#3d5048", fontSize: 9 },
                itemWidth: 8,
                itemHeight: 8
            },
            series: [{
                type: "pie",
                roseType: "area",
                radius: ["12%", "68%"],
                center: ["50%", "42%"],
                itemStyle: {
                    borderRadius: 4,
                    borderColor: "rgba(255,255,255,0.55)",
                    borderWidth: 1.5
                },
                label: {
                    color: "#1c2a24",
                    fontSize: 9,
                    formatter: "{b}"
                },
                data: roseData.map((d, i) => ({
                    ...d,
                    itemStyle: { color: roseColors[i] }
                }))
            }]
        });

        window.addEventListener("resize", () => roseChart.resize());
    }

    // -------------------------------------
    // 市州饼图 + 桥型柱状图
    // -------------------------------------

    const treeDom = document.getElementById("maintenanceTree");
    if (!treeDom) return;

    const treeChart = echarts.init(treeDom);

    const regions = ["贵阳", "遵义", "六盘水", "安顺", "毕节", "铜仁", "黔东南", "黔南", "黔西南"];
    const regionFunds = [12, 15, 8, 7, 13, 9, 14, 12, 10];

    const bridgeTypes = ["悬索桥", "斜拉桥", "拱桥", "梁桥"];
    const typeFunds = [8.5, 6.2, 3.8, 2.74];

    const regionPalette = [
        "#4A7C65", "#6D9B8B", "#8CBFAA", "#5C8A78",
        "#7A9E8E", "#A8C9B8", "#3D6B55", "#9BB5A5", "#B8D4C8"
    ];

    treeChart.setOption({
        backgroundColor: "transparent",
        tooltip: { trigger: "item", ...tooltipStyle },
        legend: {
            orient: "vertical",
            left: "4%",
            top: "32%",
            textStyle: { color: "#4A7C65", fontSize: 9 },
            itemWidth: 8,
            itemHeight: 8
        },
        series: [
            {
                name: "市州分布",
                type: "pie",
                radius: ["24%", "42%"],
                center: ["26%", "52%"],
                label: { color: "#4A7C65", fontSize: 9 },
                data: regions.map((name, i) => ({
                    name,
                    value: regionFunds[i],
                    itemStyle: { color: regionPalette[i] }
                }))
            },
            {
                name: "桥型分配",
                type: "bar",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: typeFunds,
                barWidth: 18,
                itemStyle: { color: "#6D9B8B", borderRadius: [0, 4, 4, 0] },
                label: {
                    show: true,
                    position: "insideRight",
                    color: "#F5F2E8",
                    fontSize: 9,
                    formatter: "{c} 亿"
                }
            }
        ],
        grid: {
            left: "54%",
            right: "6%",
            top: "28%",
            bottom: "14%"
        },
        xAxis: {
            type: "value",
            gridIndex: 0,
            axisLabel: { color: "#7A7A7A", fontSize: 9 },
            splitLine: { lineStyle: { color: "rgba(140,191,170,0.12)" } }
        },
        yAxis: {
            type: "category",
            gridIndex: 0,
            data: bridgeTypes,
            axisLabel: { color: "#4A7C65", fontSize: 10 },
            axisTick: { show: false }
        },
        graphic: [{
            type: "text",
            left: "54%",
            top: "18%",
            style: {
                text: "各桥型养护资金（亿元）",
                fill: "#4A7C65",
                fontSize: 11,
                fontWeight: "bold"
            }
        }]
    });

    window.addEventListener("resize", () => treeChart.resize());

})();
