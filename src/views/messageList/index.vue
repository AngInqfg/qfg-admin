<template>
   <div class="content">
      <div class="sticky">
         <el-button type="primary" text @click="addVisible = true">添加</el-button>
      </div>
      <div v-for="(item, index) in list" class="item">
         <div class="title">
            <span>{{ index + 1 > 9 ? index + 1 : `0${index + 1}` }}</span>
            <span>{{ forMat(item.createTime) }}</span>
         </div>
         <div>
            {{ item?.content }}
         </div>
         <div>
            <el-image v-for="(imgs, idx) in (Object.values(item.imageList) as any)"
               style="width: 100px; height: 100px;margin: 4px;" :src="imgs" :zoom-rate="1.2" :max-scale="7"
               :min-scale="0.2" :preview-src-list="Object.values(item.imageList)" show-progress :initial-index="idx"
               fit="cover" />
         </div>
         <div class="btn"><el-button type="warning" text @click="handleDel(item?._id, item?.content)">删除</el-button>
         </div>
      </div>
      <el-dialog v-model="addVisible" title="添加" width="500" center>
         <div style="margin: 12px 0;">内容：</div>
         <el-input v-model="form.content" style="width: 100%" :rows="4" type="textarea" placeholder="请输入文本" />
         <div style="margin: 12px 0;">图片：</div>
         <Upload v-model:fileList="form.imageList" :limit="9" :size="1" :autoUpload="false"
            :accept="['png', 'jpg', 'JPG', 'JPEG', 'jpeg']" @customUpload="imgCustomUpload($event)"
            :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" @errorChange="errorChange" />
         <template #footer>
            <div class="dialog-footer">
               <el-button @click="addVisible = false">关闭</el-button>
               <el-button type="primary" @click="handleConfirm">
                  确认
               </el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>
<script setup lang="ts">
import { usePageStore } from '@/stores/page';
import { useStore } from '@/stores'
import Upload from '@/components/Upload/index.vue'
import { uploadFile } from '@/http'
import { fileToBase64, forMat } from '@/utils'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { add_message, delete_message } from '@/http'
const store = useStore()
const pageStore = usePageStore()
const { mainColor } = toRefs(store.layoutConfig)
const list = ref<msgRequestType[]>([])
const loading = shallowRef()
const openLoading = (text) => {
   if (loading.value) {
      loading.value.close()
   }
   loading.value = ElLoading.service({ lock: true, text: text, background: 'rgba(0, 0, 0, 0.3)' })
}
const addVisible = ref<boolean>(false)
const form = ref<msgRequestType>({
   content: '',
   imageList: []
})
onMounted(async () => {
   openLoading('正在加载')
   await pageStore.getMsgList()
   list.value = pageStore.msgList
   loading.value.close()
})
const errorChange = (e) => {
   ElMessage({ type: 'warning', message: e.message })
}
const handleConfirm = async () => {
   openLoading('正在添加')
   const obj = JSON.parse(JSON.stringify(form.value))
   obj.imageList = {}
   form.value.imageList.forEach(n => {
      obj.imageList['name' + Date.now()] = n.url
   });
   const { code, message } = await add_message(obj)
   ElMessage({ type: code === 0 ? 'success' : 'warning', message })
   if (code === 0) {
      await pageStore.getMsgList(true)
      list.value = pageStore.msgList
      form.value = {
         content: '',
         imageList: []
      }
      addVisible.value = false
   }
   loading.value.close()
}
const handleDel = (i, str) => {
   ElMessageBox.confirm(
      `${str}`,
      `您要删除第${i + 1}条数据吗?`,
      {
         confirmButtonText: '确认',
         cancelButtonText: '取消',
         type: 'warning',
      }
   ).then(async () => {
      openLoading('正在删除')
      const { code, message } = await delete_message({ id: i })
      if (code === 0) {
         await pageStore.getMsgList(true)
         list.value = pageStore.msgList
      }
      ElMessage({ type: code === 0 ? 'success' : 'warning', message })
      loading.value.close()
   }).catch(() => { })
}
const imgCustomUpload = async (e) => {
   openLoading('正在上传')
   const file = e[0]
   const base = await fileToBase64(file) as string
   const res = await uploadFile({
      file: base,
      oldId: null,
      customId: 'msgImageList',
      type: file.type,
      size: file.size,
      name: file.name
   })
   form.value.imageList = [{ name: file.name, url: res.data, type: file.type }, ...form.value.imageList]
   loading.value.close()
}
</script>
<style scoped lang="scss">
.content {
   height: calc(100vh - 150px);
}

.sticky {
   text-align: right;
   position: sticky;
   top: 0;
   background: v-bind(mainColor);
}

.item {
   border-bottom: 1px solid #eee;
   padding: 12px;

   .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }

   .btn {
      text-align: right;
      margin-top: 12px;
   }

   &:last-child {
      border: 0;
   }
}
</style>