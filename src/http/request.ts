import AXIOS from 'axios'
import { useStore } from '@/stores';
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
const request = async <T>(options = {}) => {
    return axiosInstance({
        method: 'POST',
        ...options
    }).then((response) => response as T).catch((error) => {
        throw error;
    });
}
const customCode = {
    OK: 0,
    NOT: 999999
}
export {
    request, customCode
}