Vue.component('cf_toolbutton', {
    template: `<div v-on:click="click()" :class="'toolbar-button ' + cssclass"><img :src="'./img/'+ icon +'.svg'"/></div>`,
    data: function () {
        return {}
    },
    props: ["onclick", "cssclass", "icon"],
    methods: {
        click: function (evt) {
            eval(this.onclick);
        }
    }
});

Vue.component('cf_field', {
    template: `<div :data-ref="id" :type="type" class="sortable-item uk-margin-small-bottom"><div class="toolbar"><cf_toolbutton icon="move" cssclass="moveHandle"/><cf_toolbutton icon="settings" :onclick="'openSettingsById(&quot;'+ id +'&quot;)'"/><cf_toolbutton icon="trash" cssclass="deleteHandle"/></div><slot></slot></div>`,
    data: function () {
        return this.schema
    },
    props: ["schema"]
});

