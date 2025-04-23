<template>
    <div>
        <el-form labelWidth="auto">
            <el-form-item label="小程序码：">
                <Upload v-model:fileList="ImageFileList" :limit="1" :size="1" :autoUpload="false"
                    :accept="['png', 'jpg', 'JPG', 'JPEG', 'jpeg']" @customUpload="customUpload($event, 'demoWxXcxUrl')"
                    :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" />
            </el-form-item>
            <el-form-item label="小程序音乐：">
                <Upload v-model:fileList="MusicFileList" :limit="1" :size="1" uploadType="btn" :autoUpload="false"
                    :accept="['mp3', 'mpeg']" @customUpload="customUpload($event, 'music')" />
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { usePageStore } from '@/stores/page';
import Upload from '@/components/Upload/index.vue'
import { uploadFile } from '@/http'
import { fileToBase64 } from '@/utils'
import { ElLoading } from 'element-plus';
const pageStore = usePageStore()
const loading = shallowRef()
const openLoading = (text) => {
   if (loading.value) {
      loading.value.close()
   }
   loading.value = ElLoading.service({ lock: true, text: text, background: 'rgba(0, 0, 0, 0.3)' })
}
const ImageFileList = ref<{ url: string, name?: string, type?: string }[]>([])
const MusicFileList = ref<{ url: string, name?: string, type?: string }[]>([])
onMounted(async () => {
   openLoading('正在加载')
    await pageStore.getBlogData()
    ImageFileList.value = [{ url: pageStore?.blogData?.demoWxXcxUrl, type: 'jpg' }]
    MusicFileList.value = [{ url: pageStore?.blogData?.music?.url, name: pageStore?.blogData?.music?.name, type: 'mp3' }]
    loading.value.close()
})

const customUpload = async (e, str) => {
   openLoading('正在上传')
    const file = e[0]
    const base = await fileToBase64(file)
    const res = await uploadFile({
        file: base,
        oldId: str === 'music' ? pageStore.blogData.music.url : pageStore.blogData?.[str],
        customId: str,
        type: file.type,
        size: file.size,
        name: file.name
    })
    if (str === 'music') {
        MusicFileList.value = [{ url: e, type: 'mp3' }]
    } else {
        ImageFileList.value = [{ url: (res?.data as any)?.music?.url, name: (res?.data as any)?.music?.url, type: 'jpg' }]
    }
    pageStore.getBlogData(true)
    loading.value.close()
}
</script>
