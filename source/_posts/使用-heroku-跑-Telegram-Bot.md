---
title: 使用 heroku 跑 Telegram Bot
tags:
  - heroku
  - Telegram
date: 2020-04-02 01:01:33
---

早就听说了 heroku 的大名，这次终于有机会体验一把了。

我的 Telegram Bot [@ifthat_bot](https://t.me/ifthat_bot)，Telegram 在墙外，所以 bot 程序也必须运行在墙外，以前都是在我国内服务器上安装 v2ray，使用 `proxychains node app.js` 来运行，但是我买的翻墙服务不稳定，想到了 heroku 不是可以免费运行我的服务吗（还不是因为没钱），而且还是国外的服务器，打算使用 heroku 来~~白嫖~~运行试试。
下面记录一下过程和遇到的问题

## 注册 Heroku 账户

https://signup.heroku.com/login

##  heroku 命令行工具
这个命令行工具非常强大，直接使用命令行的方式替代所有在网页上的操作，例如：新建 app (hero create:{appName})

### 安装
[官网](https://devcenter.heroku.com/articles/heroku-cli)有各种安装方式，作为 nodejs 开发者，当然更喜欢 npm

`npm install heroku -g`

### 命令行登录
`heroku login`
终端会调起浏览器登录页面，如果浏览器已经登录了 heroku， 直接就会登录成功
> 登录成功后就可以愉快的玩耍了

### 创建 app
我先 cd 到我的项目路径下，`create apps:ifthat-bot-heroku`, ifthat-bot-heroku 就是 heroku app 名字，不写的画面，会生成随机的名字
`heroku apps`可以查看你的 app，也可以在网页端查看(https://dashboard.heroku.com/apps)

### 添加 config vars
hero app 都是需要发布到 git 仓库的，但是我不想也不能把我的 bot token 写到代码里面
hero 提供了一个好的解决方案，就是 config vars ，他可以把一些变量写到 config vars 里面，见[官网介绍](https://devcenter.heroku.com/articles/config-vars)
`heroku config:set token={telegram_bot_token} -a ifthat-bot-heroku`
程序里面可以使用 `const token = process.env.token` 取得 token 的值

### 添加 heroku 的 git
create 命令会自动创建一个 git， 地址是 git@heroku.com:ifthat-bot-heroku.git
`git init`
`git remote add heroku git@heroku.com:ifthat-bot-heroku.git`
`git add . && git commit -m 'add heroku'`
`git push heroku master`
现在我的项目就跑在了 heroku 的服务器上了，地址就是 https://ifthat-bot-heroku.herokuapp.com/

### 查看 log
`heroku logs --tail -a ifthat-bot-heroku`

## 问题
经常会断掉，找了半天原来是因为这个服务运行完就会停止
解决办法：跑一个 web 服务，让它一直监听
``` javascript
var http = require('http');

http.createServer(function (req, res) {
  res.end("I am running");
}).listen(process.env.PORT || 5000);
```