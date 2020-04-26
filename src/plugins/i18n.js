import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = 
{
    'ENG': {
        EMAIL: 'email', /* DO NOT REMOVE */
        LOGIN: 'login', /* DO NOT REMOVE */
        MAX_SIZE: 'max. {size} char.',
        NUMBER_REQUIRED: 'number required',
        PASSWORD: 'password', /* DO NOT REMOVE */
        REQUIRED: 'required',
    },
    'ESP': {
        EMAIL: 'email',
        LOGIN: 'login',
        MAX_SIZE: 'tamaño máximo: {size}',
        NUMBER_REQUIRED: 'number required',
        PASSWORD: 'password',
        REQUIRED: 'obligatorio',
    }
}

export default new VueI18n({
    locale: 'ESP', // set locale
    fallbackLocale: 'ENG', // set fallback locale
    messages, // set locale messages
});