// ======================================
// 图10
// 桥-民族村寨拓扑图
// ======================================

const networkDom =
document.getElementById("bridgeVillage");

const networkChart =
echarts.init(networkDom);

// ======================================
// 节点
// ======================================

const nodes = [

{
name:"花江峡谷大桥",
symbolSize:80,
category:0
},

{
name:"坝陵河大桥",
symbolSize:70,
category:0
},

{
name:"平塘特大桥",
symbolSize:75,
category:0
},

{
name:"花江镇",
symbolSize:35,
category:1
},

{
name:"关岭",
symbolSize:40,
category:1
},

{
name:"贞丰",
symbolSize:40,
category:1
},

{
name:"西江千户苗寨",
symbolSize:55,
category:1
},

{
name:"肇兴侗寨",
symbolSize:50,
category:1
},

{
name:"榕江",
symbolSize:60,
category:1
},

{
name:"村超",
symbolSize:65,
category:2
},

{
name:"天空之桥服务区",
symbolSize:42,
category:2
}

];

// ======================================
// 连线
// ======================================

const links = [

{
source:"花江峡谷大桥",
target:"花江镇",
value:90
},

{
source:"花江峡谷大桥",
target:"关岭",
value:120
},

{
source:"花江峡谷大桥",
target:"贞丰",
value:110
},

{
source:"坝陵河大桥",
target:"关岭",
value:100
},

{
source:"坝陵河大桥",
target:"西江千户苗寨",
value:80
},

{
source:"平塘特大桥",
target:"天空之桥服务区",
value:150
},

{
source:"平塘特大桥",
target:"肇兴侗寨",
value:90
},

{
source:"榕江",
target:"村超",
value:200
},

{
source:"村超",
target:"西江千户苗寨",
value:75
},

{
source:"村超",
target:"肇兴侗寨",
value:65
}

];

// ======================================
// 配置
// ======================================

const option = {

backgroundColor:"transparent",

title:[

{
text:"桥—民族村寨旅游拓扑网络",

left:"center",

top:20,

textStyle:{

color:"#4A7C65",

fontSize:30

}
},

{
text:"桥梁成为民族地区旅游流量节点",

left:"center",

top:60,

textStyle:{

color:"#7A7A7A",

fontSize:14

}
}

],

tooltip:{},

legend:{

bottom:10,

textStyle:{

color:"#4A7C65"

}

},

series:[

{

type:"graph",

layout:"force",

roam:true,

draggable:true,

force:{

repulsion:700,

edgeLength:[120,220]

},

lineStyle:{

opacity:0.4,

width:2,

color:"#8CBFAA"

},

label:{

show:true,

color:"#4A7C65",

fontSize:13

},

edgeSymbol:[
"none",
"none"
],

categories:[

{
name:"桥梁"
},

{
name:"民族村寨"
},

{
name:"旅游节点"
}

],

data:nodes,

links:links,

emphasis:{

focus:"adjacency"

}

}

]

};

networkChart.setOption(option);

window.addEventListener(
"resize",
()=>networkChart.resize()
);