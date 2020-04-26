import Vue from 'vue'
import Vuex from 'vuex'

import app from '@/store/modules/app'
import auth from '@/store/modules/auth'
import icons from '@/store/modules/icons'
// import user from '@/store/modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
    // state: {
    // },
    // mutations: {
    // },
    // actions: {
    // },
    modules: {
        app,
        auth,
        icons,
        // user,
    }
})
