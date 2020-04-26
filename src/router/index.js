import Vue from 'vue'
import VueRouter from 'vue-router'

import { TokenService } from '@/services/token.service'

import Home from '@/views/Home'
import Login from '@/views/Login'
import Public from '@/views/Public'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Public',
        component: Home,
        meta: { 
            public : true
        },
    },
    // {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    //     meta: { 
    //         public : true
    //     },
    // },
    { 
        path: '/login', 
        name: 'Login',
        component: Login,
        meta: {
            public: true,  // Allow access to even if not logged in
            onlyWhenLoggedOut: true
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { 
            public : false,
            // customComponent: 'CustomPerson'
        },
    },
    {
        path: '/test',
        name: 'Test',
        component: Home,
        meta: { 
            public : false,
            // customComponent: 'CustomPerson'
        },
    },
    { 
        path: "*", 
        component: Public,
        meta: { 
            public : true
        },
    }    
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to,from,next) => {
    const isPublic = to.matched.some(record => record.meta.public)
    const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut)
    const loggedIn = !!TokenService.getToken()

    if (!isPublic && !loggedIn) {
        return next({
            path:'/login',
            query: {redirect: to.fullPath}  // Store the full path to redirect the user to after login
        });
    }

    // Do not allow user to visit login page or register page if they are logged in
    if (loggedIn && onlyWhenLoggedOut) {
        return next('/')
    }

    /* eslint-disable no-console */
    // console.log('beforeEach: ',to, from)
    /* eslint-enable no-console */  

    next();
})  

export default router
