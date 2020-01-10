---
title: enron 数据可视化 + itunes 歌手单曲统计
date: 2018-11-17 10:38:57
tags: [nodejs, charjs, mysql]
---
## enron 数据可视化
### 思路
- 目的：统计enron数据集每周发的邮件总数
- 步骤：
   - 下载数据集导入数据库
   - 用nodejs查询出结果返回json
   - 前端chartjs解析为图表

### 创建数据库
`mysql -u root -p`
`create database enron`

### 下载enron数据库并导入到数据库
`wget http://www.ahschulz.de/pub/R/data/enron-mysqldump_v5.sql.gz`
`gzip -d enron-mysqldump_v5.sql.gz`
`mysql enron < enron-mysqldump_v5.sql`

### 编写 sql 语句
`select concat(year(date),"/",weekofyear(date)) as year_week,count(mid) from message where year(date) between 1998 and 2002 group by year_week order by date asc;`

![sql查询结果](https://ifthat.com/file/enron_result.png)

### nodejs 代码
- 初始化项目
	`npm init`
	`npm install express --save`
	`npm install mysql --save`
	`node app.js`

- 代码
``` js
var express = require('express');
var mysql = require('mysql');
var config = require('./config.json');
var db = config.db;

var app = express();
var connection = mysql.createConnection({
	host: db.host,
	port: db.port,
	user: db.user,
	password: db.password,
	database: db.database
});
connection.connect();

app.get('/', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	var sql = 'select concat(year(date),"/",weekofyear(date)) as year_week,count(mid) from message where year(date) between 1998 and 2002 group by year_week order by date asc';
	var weeklist = [];
	var midlist = [];
	connection.query(sql, function(err, results){
		if(err){console.log("error: " + err.sqlMessage); return;}
		results.forEach(function(item){
			weeklist.push(item['year_week']);
			midlist.push(item['count(mid)']);
		});
		res.json({
			weeklist: weeklist,
			midlist: midlist
		})
	});

});

app.listen(8083);

console.log('the application started at port 8083');
```

### 前端html
``` html 
<!DOCTYPE html>
<html>
<head>
	<title>enron view</title>
	<script src="https://cdn.bootcss.com/Chart.js/2.7.3/Chart.min.js"></script>
	<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
</head>
<body>
	<canvas id="Chart" width="500" height="200"></canvas>

<script type="text/javascript">
var ctx = document.getElementById("Chart").getContext('2d');

$.get('https://api.yjqing.xin', function(res){
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: res.weeklist,
			datasets: [{
				label: 'count',
				data: res.midlist,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1
			}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
	});
});
</script>
</body>
</html>
```
![显示效果](https://ifthat.com/file/result-enron.png)

### 错误处理

enron message 数据表有很多错误数据，比如有的年份只有两位数，sql语句中用 where year(date) between 1998 and 2002 解决


## 爬取itunes某个歌手的部分单曲

利用itunes的api，访问https://itunes.apple.com/search?term=jack+johnson
term=歌手名,会返回一个json文件
![](https://ifthat.com/file/Screenshot%20from%202018-11-19%2010-44-27.png)

### 编写nodejs代码
``` js
var request = require('sync-request');
var mongoose = require('mongoose');
var TrackName = require('./model/trackName.js');
mongoose.connect('mongodb://test:test@yjqing.xin:27017/test', {useNewUrlParser: true});
var url = 'https://itunes.apple.com/search?term=jack+johnson';
var txt = request('GET', url).getBody().toString();
var json = JSON.parse(txt);
var lst = json.results;
lst.forEach(function(item){
	var trackName = new TrackName({
		name: item.trackName
	});
	trackName.save().then(function(res,err){
		if(err){
			console.log(err);
		}else{
			console.log('success');
		}
	});
});
```
此代码会发送http请求，返回得到json数据，解析数据，提取歌手的单曲名，并存入mongodb数据库中
### 结果
![](https://ifthat.com/file/Screenshot%20from%202018-11-09%2010-38-55.png)
