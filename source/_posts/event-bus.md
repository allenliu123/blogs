---
title: 使用发布订阅者模式实现组件间通信
date: 2021-06-04 20:37:55
tags: javascript
---

### vue2 组件间通信代码

在 vue2 里面，遇到 组件间通信的时候一般我会用到如下代码

``` javascript
// channel.js
import Vue from "vue";

export default new Vue();
```

``` html
// A.vue
<script>
	import channel from "./channel.js"
	export default {
		mounted() {
			channel.$on("btnClick", () => {
				console.log('xxx')
			});
		}
	}
</script>
```

``` html
// B.vue
<template>
  <div>
  	<button @click="handleBtnClick" value="click"/>
  </div>
</template>

<script>
	import channel from "./channel.js"
	export default {
		methods: {
			handleBtnClick: function() {
      channel.$emit('btnClick') 
			}
		}
	}
<script>
```

### 而在 vue3 里面，可以借助另外的工具，比如 tiny-emitter

``` javascript
// eventBus.ts
const Emitter = require('tiny-emitter');

const emitter = new Emitter();

export default emitter;

```
``` html
// A.vue
<script lang="typescript">
import { defineComponent, unmount } from 'vue'
import eventBus from "./eventBus.ts"

export default defineComponent({
  unmount() {
    eventBus.on("btnClick");
  },
  setup() {
    eventBus.on("btnClick", () => {
      console.log('xxx')
    });
  }
})
</script>
```

``` html
// B.vue
<template lang="typescript">
  <div>
  	<button @click="handleBtnClick" value="click"/>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import eventBus from "./eventBus.ts"

export default defineComponent({
  setup() {
    const handleBtnClick = () => {
      eventBus.emit('btnClick') 
    }

    return {
      handleBtnClick
    }
  }
})

<script>
```
### 手动实现

但是最近读到《JavaScript设计模式与开发实际》这本书，里面提到发布订阅者模式（也叫观察者模式），就想到了组件间通信的场景，现在就来尝试实现一下

具体代码如下
``` javascript

let eventBus = function() {
  let eventList = {}

  // 订阅者
  function on(key, fn) {
    if (!eventList[key]) {
      eventList[key] = []
    }
    eventList[key].push(fn)
  }

  // 发布者
  function emit() {
    let key = Array.prototype.shift.call(arguments)
    let fnList = eventList[key]
    if (!fnList || fnList.length === 0) {
      return false
    }
    fnList.forEach(fnItem => {
      fnItem.apply(null, arguments)
    })
  }

  function remove(key, fn) {
    let fnList = eventList[key]
    if (!fnList) {
      return
    }
    if (fn) {
      const len = fnList.length
      for(let i = len; i >= 0; i--) {
        let _fn = fnList[i]
        if (_fn === fn) {
          fnList.splice(i, 1)
        }
      }
    } else {
      fnList && (fnList.length = 0)
    } 
  }

  return {
    on,
    emit,
    remove
  }

}()


module.exports = eventBus
```