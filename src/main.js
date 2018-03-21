// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/App'
import router from './router/index'
import store from './store/index'
import jwtToken from './helpers/jwt'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueI18n from 'vue-i18n'
import LangStorage from './helpers/lang'

require('swiper/dist/css/swiper.css')
import VueAwesomeSwiper from 'vue-awesome-swiper'

import zh_CN from 'vee-validate/dist/locale/zh_CN';
import VeeValidate, { Validator } from 'vee-validate';


/**
 * Set required for JWT user authentication http Authorization head info.
 */
axios.interceptors.request.use(function (config) {
  if(jwtToken.getToken()) {
    // Bearer!!!After the need for a Space!!!
    config.headers['Authorization'] = 'Bearer' + ' ' + jwtToken.getToken()
  }
  return config
}, function (error) {
  return Promise.reject(error)
})


/**
 * Vee Validate
 * zh_CN
 * Front-end Input need the field：data-vv-as
 */
// Validator.localize('zh_CN', zh_CN);
Vue.use(VeeValidate, {
  // locale: 'zh_CN'
});

Vue.use(VueAxios, axios)
Vue.use(VueAwesomeSwiper)
Vue.use(VueI18n)


/**
 * i18n
 * @type {VueI18n}
 */
const i18n = new VueI18n({
  locale: LangStorage.getLang('en'),  // 语言标识
  messages: {
    'zh': require('./common/lang/zh'),
    'en': require('./common/lang/en')
  }
})


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: {App},
  name: '{locale}'
})
