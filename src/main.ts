import Vue from 'vue';
import App from './app.vue';
import router from './router';
import store from './store';
import antdv from '@/global/antdv-config';

import { ConfigProvider } from 'ant-design-vue';

Vue.use(ConfigProvider);
Vue.use(antdv);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
