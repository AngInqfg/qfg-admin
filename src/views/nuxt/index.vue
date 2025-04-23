<template>
    <div class="form_content">
        <!-- nuxt里的 messageist时间要处理 -->
        <el-form class="form" labelWidth="auto" :model="formData">
            <div class="btn" style="grid-column: 1 / -1;">
                <el-button type="primary" @click="goMessage">消息记录</el-button>
                <el-button type="primary" @click="centerDialogVisible = true">确认</el-button>
            </div>
            <el-form-item label="头像：">
                <Upload v-model:fileList="formData.avatarList" :limit="1" :size="1" :autoUpload="false"
                    :accept="['png', 'jpg', 'JPG', 'JPEG', 'jpeg']"
                    @customUpload="imgCustomUpload($event, formData.avatar, 'avatar', 'avatarList')"
                    :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" />
                <!-- avatar -->
            </el-form-item>
            <el-form-item label="姓名：">
                <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="qq：">
                <el-input v-model="formData.qq" placeholder="请输入QQ" />
            </el-form-item>
            <el-form-item label="qq名称：">
                <el-input v-model="formData.qqName" placeholder="请输入QQ昵称" />
            </el-form-item>
            <el-form-item label="qq二维码：" style="grid-column: 1 / -1;">
                <Upload v-model:fileList="formData.qqCodeList" :limit="1" :size="1" :autoUpload="false"
                    :accept="['png', 'jpg', 'JPG', 'JPEG', 'jpeg']"
                    @customUpload="imgCustomUpload($event, formData.qqCode, 'qqCode', 'qqCodeList')"
                    :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" />
            </el-form-item>
            <el-form-item label="微信：">
                <el-input v-model="formData.wx" placeholder="请输入微信" />
            </el-form-item>
            <el-form-item label="微信名称：">
                <el-input v-model="formData.wxName" placeholder="请输入微信昵称" />
            </el-form-item>
            <el-form-item label="微信二维码：" style="grid-column: 1 / -1;">
                <Upload v-model:fileList="formData.wxCodeList" :limit="1" :size="1" :autoUpload="false"
                    :accept="['png', 'jpg', 'JPG', 'JPEG', 'jpeg']"
                    @customUpload="imgCustomUpload($event, formData.wxCode, 'wxCode', 'wxCodeList')"
                    :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" />
            </el-form-item>
            <el-form-item label="手机号：">
                <el-input v-model.number="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="email：">
                <el-input v-model="formData.email" placeholder="请输入email" />
            </el-form-item>
            <el-form-item label="技能：" style="grid-column: 1 / -1;">
                <div style="width: 100%">
                    <div class="list" v-for="(item, idx) in formData.skill">
                        <el-input v-model="item.value" placeholder="请输入技能" /> <el-button
                            @click="delList(idx, 'skill')">删除</el-button>
                    </div>
                    <div class="add"><el-button @click="addList('skill')">添加</el-button></div>
                </div>
            </el-form-item>
            <el-form-item label="公司：" style="grid-column: 1 / -1;">
                <div style="width: 100%">
                    <div class="form" style="gap:6px;margin-top: 0;margin-bottom: 16px;"
                        v-for="(item, idx) in formData.company">
                        <el-input v-model="item.name" placeholder="请输入公司名称" />
                        <el-input v-model="item.position" placeholder="请输入岗位" />
                        <el-date-picker style="width:100%" v-model="item.startTime" type="date" placeholder="请输入入职时间"
                            format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                        <el-date-picker style="width:100%" v-model="item.endTime" type="date" placeholder="请输入离职时间"
                            format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                        <div style="grid-column: 1 / -1;text-align: right;"><el-button
                                @click="delList(idx, 'company')">删除</el-button></div>
                    </div>
                    <div class="add"><el-button @click="addList('company')">添加</el-button></div>
                </div>
            </el-form-item>
            <el-form-item label="学校：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.schoolName" placeholder="请输入学校名称" />
            </el-form-item>
            <el-form-item label="时间：" style="grid-column: 1 / -1;">
                <div style="width:100%;display: flex;gap:6px">
                    <el-date-picker style="width:100%" v-model="formData.schoolStartDay" type="date"
                        placeholder="请输入开始时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                    <el-date-picker style="width:100%" v-model="formData.schoolEndDay" type="date" placeholder="请输入结束时间"
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                </div>
            </el-form-item>
            <el-form-item label="城市：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.city" placeholder="请输入地址" />
            </el-form-item>
            <el-form-item label="工作日期：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.experience" placeholder="请输入工作日期" />
            </el-form-item>
            <el-form-item label="作品NUXT3：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.demoCurrentUrl" placeholder="请输入nuxt3网址" />
            </el-form-item>
            <el-form-item label="作品Electron：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.demoElectronUrl" placeholder="请输入elementDemo下载地址" />
            </el-form-item>
            <el-form-item label="作品APP：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.demoAppUrl" placeholder="请输入app下载地址" />
            </el-form-item>
            <el-form-item label="个人简历Word：" style="grid-column: 1 / -1;">
                <div style="width:100%;">
                    <el-input v-model="formData.biographicalNotesWorkDownloadName" readonly placeholder="请输入word名称" />
                    <Upload v-model:fileList="formData.biographicalNotesWorkDownloadUrlList" uploadType="btn" :limit="1"
                        :size="1" :autoUpload="false" :accept="['word', 'WORD', 'doc', 'DOC']"
                        @customUpload="imgCustomUpload($event, formData.biographicalNotesWorkDownloadUrl, 'biographicalNotesWorkDownloadUrl', 'biographicalNotesWorkDownloadUrlList')"
                        :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" />
                </div>
            </el-form-item>
            <el-form-item label="个人简历PDF：" style="grid-column: 1 / -1;">
                <div style="width:100%;">
                    <el-input v-model="formData.biographicalNotesPdfDownloadName" readonly placeholder="请输入pdf名称" />
                    <Upload v-model:fileList="formData.biographicalNotesPdfDownloadUrlList" uploadType="btn" :limit="1"
                        :size="1" :autoUpload="false" :accept="['pdf', 'PDF']"
                        @customUpload="imgCustomUpload($event, formData.biographicalNotesPdfDownloadUrl, 'biographicalNotesPdfDownloadUrl', 'biographicalNotesPdfDownloadUrlList')"
                        :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" />
                </div>
            </el-form-item>
            <el-form-item label="个人简历PNG：" style="grid-column: 1 / -1;">
                <div style="width:100%;">
                    <el-input v-model="formData.biographicalNotesPngDownloadName" readonly placeholder="请输入png名称" />
                    <Upload v-model:fileList="formData.biographicalNotesPngDownloadUrlList" uploadType="btn" :limit="1"
                        :size="1" :autoUpload="false" :accept="['png', 'PNG']"
                        @customUpload="imgCustomUpload($event, formData.biographicalNotesPngDownloadUrl, 'biographicalNotesPngDownloadUrl', 'biographicalNotesPngDownloadUrlList')"
                        :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" />
                </div>
            </el-form-item>
            <el-form-item label="NuxtName：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.webName" placeholder="请输入NuxtName" />
            </el-form-item>
            <el-form-item label="NuxtNike：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.webNike" placeholder="请输入NuxtNike" />
            </el-form-item>
            <el-form-item label="CSDN：" style="grid-column: 1 / -1;">
                <div style="width:100%;display: flex;gap:6px">
                    <el-input v-model="formData.nikeName" placeholder="请输入CSDN昵称" />
                    <el-input v-model="formData.csdnUrl" placeholder="请输入CSDN地址" />
                </div>
            </el-form-item>
            <el-form-item label="GITEE：" style="grid-column: 1 / -1;">
                <div style="width:100%;display: flex;gap:6px">
                    <el-input v-model="formData.giteeName" placeholder="请输入GITEE昵称" />
                    <el-input v-model="formData.giteeUrl" placeholder="请输入GITEE地址" />
                </div>
            </el-form-item>
            <el-form-item label="管理系统：" style="grid-column: 1 / -1;">
                <el-input v-model="formData.currentUrl" placeholder="请输入当前系统地址" />
            </el-form-item>
            <el-form-item label="个人简介：" style="grid-column: 1 / -1;">
                <div style="width: 100%">
                    <div class="list" v-for="(item, idx) in formData.describe">
                        <el-input v-model="item.value" placeholder="请输入简介" /><el-button
                            @click="delList(idx, 'describe')">删除</el-button>
                    </div>
                    <div class="add"><el-button @click="addList('describe')">添加</el-button></div>
                </div>
            </el-form-item>
        </el-form>
        <el-dialog v-model="centerDialogVisible" title="验证" width="500" center>
            <span>
                <el-input v-model="formData.keyCode" placeholder="请输入keyCode" />
            </span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
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
import Upload from '@/components/Upload/index.vue'
import { update_info, uploadFile } from '@/http'
import { ElMessage, ElLoading } from 'element-plus';
const router = useRouter()
const pageStore = usePageStore()
const loading = shallowRef()
const openLoading = (text) => {
   if (loading.value) {
      loading.value.close()
   }
   loading.value = ElLoading.service({ lock: true, text: text, background: 'rgba(0, 0, 0, 0.3)' })
}
const formData = ref<any>({})
onMounted(async () => {
    openLoading('正在加载')
    await pageStore.getBlogData()
    const cloneData = structuredClone(toRaw(pageStore.blogData))
    formData.value = pageStore.blogData ? cloneData : {}
    formData.value.schoolName = cloneData.school?.schoolName || ''
    formData.value.schoolStartDay = cloneData.school?.schoolStartDay || ''
    formData.value.schoolEndDay = cloneData.school?.schoolEndDay || ''
    formData.value.avatarList = [{ url: cloneData.avatar, type: 'jpg' }]
    formData.value.qqCodeList = [{ url: cloneData.qqCode, type: 'jpg' }]
    formData.value.wxCodeList = [{ url: cloneData.wxCode, type: 'jpg' }]
    formData.value.wxCodeList = [{ url: cloneData.wxCode, type: 'jpg' }]
    formData.value.biographicalNotesPdfDownloadUrlList = [{ url: cloneData.biographicalNotesPdfDownloadUrl, type: 'png' }]
    formData.value.biographicalNotesPngDownloadUrlList = [{ url: cloneData.biographicalNotesPngDownloadUrl, type: 'png' }]
    formData.value.biographicalNotesWorkDownloadUrlList = [{ url: cloneData.biographicalNotesWorkDownloadUrl, type: 'png' }]
    formData.value.skill = formData.value?.skill && formData.value?.skill.map((n) => {
        return { value: n }
    }) || []
    formData.value.describe = formData.value?.describe && formData.value?.describe.map((n) => {
        return { value: n }
    }) || []
    loading.value.close()
})
const centerDialogVisible = ref<boolean>(false)
const handleConfirm = async () => {
   openLoading('正在保存')
    const oldObj = JSON.parse(JSON.stringify(formData.value))
    const obj = {
        ...oldObj,
        skill: oldObj.skill.map((n) => n.value),
        describe: oldObj.describe.map((n) => n.value),
        school: {
            schoolName: oldObj.schoolName,
            schoolStartDay: oldObj.schoolStartDay,
            schoolEndDay: oldObj.schoolEndDay,
        }
    }
    delete obj.schoolName
    delete obj.schoolStartDay
    delete obj.schoolEndDay
    delete obj.biographicalNotesWorkDownloadUrlList
    delete obj.biographicalNotesPngDownloadUrlList
    delete obj.biographicalNotesPdfDownloadUrlList
    delete obj.wxCodeList
    delete obj.qqCodeList
    delete obj.avatarList
    const { code, message } = await update_info(obj)
    ElMessage({
        type: code === 0 ? 'success' : 'warning',
        message
    })
    centerDialogVisible.value = false
    pageStore.getBlogData(true)
    loading.value.close()
}

const imgCustomUpload = async (e, oldId, customId, tempKey) => {
   openLoading('正在上传')
    const file = e[0]
    const base = await fileToBase64(file) as string
    const res = await uploadFile({
        file: base,
        oldId: oldId,
        customId: customId,
        type: file.type,
        size: file.size,
        name: file.name
    })
    formData.value[tempKey] = [{ url: res?.data || '', type: 'jpg' }]
    if (['qqCode', 'wxCode', 'avatar'].includes(customId)) {
        formData.value[customId] = res?.data
    } else {
        formData.value[customId] = res?.data
        formData.value[`${customId.replace('Url', 'Name')}`] = file.name
    }
    loading.value.close()
}
const delList = (idx, str) => {
    formData.value[str] = formData.value[str].filter((_n, i) => {
        return i !== idx
    })
}
const addList = (str) => {
    const newObj = ['describe', 'skill'].includes(str) ?
        { value: '' } : { name: '', position: '', startTime: '', endTime: '' }
    formData.value[str].push(newObj)
}
const goMessage = () => {
    router.push({ path: '/messageList' })
}
</script>
<style scoped lang="scss">
.form_content {
    .form {
        max-width: 800px;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    &:deep(.el-form-item__content) {
        align-items: flex-start;
    }

    .btn {
        width: 100%;
        text-align: right;
        position: sticky;
        top: 0;
        z-index: 5;
        margin-bottom: 20px;
    }

    .list {
        gap: 6px;
        margin-top: 0;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
    }

    .add {
        text-align: right;
    }
}
</style>