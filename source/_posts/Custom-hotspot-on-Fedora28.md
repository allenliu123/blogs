---
title: Fedora28 上开自定义热点
date: 2018-08-10 20:36:03
tags: linux
---

fedora28的Gnome桌面可以开热点了，但是有时候是需要用命令行来开热点怎么办

先开启wifi
```
nmcli radio wifi on
nmcli con up Hotspot ifname wlp3s0
```

不出意外，现在就开好了热点，名字和密码和你Gnome设置的一样

但如果不知道密码或者想改密码，那就需要下面这几步了

```
sudo vim  /etc/sysconfig/network-scripts/ifcfg-Hotspot
```

里面有个ESSID就是用户名

如果要修改密码的话，修改下面这个文件修改WPA_PSK的值就行了
```
sudo vim /etc/sysconfig/network-scripts/keys-Hotspot
```
