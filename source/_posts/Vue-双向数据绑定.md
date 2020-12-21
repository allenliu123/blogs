---
title: Vue 双向数据绑定
date: 2020-12-20 19:02:47
tags:
---

## Vue 双向数据绑定

Vue 的双向数据绑定就像官网展示的那样，简单的说就是，当 视图 变化的时候，数据 可以跟着变，数据 变化的时候，视图也可以跟着变
地址：https://cn.vuejs.org/v2/guide/forms.html
![](https://static.ifthat.com/public/data/db6adb7811ac59ac-GIF-2020-12-20-19-18-38.gif)

核心：Object.defineProperty()

虽然使用 DOM 也可以实现这样的效果，

模拟实现：

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <input type="text" id="input">
  <h2 id="show"></h2>

  <script type="text/javascript">
    var vm = {}
    var data = ''

    Object.defineProperty(vm, 'data', {
      get() {
        return data
      },

      set(newData) {
        data = newData
        document.getElementById('input').value = newData
        document.getElementById('show').innerHTML = newData
      }
    })

    document.addEventListener('keyup', function(e) {
      vm.data = e.target.value
    })

    setTimeout(function() {
      this.vm.data = 'Vue'
    }, 1000)
    
  </script>
</body>
</html>
```

效果:
![](https://static.ifthat.com/public/data/f60060f34de763d6-GIF-2020-12-20-19-37-36.gif)