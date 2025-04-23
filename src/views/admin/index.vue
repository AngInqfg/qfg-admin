<template>
    <div>
        <el-form labelWidth="auto" ref="formRef" :model="formData" :rules="formRule as any" style="max-width: 500px">
            <el-form-item>
                <el-button type="primary" @click="goMenuChange()">
                    菜单设置
                </el-button>
            </el-form-item>
            <el-form-item label="用户名：" prop="username">
                <el-input v-model="formData.username" />
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
                <el-input v-model.number="formData.phone" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="旧密码：" prop="oldPassword">
                <el-input v-model="formData.oldPassword" />
            </el-form-item>
            <el-form-item label="新密码：" prop="password">
                <el-input v-model="formData.password" />
            </el-form-item>
            <el-form-item label="头像：">
                <Upload v-model:fileList="list" :limit="1" :size="1" :autoUpload="false"
                    :accept="['png', 'jpg', 'JPG', 'JPEG', 'jpeg']" @customUpload="customUpload($event)"
                    :modalOperationExclude="['hoverDownload', 'hoverDetail', 'download']" />
            </el-form-item>
            <el-form-item>
                <div style="width:100%;text-align: center;">
                    <el-button type="default" @click="refresh()">
                        重置
                    </el-button>
                    <el-button type="primary" @click="handleConfirm()">
                        确认
                    </el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { useStore } from '@/stores';
import { fileToBase64 } from '@/utils'
import { set_user } from '@/http'
import { ElMessage, ElLoading } from 'element-plus';
import Upload from '@/components/Upload/index.vue'
const router = useRouter()
const store = useStore()
const loading = shallowRef()
const openLoading = (text) => {
   if (loading.value) {
      loading.value.close()
   }
   loading.value = ElLoading.service({ lock: true, text: text, background: 'rgba(0, 0, 0, 0.3)' })
}
const list = ref<{ url: string, type: string }[]>([])
const formRef = ref()
const formData = ref<userType>({
    avatar: '',
    phone: null,
    username: ''
})
const formRule = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { type: 'number', message: '请输入数字' },
    ],
    oldPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
onMounted(() => {
    refresh()
})

function refresh() {
    openLoading('正在加载')
    const { avatar, phone, username } = store.user
    formData.value = { avatar, phone, username }
    if (formData.value.avatar) {
        list.value = [{ url: formData.value.avatar, type: 'jpg' }]
    }
    loading.value.close()
}
const customUpload = async (e) => {
    openLoading('正在上传')
    const file = e[0]
    const base = await fileToBase64(file) as string
    const pic: any = {
        file: base,
        oldId: store.user?.avatar,
        customId: 'avatar',
        type: file.type,
        size: file.size,
        name: file.name
    }
    const img = URL.createObjectURL(file)
    list.value = [{ url: img, type: 'jpg' }]
    formData.value.avatar = pic
    loading.value.close()
}
const handleConfirm = () => {
    formRef.value.validate(async valid => {
        if (valid) {
            openLoading('正在保存')
            const { code, message } = await set_user(formData.value)
            ElMessage({
                type: code === 0 ? 'success' : 'warning',
                message
            })
            if (code === 0) {
                let timer = setTimeout(() => {
                    sessionStorage.clear()
                    window.location.href = window.location.origin
                    clearTimeout(timer)
                }, 200);
            }
            loading.value.close()
        }
    })
}
const goMenuChange = () => {
    router.push({ path: '/menu' })
}
</script>
