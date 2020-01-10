---
title: ubuntu mariadb 无法连接远程连接的解决思路
date: 2018-11-20 10:48:23
tags: [linux, mariadb]
---
今天在阿里云服务器上安装mysql，原本以为会很顺利，结果总是无法远程连接
搞了很久才解决，浪费了这么多时间，写篇博客记(ma)录(niang)一下，避免下次在入坑

## 设置数据库可外网访问
mysqladmin 初始化的用户一般是只能本地登录访问的，要添加一个外网访问的数据库
`mysql -u root -p`
新建用户
`create user username@localhost identified by 'password'; // 设置外网访问create user username@'%' identified by 'password';`
设置权限
`grant all privileges on testdb.* to 'username';`

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2010-25-50.png)
原本以为这样就成功了，谁知道输入命令mysql -h 120.79.237.202 -P 3306 -u root -p 
ERROR 2003 (HY000): Can't connect to MySQL server on '120.79.237.202' (111)
连接不上
开始找原因

## 检查mysqld是否开启和端口监听情况
`netstat -nltp `

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2009-30-35.png)

这里mysqld的端口是3306，0.0.0.0也没错
如果你的不是0.0.0.0，而是127.0.0.1，需要修改/etc/mysql/mariadb.conf.d/50-server.cnf

## 修改配置文件
ubuntu 的配置文件在/etc/mysql/mariadb.conf.d/50-server.cnf，不知道为什么要放在这样一个地方，

`vim /etc/mysql/mariadb.conf.d/50-server.cnf`

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2009-35-02.png)

把bind-address=127.0.0.1 改为 bind-address=0.0.0.0 或者直接注释掉
重启服务
`/etc/init.d/mysql restart`

改为0.0.0.0会像上图一样，但是注释掉的话，会变为这样

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2009-40-37.png)

这样是正常的，0.0.0.0是所有IPv4的网络，:::表示所有IPv6的ip访问，都没问题

## 检查ip能否ping通和3306是否能访问
`ping 120.79.237.202`

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2009-47-04.png)

`telnet 120.79.237.202 3306`

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2009-54-09.png)

问题来了，3306不通

## 检查防火墙
`sudo iptables -L -n`

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2009-57-48.png)

这里也没问题，已经开放3306端口了，如果你的3306没开，输入命令iptables -A INPUT -p tcp --dport 3306 -j ACCEPT 即可

都没问题，想了好久，想到会不会是服务商的防火墙规则

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2009-52-47.png)

妈蛋, 真的是服务上的防火墙的问题，赶快添加一条规则

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2010-02-18.png)

`mysql -h 120.79.237.202 -u root -p`

![](https://ifthat.com/file/Screenshot%20from%202018-11-20%2010-16-58.png)

成功！！！