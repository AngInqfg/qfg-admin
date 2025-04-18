<template>
    <div class="login">
        <div class="login_content">
            <div class="login_content_box">
                <div class="login_content_box_title">{{ store?.name }}</div>
                <div class="login_content_box_content">
                    <el-form class="login_form_content" ref="formRef" :model="formData" :rules="formRule">
                        <el-form-item prop="username">
                            <el-input v-model="formData.username" :prefix-icon="User" clearable />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="formData.password" :prefix-icon="Lock" show-password
                                clearable />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="login_content_box_btn">
                    <el-button type="primary" :color="color" @click="handleLoginClick">登&nbsp;&nbsp;陆</el-button>
                </div>
            </div>
        </div>
        <BGCANVAS :name="store?.name"></BGCANVAS>
    </div>
</template>
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import { useStore } from '@/stores';
import BGCANVAS from './child/bg'
import { login } from '@/http'
const store = useStore();
const color = 'rgba(66,86,208,1)';
const formRef = ref()
const formData = ref({
    username: 'qinfugui',
    password: 'qinfugui'
})
const formRule = {
    username: [
        { required: true, message: '请输入用户名或手机号', trigger: 'blur', id: 1 },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur', id: 1 },
    ],
}

const loadingEl = ref()
const loadingOptions = ref({
    text: '正在登陆...',
    background: 'rgba(0, 0, 0, 0.5)'
})

function handleLoginClick() {
    formRef.value.validate(async (valid: boolean) => {
        loadingEl.value = ElLoading.service(loadingOptions.value)
        if (!valid) {
            ElMessage({ message: '请输入正确的用户名和密码！', type: 'warning', grouping: true })
            loadingEl.value.close()
            return
        }
        try {
            const { code, data } = await login(formData.value)
            if (code === 0) {
                await getUserCallback(data)
            } else {
                ElMessage({ message: '账户或密码错误！', type: 'warning', grouping: true })
                loadingEl.value.close()
            }
        } catch {
            loadingEl.value.close()
        }
    })
}

async function getUserCallback(t: string) {
    await store.getUser(t)
    await store.getMenu()
    let timer = setTimeout(() => {
        ElMessage({ message: '欢迎回来！', type: 'success', grouping: true })
        loadingEl.value.close()
        window.location.reload()
        clearTimeout(timer)
    }, 200);
}
</script>
<style scoped lang="scss">
.login {
    width: 100%;
    height: 100%;
    position: relative;

    .login_form_content {
        width: 100%;

        &:deep(.el-input__wrapper) {
            background-color: transparent;

            input {
                color: #fff;
            }
        }
    }

    &_content {
        width: 100%;
        height: 100%;
        background-color: transparent;
        position: absolute;

        &_box {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-height: 350px;
            min-height: 250px;
            background-color: transparent;
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.7) inset;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.7);
            @include cssFlex(column, flex-start, center);

            $w: 80%;

            &:deep(.login_type_content) {
                background-color: rgba(0, 0, 0, 0.3) !important;
                transform: translateY(-5px);
                border: none;
                min-width: 80px;
                width: 80px;
                padding: 12px;
            }

            &_title {
                width: $w;
                height: 70px;
                font-size: 22px;
                color: v-bind(color);
                font-weight: 600;
                user-select: none;
                @include cssFlex();
            }

            &_content {
                width: $w;
                flex: 1;
                @include cssFlex();
            }

            &_btn {
                width: $w;
                height: 70px;
                @include cssFlex();

                .el-button {
                    width: 100%;
                    height: 36px;
                    font-size: 16px;
                }
            }
        }
    }

    &:deep(.name) {
        $dis: 6px;
        position: absolute;
        bottom: $dis;
        right: $dis;
        font-size: 10px;
    }
}
</style>