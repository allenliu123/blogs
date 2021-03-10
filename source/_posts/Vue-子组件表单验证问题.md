---
title: Vue 子组件表单验证问题
date: 2021-03-10 21:46:30
tags: vue
---
## 前因

环境

Vue3 + typescript + ant-design-vue 2.0

```vue
// 父组件
<template>
	<Form ref="formRef" :model="formState" :labelCol="{ style: 'width: 70px' }" :rules="rules">
    <FormItem label="标  题" name="title">
      <Input v-model:value="formState.title" placeholder="请输入文章标题" />
    </FormItem>
    <FormItem label="封  面" name="themeImgs">
      <UploadCover v-model:value="formState.themeImgs"></UploadCover>
    </FormItem>
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import UploadCover from '@/components/UploadCover.vue';
  
export default defineComponent({
	setup() {
    const formRef = ref();
    
    const rules = {
      themeImgs: [
        { required: true, message: '请上传封面', trigger: 'change' }
      ]
    };
    
    return {
      formRef,
      rules
    }
  }
})
</scirpt>
```

```vue
// 子组件
<template>
  <a-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    action="/apps-resource-app/content/image/imageUpload"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imgUrl" :src="imgUrl" class="upload-image" />
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
</template>

<script lang="ts">
import { defineComponent, reactive, UnwrapRef, ref, computed } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ImageResponse, Response } from '@/declares/interfaces';

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

export default defineComponent({
  name: 'UploadCover',
  components: {
    LoadingOutlined,
    PlusOutlined,
  },
  props: {
    value: String,
  },
  setup(props, context) {
    const fileList = ref([]);
    const loading = ref<boolean>(false);

    const handleChange = (info: FileInfo) => {
      if (info.file.status === 'uploading') {
        loading.value = true;
        return;
      }
      if (info.file.status === 'done') {
        loading.value = false;
        let response = info.file.response;
        if (response) {
          if (response.data) {
            context.emit('update:value', response.data.fileUrl);
            // 需要触发组件的 blur 事件，用于表单验证
            context.emit('blur');
          } else {
            message.error(response.resultMessage || '图片上传失败');
          }
        }
      }
      if (info.file.status === 'error') {
        message.error('upload error');
        loading.value = false;
      }
    };

    const beforeUpload = (file: FileItem) => {
      ...
    };

    const imgUrl = computed(() => props.value);

    return {
      fileList,
      loading,
      imgUrl,
      handleChange,
      beforeUpload,
    };
  },
});
</script>
```



这样写标题是起作用的，而封面的表单验证没有起作用，并且控制台会报出一个警告

![](http://stg.iobs.pingan.com.cn/download/icore-aops-dmz-stg/portal-icore-apps-content-1614671397961-D9E2555D23F44A10A6572DE7DDFAF734-92331884)

## 解决

搞了很久都不知道是为什么，我一直以为`themeImgs: [{ required: true, message: '请上传封面', trigger: 'change' }]`是会监听 themeImgs 这个变量的变化，从而触发校验，后来了解原理之后才知道，这样写，它会在<UploadCover>组件上绑定一个change事件，第一个标题的校验没问题是因为 Input 有内部会触发 blur 方法，所以我只需要在我的 子组件里面也触发 change 方法就行了，这样改了之后发现警告还是存在，后面想到我是这样写的

```vue
// 子组件
<template>
  <a-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    action="/apps-resource-app/content/image/imageUpload"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imgUrl" :src="imgUrl" class="upload-image" />
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
</template>
```

里面也有change事件，两者冲突了，所以我只需要在template之下加一个根 div 就行了

```vue
// 子组件
<template>
	<div>
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      action="/apps-resource-app/content/image/imageUpload"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <img v-if="imgUrl" :src="imgUrl" class="upload-image" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
  </div>
</template>
```

这样就没问题了

*参考资料*

1.[element ui form 验证机制](https://blog.csdn.net/weixin_36878452/article/details/89010829)
