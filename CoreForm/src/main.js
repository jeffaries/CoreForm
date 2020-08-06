import Vue from 'vue'
import App from "./App.vue";
import router from './router'

Vue.config.productionTip = false
setTimeout(() => {
	console.log(router.currentRoute.path);
}, 0);
new Vue({
    router:router,
    render: h => h(App)
}).$mount("#app");
