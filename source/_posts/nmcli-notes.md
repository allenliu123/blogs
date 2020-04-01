---
title: nmcli 使用笔记
tags: wifi
date: 2020-04-01 17:10:52
---


system version: fedora 30
nmcli version: 1.16.4-1.fc30

## nmcli 介绍

nmcli 是 NetworkManager 的命令行工具，详细请参考[官方文档](https://developer.gnome.org/NetworkManager/stable/nmcli.html)

## 简单使用

fedora 30 预装 Gnome，Gnome 桌面自带 NetworkManager， 可以直接打开网络设置，就可以连 WIFI，开热点等操作
但是我使用的是 i3wm，没有使用 Gnome，所以连 wifi 需要使用 nmcli
![](https://static.ifthat.com/public/data/3c0c19af42e4f341-image.png)

0. **打开关闭 wifi**
`nmcli radio wifi on[off]`

0. **列出附近 wifi 列表**
`nmcli device wifi list`
![](https://static.ifthat.com/public/data/1c765ef9d0c8c504-image.png)

0. **建立一个 wifi 连接**
`nmcli device wifi connect TP-LINK_33D8 password 12345678`
连接成功后，会在 `/etc/sysconfig/network-scripts` 生成两个文件，*ifcfg-TP-LINK_33D8* 和 *keys-TP-LINK_33D8*，一个是 wifi 配置信息，一个是 wifi 密码
![](https://static.ifthat.com/public/data/5cedf419803c641e-image.png)
    > 注：fedora 30 是这个 `/etc/sysconfig/network-scripts` 位置，其他系统不一定

0. **第一次建立连接后可以使用以下命令打开和关闭 wifi**
`nmcli connection up[down] TP-LINK_33D8`
`nmcli device connect[disconnect] wlp3s0`
![](https://static.ifthat.com/public/data/f59f91a9ee66ab9b-image.png)

0. **创建热点**
    命令格式：`wifi hotspot [ifname ifname] [con-name name] [ssid SSID] [ band { a | bg } ] [channel channel] [password password]`
    | 属性 | 解释 |
    | ----- | ----- |
    | ifname | 使用的网络设备名称 |
    | con-name  | 热点的名称 |
    | ssid  | 热点的ssid |
    | band | wifi的协议标准 |
    | channel | 信道 |
    | password | 热点的密码 |
    示例：`nmcli device wifi hotspot ifname wlp3s0 con-name myhotspot ssid myhotspotSSID password 12345678`

0. **打开关闭热点**
`nmcli connection up[down] myhotspot`
    > 注：和打开 wifi 关闭 wifi 是一样的

0. **修改热点密码**
`sudo vim /etc/sysconfig/network-scripts/keys-TP-LINK_33D8`

## 使用 nm-applet
嫌命令行操作太麻烦也可以使用 nm-applet
nm-applet 是 NetworkManager 提供的小程序，可以在 i3wm 状态栏显示图标
直接命令行输入 `nm-applet`，即可运行
![](https://static.ifthat.com/public/data/b55d0882a587a59c-Screenshot-from-2020-04-01-18-02-01.png)

每次打开比较麻烦，可以写到 i3wm 的配置里面，每次开机，自动运行
在 ~/.config/i3/config 文件里面加一句 `exec --no-startup-id nm-applet`
![](https://static.ifthat.com/public/data/b597009244f94aee-image.png)
