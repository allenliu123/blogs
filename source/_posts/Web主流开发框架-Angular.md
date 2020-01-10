---
title: Web主流开发框架-Angular
date: 2019-03-28 17:31:09
tags: angular
---

&emsp;&emsp; Angular 作为Web主流前端框架，和Vue，React三分天下，我用过Angular和Vue开发过网站，对我的感觉就是，Vue像是一个正值青年时期的小伙子，非常富有活力，再搭配上ElementUI，让他的那青春活力发挥的淋漓尽致，Vue让许多麻烦的事情变得非常的简单。而Angular更像是一个非常成熟的中年人，做什么事情都非常稳重。 Angular从2016年发布至今已经过了两年，随着不断的迭代，其相对于其他框架的优势已经越来越让人无法忽视了。最近一段时间在用Angular进行一些项目开发，从我个人了学习Angular的路程中，说说我对Angular的理解：

## 1.TypeScript

&emsp;&emsp; Angular 引入了强类型的语言 TypeScript 这让Java 程序员转前端变得非常的容易，java程序员可以以java的那种完全面向对象的思想来开发前端，Angular对TypeScript的完美支持，搭配VSCode这样的利器，本身对于开发效率还是项目质量都是很大的提升。众所周知，虽然TypeScript早在Angular发布前几年就已经提出，但是由于缺乏一些框架/工具的推动，并没有流行起来。而Angular后期的版本对于TypeScript的推动作用显而易见，我想很多开发者都跟我一样，是通过Angular去学习TypeScript的。但站在开发者的角度，本身可能只是想去学习一门新的框架，结果刚开始看文档就发现还要学一门新的“语言”（即使和JavaScript非常相似），无疑让开发者的门槛提高了。官方的文档还是写的非常好，官网（ https://angular.io/ ），并且还有中文官网（ https://angular.cn/ ），这让英语不好的开发者可以非常快速的学习Angular。

## 2.一套完整的框架

&emsp;&emsp; Angular是一套完整的Web前端开发框架，里面什么都有，不像Vue一样，只有前端View层的逻辑框架，连执行异步请求还需要安装axios插件。Angular自己就集成了异步请求的类，可以直接使用。
&emsp;&emsp; 学习Angular，出了了解基本的数据绑定，你还需要学会使用Rx.js处理各种异步事件、使用module去模块化管理你的应用、使用service去封装业务逻辑提高复用性以及依赖注入等等。在学习Angular时需要理解这些概念，并且在开发中遵循这样的一些约定。从工程化角度来说，Angular的component、module、service等基本特性都是非常好的实践。在构建大的应用时，Angular的这些特性可以让你的应用可以有很不错的可维护性和拓展性。这些约定可以带来的另外一个好处就是如果项目有新人加入，Angular这些"条条框框"的约定可以让一个之前甚至没有Angular经验的人也可以写出质量过关的代码。
&emsp;&emsp; 很多轻量级的业务场景可能也并不需要Angular这样一个过于巨大框架。相比之下，Vue/React作为一个View的Library，很容易就能集成进项目之中。Vue提出的渐进式框架的理念也让很多人更容易接受也更容易上手。所以用不用Angular取决与项目的大小和难易程度。

## 3.Angular的优势

&emsp;&emsp; 一些大型项目考虑到稳定性和可拓展性，会在项目开始时就考虑Angular，了解并且可以熟练使用Angular之后，开发人员也会从中受益。我想很多中度/重度使用过Angular的开发者会觉得因为使用Angular所学习的这一切都是非常值得的，并且会喜欢上这个框架。
&emsp;&emsp; 但Angular作为一门框架，同样也是需要时间去理解去学习的，可能很多时候不能像React/Vue一样快速上手。由此，可能Angular也在不经意间给打上了”适用于大型项目“的标签。这也一定程度上对Angular的推广造成了限制吧。但无法改变的是Angular是一门值得去学习去使用的框架。