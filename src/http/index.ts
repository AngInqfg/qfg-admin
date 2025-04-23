import { request } from "./request"
import { ENV, BASE } from '/public/env'
const env = import.meta.env
const envName = env.MODE
const adminBase = envName === 'dev' ? BASE['default'] : ENV['dev'].defaultUrl
const blogBase = envName === 'dev' ? BASE['blog'] : ENV['dev'].blogUrl

export const login = async (e: loginParamType) => {
    return await request<loginRequestType>({ url: adminBase + '/login', data: e })
}
export const get_user = async () => {
    return await request<userRequestType>({ url: adminBase + '/getUser' })
}
export const get_menu = async () => {
    return await request<menuRequestType[]>({ url: adminBase + '/getMenu' })
}
export const get_blog = async () => {
    return await request<menuRequestType[]>({ url: blogBase + '/getQfgBlogInfo' })
}
export const get_message = async () => {
    return await request<userRequestType>({ url: blogBase + '/getQfgBlogMsgList' })
}
export const add_message = async (e) => {
    return await request<userRequestType>({ url: blogBase + '/addQfgBlogMsgList', data: e })
}
export const delete_message = async (e) => {
    return await request<userRequestType>({ url: blogBase + '/deleteQfgBlogMsgList', data: e })
}
export const get_xcx = async () => {
    return await request<menuRequestType[]>({ url: blogBase + '/getQfgBlogXcx' })
}
export const set_user = async (e: userType) => {
    return await request<null>({ url: adminBase + '/setUser', data: e })
}
export const update_menu = async (e: any) => {
    return await request<null>({ url: adminBase + '/updateMenu', data: e })
}
export const update_info = async (e: any) => {
    return await request<null>({ url: adminBase + '/updateInfo', data: e })
}
export const uploadFile = async (e) => {
    return await request<null>({ url: adminBase + '/uploadFile', data: e })
}