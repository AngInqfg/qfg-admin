import { defineStore } from 'pinia'
import { useSessionStorage } from '@vueuse/core';
import { get_user, get_menu } from '@/http'
export const useStore: any = defineStore('useStore', () => {
    const asideRefresh = ref(false)
    const name = 'QFGBLOG管理'
    const token = useSessionStorage('token', '');
    const color = useSessionStorage('color', '#4763e4');
    const user = useSessionStorage<userRequestType | {}>('user', {})
    const menu = useSessionStorage<menuRequestType[]>('menu', [])
    const tabList: any = useSessionStorage('tabList', [])
    const layoutConfig = ref({
        asideColor: '#333',
        asideWidth: '240px',
        asideCollapse: true,
        menuActiveBgColor: 'rgba(66, 86, 208,1)',
        menuActiveTextColor: 'rgba(255, 255, 255,1)',
        headColor: 'rgba(255, 255, 255, 1)',
        headHeight: '60px',
        breadColor: 'rgba(250, 250, 250, 1)',
        breadShow: true,
        mainColor: 'rgba(250, 250, 250, 1)',
    })
    const getUser = async (t: loginRequestType) => {
        token.value = t
        const { code, data } = await get_user()
        user.value = code === 0 ? data : null
    }
    const getMenu = async () => {
        const { code, data } = await get_menu()
        menu.value = code === 0 ? data : []
    }
    const clearStorage = async () => {
        await localStorage.clear()
        await sessionStorage.clear()
    }
    return {
        asideRefresh,
        name,
        token,
        color,
        user,
        menu,
        layoutConfig,
        getUser,
        getMenu,
        clearStorage,
        tabList
    }
})