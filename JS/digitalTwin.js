// ======================================
// 图13
// 数字孪生桥梁蓝图
// ======================================

const twinDom =
document.getElementById("digitalTwin");

const twinChart =
echarts.init(twinDom);

const option = {

backgroundColor:"transparent",

graphic:[

/* ======================
   桥梁主体
====================== */

{
type:"line",

left:"center",

top:"55%",

shape:{
x1:-350,
y1:0,
x2:350,
y2:0
},

style:{
stroke:"#4A7C65",
lineWidth:4
}
},

/* 主塔 */

{
type:"rect",

left:"42%",

top:"33%",

shape:{
width:14,
height:180
},

style:{
fill:"#4A7C65"
}
},

{
type:"rect",

left:"58%",

top:"33%",

shape:{
width:14,
height:180
},

style:{
fill:"#4A7C65"
}
},

/* 主缆 */

{
type:"bezierCurve",

shape:{
x1:350,
y1:250,
cpx1:500,
cpy1:120,
cpx2:700,
cpy2:120,
x2:850,
y2:250
},

style:{
stroke:"#8CBFAA",
lineWidth:2
}
},

/* ======================
   传感器节点
====================== */

...Array.from({length:30},(_,i)=>({

type:"circle",

shape:{
cx:250+i*25,
cy:270+
Math.sin(i/3)*20,
r:3
},

style:{
fill:"#6D9B8B"
}

})),

/* ======================
   指标面板
====================== */

{
type:"text",

left:80,

top:100,

style:{

text:
`126
长大桥梁`,

fill:"#4A7C65",

fontSize:30,

fontWeight:"bold"
}
},

{
type:"text",

left:80,

top:220,

style:{

text:
`30+
传感器类型`,

fill:"#4A7C65",

fontSize:30,

fontWeight:"bold"
}
},

{
type:"text",

left:80,

top:340,

style:{

text:
`1.4万+
监测设备`,

fill:"#4A7C65",

fontSize:30,

fontWeight:"bold"
}
},

{
type:"text",

right:100,

top:100,

style:{

text:
`3900万+
监测数据`,

fill:"#4A7C65",

fontSize:30,

fontWeight:"bold"
}
},

{
type:"text",

right:100,

top:220,

style:{

text:
`95%
识别准确率`,

fill:"#4A7C65",

fontSize:30,

fontWeight:"bold"
}
},

{
type:"text",

right:100,

top:340,

style:{

text:
`14级
抗风能力`,

fill:"#4A7C65",

fontSize:30,

fontWeight:"bold"
}
}

],

title:[

{
text:"桥的数字生命",

left:"center",

top:20,

textStyle:{
fontSize:30,
color:"#4A7C65"
}
},

{
text:"数字孪生 · 智慧养护 · 结构健康监测",

left:"center",

top:60,

textStyle:{
fontSize:14,
color:"#7A7A7A"
}
}

]

};

twinChart.setOption(option);

window.addEventListener(
"resize",
()=>twinChart.resize()
);