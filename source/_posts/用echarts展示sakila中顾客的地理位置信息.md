---
title: 用echarts展示sakila中顾客的地理位置信息
date: 2019-04-16 20:16:40
tags: [javascrip]
---
## 写在前面
使用echarts最重要的就是把options配置正确，
下面是官网上介绍的options每一个配置的含义
> chart	是指一个完整的图表，如折线图，饼图等“基本”图表类型或由基本图表组合而成的“混搭”图表，可能包括坐标轴、图例等
axis	直角坐标系中的一个坐标轴，坐标轴可分为类目型、数值型或时间型
xAxis	直角坐标系中的横轴，通常并默认为类目型
yAxis	直角坐标系中的纵轴，通常并默认为数值型
grid	直角坐标系中除坐标轴外的绘图网格，用于定义直角系整体布局
legend	图例，表述数据和图形的关联
dataRange	值域选择，常用于展现地域数据时选择值域范围
dataZoom	数据区域缩放，常用于展现大量数据时选择可视范围
roamController	缩放漫游组件，搭配地图使用
toolbox	辅助工具箱，辅助功能，如添加标线，框选缩放等
tooltip	气泡提示框，常用于展现更详细的数据
timeline	时间轴，常用于展现同一系列数据在时间维度上的多份数据
series	数据系列，一个图表可能包含多个系列，每一个系列可能包含多个数据

入门级玩家在官网上找一个差不多的样例来改就行了
我找的是这个https://echarts.baidu.com/examples/editor.html?c=map-parallel-prices

## 准备数据
因为需要城市的经纬度信息，正好tableau可以自动生成经纬度信息，所以我就用它来生成
![](https://static.ifthat.com/public/data/QZWKDR8P.png)

导出数据
![](https://static.ifthat.com/public/data/Q_X2CX.png)
![导出的数据](https://static.ifthat.com/public/data/NLC35P8O.png)

因为js比较好处理json格式一点，所以用在线格式转换工具把csv格式转换成json格式
![转换数据格式](https://static.ifthat.com/public/data/B82GV.png)

## JavaScript代码
把数据粘贴到js代码里面
![](https://static.ifthat.com/public/data/1001.png)

因为echarts里面option.series.data接收的是类似**[{name: 'cityname', value: [longitude, latitude, count]},...]**这种格式的数据，所以需要转换一下
``` javascript
// 转换数据格式为[{name: 'cityname', value: [longitude, latitude, count]}]
function makeMapData(rawData) {
    var mapData = [];
    for (var i = 0; i < rawData.length; i++) {
    	var ls = []
        ls.push(rawData[i].longitude)
        ls.push(rawData[i].latitude)
        ls.push(rawData[i].count)
        mapData.push({
            name: rawData[i].city,
            value: ls
        });
    
    }
    return mapData;
};
```
option配置里面这样调用
![](https://static.ifthat.com/public/data/1003.png)

现在应该是不会正常显示的，因为地图插件需要引入另外一个js文件
地址是http://gallery.echartsjs.com/dep/echarts/map/js/world.js
![](https://static.ifthat.com/public/data/1004.png)
导入后正常显示
![](https://static.ifthat.com/public/data/1005.png)
但是这颜色太单调了，我想绚丽一点，修改options.series.itemstyle.normal.color为随机的颜色
![](https://static.ifthat.com/public/data/1010.png)
![](https://static.ifthat.com/public/data/1007.png)
我还想让每个城市人数不同展示不同的大小，修改options.series.symbolSize
![](https://static.ifthat.com/public/data/1008.png)
data[2]就是原始数据里面的count
![最终效果](https://static.ifthat.com/public/data/1009.png)
只有London有两个顾客，其他城市都只有一个顾客，所以看起来大小都差不多

效果: <https://static.ifthat.com/public/data/Echarts可视化.html>
源代码:<https://static.ifthat.com/public/data/Echarts可视化.txt>
