<template>
    <el-tabs :model-value="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="item in list" :label="item?.title" :name="item?.path" />
    </el-tabs>
</template>
<script setup lang="ts">
defineProps<{ list: any[], }>()
const emits = defineEmits(['handleTabClick'])
const activeTab = defineModel<string>('activeTab')
const handleClick = (e: any) => {
    emits('handleTabClick', e.paneName)
}
</script>