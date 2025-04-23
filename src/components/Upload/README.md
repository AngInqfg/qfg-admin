# Upload 上传 接口问题
<template>
  <div>
    <UPLOAD v-model:fileList="FileList" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import UPLOAD from './components/Upload/index.vue'
const FileList = ref([])
function uploadBefore(e) {
  console.log(e);
}
</script>

### slot
customUploadStyle 自定义上传按钮
customFileList 自定义fileList
customFileItem 自定义每一个file
customFileOperation 自定义每一个hover操作栏

### props
loading 上传loading
uploadType 上传按钮类型 rect btn
readOnly 只读
limit 最大数
size 文件大小
multiple 多选
accept 类型
httpUrl 上传地址
autoUpload 是否自动上传
showIsDragDialog 上传弹窗显示
fileList 文件列表
uploadBefore 上传文件之前 false停止后边操作
modalBackground 查看大图背景
modalOperationList 大图操作栏[数组]
----showFileList显示文件列表 hover悬浮图片操作 showOperation现在图片操作 tab切换键 page个数 scale放大按钮 wheelScale鼠标放大 full视口按钮 rotate旋转按钮 download下载 delete删除
modalOperationExclude 操作栏过滤
scaleObject 放大缩小

### 事件
customUpload props.autoUpload=false时候 触发
errorChange 上传错误事件
deleteChange 删除事件
downloadChange 下载事件
detailChange 详情事件