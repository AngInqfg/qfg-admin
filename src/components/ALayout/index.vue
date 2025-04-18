<template>
    <el-container class="layout" ref="layoutRef">
        <el-aside class="layout_aside" :width="asideCollapse ? 'auto' : asideWidth">
            <ASIDE :name="store.name" :user="store?.user" :collapse="asideCollapse" :menuList="store?.menu"
                @handleMenuClick="handleMenuClick" @handleUserClick="handleUserClick" />
        </el-aside>
        <el-container class="layout_content">
            <el-header>
                <HEADER :list="store.tabList" />
            </el-header>
            <div class="layout_bread" v-if="breadShow">
                <BREAD :collapse="asideCollapse" :breadList="breadList" @handleCollapseClick="handleCollapseClick" />
            </div>
            <el-main class="layout_main">
                <div class="layout_main_content">
                    <router-view v-slot="{ Component, route }">
                        <keep-alive>
                            <component :is="Component" :key="route.name" v-if="route?.meta?.keepAlive" />
                        </keep-alive>
                        <component :is="Component" :key="route.name" v-if="!route?.meta?.keepAlive" />
                    </router-view>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
<script setup lang="ts">
import ASIDE from './child/aside.vue'
import HEADER from './child/header.vue'
import BREAD from './child/bread.vue'
import { useStore } from '@/stores'
import { ElMessage } from 'element-plus'
const store = useStore()
const route = useRoute()
const router = useRouter()
const layoutRef = ref()
const { asideColor, asideWidth, asideCollapse, menuActiveBgColor, menuActiveTextColor, headColor, headHeight, breadColor, breadShow, mainColor } = toRefs(store.layoutConfig)
const flatMenu = computed<any[]>(() => {
    let ar: menuType[] = []
    function flatCl(arr: menuType[]) {
        arr.map((n) => {
            ar.push(n)
            if (n.children && n.children.length > 0) {
                flatCl(n.children)
            }
        })
    }
    flatCl(store.menu)
    return ar
})
const breadList = ref<any[]>([])
watch(() => route, (_new: any) => {
    breadRouteCallback(_new)
    tabRouteCallback(_new)
}, { deep: true, immediate: true })
onMounted(() => {
    nextTick(() => {
        const resize = new ResizeObserver(([first]) => {
            store.layoutConfig.asideCollapse = first?.contentRect?.width < 750
        })
        resize.observe(layoutRef.value.$el)
    })
})
function breadRouteCallback(_new: any) {
    const list = _new.matched.filter((_n: any, _i: number) => _i !== 0)
    breadList.value = list.map((n: any) => {
        const ci = flatMenu.value.find((m: menuType) => m.path === n.path)
        return {
            ...ci,
            title: ci?.title || ''
        }
    })
}
function tabRouteCallback(_new: any) {
    const ci = flatMenu.value.find((m: menuType) => m.path === _new.path)
    if (ci.path !== '/') {
        const hi = store.tabList.findIndex((n: any) => n.path === _new.path)
        const nCi = { ...ci, query: _new?.query || {} }
        if (hi !== -1) {
            store.tabList.splice(hi, 1, nCi)
        } else {
            store.tabList.push(nCi)
        }
    }
}
const menuActiveBgColorOpacity = computed<string>(() => {
    const sp = menuActiveBgColor.value.split(',')
    sp[sp.length - 1] = `0.1)`
    return sp.join(',')
})

const handleMenuClick = (e: menuType) => {
    if (!e?.path) {
        ElMessage({ type: 'warning', message: `暂时无法查看${e?.title || ''}页面` })
        return
    }
    router.push({ path: e?.path })
}
const handleUserClick = async (e: string) => {
    if (e === 'exit') {
        await store.clearStorage()
        window.location.reload()
    }
}
const handleCollapseClick = () => {
    store.layoutConfig.asideCollapse = !store.layoutConfig.asideCollapse
}

</script>

<style scoped lang="scss">
.layout {
    $mainMar: 12px;
    height: 100%;

    .layout_aside {
        $firstColor: rgba(255, 255, 255, 1);
        $secondColor: rgba(142, 148, 179, 1);
        background: v-bind(asideColor);
        display: flex;
        flex-flow: column nowrap;
        position: relative;

        &:deep(.logo) {
            flex: 0 0 v-bind(headHeight);
            color: #fff;
        }

        &:deep(.user_popover) {
            padding: 6px;
            position: fixed !important;
        }

        &:deep(.aside_user_item) {
            padding: 4px 4px;

            &:hover {
                background: v-bind(menuActiveBgColorOpacity);
                cursor: pointer;
                color: v-bind(menuActiveBgColor);
            }
        }

        &:deep(.user) {
            color: #fff;
            flex: 0 0 60px;
        }

        &:deep(.el-menu) {
            background: rgba(0, 0, 0, 0);
            border-right: none;
            flex: 1;
            overflow-y: scroll;

            &::-webkit-scrollbar {
                display: none;
            }

            &.layout_menu::-webkit-scrollbar {
                width: 4px;
                display: block;
            }

            &.layout_menu::-webkit-scrollbar-track {
                background: transparent;
            }

            &.layout_menu::-webkit-scrollbar-thumb {
                background-color: v-bind(menuActiveBgColor);
            }

            .el-sub-menu.is-active.is-opened {
                background: v-bind(menuActiveBgColorOpacity);

                .el-sub-menu__title {
                    color: $firstColor;
                }
            }

            .el-menu-item {
                color: $firstColor;

                &:hover {
                    background: v-bind(menuActiveBgColor);
                }

                &.is-active {
                    background: v-bind(menuActiveBgColor);
                    color: v-bind(menuActiveTextColor);
                    font-weight: 600;
                }

            }

            .el-sub-menu__title {
                color: $secondColor;

                &:hover {
                    background: v-bind(menuActiveBgColor);
                    color: $firstColor;
                }
            }

        }
    }

    .layout_content {
        height: 100%;
        background: v-bind(mainColor);
    }

    .el-header {
        $tabW: 50px;
        width: 100%;
        height: v-bind(headHeight);
        padding: 0 $mainMar;
        background: v-bind(headColor);
        @include cssFlex(row, space-between, center);

        &:deep(.el-tabs) {
            width: calc(100% - $tabW);
        }

        &:deep(.el-tabs__header) {
            margin: 0;
        }

        &:deep(.el-tabs__nav-wrap) {
            &::after {
                display: none;
            }
        }

        &:deep(.header_other) {
            height: 100%;
            flex: 0 0 $tabW;
            @include cssFlex();
        }
    }

    &:deep(.layout_news_drawer) {
        .el-drawer__body {
            padding: 0 !important;
        }

        .layout_news {
            height: calc(100% - $mainMar * 2);
            margin: $mainMar;
            margin-right: 0;
            overflow: auto;

            &::-webkit-scrollbar {
                width: 4px;
                display: block;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background-color: v-bind(menuActiveBgColor);
            }
        }
    }

    .layout_bread {
        background: v-bind(breadColor);
        padding: $mainMar;
        @include cssFlex(row, flex-start);
        box-shadow: 0 0 12px rgba(247, 247, 247, 1) inset;

        &:deep(.text) {
            font-size: 14px;
        }

        &:deep(.collapse_icon) {
            font-size: 16px;
            margin: 0 6px 0 0;
            cursor: pointer;

            &:hover {
                color: v-bind(menuActiveBgColor);
            }
        }
    }

    .layout_main {
        padding: 0;
        overflow: hidden;

        &_content {
            max-height: calc(100% - $mainMar * 2);
            overflow: auto;
            margin: $mainMar;

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
}
</style>