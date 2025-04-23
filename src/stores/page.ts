import { defineStore } from 'pinia'
import { useSessionStorage } from '@vueuse/core';
import { get_blog, get_xcx, get_message } from '@/http'
export const usePageStore:any = defineStore('usePageStore', () => {
    const blogData = useSessionStorage('blogData', {});
    const getBlogData = async (bool) => {
        if (!bool && Object.getOwnPropertyNames(blogData.value).length !== 0) {
            return
        }
        const { data } = await get_blog()
        const { data: xcx } = await get_xcx()
        blogData.value = data && xcx ? { ...data, ...xcx } : {}
    }
    const msgList = useSessionStorage('msgList', {});
    const getMsgList = async (bool) => {
        if (!bool && Object.getOwnPropertyNames(msgList.value).length !== 0) {
            return
        }
        const { data } = await get_message()
        msgList.value = data || {}
    }
    return {
        blogData,
        getBlogData,
        msgList,
        getMsgList
    }
})