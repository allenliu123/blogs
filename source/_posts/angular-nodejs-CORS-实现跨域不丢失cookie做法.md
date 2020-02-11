---
title: angular + nodejs + CORS 实现跨域不丢失cookie做法
date: 2019-03-27 18:27:40
tags:
- nodejs
- angular
---

想要做一个angular + nodejs 的登录
## 需要解决的问题
- angular的4200端口 向 nodejs的8080端口 发送一个post请求, 这会造成跨域问题, 

跨域，指的是浏览器不能执行其他网站的脚本。它是由浏览器的同源策略造成的，是浏览器对javascript施加的安全限制
只有协议，域名，端口完全相同了才算同一个域，不同域之间不允许通信

### CORS 解决跨域问题
jsonp 是一种解决方案, 但是 CORS 更优雅

CORS 跨域资源共享（Cross-Origin Resource Sharing）
了解原理请移步 http://www.ruanyifeng.com/blog/2016/04/cors.html

这里只讲做法

nodejs 后端代码
``` js
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});
```
解决一般的跨域,就这样写就够了

默认情况下，跨源请求不提供凭据(cookie、HTTP认证及客户端SSL证明等)，通过将withCredentials属性设置为true，可以指定某个请求应该发送凭据。

后端收到这种请求的时候, 不会检测 cookie 里面的数据

没了 cookie session 自然也就无效了 

如果你的请求需要使用到 cookie

前端angular需要这样写
```

// {withCredentials: true} withCredentials 表示是否传递凭证，就是cookie
this.http.get<any>(this.hostName + "/captcha", {withCredentials: true}).subscribe((data) => {
  
});
  
```
 后端也需要返回 cookie
 res.header('Access-Control-Allow-Credentials', true);// Allow Cookie

``` js
app.use((req, res, next) => {
    // req.headers.origin
	res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);// Allow Cookie
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	next();
});
```

这样写会报错, 因为有 cookie 的话, Access-Control-Allow-Origin 就不能写 "*" 了 
可以把 Access-Control-Allow-Origin 改成 访问者的ip+端口, 如:
res.header("Access-Control-Allow-Origin", "http://localhost:4200"); 
但是, 访问者是动态的, 怎么知道访问者的ip, req.headers.origin 就是访问者的ip和端口
最终写法
``` js
app.use((req, res, next) => {
    // 需要使用cookie的话,是不能写 * 的,必须写具体的域, 像这样
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);// Allow Cookie
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});
```
