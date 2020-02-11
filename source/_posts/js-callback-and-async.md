---
title: Js回调函数和异步
date: 2018-11-12 03:15:52
tags:
- javascript
- c++
---
首先要知道的是，回调和异步不是同一个东西
我以前认为js中每个回调函数都是异步处理的，实际上并不是，可以同步回调，也可以异步回调
## callback 例子
说到callback，大家都在javascript中遇到以下的例子
``` javascript
$('#id').on('click', function(){
	//code
});
$('#id').setTimeout(function(){
	//code
},1000);
```

这些代码用了这么久，知道怎么用，但是可能对回调的概念并不是那么清晰

再来个例子
``` javascript
function a(callback) 
{
    alert("执行parent函数a！"); 
    alert("开始调用回调函数"); 
    callback(); 
    alert("结束回调函数"); 
}

function b(){ 
	alert("执行回调函数b"); 
} 

function test() 
{ 
   a(b);
   a(function() { 
		alert("执行匿名回调函数"); 
   }); 
}
test();
```
执行顺序：
执行parent函数a！
开始调用回调函数
执行回调函数b
结束回调函数

执行parent函数a！
开始调用回调函数
执行匿名回调函数
结束回调函数

## callback 原理

简单的说，就是把一个函数作为形参进行传递，上面的callback参数可以改为任意名字

## callback 用 C++ 实现
#### 不带参数回调
``` c++
#include <iostream>
using namespace std; 

//定义回调函数
void Print() 
{
    cout <<"Hello World!\n";
}

//定义实现回调函数的"调用函数"
void Call(void (*callback)())
{
    callback();
}

//在main函数中实现函数回调
int main(int argc,char* argv[])
{
    Call(Print);
    return 0;
}
```
#### 带参数回调
``` c++
#include <iostream>
using namespace std; 

//定义带参回调函数
void Print(string s) 
{
   cout << s << endl;
}

//定义实现带参回调函数的"调用函数"
void Call(void (*callback)(string),string s)
{
    callback(s);
}

//在main函数中实现带参的函数回调
int main(int argc,char* argv[])
{
    Call(Print,"Hello World!");
    return 0;
}
```
## 异步例子
经典例子
``` javascript
function a(){
	console.log('执行a');
	setTimeout(function(){
		console.log('setTimeout');
	}, 1000);
}

function b(){
	console.log('执行b');
}

a();
b();
```

执行顺序：
执行a
执行b
setTimeout  (一秒后执行)

## 异步原理
都知道js是单线程的，所谓的单线程就是一次只能完成一个任务，其任务的调度方式就是排队，毫无疑问，这样的效率是不高的，后面的任务必须等到前面的任务执行完毕后才能执行，如果有一个比较耗时的操作，比如http请求，文件io
其他语言遇到这种比较耗时的任务往往是开一个线程来处理，但js本身就是单线程的，js对这种任务的处理就是这个一个任务挂载起来，等耗时任务完成后再把回调函数添加到执行队列尾部
所以，在刚刚这个例子中，即使把延迟时间设置为0，也是一样的结果
