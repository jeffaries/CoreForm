<template>
    <div v-cloak>
        <ul class="uk-list uk-list-striped" id="example-1">
            <li v-for="form in FormList" :key="form">
                {{ form }}
            </li>
        </ul>
        <button class="uk-button uk-button-default" @click="save">Add</button>
    </div>
</template>

<script>
    import dotnetify from 'dotnetify/vue';
    import UIkit from 'uikit';
    import Icons from 'uikit/dist/js/uikit-icons';

    UIkit.use(Icons);

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
            save: function (formName) {
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