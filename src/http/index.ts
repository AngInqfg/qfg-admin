import { request } from "./request"
import { ENV, BASE } from '/public/env'
const env = import.meta.env
const envName = env.MODE
const base = envName === 'dev' ? BASE['default'] : ENV['dev'].defaultUrl

export const login = async (e): Promise<{ code: number, data: string, message: string }> => {
    return await request<{ code: number, data: string, message: string }>({ url: base + '/login', data: e })
}
export const get_user = async (): Promise<{ code: number, data: null, message: string }> => {
    return await request<{ code: number, data: null, message: string }>({ url: base + '/getUser' })
}
export const get_menu = async (): Promise<{ code: number, data: any[], message: string }> => {
    return await request<{ code: number, data: any[], message: string }>({ url: base + '/getMenu' })
}