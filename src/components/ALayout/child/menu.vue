<template>
    <template v-for="item in list">
        <el-sub-menu :index="item?.path" v-if="item?.children && item?.children.length > 0">
            <template #title>
                <el-icon>
                    <ICON v-if="item?.icon" :name="`menu-${item?.icon}`" />
                </el-icon>
                <span>{{ item?.title }}</span>
            </template>
            <MENU :list="item?.children" @click="handleClick" />
        </el-sub-menu>
        <template v-else>
            <el-menu-item :index="item?.path" v-if="item?.show" @click="handleClick(item)">
                <el-icon>
                    <ICON v-if="item?.icon" :name="`menu-${item?.icon}`" />
                </el-icon>
                <span>{{ item?.title }}</span>
            </el-menu-item>
        </template>
    </template>
</template>
<script setup lang="ts">
import ICON from '@/components/AIcon/index'
import MENU from './menu.vue'
defineProps<{ list: menuType[] }>()
const emits = defineEmits(['click'])
const handleClick = (e: menuType) => {
    emits('click', e)
}
</script>