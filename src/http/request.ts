import AXIOS, { AxiosRequestConfig } from 'axios'
import { useStore } from '@/stores';
import { ElMessage } from 'element-plus'
const axiosInstance = AXIOS.create({
    baseURL: '/',
    timeout: 1000 * 60 * 5
});
axiosInstance.interceptors.request.use(
    (config) => {
        const store = useStore()
        if (store?.token) {
            config.headers['Authorization'] = store?.token;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            return response.data
        } else {
            return undefined
        }
    }, (error) => {
        return Promise.reject(error);
    }
);
const request = async <T>(options: AxiosRequestConfig = {}): Promise<requestType<T>> => {
    try {
        const response = await axiosInstance({
            method: 'POST',
            ...options
        }) as unknown as requestType<T>;
        if(response?.code === 9998) {
            ElMessage({ type: 'danger', message: '登录已过期' })
            sessionStorage.clear()
            window.location.href = window.location.origin
        }
        return response;
    } catch (error) {
        // 你可以在这里处理或记录错误
        throw error;
    }
}
const customCode = {
    OK: 0,
    NOT: 999999
}
export {
    request, customCode
}