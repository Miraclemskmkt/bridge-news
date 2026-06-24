// =====================================
// 图7 出山入海 Flow Map
// =====================================

(function () {

const flowDom = document.getElementById("flowMap");
if (!flowDom) return;

const flowChart = echarts.init(flowDom);

// -------------------------------------
// 节点
// -------------------------------------

const nodes = [

{
name:"关岭牛",
x:12,
y:20
},

{
name:"贞丰花椒",
x:12,
y:45
},

{
name:"刺梨",
x:12,
y:70
},

{
name:"茶叶",
x:12,
y:85
},

{
name:"六盘水大豆油",
x:12,
y:58
},

{
name:"花江峡谷大桥",
x:45,
y:30
},

{
name:"北盘江大桥",
x:45,
y:55
},

{
name:"平塘特大桥",
x:45,
y:78
},

{
name:"国内市场",
x:75,
y:40
},

{
name:"海外市场",
x:75,
y:65
},

{
name:"缅甸",
x:92,
y:55
},

{
name:"东盟",
x:92,
y:72
}

];

// -------------------------------------
// 流向
// -------------------------------------

const links = [

["关岭牛","花江峡谷大桥",90],
["贞丰花椒","花江峡谷大桥",70],
["刺梨","北盘江大桥",80],
["茶叶","平塘特大桥",75],
["六盘水大豆油","北盘江大桥",100],

["花江峡谷大桥","国内市场",150],
["北盘江大桥","海外市场",180],
["平塘特大桥","国内市场",120],

["海外市场","缅甸",140],
["海外市场","东盟",90]

];

// -------------------------------------
// 构造线
// -------------------------------------

const seriesData = [];

links.forEach(item=>{

const source =
nodes.find(
n=>n.name===item[0]
);

const target =
nodes.find(
n=>n.name===item[1]
);

seriesData.push({

coords:[

[source.x,source.y],

[target.x,target.y]

],

value:item[2]

});

});

// -------------------------------------
// option
// -------------------------------------

const option = {

backgroundColor:"transparent",

title:[

{
text:"出山入海",

left:"center",

top:20,

textStyle:{
color:"#4A7C65",
fontSize:30
}
},

{
text:"贵州特色产业借桥出山",

left:"center",

top:60,

textStyle:{
color:"#7A7A7A",
fontSize:14
}
}

],

xAxis:{
show:false,
min:0,
max:100
},

yAxis:{
show:false,
min:0,
max:100
},

series:[

{
type:"lines",

coordinateSystem:"cartesian2d",

polyline:false,

effect:{

show:true,

period:6,

trailLength:0.3,

symbolSize:6

},

lineStyle:{

width:function(params){

return params.data.value/25;

},

color:"#6D9B8B",

opacity:0.65,

curveness:0.25

},

data:seriesData
},

{
type:"scatter",

symbolSize:18,

itemStyle:{
color:"#4A7C65"
},

label:{

show:true,

position:"right",

color:"#4A7C65",

fontSize:13

},

data:nodes.map(n=>({

name:n.name,

value:[n.x,n.y]

}))
}

]

};

flowChart.setOption(option);

window.addEventListener(
"resize",
()=>flowChart.resize()
);

})();