---
title: Linux上 MongoDB 实现远程连接并设置账号密码
date: 2018-07-31 20:26:31
tags:
- mongodb
- linux
---

本地系统：Fedora 28
服务器系统：CentOS 7

## 安装
在本地安装客户端
`sudo dnf install mondodb`

在服务器上安装服务端
`sudo dnf install mongodb-server`

基本的操作网上很多（比如指定数据库路径`--dbpath`，指定端口`--port`），这里就不缀述了，我觉得菜鸟教程不错，给个链接<http://www.runoob.com/mongodb/mongodb-tutorial.html>

## 设置可远程连接

开启服务时加上 `--bind_ip_all` 参数就会设置了可以远程连接, 可用netstat -nltp来查看

`mongod --bind_ip_all`
`netstat -nltp`
![图片描述](https://ifthat.com/file/Screenshot%20from%202018-08-14%2004-30-47.png)

端口号为27017前面的ip是0.0.0.0而不是127.0.0.1表示正确

现在就可以在客户端来连接了

## 设置账号密码
MongoDB 默认安装完成以后，只允许本地连接，同时不需要使用任何账号密码就可以直接连接MongoDB，这样是很不安全的，所以我们要设个密码

服务器端开启服务，非auth验证方式
`mongod  --bind_ip_all`

客户端连接
`mongo [yourIP]:27017`
`use admin`

创建管理员账户
`db.createUser({ user: "useradmin", pwd: "adminpassword", roles: [{ role: "userAdminAnyDatabase", db: "admin" }] })`

mongodb中的用户是基于身份role的，该管理员账户的 role是 userAdminAnyDatabase。 'userAdmin' 代表用户管理身份， 'AnyDatabase' 代表可以管理任何数据库

创建普通用户（为了安全，应该每个数据库或者每个业务都创建自己的账户，这样即使一个业务密码被别人知道了，不会影响到其他的数据库）
`use yourdatabase`
`db.createUser({ user: "youruser", pwd: "yourpassword", roles: [{ role: "dbOwner", db: "yourdatabase" }] })`

服务器上账户创建完成后，ctrl C 掉，重新用密码验证方式开启服务

服务器端重启服务，auth验证方式
`mongod --auth --bind_ip_all //加了--auth 表示需要验证用户名密码`

## 客户端连接

客户端连接
`mongo [yourIP]:27017`
`use admin // 需要先选择admin数据库才可以作验证`
`db.auth('useradmin','adminpassword') // 返回1就表示验证成功，获得所有权限了`

ps：上面的方式太麻烦，其实客户端用户名密码连接还有类似mysql的连接方式
`mongo localhost:27017/admin -u useradmin -p`//如果是普通用户的话，admin 改为你的数据库

--fork 参数表示后台启动
`mongod --fork --logpath /var/log/mongodb/mongod.log`

后台启动这种方式启动后只能这样关闭
`mongod --shutdown `

## 修改密码 

非验证方式打开 mongod 服务
`mongod`
`mongo`
`use admin`
`db.changeUserPassword('user','newpassword'); // 必须用户名存在`