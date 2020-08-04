<template>
    <div v-cloak id="app">
        <ul class="uk-list uk-list-striped" id="example-1">
            <li v-for="form in FormList" :key="form">
                {{ form }}
            </li>
        </ul>
        <button class="uk-button uk-button-default" @click="save">Add</button>
3
        <designer/>
    </div>
</template>

<script>
    import Vue from "vue";
    import dotnetify from 'dotnetify/vue';
    import UIkit from 'uikit';
    import Icons from 'uikit/dist/js/uikit-icons';
    import { designer } from '@coreform/components' 
    Vue.component('designer', designer);
    UIkit.use(Icons);

    // Due to a little bug in Sortable (test of JQuery while Jquery is not present....)
    window.jQuery = null;
    dotnetify.hubOptions = { transport: ['longPolling'] };
    export default {
        name: 'FormViewModel',
        created: function () {
            this.vm = dotnetify.vue.connect("FormViewModel", this, { watch: ['FormList'] });
        },
        destroyed: function () {
            this.vm.$destroy();
        },
        data: function () {
            return {
                FormList: Array
            }
        },
        methods: {
            save: function () {
               this.vm.$dispatch({ Save: null });
            }
        }
    }
</script>
<style lang="scss">
    @import "../node_modules/uikit/src/scss/variables-theme.scss";
    @import "../node_modules/uikit/src/scss/mixins-theme.scss";
    @import "../node_modules/uikit/src/scss/uikit-theme.scss";
</style>