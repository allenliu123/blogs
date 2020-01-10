---
title: fedora 28 安装后的配置
date: 2018-07-28 08:15:50
tags: [chrome, sublime, linux]
---

现在重装过我的linux系统大概3次，每次装完系统都要配置好半天，不像windows一样，装完之后就可以用了，还会出现不少的问题，现在作一个记录，为了下次的重装系统不再麻烦
## zsh
sudo dnf install zsh
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
需要重启生效


## 安装shadowsocks

shadowsocks 在我之前都是可以用的，但是，我在今天的fedora28后，用sudo dnf install shadowsocks-qt5 后发现用不了了，网上一查，好多都说用不了了，后来有一个老铁说可以用shadowsocks-libev代替，下面写一些步骤
- sudo dnf install shadowsocks-libev
- 配置一下 /etc/shadowsocks-libev/config.json
    ``` js
    {
        "server":"你的服务器ip或域名",
        "server_port":服务器端口,
        "local_port":本地端口,
        "password":"密码",
     	"timeout":60,
        "method":"加密方式"
    }
    ```
- ss-local [-c /etc/shadowsocks-libev/config.json]
这样就搞定了
这是用配置文件的方式，可以用另外一种方式
 
> ss-local -s 服务器地址 -p 服务器端口 -l 本地端端口 -k 密码 -m 加密方法
 
配合nohup和&可以使之后台运行，关闭终端也不影响
 
`nohup ss-local > /dev/null 2>&1 &`
 
shadowsocks客户端启动后，其他程序并不会直接应用socks5连接，浏览器要用一些插件来连接，比如SwitchOmega
> fedora 30 不能 dnf install shadowsocks-libev
> 解决方案
> `sudo pip3 install shadowsocks`
> 如果有错，https://kionf.com/2016/12/15/errornote-ss/


## 安装 chrome
https://www.if-not-true-then-false.com/2010/install-google-chrome-with-yum-on-fedora-red-hat-rhel/
sudo -i
dnf install fedora-workstation-repositories
dnf config-manager --set-enabled google-chrome
dnf install google-chrome-stable

 
## 下载 SwitchyOmega

chrome 的插件商店是需要翻墙的，以前可以到其他地方把这个插件下载下来，拖进插件管理中心就行了。但是现在版本更新后好像不行了
我的所有插件都是和chrome账户同步了的，所以我只需要登陆账户就行了，那么问题就来了，chrome登陆账户也是需要翻墙的
现在的办法就是用全局代理，给出设置后的截图

![text](https://ifthat.com/file/blog2.png)

设置好之后就全局代理了
 
## proxychains

如果某个应用想要临时代理以下，那就需要用到proxychains了

### 安装

`sudo dnf install proxychains`

### 配置 /etc/proxychains.conf

把这个文件最后一行改为

`socks5  127.0.0.1 1080`

在开启shadowsocks的情况下，就可以直接用 proxychains4 某某程序 来临时代理一下了

## i3管理器

作为一个非常强大的平铺式桌面管理器，在我朋友@nova第一次给我用了之后就爱不释手了，我的朋友们全都在用它

### 安装

借助nova的博客<https://nova.moe/playing-i3wm-with-fedora/>，安装

### 配置

配置文件在 /home/allen/.config/i3/config，我的配置文件在[我的github](https://github.com/allenliu123/config/blob/master/i3/config)上

### 配置i3中文输入法

i3里面只有英文输入，对于一个中国人必须要一个中文输入法呀
执行两步就够了

- 终端输入 ibus-daemon
- 然后ibus-setup添加中文 

### network-manager-applet
dnf --refresh install network-manager-applet


## 好用的工具 sublime-text3

sublime 是一个非常小，但是功能非常强大的文本编辑器

### 安装
`sudo rpm -v --import https://download.sublimetext.com/sublimehq-rpm-pub.gpg`
`sudo dnf config-manager --add-repo https://download.sublimetext.com/rpm/stable/x86_64/sublime-text.repo`
`sudo dnf install sublime-text`

### 配置主题(boxy)

boxy 是我非常喜欢的主题，尤其是包里面的tomorrow

`ctrl + shift + p -> install package control`

它会安装Package Control 功能

> 现在 ctrl + shift + p -> package control install package -> boxy theme

左下角会有安装进度
安装完了就可以设置主题了

> Preferences -> Theme -> Boxy Tomorrow.sublime-theme
> Preferences -> Color Theme -> Boxy Tomorrow

基本上的配置就完成了，给个截图吧

![success](https://ifthat.com/file/blog3.png)

## 安装 polybar
https://github.com/polybar/polybar

### 运行
`polybar example`
![polybar](https://static.ifthat.com/public/data/Screenshot-from-2019-06-27-13-27-45.png)