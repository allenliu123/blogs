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
先看看 JavaScript 对象的两类属性

数据属性：

  value：就是属性的值。

  writable：决定属性能否被赋值，默认 true。

  enumerable：决定 for in 能否枚举该属性，默认 true。

  configurable：决定该属性能否被删除或者改变特征值，默认 true。



访问器（getter/setter）属性：

  getter：函数或 undefined，在取属性值时被调用。

  setter：函数或 undefined，在设置属性值时被调用。

  enumerable：决定 for in 能否枚举该属性。

  configurable：决定该属性能否被删除或者改变特征值。

通过 `Object.getOwnPropertyDescriptor `可以拿到对象的这几个属性的值

```js
var obj = { a: 1 };
Object.getOwnPropertyDescriptor(obj, 'a');
```

要修改属性，可以使用`Object.defineProperty`函数修改

```js
var obj1 = { a: 1 };
Object.defineProperty(obj1, 'a', {
	value: 2
});
console.log(obj1) // {a: 2}

Object.defineProperty(obj1, 'a', {
	get() { return 3}
});
console.log(obj1) // { a: 3, get a: f get() }
```

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

    document.addEventListener('input', function(e) {
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

2020.03.03更新

最近在是使用 Vue 3 开发，在 Vue 3 里面已经抛弃了 Object.defineProperty 而采用 Proxy

Proxy 的语法也很简单

```js
let proxy = new Proxy(target, handler);
```

target: 需要代理的目标对象

handler: 自定义的行为

例子：

```js
let obj = { a: 1 }

let proxy = new Proxy(obj, {
  get: function(target, prop) {
    return target[prop];
  },
  set: function(target, prop, value) {
    console.log('set value')
    target[prop] = value;
  }
})

console.log(proxy.a) // 1

proxy.a = 2
console.log(proxy.a) // set value, 2
```

使用 Proxy 改写上面的 Object.defineProperty() 的实现

```html
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

    let proxy = new Proxy(vm, {
      get: function(target, prop) {
        return target[prop];
      },
      set: function(target, prop, value) {
        target[prop] = value;
        document.getElementById('input').value = value
        document.getElementById('show').innerHTML = value
      }
    })

    document.addEventListener('input', function(e) {
      proxy.data = e.target.value
    })

    setTimeout(function() {
      proxy.data = 'Vue'
    }, 1000)
    
  </script>
</body>
</html>
```

效果:
![](https://static.ifthat.com/public/data/3e3973a63b317880-GIF-2022-3-20-15-05-01.gif)

参考资料

1. [JavaScript对象：面向对象还是基于对象？](https://time.geekbang.org/column/article/79319)
2. [初探 Vue3.0 中的一大亮点——Proxy !](https://www.jianshu.com/p/2a8ec76e0090)