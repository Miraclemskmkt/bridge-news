// ======================================
// 图12
// 中国景区桥游客量对比
// Lollipop Chart
// ======================================

const compareDom =
document.getElementById("tourismCompare");

const compareChart =
echarts.init(compareDom);

const data = [

{
name:"榕江村超",
value:2506,
highlight:true
},

{
name:"平塘天空之桥",
value:520,
highlight:true
},

{
name:"重庆洪崖洞桥区",
value:380
},

{
name:"武汉鹦鹉洲观景区",
value:210
},

{
name:"花江峡谷大桥",
value:160,
highlight:true
},

{
name:"坝陵河大桥",
value:120,
highlight:true
}

];

const option = {

backgroundColor:"transparent",

title:[

{
text:"中国景区桥旅游吸引力",

left:"center",

top:20,

textStyle:{

color:"#4A7C65",

fontSize:30

}
},

{
text:"游客量对比（单位：万人次）",

left:"center",

top:60,

textStyle:{

color:"#7A7A7A",

fontSize:14

}
}

],

grid:{

left:"18%",

right:"10%",

top:120,

bottom:60

},

xAxis:{

type:"value",

splitLine:{

lineStyle:{
color:"rgba(140,191,170,0.12)"
}

},

axisLabel:{

color:"#7A7A7A"

}

},

yAxis:{

type:"category",

inverse:true,

data:data.map(d=>d.name),

axisLine:{
show:false
},

axisTick:{
show:false
},

axisLabel:{

color:"#4A7C65",

fontSize:14

}

},

series:[

{
type:"bar",

data:data.map(d=>d.value),

barWidth:2,

itemStyle:{

color:"#B8B8B8"

},

z:1

},

{
type:"scatter",

data:data.map(d=>({

value:d.value,

itemStyle:{

color:d.highlight
? "#4A7C65"
: "#8CBFAA"

}

})),

symbolSize:function(param){

return Math.sqrt(param)*1.6;

},

label:{

show:true,

position:"right",

formatter:"{c}",

color:"#4A7C65",

fontWeight:"bold"

}

}

]

};

compareChart.setOption(option);

window.addEventListener(
"resize",
()=>compareChart.resize()
);