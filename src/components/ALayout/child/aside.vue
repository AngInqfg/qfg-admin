<template>
    <div class="logo" :style="{ justifyContent: collapse ? 'center' : 'flex-start' }">
        <ICON name="q_icon" size="30px" color="#fff" />
        <span v-if="!collapse">{{ name }}</span>
    </div>
    <el-menu class="layout_menu" :default-active="route.path" :collapse="collapse" :collapse-transition="false">
        <MENU :list="menuList" @click="handleMenuClick" />
    </el-menu>
    <el-popover ref="popoverRef" :teleported="false" trigger="click" placement="top" popper-class="user_popover">
        <div class="aside_user_item" @click="handleUserClick('exit')">退出登录</div>
        <template #reference>
            <div class="user">
                <img class="user_avatar" :src="user?.avatar || DEFAULTAVATAR">
                <div v-if="!collapse">
                    <span style="margin-bottom: 4px;">{{ user?.username }}</span>
                    <span>{{ user?.phone }}</span>
                </div>
            </div>
        </template>
    </el-popover>
</template>
<script setup lang="ts">
import ICON from '@/components/AIcon/index'
import MENU from './menu.vue'
import DEFAULTAVATAR from '@/assets/images/default_avatar.jpg'
const route = useRoute()
defineProps<{ name: string, collapse: boolean, menuList: menuType[], user: any }>()
const emits = defineEmits(['handleMenuClick', 'handleUserClick'])
const popoverRef = ref()
const handleMenuClick = (e: menuType) => {
    emits('handleMenuClick', e)
}
const handleUserClick = (e: string) => {
    popoverRef.value.hide()
    emits('handleUserClick', e)
}
</script>

<style scoped lang="scss">
.logo {
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-weight: 600;
    font-size: 22px;
    user-select: none;
    pointer-events: none;

    span {
        margin: 0 0 0 8px;
    }
}

.user {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 20px;
    cursor: pointer;

    &_avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    >div {
        @include cssFlex(column, center, flex-start);
        margin: 0 0 0 8px;

        span {
            line-height: 1;
        }

        >span:last-child {
            font-weight: 400;
            font-size: 14px;
            margin-top: 2px;
        }
    }
}
</style>