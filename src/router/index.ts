import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from '@/stores'
import Layout from '@/components/ALayout/index.vue'
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'LAYOUT',
        component: Layout,
        children: [
            rc('/home', false, { title: '首页' }),
            rc('/item', true),
            rc('/admin', false, { title: '用户' }),
            rc('/nuxt', false, { title: 'nuxt' }),
            rc('/xcx', false, { title: '小程序' }),
            rc('/menu', false, { title: '菜单' }),
            rc('/messageList', true, { title: '记录' }),
        ],
        redirect: '/home'
    },
    rc('/login', false, { title: '登录' })
]
const router = createRouter({
    history: createWebHistory(''),
    routes,
})

router.beforeEach(async (_to: any, _from: any, _next: any) => {
    const store = useStore()
    if (_to.meta.title) {
        document.title = _to.meta.title as string;
    }
    if (!!store.token) {
        if (_to.path === '/login') {
            _next(_from)
            return
        }
        if (!store.menu.some((n) => n.path === _to.path)) {
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