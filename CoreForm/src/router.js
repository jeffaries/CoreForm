import Vue from 'vue'
import Router from 'vue-router'
import Main from './pages/main.vue'
import FormDefinition from './pages/formdefinition.vue'
import ProcessDefinition from './pages/processdefinition.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/main'
        },
        {
            path: '/main',
            name: 'Main',
            component: Main
        },
        {
            path: '/formdefinition',
            name: 'FormDefinition',
            component: FormDefinition
        },
        {
            path: '/processdefinition',
            name: 'ProcessDefinition',
            component: ProcessDefinition
        }
    ]
})