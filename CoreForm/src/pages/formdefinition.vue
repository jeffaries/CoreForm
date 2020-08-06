<template>
    <div v-cloak>
        <ul class="uk-list uk-list-striped" id="example-1">
            <li v-for="form in FormList" :key="form">
                {{ form }}
            </li>
        </ul>
        <button class="uk-button uk-button-default" @click="save">Add</button>
        <designer />
    </div>
</template>

<script>
    import Vue from "vue";
    import dotnetify from 'dotnetify/vue';
    import { designer } from '@coreform/components'
    Vue.component('designer', designer);

    // Due to a little bug in Sortable (test of JQuery while Jquery is not present....)
    window.jQuery = null;
    export default {
        name: 'FormViewModel',
        created: function () {
            dotnetify.hubOptions = { transport: ['webSockets','longPolling'] };
            this.vm = dotnetify.vue.connect("FormViewModel", this, { watch: ['FormList'] });
            dotnetify.connectionStateHandler = state => {
                console.log("dotnetify connection : " + state)
            };
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
