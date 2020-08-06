<template>
    <div v-cloak id="app">
        <h1>CoreForm</h1>
        <transition name="fade">
            <router-view></router-view>
        </transition>
        <router-link :to="{ name: 'FormDefinition' }">Form Definition</router-link>
        <router-link :to="{ name: 'ProcessDefinition' }">Process Definition</router-link>
    </div>
</template>

<script>
    import UIkit from 'uikit';
    import Icons from 'uikit/dist/js/uikit-icons';
    UIkit.use(Icons);

    // Due to a little bug in Sortable (test of JQuery while Jquery is not present....)
    export default {
        name: 'app',
    }
</script>
<style lang="scss">
    @import "../node_modules/uikit/src/scss/variables-theme.scss";
    @import "../node_modules/uikit/src/scss/mixins-theme.scss";
    @import "../node_modules/uikit/src/scss/uikit-theme.scss";
</style>

<style>
    .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
</style>