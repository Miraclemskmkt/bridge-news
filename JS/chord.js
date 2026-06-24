// =====================================
// 民族交融弦图（环形关系网络）
// =====================================

const chordDom = document.getElementById("ethnicChord");
const chordChart = echarts.init(chordDom);

const ethnicGroups = [
    "苗族", "布依族", "侗族", "水族", "仡佬族", "彝族", "瑶族", "壮族"
];

const links = [
    ["苗族", "侗族", 120], ["苗族", "水族", 85], ["布依族", "苗族", 95],
    ["布依族", "仡佬族", 70], ["侗族", "苗族", 110], ["水族", "布依族", 60],
    ["仡佬族", "苗族", 80], ["彝族", "苗族", 55], ["瑶族", "侗族", 45],
    ["壮族", "布依族", 50], ["苗族", "瑶族", 40], ["侗族", "水族", 65]
].map(([source, target, value]) => ({ source, target, value }));

chordChart.setOption({
    backgroundColor: "transparent",
    title: [
        {
            text: "各民族走过同一座桥",
            left: "center",
            top: 20,
            textStyle: { color: "#4A7C65", fontSize: 28 }
        },
        {
            text: "民族地区人口流动与交融示意",
            left: "center",
            top: 58,
            textStyle: { color: "#7A7A7A", fontSize: 14 }
        }
    ],
    tooltip: {},
    series: [{
        type: "graph",
        layout: "circular",
        circular: { rotateLabel: true },
        center: ["50%", "55%"],
        radius: "42%",
        roam: false,
        label: {
            show: true,
            color: "#4A7C65",
            fontSize: 12
        },
        data: ethnicGroups.map(name => ({
            name,
            symbolSize: 42,
            itemStyle: { color: "#4A7C65" }
        })),
        links: links.map(l => ({
            ...l,
            lineStyle: {
                width: Math.sqrt(l.value) / 3,
                color: "rgba(109,155,139,0.45)",
                curveness: 0.2
            }
        })),
        emphasis: {
            focus: "adjacency",
            lineStyle: { width: 6, color: "#4A7C65" }
        }
    }]
});

window.addEventListener("resize", () => chordChart.resize());
