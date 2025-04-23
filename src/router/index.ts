import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from '@/stores'
import Layout from '@/components/ALayout/index.vue'
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'LAYOUT',
        component: Layout,
        children: [
            rc('/home', false),
            rc('/item', true),
            rc('/admin', false),
            rc('/nuxt', false),
            rc('/xcx', false),
            rc('/menu', false),
            rc('/messageList', true),
        ],
        redirect: '/home'
    },
    rc('/login', false)
]
const router = createRouter({
    history: createWebHistory(''),
    routes,
})

router.beforeEach(async (_to: any, _from: any, _next: any) => {
    const store = useStore()
    if (!!store.token) {
        if (_to.path === '/login') {
            _next(_from)
            return
        }
        if(!store.menu.some((n) => n.path === _to.path)) {
            _next(_from)
            return
        }
        _next()
    } else {
        if (_to.path === '/login') {
            _next()
            return
        }
        _next({ path: '/login' })
    }
})
router.afterEach((_to: any) => {

})
export {
    router
}