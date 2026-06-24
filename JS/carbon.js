// ======================================
// 图14
// 生命周期碳足迹对冲图
// ======================================

const carbonDom =
document.getElementById("carbonLife");

const carbonChart =
echarts.init(carbonDom);

const categories = [

"材料生产",
"工程施工",
"运输安装",
"后期维护",
"智能养护收益",
"寿命延长收益"

];

const values = [

45,
28,
17,
10,
-35,
-45

];

const option = {

backgroundColor:"transparent",

title:[

{
text:"桥梁生命周期碳足迹",

left:"center",

top:20,

textStyle:{
fontSize:30,
color:"#4A7C65"
}
},

{
text:"建设成本与智慧养护收益对冲",

left:"center",

top:60,

textStyle:{
fontSize:14,
color:"#7A7A7A"
}
}

],

grid:{
left:"15%",
right:"10%",
top:120,
bottom:60
},

tooltip:{

formatter:function(p){

return `${p.name}<br>${p.value} 万吨CO₂e`;

}

},

xAxis:{

type:"value",

axisLabel:{
color:"#7A7A7A"
},

splitLine:{

lineStyle:{
color:"rgba(140,191,170,0.12)"
}

}

},

yAxis:{

type:"category",

data:categories,

axisLabel:{
color:"#4A7C65"
},

axisTick:{
show:false
}

},

series:[

{

type:"bar",

data:values,

barWidth:26,

itemStyle:{

color:function(params){

return params.value > 0
? "#5C8A78"
: "#8CBFAA";

}

},

label:{

show:true,

position:"right",

color:"#4A7C65"

}

}

]

};

carbonChart.setOption(option);

window.addEventListener(
"resize",
()=>carbonChart.resize()
);