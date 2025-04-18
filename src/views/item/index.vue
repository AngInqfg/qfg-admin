<template>
    item:
    <input type="text" v-model="id">
</template>
<script setup lang="ts">
const route = useRoute()
const id = ref<string>('')
onActivated(() => {
    id.value = route.query?.id as string
})
</script>