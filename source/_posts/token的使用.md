---
title: token的使用
date: 2020-10-11 17:43:03
tags: nodejs
---
规定 验证服务器，客户端，业务服务器

0. 客户端携带登录用户名密码信息发送到验证服务器，验证服务器验证查询数据库通过后 返回 access_token （使用私钥加密用户id，用户名等非隐私信息）和 refresh_token （使用私钥只加密用户id信息）

0. 客户端收到 access_token 和 refresh_token 都保存到 Cookie 或者 LocalStorage 里面，请求业务服务器只需要携带 access_token，然后业务服务器使用公钥解密，解密成功则判定为合法用户，返回数据。

0. 如果业务服务器收 access_token 发现已经过期，则返回 401。客户端收到业务服务器返回的 401 状态码，使用 refresh_token 去验证服务器重新获取 access_token，验证服务器验证 refresh_token 有效后，重新生成 access_token，返回给客户端，客户端再重新使用新的 access_token 去请求业务服务器。

0. 如果使用 refresh_token 去验证服务器重新获取 access_token，发现 refresh_token 也过期了，就返回 401，客户端收到 401，跳转到登录页面。

一般 access_token 过期时间设置成 30 min，refresh_token 过期时间设置成 1 day。

下面一段代码使用 nodejs 和 jwt

验证服务器
``` javascript
const express = require('express')
const jwt = require('jsonwebtoken')
let fs = require("fs")

const app = express()

// 公钥私钥可以使用任何很多工具生成，也可以使用 crypto 用代码生成
let publicKey = fs.readFileSync('public.pem').toString()
let secretKey = fs.readFileSync('secret.key').toString()

app.get('/login', (req, res) => {
  // 数据库验证成功后
  const payload = {
    user_id: 1001,
    user_name: 'allen'
  }
  const refreshPayload = {
    user_id: 1001
  }
  let token = jwt.sign(payload, secret, { algorithm: 'RS256', expiresIn: '1min' })
  let refreshToken = jwt.sign(refreshPayload, secretKey, { algorithm: 'RS256', expiresIn: '1day' })
  res.json({
    code: 200,
    message: 'success',
    data: {
      token: token,
      refresh_token: refreshToken
    }
  })
})

app.get('/refresh', (req, res) => {
  let refresh_token = req.query.refresh_token
  jwt.verify(refresh_token, publicKey, function(err, decoded) {
    if (err) {
      res.json({
        code: -1,
        message: 'error',
        data: err
      })
    } else {
      let user_id = decoded.user_id

      // 数据库查询

      const payload = {
        user_id: user_id,
        user_name: 'allen'
      }
      let token = jwt.sign(payload, secret, { algorithm: 'RS256', expiresIn: '1min' })
      res.json({
        code: 200,
        message: 'success',
        data: {
          token: token
        }
      })
    }
  })
})

app.listen(8080)
```
业务服务器
``` javascript
const express = require('express')
const jwt = require('jsonwebtoken')
let fs = require("fs")

const app = express()

// 公钥私钥可以使用任何很多工具生成，也可以使用 crypto 用代码生成
let publicKey = fs.readFileSync('public.pem').toString()

// 业务服务器
app.get('/verify', (req, res) => {
  let token = req.query.token
  jwt.verify(token, publicKey, function(err, decoded) {
    if (err) {
      res.json({
        code: -1,
        message: 'error',
        data: err
      })
    } else {
      res.json({
        code: 200,
        message: 'success',
        data: decoded
      })
    }
  })
    
})

app.listen(8081)
```

代码在这 https://github.com/allenliu123/StudyCode/tree/main/token%E7%9A%84%E4%BD%BF%E7%94%A8

## 参考资料

[Token 认证的来龙去脉](https://my.oschina.net/jamesfancy/blog/1613994)
[JWT的rs256算法...](https://www.jianshu.com/p/e9bad7d3b030)
