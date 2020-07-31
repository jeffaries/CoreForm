import Vue from 'vue';
import SuspensionFiller from './main.vue';

document.getElementById('App').innerHTML = '<sf-main />';
new Vue({
    el: '#App',
    components: {
        'sf-main': SuspensionFiller
    }
});