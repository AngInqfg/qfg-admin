<template>
    <el-button type="primary" @click="handleAdd">添加</el-button>
    <el-button type="primary" v-if="!isEdit" @click="handleEdit">编辑</el-button>
    <el-table :data="menuList">
        <el-table-column prop="icon" label="图标" width="75">
            <template #default="scope">
                <ICON v-if="!isEdit && scope.row?.icon" :name="`menu-${scope.row?.icon}`" />
                <div v-else>
                    <el-popover v-model:visible="scope.row.visible" placement="bottom" title="选择图标" :width="200"
                        trigger="click">
                        <div style="display: grid;grid-template-columns: repeat(5, auto);gap: 6px;">
                            <ICON class="icon" size="16px" v-for="(item) in svgList" :name="`menu-${item.name}`"
                                @click="handleIconChange(item?.name, scope)" />
                        </div>
                        <template #reference>
                            <ICON v-if="!!scope.row?.icon" :key="scope.row?.icon" :name="`menu-${scope.row?.icon}`" />
                            <span v-else>暂无</span>
                        </template>
                    </el-popover>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="path" label="路由">
            <template #default="scope">
                <span v-if="!isEdit">{{ scope.row?.path }}</span>
                <el-input v-else v-model="scope.row.path"></el-input>
            </template>
        </el-table-column>
        <el-table-column prop="show" label="显示">
            <template #default="scope">
                <span v-if="!isEdit">{{ scope.row?.show }}</span>
                <el-radio-group v-else v-model="scope.row.show">
                    <el-radio :value="true">是</el-radio>
                    <el-radio :value="false">否</el-radio>
                </el-radio-group>
            </template>
        </el-table-column>
        <el-table-column prop="title" label="标题">
            <template #default="scope">
                <span v-if="!isEdit">{{ scope.row?.title }}</span>
                <el-input v-else v-model="scope.row.title"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="100" align="center" prop="operaction" label="操作">
            <template #default="scope">
                <el-button @click="handleDel(scope)" text type="primary">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="btn" v-if="isEdit">
        <el-button type="default" @click="handleConceal">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
    </div>
</template>
<script setup lang="ts">
import { useStore } from '@/stores'
import ICON from '@/components/AIcon/index'
import { update_menu } from '@/http'
import { ElMessage, ElLoading } from 'element-plus';
const globSvg = import.meta.glob('/src/assets/icons/menu-**.svg')
const router = useRouter()
const store = useStore()
const loading = shallowRef()
const openLoading = (text) => {
   if (loading.value) {
      loading.value.close()
   }
   loading.value = ElLoading.service({ lock: true, text: text, background: 'rgba(0, 0, 0, 0.3)' })
}
const { menu, getMenu } = store
const menuList = ref<{ icon?: string, path: string, show: boolean, title: string, visible?: boolean }[]>([])
const svgList = shallowRef<{ name: string }[]>([])
onMounted(() => {
    menuList.value = menu
    for (const keys in globSvg) {
        svgList.value.push({
            name: keys.split('menu-')[1].replace('.svg', ''),
        })
    }
});
const isEdit = ref<boolean>(false)
const handleEdit = () => {
    if (isEdit.value) return
    isEdit.value = true
    menuList.value = menu ? structuredClone(toRaw(menu)) : []
}
const handleAdd = () => {
    isEdit.value = true
    menuList.value.push({ path: '', show: false, title: '' })
}
const handleConceal = () => {
    isEdit.value = false
    menuList.value = menu ? structuredClone(toRaw(menu)) : []
}
const handleDel = ({ $index }) => {
    menuList.value = menuList.value.filter((_n, i) => {
        return i !== $index
    })
}
const handleIconChange = (name, scope) => {
    menuList.value = menuList.value.map((n, i) => {
        if (i === scope.$index) {
            n.icon = name
        }
        n.visible = false
        return n
    })
}
const handleConfirm = async () => {
    openLoading('正在保存')
    const data = menuList.value.map((n) => {
        delete n.visible
        return n
    }).filter((n) => {
        return n.path && n.title
    })
    const { code, message } = await update_menu(data)
    ElMessage({
        type: code === 0 ? 'success' : 'warning',
        message
    })
    if (code === 0) {
        await getMenu()
        store.asideRefresh = !store.asideRefresh
        let timer = setTimeout(() => {
            router.replace('/admin')
            clearTimeout(timer)
        }, 200);
    }
    loading.value.close()
}
</script>
<style scoped lang="scss">
.icon {
    cursor: pointer;
    fill: #888;

    &:hover {
        fill: #000;
        background: #ddd;
    }
}

.btn {
    width: 100%;
    text-align: right;
    margin-top: 6px;
}
</style>