---
title: typescript
date: 2021-03-09 22:06:56
tags: typescript
---
最近在使用 ts 搬砖，感觉每次都提示让我写类型，烦的一匹，像下面这样

我有这样一个对象

![](http://stg.iobs.pingan.com.cn/download/icore-aops-dmz-stg/portal-icore-apps-content-1614917315610-8189563978EE43A9A9A0074FE11F4716-29430210)

我想要取到里面的 fileUrl，在 ts 里面需要先定义类型，就需要这么写

```ts
export interface ImageResponse {
  fileName: string;
  fileUrl: string;
}

export interface Response<ImageResponse> {
  code?: string;
  data: ImageResponse;
  msg?: string;
  reqId?: string;
  resultCode?: string;
  resultMessage?: string;
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: Response<ImageResponse>;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

let url = info.file.response.data.fileUrl
```

在 js 里面直接 `let url = info.file.response.data.fileUrl`就行，还是 js 香呀

后来我一直在思考，ts 需要写这么多代码，身边也有很多大佬也在说 ts 香，我根本没有发现它哪里香了，还不如直接用js，都说 ts 适合在大型项目里面使用，但是我真的不知道为什么适合大型项目里面，想了好几天，我必须要找理由说服自己。

后来真的发现了 ts 比较好的地方，假如我写了一个三个 ts 文件

```tsx
// enum.ts
export enum DesignType {
  picture = '1',
  font = '2',
  video = '3',
  designCase = '4',
  middleVideo = '2',
  middleArticle = '0'
}

// func.ts
import { queryClassifyAPI } from '@/api/data';
import { DesignType } from '@/declares/enums';

export async function generateCate(type: DesignType) {
  return await queryClassifyAPI({ type });
}

// main.ts
import * as func from './func';

```

![](http://stg.iobs.pingan.com.cn/download/icore-aops-dmz-stg/portal-icore-apps-content-1614925183240-4CFFE1226E00479E8223FC8D59AA1C5D-26080834)

在使用的提示简直就跟java一样，简直不要太友好，这个函数可能不太明显，万一换一个函数，像这样

![](http://stg.iobs.pingan.com.cn/download/icore-aops-dmz-stg/portal-icore-apps-content-1614925773318-50B184B9790342EAB4A4360A57C3544A-31117459)

这个函数是引入的 ant-design-vue 包里面的，要是没有这个语法提示，完全不知道给他传什么样的参数，这种情况要是在 js 里面，函数要是自己项目里面写的，一般我会全局搜索函数，找到源码，去查看需要传什么参数，如果是引入开源的库，就只能看官方文档或者去 google用法，难受。

做了这么久的js开发，居然没有把语法提示用起来，真是惭愧~

并且我在没有 import 的情况也可以直接输入 generateCate 回车，它还会自动帮我`import { generateCate } from './func'`

------------------这里需要插动图



现在用 ts 开发，一般都是在公司的项目里面，有时候需要使用别人写的函数时，就可以看语法提示来推断出这个函数的使用方法，而不用去全局搜索这个函数名，找到具体的函数参数。所以我认为这一点就是 ts 为什么适合大型项目的原因。

持续更新中...

*参考资料*

1. [TS的优势，以及和ES6做对比](https://www.jianshu.com/p/d2d15111f9d4)