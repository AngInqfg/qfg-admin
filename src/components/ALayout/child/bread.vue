<template>
    <el-icon class="collapse_icon" @click="emits('handleCollapseClick')">
        <Fold v-show="!collapse" />
        <Expand v-show="collapse" />
    </el-icon>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in breadList" :key="item?.path"
            :to="index !== breadList.length - 1 ? { path: item?.path } : ''">
            <ICON v-if="item?.icon" style="margin-right: 2px;" :name="`menu-${item?.icon}`" :color="index !==0 ? 'var(--el-text-color-regular)' : 'inherit'" />
            <span class="text" :style="{ color: index !==0 ? 'var(--el-text-color-regular)' : 'inherit'}">
                {{ item?.title }}
            </span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script setup lang="ts">
import { ArrowRight, Expand, Fold } from '@element-plus/icons-vue'
import ICON from '@/components/AIcon/index'
defineProps<{ breadList: any[], collapse: false }>()
const emits = defineEmits(['handleCollapseClick'])
</script>