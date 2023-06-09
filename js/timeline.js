// 时间轴
(function(){
var timeline = echarts.init(document.querySelector(".timeline"));
var option = {
timeline: {
    axisType: 'category',
    autoPlay: true,
    symbolSize: 10,
    // symbol: "image://"+symbol1,
    playInterval: 4000,
    left: '5%',
    right: '5%',
    bottom: '0%',
    label: {
        normal: {
            position: 'top',
            color: 'white',
            fontSize: 15,
        }
    },
    lineStyle: {
        color: "#0b4e86"
    },
    itemStyle: {
        normal: {
            color: '#f00',
            borderColor: "#00aeff",
            borderWidth: 2
        }

    },
    checkpointStyle: {
        // symbol: "image://"+symbol2,
        symbolSize: 16
    },
    controlStyle: {
        showPlayBtn: true
    },
    data: ['1','2','3','4','5','6','7','8','9','10','11','12'],
},
options: []

};
timeline.setOption(option);
window.addEventListener("resize", function () {
    timeline.resize();
});
// 监听timeline 实现动态加载数据
timeline.on("timelinechanged", function (timeLineIndex) {
    // console.log(timeLineIndex) 
    // console.log(timeLineIndex.currentIndex) 
    var data2022 = [
        3223, 2342, 3525, 3457,
        4230, 3308, 3456, 3600,
        3671, 4200, 3850, 3619
    ];
    var data2023 = [
        2815, 3216, 3412, 3543,
        5650, 3320, 3560, 3450,
        3734, 5831, 3850, 3619
    ];
    document.getElementById("2022").innerText = data2022[timeLineIndex.currentIndex]+" w";
    document.getElementById("2023").innerText = data2023[timeLineIndex.currentIndex]+" w";
    // 柱状图变化
    (function(){
        var barChart = echarts.init(document.querySelector(".bar .chart"));
        console.log('bar---', barxaxis[timeLineIndex.currentIndex]);
        console.log('bar---',bardata[timeLineIndex.currentIndex]);
        barChart.setOption({
            xAxis: {
                data: barxaxis[timeLineIndex.currentIndex]
            },
            series: [{
                data: bardata[timeLineIndex.currentIndex]
            }]
        });
    })();
    // 飞行图变化
    (function(){
        var flymap = echarts.init(document.querySelector(".map .chart"));
        var planePath =
            "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
        //var planePath = 'arrow';
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];

                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord],
                        value: dataItem[1].value
                    });
                }
            }
            return res;
        };

        var color = ["#a6c84c", "#ffa022", "#46bee9"]; //航线的颜色
        var flyseries = [];
        var currentData = flydata[timeLineIndex.currentIndex];
        var Data0 = currentData[0][1];
        var Data1 = currentData[1][1];
        var Data2 = currentData[2][1];
        [
            [currentData[0][0], Data0],
            [currentData[1][0], Data1],
            [currentData[2][0], Data2]
        ].forEach(function (item, i) {
            flyseries.push(
                {
                    name: item[0] + " Top3",
                    type: "lines",
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: "red", //arrow箭头的颜色
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                },
                {
                    name: item[0] + " Top3",
                    type: "lines",
                    zlevel: 2,
                    symbol: ["none", "arrow"],
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: planePath,
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                },
                {
                    name: item[0] + " Top3",
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    zlevel: 2,
                    rippleEffect: {
                        brushType: "stroke"
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "right",
                            formatter: "{b}"
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 8;
                    },
                    itemStyle: {
                        normal: {
                            color: color[i]
                        },
                        emphasis: {
                            areaColor: "#2B91B7"
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                }
            );
        });
        flymap.setOption({
            series: flyseries,
            legend: {
                orient: "vertical",
                top: "bottom",
                left: "right",
                data: [`${currentData[0][0]} Top3`, `${currentData[1][0]} Top3`,
                `${currentData[2][0]} Top3`],
                textStyle: {
                    color: "#fff"
                },
                selectedMode: "multiple"
            },
        });
    })();
    // 气泡图变化
    (function(){
        var data = bubbledata[timeLineIndex.currentIndex];
        var symbols = {
            '私家车': 'path://M1136.047385 339.881769c-23.341731-196.733067-118.702365-340.157424-235.779091-339.881372L358.68492 1.288641C241.577522 1.564693 146.922354 145.357118 124.408779 342.243548c-82.2635 48.953223-124.683492 148.73069-124.40744 264.151103 0.184035 85.698813 24.016525 162.53329 69.902504 216.394105l0.460087 191.365389 212.805429-0.490759-0.276052-112.077117 697.338055-1.686985 0.276052 112.077117 212.805429-0.521432-0.460087-191.365389c45.640599-54.014177 69.135693-131.002016 68.920986-216.700829C1261.528361 488.183045 1218.586937 388.497596 1136.047385 339.881769zM358.930299 74.319734 900.513674 73.031491c75.392872-0.184035 141.491992 101.985882 166.490036 240.563992-11.53284-2.300433-23.648456-3.711366-36.193486-4.447505 0-0.306724 0.337397-0.920173 0.061345-0.889501-101.893865 0.24538-70.055866 0.153362-141.798717 0.337397s-46.560773 0.092017-118.119589 0.276052L247.282597 310.129497c-19.016916 0.030672-36.99097 2.085726-53.983505 5.551713C217.806376 176.919065 283.537427 74.473096 358.930299 74.319734zM218.297135 702.031337c-46.591445 0.092017-84.318553-42.788062-84.441243-95.974083-0.12269-53.094004 37.420384-96.250135 83.981157-96.372825 46.376738-0.092017 84.103846 42.880079 84.257209 95.974083C302.216947 658.93655 264.704546 701.908647 218.297135 702.031337zM875.270251 683.903921l-488.366682 0.582776c-76.12901 0.184035-77.785322-131.124706-0.306724-131.30874l488.366682-1.165553C946.184946 551.82837 946.49167 683.719887 875.270251 683.903921zM1043.938031 700.037628c-46.468755 0.12269-84.195864-42.757389-84.318553-95.94341-0.12269-53.094004 37.420384-96.280807 83.858467-96.372825 46.499428-0.12269 84.257209 42.849407 84.379898 95.974083C1127.888515 656.973514 1090.406786 699.976283 1043.938031 700.037628z',
            '大巴': 'path://M910.165333 312.888889l-0.483555-0.056889V682.666667c0 31.431111 0.540444 56.888889 0.540444 56.888889h-28.444444 28.444444v199.111111a28.444444 28.444444 0 0 1-28.444444 28.444444h-85.333334a28.444444 28.444444 0 0 1-28.444444-28.444444l-9.472-56.888889H265.472L256 938.666667a28.444444 28.444444 0 0 1-28.444444 28.444444H142.222222a28.444444 28.444444 0 0 1-28.444444-28.444444v-199.111111h28.444444-28.444444s-0.512-25.457778-0.512-56.888889V312.832C82.090667 312.519111 56.888889 287.715556 56.888889 257.052444V201.187556c0-30.634667 25.201778-27.932444 56.376889-27.904V113.777778a56.888889 56.888889 0 0 1 56.888889-56.888889h682.638222a56.888889 56.888889 0 0 1 56.888889 56.888889v56.945778L910.165333 170.666667C941.624889 170.666667 967.111111 167.68 967.111111 199.111111v56.888889a56.888889 56.888889 0 0 1-56.945778 56.888889zM227.555556 718.222222c0 11.776 10.183111 21.333333 22.755555 21.333334H341.333333c0-71.367111-55.694222-85.333333-68.266666-85.333334h-22.755556c-12.572444 0-22.755556 9.557333-22.755555 21.333334v42.666666zM796.444444 256V199.111111a28.444444 28.444444 0 0 0-28.444444-28.444444H256a28.444444 28.444444 0 0 0-28.444444 28.444444v227.555556a56.888889 56.888889 0 0 0 56.888888 56.888889h455.111112a56.888889 56.888889 0 0 0 56.888888-56.888889V256z m0 419.555556c0-11.776-10.183111-21.333333-22.755555-21.333334h-22.755556c-12.572444 0-68.266667 13.966222-68.266666 85.333334h91.022222c12.572444 0 22.755556-9.557333 22.755555-21.333334v-42.666666z',
            '动车': 'path://M425.6 125.328h156.8c21.952 0 39.2-17.008 39.2-38.656C621.6 65.008 604.352 48 582.4 48h-156.8c-21.952 0-39.2 17.008-39.2 38.672 0 21.648 17.248 38.656 39.2 38.656zM770.56 976H896l-117.6-122.96c45.472-16.24 78.4-58.768 78.4-109.04v-464c0-64.192-53.312-116-117.6-116H268.8c-65.072 0-117.6 52.592-117.6 116v464c0 50.272 32.928 93.568 78.4 109.04L112 976h125.44l111.328-116h310.464L770.56 976zM241.36 349.6c0-42.528 35.28-77.328 78.4-77.328h368.48c43.12 0 78.4 34.8 78.4 77.328v131.472c0 42.528-35.28 77.328-78.4 77.328h-368.48c-43.12 0-78.4-34.8-78.4-77.328V349.6z m90.16 425.328c-34.496 0-62.72-27.84-62.72-61.856 0-34.032 28.224-61.872 62.72-61.872 34.496 0 62.72 27.84 62.72 61.872 0 34.016-28.224 61.856-62.72 61.856z m282.24-61.856c0-34.032 28.224-61.872 62.72-61.872 34.496 0 62.72 27.84 62.72 61.872 0 34.016-28.224 61.856-62.72 61.856-34.496 0-62.72-27.84-62.72-61.856z',
            '飞机': 'path://M1007.8 543c-42.5-94.5-140.4-151.2-243.5-141h-0.4L636 417.2 500 300.8c-4-3.4-9-5.3-14.3-5.3H315.3c-8.4 0-16 4.7-19.7 12.2-3.7 7.5-2.8 16.4 2.2 23.1L385.9 447l-139 16.6c-13.6 1.6-27.5-2.4-38.1-11.1l-88.9-72.6c-3.9-3.2-8.8-5-13.9-5H37c-7.5 0-14.6 3.9-18.6 10.3-4.1 6.4-4.5 14.4-1.3 21.2l67.6 142c15.6 32.7 40.1 60.3 70.7 79.6 30.6 19.4 66 29.6 102.2 29.6h116.8l-76.5 101c-5.1 6.7-5.9 15.6-2.2 23.1s11.3 12.2 19.7 12.2h170.4c5.2 0 10.3-1.9 14.3-5.2l152.9-131h280.6c27.7 0 53.3-13.9 68.3-37.2 15.1-23.3 17.3-52.2 5.9-77.5zM436.1 440.5l-76.5-101h118l99 84.8L436.4 441c-0.1-0.2-0.2-0.3-0.3-0.5zM965 596.6c-7 10.8-18.4 17-31.3 17H644.8c-5.2 0-10.3 1.9-14.3 5.3l-152.9 131H359.7l76.5-101c5.1-6.7 5.9-15.6 2.2-23.1s-11.3-12.2-19.7-12.2H257.6c-27.9 0-55.1-7.9-78.7-22.8s-42.4-36.1-54.4-61.3L71.9 419h26.3l82.8 67.7c19.9 16.2 45.8 23.7 71.2 20.7l516.7-61.7c64.2-6.3 125.9 19.2 166.9 65.8H889c-12.2 0-22 9.8-22 22s9.8 22 22 22h76.1c0.9 1.8 1.8 3.6 2.6 5.5 5.3 11.8 4.3 24.8-2.7 35.6z'
        };
        var colors = {
            '自然景点': 'green',
            '历史遗迹': 'orange',
            '主题公园': 'skyblue'
        };
        var itemStyle = {
            normal: {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        };
        var myseries = [];
        var bubbleChart = echarts.init(document.querySelector(".bubble .chart"));
        data.forEach((data) => (myseries.push({
            data: [data],
            type: 'scatter',
            symbolSize: data[1] * bubbleChart.getWidth() / 720,
            symbol: symbols[data[2]],
            itemStyle: itemStyle,
            color: colors[data[3]],
        })
        ));
        bubbleChart.setOption({
            series: myseries
        });
    })();
    // 多线图变化
    (function(){
        var data = multilinedata[timeLineIndex.currentIndex];
        var xaxis = multilinexaxis[timeLineIndex.currentIndex];
        var multichart = echarts.init(document.querySelector(".multiline .chart"));
        multichart.setOption({
            xAxis: [{
                data: xaxis
            }],
            series: [
            {
                data: data[0]
            },{
                data: data[1]
            },{
                data: data[2]
            }]
        })
    })();
    // 玫瑰图变化
    (function(){
        var data = rosedata[timeLineIndex.currentIndex];
        var rosechart = echarts.init(document.querySelector('.rose .chart'));
        rosechart.setOption({
            series: [{
                data: data
            }]
        })
    })();
    // 
});

})(); // timeline_end



var rosedata = [
    // 1     ['内蒙古','安徽','北京','广东','福建','广西']
    [
        { value: 70, name: '广东' },
        { value: 110, name: '内蒙古' },
        { value: 95, name: '安徽' },
        { value: 50, name: '广西' },
        { value: 40, name: '海南' },
        { value: 80, name: '北京' },
        { value: 35, name: '江西' },
        { value: 55, name: '福建' }
    ],
    // 2    ['黑龙江','江苏','陕西','广西','浙江','广东']
    [
        { value: 65, name: '广西' },
        { value: 30, name: '山东' },
        { value: 85, name: '江苏' },
        { value: 45, name: '广东' },
        { value: 100, name: '黑龙江' },
        { value: 35, name: '湖北' },
        { value: 75, name: '陕西' },
        { value: 50, name: '浙江' }
    ],
    // 3    ['甘肃','辽宁','山西','重庆','河南','四川']
    [       
        { value: 60, name: '重庆' },
         { value: 30, name: '天津' },
        { value: 80, name: '辽宁' },
        { value: 40, name: '四川' },
        { value: 70, name: '山西' },
        { value: 25, name: '湖南' },
        { value: 45, name: '河南' },
        { value: 90, name: '甘肃' }
    ],
    // 4    ['江西','福建','浙江','湖北','云南','陕西']
    [  
        { value: 125, name: '江西' },
        { value: 105, name: '福建' },
        { value: 80, name: '湖北' },
        { value: 55, name: '陕西' },
         { value: 95, name: '浙江' },
        { value: 45, name: '山东' },
        { value: 40, name: '甘肃' },
        { value: 65, name: '云南' }
    ],
    // 5    ['天津','河北','山东','北京','安徽','河南',]
    [
        { value: 140, name: '天津' },
        { value: 50, name: '江苏' },
        { value: 65, name: '河南' },
        { value: 50, name: '山西' },
        { value: 110, name: '山东' },
        { value: 90, name: '北京' },
        { value: 85, name: '安徽' },
        { value: 120, name: '河北' }
    ],
    // 6    ['浙江','江苏','黑龙江','上海','辽宁','湖北']
    [
        { value: 105, name: '上海' },
        { value: 165, name: '浙江' },
        { value: 140, name: '江苏' },
        { value: 130, name: '黑龙江' },
        { value: 75, name: '湖北' },
        { value: 60, name: '吉林' },
        { value: 60, name: '湖南' },
        { value: 100, name: '辽宁' }
    ],
    // 7    ['广西','海南','湖南','广东','重庆','云南']
    [
        { value: 140, name: '广东' },
        { value: 185, name: '海南' },
        { value: 100, name: '云南' },
        { value: 125, name: '重庆' },
        { value: 80, name: '贵州' },
        { value: 170, name: '湖南' },
        { value: 75, name: '湖北' },
        { value: 215, name: '广西' }
    ],
    // 8    ['江西','山东','青海','福建','新疆','陕西']
    [
        { value: 90, name: '福建' },
        { value: 140, name: '江西' },     
        { value: 65, name: '陕西' },
        { value: 50, name: '甘肃' },   
        { value: 45, name: '宁夏' },
        { value: 85, name: '新疆' },
        { value: 110, name: '青海' },
        { value: 120, name: '山东' }
    ],
    // 9    ['山西','河南','福建','内蒙古','海南','湖北']
    [      
        { value: 65, name: '山西' },
        { value: 55, name: '河南' },
        { value: 30, name: '湖北' },
        { value: 20, name: '广东' },
        { value: 25, name: '江西' },
        { value: 50, name: '福建' },
        { value: 40, name: '内蒙古' },
        { value: 35, name: '海南' }
    ],
    // 10   ['天津','河北','辽宁','北京','黑龙江','山西']
    [
        { value: 35, name: '北京' },
         { value: 30, name: '黑龙江' },
        { value: 50, name: '河北' },
        { value: 25, name: '山西' },
        { value: 20, name: '内蒙古' },
        { value: 55, name: '天津' },
        { value: 40, name: '辽宁' },
        { value: 15, name: '吉林' }
    ],
    // 11   ['浙江','安徽','山东','江苏','湖北','福建']
    [
        { value: 40, name: '江苏' },
        { value: 25, name: '江西' },  
        { value: 30, name: '福建' },
        { value: 50, name: '山东' },
        { value: 60, name: '浙江' },
        { value: 20, name: '河南' },
        { value: 35, name: '湖北' },
        { value: 55, name: '安徽' }
    ],
    // 12   ['广西','海南','四川','湖南','西藏','贵州']
    [       
        { value: 30, name: '重庆' },
        { value: 35, name: '贵州' },
        { value: 70, name: '四川' },
        { value: 55, name: '湖南' },
        { value: 50, name: '西藏' },
        { value: 85, name: '广西' },
        { value: 70, name: '海南' },
        { value: 40, name: '云南' }
    ]
];
// 各省份每月 7天，5天，三天旅游花费

var multilinexaxis = [
    ['内蒙古', '安徽', '北京', '广东', '福建', '广西'],
    ['黑龙江', '江苏', '陕西', '广西', '浙江', '广东'],
    ['甘肃', '辽宁', '山西', '重庆', '河南', '四川'],
    ['江西', '福建', '浙江', '湖北', '云南', '陕西'],
    ['天津', '河北', '山东', '北京', '安徽', '河南',],
    ['浙江', '江苏', '黑龙江', '上海', '辽宁', '湖北'],
    ['广西', '海南', '湖南', '广东', '重庆', '云南'],
    ['江西', '山东', '青海', '福建', '新疆', '陕西'],
    ['山西', '河南', '福建', '内蒙古', '海南', '湖北'],
    ['天津', '河北', '辽宁', '北京', '黑龙江', '山西'],
    ['浙江', '安徽', '山东', '江苏', '湖北', '福建'],
    ['广西', '海南', '四川', '湖南', '西藏', '贵州']
];
var multilinedata = [
    // 1
    [
        [2300, 1900, 500, 1800, 2200, 2600],  // 7天
        [1900, 2500, 1300, 1300, 4000, 2700], // 5天
        [1500, 1100, 700, 2000, 1200, 1800],  // 3天
    ],
    // 2
    [
        [2800, 2300, 800, 2800, 2900, 3200],  // 7天
        [2200, 2900, 1600, 1600, 4600, 3100], // 5天
        [1800, 1400, 900, 2300, 1500, 2200],  // 3天
    ],
    // 3
    [
        [3100, 2500, 900, 2900, 3200, 3400],  // 7天
        [2400, 3200, 1700, 1700, 5100, 3400], // 5天
        [1900, 1500, 1000, 2600, 1700, 2500],  // 3天
    ],
    // 4
    [
        [3500, 3000, 1100, 3600, 3800, 3900],  // 7天
        [2700, 3600, 1900, 1900, 5600, 3800], // 5天
        [2100, 1700, 1100, 3000, 2000, 3000],  // 3天
    ],
    // 5
    [
        [3800, 3200, 1200, 4200, 4300, 4500],  // 7天
        [2900, 3900, 2100, 2100, 6400, 4300], // 5天
        [2300, 1800, 1200, 3400, 2300, 3500],  // 3天
    ],
    // 6
    [
        [4100, 3500, 1300, 4700, 4800, 4800],  // 7天
        [3100, 4200, 2200, 2400, 7200, 4800], // 5天
        [2500, 1900, 1300, 3800, 2500, 4000],  // 3天
    ],
    // 7
    [
        [4600, 3900, 1400, 5100, 5200, 5200],  // 7天
        [3500, 4700, 2500, 2800, 8500, 5300], // 5天
        [2800, 2100, 1500, 4400, 2800, 4500],  // 3天
    ],
    // 8
    [
        [5000, 4200, 1600, 5800, 6000, 6100],  // 7天
        [3800, 5200, 2800, 3200, 9700, 6200], // 5天
        [3100, 2300, 1600, 5100, 3200, 5000],  // 3天
    ],
    // 9
    [
        [4600, 3900, 1400, 5100, 5200, 5300],  // 7天
        [3500, 4700, 2500, 2800, 8500, 5600], // 5天
        [2800, 2100, 1500, 4400, 2800, 4700],  // 3天
    ],
    // 10
    [
        [4100, 3500, 1300, 4700, 4800, 5000],  // 7天
        [3100, 4200, 2200, 2400, 7200, 4800], // 5天
        [2500, 1900, 1300, 3800, 2500, 4000],  // 3天
    ],
    // 11
    [
        [3500, 3000, 1100, 3600, 3800, 4300],  // 7天
        [2700, 3600, 1900, 1900, 5600, 3800], // 5天
        [2100, 1700, 1100, 3000, 2000, 3000],  // 3天
    ],
    // 12
    [
        [2400, 2000, 900, 2800, 2900, 3400],  // 7天
        [1900, 2600, 1400, 1300, 4000, 2700], // 5天
        [1500, 1200, 800, 1900, 1200, 1800],   // 3天
    ]
];
var barxaxis = [
    ['湖南', '广东', '云南', '四川', '贵州', '新疆', '北京'],
    ['江苏', '上海', '浙江', '广西', '河北', '天津', '陕西'],
    ['河南', '山东', '福建', '辽宁', '湖北', '黑龙江', '甘肃'],
    ['内蒙古', '安徽', '吉林', '海南', '山西', '重庆', '青海'],
    ['宁夏', '江西', '湖南', '广东', '香港', '澳门', '台湾'],
    ['北京', '上海', '天津', '江苏', '浙江', '福建', '广东'],
    ['辽宁', '山东', '河北', '陕西', '甘肃', '青海', '新疆'],
    ['云南', '西藏', '贵州', '广西', '海南', '澳门', '台湾'],
    ['湖北', '重庆', '四川', '贵州', '陕西', '青海', '甘肃'],
    ['黑龙江', '吉林', '内蒙古', '河南', '山西', '宁夏', '新疆'],
    ['广西', '云南', '西藏', '四川', '贵州', '甘肃', '青海'],
    ['北京', '上海', '天津', '江苏', '浙江', '福建', '广东']
];
var bubbledata = [
    // 1
    [
        ['12000', 109, '私家车', '历史遗迹'],
        ['2000', 27, '大巴', '主题公园'],
        ['7000', 98, '动车', '自然景点'],
        ['6000', 54, '私家车', '历史遗迹'],
        ['20000', 143, '飞机', '自然景点'],
        ['22000', 131, '飞机', '历史遗迹'],
        ['4000', 52, '大巴', '主题公园'],
    ],
    // 2
    [
        ['1800', 135, '动车', '主题公园'],
        ['10800', 109, '私家车', '历史遗迹'],
        ['8400', 54, '大巴', '历史遗迹'],
        ['12600', 148, '飞机', '自然景点'],
        ['4200', 27, '大巴', '历史遗迹'],
        ['20000', 82, '私家车', '主题公园'],
        ['16200', 131, '飞机', '历史遗迹']
    ],
    // 3
    [
        ['5500', 92, '动车', '自然景点'],
        ['9600', 44, '私家车', '主题公园'],
        ['13500', 109, '私家车', '历史遗迹'],
        ['7000', 28, '大巴', '历史遗迹'],
        ['24000', 148, '飞机', '自然景点'],
        ['4200', 68, '私家车', '历史遗迹'],
        ['5400', 43, '大巴', '主题公园']
    ],
    // 4
    [
        ['12800', 75, '私家车', '历史遗迹'],
        ['3500', 42, '大巴', '主题公园'],
        ['5400', 52, '大巴', '自然景点'],
        ['6100', 66, '私家车', '历史遗迹'],
        ['32400', 129, '飞机', '自然景点'],
        ['12800', 106, '动车', '历史遗迹'],
        ['12000', 38, '私家车', '主题公园']
    ],
    // 5
    [
        ['7800', 62, '动车', '主题公园'],
        ['9500', 80, '私家车', '历史遗迹'],
        ['12000', 95, '飞机', '自然景点'],
        ['5400', 43, '大巴', '历史遗迹'],
        ['2400', 24, '大巴', '自然景点'],
        ['20800', 134, '私家车', '历史遗迹'],
        ['8400', 78, '动车', '主题公园']
    ],
    // 6
    [
        ['9800', 87, '私家车', '自然景点'],
        ['6800', 48, '大巴', '历史遗迹'],
        ['12800', 102, '动车', '历史遗迹'],
        ['5400', 36, '私家车', '主题公园'],
        ['19500', 122, '飞机', '自然景点'],
        ['6200', 57, '私家车', '自然景点'],
        ['9400', 73, '大巴', '主题公园']
    ],
    // 7
    [
        ['12500', 29, '私家车', '自然景点'],
        ['5000', 112, '大巴', '自然景点'],
        ['7820', 102, '动车', '历史遗迹'],
        ['5750', 72, '私家车', '主题公园'],
        ['22125', 132, '飞机', '历史遗迹'],
        ['5625', 31, '飞机', '自然景点'],
        ['3120', 75, '大巴', '主题公园']
    ],
    // 8
    [
        ['11950', 60, '私家车', '自然景点'],
        ['4500', 86, '大巴', '主题公园'],
        ['8850', 92, '动车', '历史遗迹'],
        ['6300', 36, '私家车', '主题公园'],
        ['22800', 138, '飞机', '历史遗迹'],
        ['6375', 33, '飞机', '主题公园'],
        ['3300', 48, '大巴', '历史遗迹']
    ],
    // 9
    [
        ['12500', 29, '私家车', '自然景点'],
        ['5000', 112, '大巴', '自然景点'],
        ['7820', 102, '动车', '历史遗迹'],
        ['5750', 72, '私家车', '主题公园'],
        ['22100', 132, '飞机', '历史遗迹'],
        ['5650', 31, '飞机', '自然景点'],
        ['3100', 75, '大巴', '主题公园']
    ],
    // 10
    [
        ['14250', 74, '动车', '自然景点'],
        ['4200', 42, '私家车', '主题公园'],
        ['11700', 87, '大巴', '历史遗迹'],
        ['4800', 51, '私家车', '自然景点'],
        ['30800', 135, '飞机', '历史遗迹'],
        ['10100', 32, '飞机', '自然景点'],
        ['3500', 79, '大巴', '自然景点']
    ],
    // 11
    [
        ['10200', 73, '动车', '自然景点'],
        ['4200', 26, '大巴', '主题公园'],
        ['9700', 62, '私家车', '历史遗迹'],
        ['6600', 48, '私家车', '自然景点'],
        ['24200', 143, '飞机', '历史遗迹'],
        ['7900', 38, '飞机', '自然景点'],
        ['3400', 78, '大巴', '自然景点']
    ],
    // 12
    [
        ['9300', 56, '大巴', '历史遗迹'],
        ['12500', 68, '动车', '自然景点'],
        ['5800', 42, '私家车', '主题公园'],
        ['34200', 140, '飞机', '历史遗迹'],
        ['7400', 35, '飞机', '自然景点'],
        ['4600', 66, '私家车', '自然景点'],
        ['3100', 87, '大巴', '自然景点']
    ]
];
var bardata = [
    [1500, 2000, 3000, 2800, 3500, 4000, 5000],
    [1200, 1800, 2200, 2600, 2900, 4000, 4500],
    [1000, 1600, 2300, 2500, 3100, 3600, 4700],
    [1300, 1900, 2700, 2400, 3300, 4100, 4800],
    [1400, 2100, 2900, 2600, 3600, 4300, 5200],
    [1100, 1700, 2100, 2900, 3200, 3800, 4400],
    [1700, 2400, 3100, 3400, 3700, 4300, 5400],
    [900, 1500, 2000, 2700, 3300, 3500, 4600],
    [1400, 2100, 2600, 2900, 3500, 4200, 5100],
    [1200, 1800, 2300, 2500, 3000, 3800, 4400],
    [1400, 2200, 3000, 2700, 3600, 4200, 5300],
    [1100, 1700, 2100, 2900, 3200, 3800, 4500]
];
var flydata = [
    // 1
    [
        ['福建', [
            [{ name: "福建" }, { name: "上海", value: 56 }],
            [{ name: "福建" }, { name: "广东", value: 124 }],
            [{ name: "福建" }, { name: "广西", value: 89 }],
            [{ name: "福建" }, { name: "云南", value: 32 }],
            [{ name: "福建" }, { name: "贵州", value: 78 }]
        ]],
        ['湖南', [
            [{ name: "湖南" }, { name: "浙江", value: 99 }],
            [{ name: "湖南" }, { name: "湖北", value: 67 }],
            [{ name: "湖南" }, { name: "安徽", value: 41 }],
            [{ name: "湖南" }, { name: "黑龙江", value: 105 }],
            [{ name: "湖南" }, { name: "江苏", value: 22 }]
        ]],
        ['西藏', [
            [{ name: "西藏" }, { name: "广西", value: 185 }],
            [{ name: "西藏" }, { name: "广东", value: 13 }],
            [{ name: "西藏" }, { name: "福建", value: 96 }],
            [{ name: "西藏" }, { name: "江西", value: 77 }],
            [{ name: "西藏" }, { name: "四川", value: 145 }]
        ]]
    ],
    // 2
    [
        ['内蒙古', [
            [{ name: "内蒙古" }, { name: "上海", value: 23 }],
            [{ name: "内蒙古" }, { name: "广西", value: 67 }],
            [{ name: "内蒙古" }, { name: "广东", value: 54 }],
            [{ name: "内蒙古" }, { name: "云南", value: 43 }],
            [{ name: "内蒙古" }, { name: "贵州", value: 88 }]
        ]],
        ['湖南', [
            [{ name: "湖南" }, { name: "浙江", value: 77 }],
            [{ name: "湖南" }, { name: "湖北", value: 45 }],
            [{ name: "湖南" }, { name: "安徽", value: 34 }],
            [{ name: "湖南" }, { name: "黑龙江", value: 99 }],
            [{ name: "湖南" }, { name: "江苏", value: 12 }]
        ]],
        ['西藏', [
            [{ name: "西藏" }, { name: "广西", value: 167 }],
            [{ name: "西藏" }, { name: "广东", value: 23 }],
            [{ name: "西藏" }, { name: "福建", value: 84 }],
            [{ name: "西藏" }, { name: "江西", value: 63 }],
            [{ name: "西藏" }, { name: "宁夏", value: 127 }]
        ]]
    ],
    // 3
    [
        ['黑龙江', [
            [{ name: "黑龙江" }, { name: "上海", value: 154 }],
            [{ name: "黑龙江" }, { name: "广西", value: 82 }],
            [{ name: "黑龙江" }, { name: "广东", value: 125 }],
            [{ name: "黑龙江" }, { name: "云南", value: 176 }],
            [{ name: "黑龙江" }, { name: "贵州", value: 35 }]
        ]],
        ['湖南', [
            [{ name: "湖南" }, { name: "浙江", value: 184 }],
            [{ name: "湖南" }, { name: "湖北", value: 57 }],
            [{ name: "湖南" }, { name: "安徽", value: 131 }],
            [{ name: "湖南" }, { name: "黑龙江", value: 77 }],
            [{ name: "湖南" }, { name: "江苏", value: 194 }]
        ]],
        ['西藏', [
            [{ name: "西藏" }, { name: "广西", value: 92 }],
            [{ name: "西藏" }, { name: "广东", value: 168 }],
            [{ name: "西藏" }, { name: "福建", value: 145 }],
            [{ name: "西藏" }, { name: "江西", value: 110 }],
            [{ name: "西藏" }, { name: "宁夏", value: 11 }]
        ]]
    ],
    // 4
    [
        ['甘肃', [
            [{ name: "甘肃" }, { name: "四川", value: 168 }],
            [{ name: "甘肃" }, { name: "云南", value: 75 }],
            [{ name: "甘肃" }, { name: "青海", value: 112 }],
            [{ name: "甘肃" }, { name: "陕西", value: 190 }],
            [{ name: "甘肃" }, { name: "内蒙古", value: 28 }]
        ]],
        ['河南', [
            [{ name: "河南" }, { name: "河北", value: 196 }],
            [{ name: "河南" }, { name: "山东", value: 59 }],
            [{ name: "河南" }, { name: "江苏", value: 137 }],
            [{ name: "河南" }, { name: "湖北", value: 83 }],
            [{ name: "河南" }, { name: "河南", value: 203 }]
        ]],
        ['浙江', [
            [{ name: "浙江" }, { name: "江苏", value: 87 }],
            [{ name: "浙江" }, { name: "福建", value: 163 }],
            [{ name: "浙江" }, { name: "广东", value: 141 }],
            [{ name: "浙江" }, { name: "上海", value: 104 }],
            [{ name: "浙江" }, { name: "浙江", value: 13 }]
        ]]
    ],
    // 5
    [
        ['新疆', [
            [{ name: "新疆" }, { name: "上海", value: 89 }],
            [{ name: "新疆" }, { name: "广西", value: 138 }],
            [{ name: "新疆" }, { name: "广东", value: 46 }],
            [{ name: "新疆" }, { name: "云南", value: 177 }],
            [{ name: "新疆" }, { name: "贵州", value: 23 }]
        ]],
        ['湖南', [
            [{ name: "湖南" }, { name: "广东", value: 166 }],
            [{ name: "湖南" }, { name: "山东", value: 53 }],
            [{ name: "湖南" }, { name: "江西", value: 78 }],
            [{ name: "湖南" }, { name: "四川", value: 131 }],
            [{ name: "湖南" }, { name: "贵州", value: 21 }]
        ]],
        ['广东', [
            [{ name: "广东" }, { name: "海南", value: 13 }],
            [{ name: "广东" }, { name: "湖南", value: 103 }],
            [{ name: "广东" }, { name: "福建", value: 57 }],
            [{ name: "广东" }, { name: "云南", value: 189 }],
            [{ name: "广东" }, { name: "广西", value: 72 }]
        ]]
    ],
    // 6
    [
        ['吉林', [
            [{ name: "吉林" }, { name: "辽宁", value: 53 }],
            [{ name: "吉林" }, { name: "黑龙江", value: 89 }],
            [{ name: "吉林" }, { name: "北京", value: 27 }],
            [{ name: "吉林" }, { name: "上海", value: 168 }],
            [{ name: "吉林" }, { name: "河北", value: 17 }]
        ]],
        ['河南', [
            [{ name: "河南" }, { name: "湖北", value: 182 }],
            [{ name: "河南" }, { name: "山西", value: 69 }],
            [{ name: "河南" }, { name: "河北", value: 32 }],
            [{ name: "河南" }, { name: "陕西", value: 121 }],
            [{ name: "河南" }, { name: "安徽", value: 46 }]
        ]],
        ['广东', [
            [{ name: "广东" }, { name: "海南", value: 23 }],
            [{ name: "广东" }, { name: "湖南", value: 74 }],
            [{ name: "广东" }, { name: "福建", value: 43 }],
            [{ name: "广东" }, { name: "广西", value: 194 }],
            [{ name: "广东" }, { name: "云南", value: 87 }]
        ]]
    ],
    // 7
    [
        ['河北', [
            [{ name: "河北" }, { name: "北京", value: 100 }],
            [{ name: "河北" }, { name: "河南", value: 100 }],
            [{ name: "河北" }, { name: "山东", value: 100 }],
            [{ name: "河北" }, { name: "天津", value: 100 }],
            [{ name: "河北" }, { name: "山西", value: 100 }]
        ]],
        ['安徽', [
            [{ name: "安徽" }, { name: "浙江", value: 100 }],
            [{ name: "安徽" }, { name: "江苏", value: 100 }],
            [{ name: "安徽" }, { name: "江西", value: 100 }],
            [{ name: "安徽" }, { name: "湖南", value: 100 }],
            [{ name: "安徽" }, { name: "河南", value: 100 }]
        ]],
        ['山西', [
            [{ name: "山西" }, { name: "陕西", value: 100 }],
            [{ name: "山西" }, { name: "内蒙古", value: 100 }],
            [{ name: "山西" }, { name: "河南", value: 100 }],
            [{ name: "山西" }, { name: "河北", value: 100 }],
            [{ name: "山西" }, { name: "北京", value: 100 }]
        ]]
    ],
    // 8
    [
        ['贵州', [
            [{ name: "贵州" }, { name: "四川", value: 66 }],
            [{ name: "贵州" }, { name: "湖南", value: 104 }],
            [{ name: "贵州" }, { name: "广东", value: 42 }],
            [{ name: "贵州" }, { name: "云南", value: 155 }],
            [{ name: "贵州" }, { name: "北京", value: 23 }]
        ]],
        ['河北', [
            [{ name: "河北" }, { name: "北京", value: 177 }],
            [{ name: "河北" }, { name: "河南", value: 93 }],
            [{ name: "河北" }, { name: "山东", value: 62 }],
            [{ name: "河北" }, { name: "天津", value: 126 }],
            [{ name: "河北" }, { name: "山西", value: 53 }]
        ]],
        ['广西', [
            [{ name: "广西" }, { name: "云南", value: 32 }],
            [{ name: "广西" }, { name: "广东", value: 129 }],
            [{ name: "广西" }, { name: "海南", value: 74 }],
            [{ name: "广西" }, { name: "湖南", value: 187 }],
            [{ name: "广西" }, { name: "四川", value: 86 }]
        ]]
    ],
    // 9
    [
        ['山西', [
            [{ name: "山西" }, { name: "河南", value: 36 }],
            [{ name: "山西" }, { name: "陕西", value: 115 }],
            [{ name: "山西" }, { name: "北京", value: 44 }],
            [{ name: "山西" }, { name: "山东", value: 163 }],
            [{ name: "山西" }, { name: "内蒙古", value: 24 }]
        ]],
        ['河南', [
            [{ name: "河南" }, { name: "北京", value: 177 }],
            [{ name: "河南" }, { name: "河北", value: 93 }],
            [{ name: "河南" }, { name: "山西", value: 62 }],
            [{ name: "河南" }, { name: "天津", value: 126 }],
            [{ name: "河南" }, { name: "山东", value: 53 }]
        ]],
        ['广东', [
            [{ name: "广东" }, { name: "江苏", value: 28 }],
            [{ name: "广东" }, { name: "浙江", value: 129 }],
            [{ name: "广东" }, { name: "福建", value: 73 }],
            [{ name: "广东" }, { name: "海南", value: 191 }],
            [{ name: "广东" }, { name: "重庆", value: 86 }]
        ]]
    ],
    // 10
    [
        ['河南', [
            [{ name: "河南" }, { name: "北京", value: 76 }],
            [{ name: "河南" }, { name: "河北", value: 49 }],
            [{ name: "河南" }, { name: "山西", value: 119 }],
            [{ name: "河南" }, { name: "天津", value: 167 }],
            [{ name: "河南" }, { name: "山东", value: 23 }]
        ]],
        ['广西', [
            [{ name: "广西" }, { name: "福建", value: 115 }],
            [{ name: "广西" }, { name: "浙江", value: 31 }],
            [{ name: "广西" }, { name: "广东", value: 184 }],
            [{ name: "广西" }, { name: "海南", value: 75 }],
            [{ name: "广西" }, { name: "云南", value: 32 }]
        ]],
        ['江苏', [
            [{ name: "江苏" }, { name: "浙江", value: 40 }],
            [{ name: "江苏" }, { name: "安徽", value: 151 }],
            [{ name: "江苏" }, { name: "上海", value: 81 }],
            [{ name: "江苏" }, { name: "山东", value: 14 }],
            [{ name: "江苏" }, { name: "江西", value: 198 }]
        ]]
    ],
    // 11 
    [
        ['四川', [
            [{ name: "四川" }, { name: "云南", value: 54 }],
            [{ name: "四川" }, { name: "贵州", value: 101 }],
            [{ name: "四川" }, { name: "重庆", value: 32 }],
            [{ name: "四川" }, { name: "甘肃", value: 170 }],
            [{ name: "四川" }, { name: "湖南", value: 23 }]
        ]],
        ['海南', [
            [{ name: "海南" }, { name: "广东", value: 143 }],
            [{ name: "海南" }, { name: "北京", value: 57 }],
            [{ name: "海南" }, { name: "上海", value: 99 }],
            [{ name: "海南" }, { name: "浙江", value: 95 }],
            [{ name: "海南" }, { name: "江苏", value: 17 }]
        ]],
        ['陕西', [
            [{ name: "陕西" }, { name: "山西", value: 78 }],
            [{ name: "陕西" }, { name: "四川", value: 115 }],
            [{ name: "陕西" }, { name: "宁夏", value: 92 }],
            [{ name: "陕西" }, { name: "甘肃", value: 55 }],
            [{ name: "陕西" }, { name: "河南", value: 22 }]
        ]]
    ],
    // 12
    [
        ['青海', [
            [{ name: "青海" }, { name: "四川", value: 36 }],
            [{ name: "青海" }, { name: "云南", value: 89 }],
            [{ name: "青海" }, { name: "西藏", value: 81 }],
            [{ name: "青海" }, { name: "内蒙古", value: 122 }],
            [{ name: "青海" }, { name: "甘肃", value: 46 }]
        ]],
        ['湖北', [
            [{ name: "湖北" }, { name: "江苏", value: 73 }],
            [{ name: "湖北" }, { name: "浙江", value: 55 }],
            [{ name: "湖北" }, { name: "湖南", value: 102 }],
            [{ name: "湖北" }, { name: "广东", value: 36 }],
            [{ name: "湖北" }, { name: "安徽", value: 43 }]
        ]],
        ['广东', [
            [{ name: "广东" }, { name: "海南", value: 52 }],
            [{ name: "广东" }, { name: "香港", value: 63 }],
            [{ name: "广东" }, { name: "澳门", value: 99 }],
            [{ name: "广东" }, { name: "福建", value: 17 }],
            [{ name: "广东" }, { name: "北京", value: 29 }]
        ]]
    ]
];
var geoCoordMap = {
    '黑龙江': [127.9688, 45.368],
    '内蒙古': [110.3467, 41.4899],
    "吉林": [125.8154, 44.2584],
    '北京': [116.4551, 40.2539],
    "辽宁": [123.1238, 42.1216],
    "河北": [114.4995, 38.1006],
    "天津": [117.4219, 39.4189],
    "山西": [112.3352, 37.9413],
    "陕西": [109.1162, 34.2004],
    "甘肃": [103.5901, 36.3043],
    "宁夏": [106.3586, 38.1775],
    "青海": [101.4038, 36.8207],
    "新疆": [87.9236, 43.5883],
    "西藏": [91.11, 29.97],
    "四川": [103.9526, 30.7617],
    "重庆": [108.384366, 30.439702],
    "山东": [117.1582, 36.8701],
    "河南": [113.4668, 34.6234],
    "江苏": [118.8062, 31.9208],
    "安徽": [117.29, 32.0581],
    "湖北": [114.3896, 30.6628],
    "浙江": [119.5313, 29.8773],
    "福建": [119.4543, 25.9222],
    "江西": [116.0046, 28.6633],
    "湖南": [113.0823, 28.2568],
    "贵州": [106.6992, 26.7682],
    "云南": [102.9199, 25.4663],
    "广东": [113.12244, 23.009505],
    "广西": [108.479, 23.1152],
    "海南": [110.3893, 19.8516],
    '上海': [121.4648, 31.2891]

};