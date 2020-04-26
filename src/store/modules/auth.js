import { UserService, AuthenticationError } from '@/services/user.service'
import {TokenService} from '@/services/token.service'
import router from '@/router'

const state =  {
    authenticating: false,
    accessToken: TokenService.getToken(),
    authenticationSuccess: false,
    authenticationErrorCode: 0,
    authenticationError: '',
}

const getters = {
    loggedIn(state){
        return state.accessToken ? true : false
    },

    authenticationErrorCode: (state) => {
        return state.authenticationErrorCode
    },

    authenticationError(state){
        return state.authenticationError
    },

    authenticationSuccess(state){
        return state.authenticationSuccess
    },

    authenticating: (state) => {
        return state.authenticating
    },
}

const actions = {
    async login({ commit }, {email, password}) {
        commit('loginRequest')
        try {
            const token = await UserService.login(email, password);
            commit('loginSuccess', token)
            /* eslint-disable no-console */
            //console.log(token)
            /* eslint-enable no-console */              
            // Redirect the user to the page he first tried to visit or to the home view
            router.push(router.history.current.query.redirect || '/home');
            return true
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('loginError', {errorCode: e.errorCode, errorMessage: e.message})
            }
            return false
        }
    },

    logout({ commit }) {
        UserService.logout()
        commit('logoutSuccess')
        router.push({ name: 'Login'})
    },
}

const mutations = {
    loginRequest(state) {
        state.authenticating = true;
        state.authenticationError = ''
        state.authenticationErrorCode = 0
    },

    loginSuccess(state, accessToken) {
        state.accessToken = accessToken
        state.authenticationSuccess = true;
        state.authenticating = false;
    },

    loginError(state, {errorCode, errorMessage}) {
        state.authenticating = false
        state.authenticationSuccess = false;
        state.authenticationErrorCode = errorCode
        state.authenticationError = errorMessage
    },

    logoutSuccess(state) {
        state.accessToken = ''
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}