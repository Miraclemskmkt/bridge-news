// =====================================
// 贵州交通进化年轮
// 2015-2025
// =====================================

const transportDom = document.getElementById("transportRing");

const transportChart = echarts.init(transportDom);

const years = [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025"
];

// -------------------------------------
// 模拟交通覆盖扩张
// 后续获得完整数据后直接替换
// -------------------------------------

const expressRadius = [
    15,22,30,38,46,55,63,72,80,90,100
];

const railwayRadius = [
    0,0,0,0,8,18,30,42,55,70,85
];

// -------------------------------------
// 三个民族自治州
// -------------------------------------

const ethnicStates = [

    {
        name:"黔东南",
        angle:50,
        radius:85
    },

    {
        name:"黔南",
        angle:150,
        radius:78
    },

    {
        name:"黔西南",
        angle:290,
        radius:82
    }

];

// -------------------------------------
// 环数据
// -------------------------------------

const series = [];

// 高速扩张环

expressRadius.forEach((r,index)=>{

    series.push({

        type:"pie",

        radius:[r+"%",(r+3)+"%"],

        center:["50%","50%"],

        startAngle:90,

        silent:true,

        label:{show:false},

        data:[
            {
                value:100,
                itemStyle:{
                    color:"rgba(109,155,139,0.65)"
                }
            }
        ]
    });

});

// 高铁扩张环

railwayRadius.forEach((r,index)=>{

    if(r===0) return;

    series.push({

        type:"pie",

        radius:[r+"%",(r+2)+"%"],

        center:["50%","50%"],

        startAngle:90,

        silent:true,

        label:{show:false},

        data:[
            {
                value:100,
                itemStyle:{
                    color:"rgba(74,124,101,0.95)"
                }
            }
        ]
    });

});

// -------------------------------------
// 贵阳中心
// -------------------------------------

series.push({

    type:"scatter",

    coordinateSystem:null,

    data:[[0,0]],

    symbolSize:18,

    itemStyle:{
        color:"#4A7C65"
    }

});


// -------------------------------------
// 配置
// -------------------------------------

const transportOption = {

    backgroundColor:"transparent",

    title:[

        {

            text:"贵州交通进化年轮",

            left:"center",

            top:20,

            textStyle:{

                color:"#4A7C65",

                fontSize:30,

                fontWeight:"bold"

            }

        },

        {

            text:"2015 县县通高速 → 2025 市市通高铁",

            left:"center",

            top:60,

            textStyle:{

                color:"#7A7A7A",

                fontSize:15,

                fontWeight:"normal"

            }

        }

    ],

    graphic:[

        // 中心

        {

            type:"circle",

            left:"center",

            top:"center",

            shape:{
                r:18
            },

            style:{
                fill:"#4A7C65"
            }

        },

        {

            type:"text",

            left:"49%",

            top:"48.8%",

            style:{

                text:"贵阳",

                fill:"#ffffff",

                fontSize:13,

                fontWeight:"bold"

            }

        }

    ],

    series:series

};

// -------------------------------------
// 添加自治州标记
// -------------------------------------

ethnicStates.forEach(state=>{

    transportOption.graphic.push({

        type:"group",

        left:"50%",

        top:"50%",

        children:[

            {

                type:"text",

                style:{

                    text:"✦",

                    fill:"#8CBFAA",

                    fontSize:24

                },

                x:
                Math.cos(state.angle*Math.PI/180)
                *
                280,

                y:
                Math.sin(state.angle*Math.PI/180)
                *
                280

            },

            {

                type:"text",

                style:{

                    text:state.name,

                    fill:"#4A7C65",

                    fontSize:14

                },

                x:
                Math.cos(state.angle*Math.PI/180)
                *
                320,

                y:
                Math.sin(state.angle*Math.PI/180)
                *
                320

            }

        ]

    });

});

transportChart.setOption(transportOption);

window.addEventListener("resize",()=>{

    transportChart.resize();

});