export interface envType {
    name: string,
    defaultUrl: string,
    wsUrl?: string
}
// /posts
export type envConfigType = Record<string, envType>
const dev: envType = {
    name: 'DEV',
    defaultUrl: 'https://fc-mp-d2710277-d07d-462e-99b0-59276137c9a6.next.bspapp.com/qfg-admin',
    // wsUrl: ''
}
const prev: envType = {
    name: 'PREV',
    defaultUrl: 'https://fc-mp-d2710277-d07d-462e-99b0-59276137c9a6.next.bspapp.com/qfg-admin',

}
const prod: envType = {
    name: 'PROD',
    defaultUrl: 'https://fc-mp-d2710277-d07d-462e-99b0-59276137c9a6.next.bspapp.com/qfg-admin',
}
const BASE: Record<string, string> = {
    default: '/qfg-admin',
    //  ws: '/ws'
}
const ENV: envConfigType = { dev, prod, prev }
const PROXY = (currentEnv: envType) => {
    const newProxy: any = {}
    for (const K in BASE) {
        const V = BASE[K]
        const itemKey = `${K}Url`
        newProxy[V] = {
            target: currentEnv[itemKey as keyof typeof currentEnv],
            secure: false,
            changeOrigin: true,
            rewrite: (path: string) => path.replace(new RegExp(V), ""),
            bypass(req: any, res: any, options: any) {
                const proxyUrl = new URL(options.rewrite(req?.url) || '', (options?.target) as string)?.href || ''
                res.setHeader('v-proxy-url', proxyUrl)
            }
        }
    }
    return newProxy
}
export { ENV, BASE, PROXY }