<template>
    <TAB :list="list" :activeTab="activeTab" @handleTabClick="handleTabClick" />
</template>
<script setup lang="ts">
import TAB from './tab.vue'
const route = useRoute()
const router = useRouter()
const props = defineProps<{ list: any[] }>()
const emits = defineEmits(['handleHeadClick'])
const activeTab = ref(route.path)
watch(() => route.path, (_new: any) => {
    activeTab.value = _new
}, { deep: true })
const handleTabClick = (e: string) => {
    const item = props.list.find((n: menuType) => n.path === e)
    router.push({ path: item.path, query: item?.query || null })
}
</script>