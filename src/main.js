import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'

import router from './router'
import store from './store'
import i18n from './plugins/i18n'

import ApiService from '@/services/api.service'
import { TokenService } from '@/services/token.service'

//Set the base URL of the API
ApiService.init(process.env.VUE_APP_ROOT_API)

//If token exists set header
if (TokenService.getToken()) {
    ApiService.setHeader()
}

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
