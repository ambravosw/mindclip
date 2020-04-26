import Vue from 'vue'
import Vuex from 'vuex'

// import db from '@/services/database.service'
import ApiService from '@/services/api.service'

Vue.use(Vuex)

export default {
    namespaced: true,
    // -----------------------------------------------------------------
    state: {
    },
    // -----------------------------------------------------------------
    getters: {
        getAuthenticated(state, getters, rootState) {
            return rootState.auth.accessToken
        },
    },
    // -----------------------------------------------------------------
    mutations: {
    },
    // -----------------------------------------------------------------
    actions: {
        async login({ commit }, payload) {
            /* eslint-disable no-console */
            console.log('login ...', commit)
            /* eslint-enable no-console */
            await this.dispatch('auth/login', payload)
            await this.dispatch('app/initApp')
        },
        async logout() {
            /* eslint-disable no-console */
            console.log('logout ...')
            /* eslint-enable no-console */
            await this.dispatch('auth/logout')
        },
        async initApp({ commit }) {
            /* eslint-disable no-console */
            console.log('starting ...', commit)
            await this.dispatch('app/test')
            /* eslint-enable no-console */
        },
        async test({ commit }) {
            /* eslint-disable no-console */
            console.log('test', commit)
            const response = await ApiService.get("/api/auth/test")
                .catch((e) => {
                    const errorMsg = JSON.stringify(e.response.data)
                    console.log('errorMsg', errorMsg)
                })

            if (response) {
                console.log('fetching data', response)
                if (response.data.success) {
                    return response.data.data
                }
            }
            /* eslint-enable no-console */
        },
    }
}