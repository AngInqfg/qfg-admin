
const imV = import.meta.glob('@/views/**/*.vue')
const imT = import.meta.glob('@/views/**/*.tsx')
interface rcType {
    url: string,
    keepAlive: boolean,
}
export const rc = (url: rcType['url'], keepAlive: rcType['keepAlive'], option: any = {}) => {
    const u = `/src/views${url}/index.vue`
    const component = imV[u] || imT[u] || undefined
    const item: any = {
        path: url,
        name: url.replaceAll('/', '').toLocaleUpperCase(),
        meta: {
            keepAlive: keepAlive || false
        },
    }
    if (!!component) {
        item.component = component
    }
    if (option?.redirect) {
        item.redirect = option?.redirect
        delete option.redirect
    }
    item.meta = { ...item.meta, ...option, }
    return item
}