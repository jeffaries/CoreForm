Vue.component('x-form', {
    template: `<div class="row x-form"><div id="formContainer" v-cloak class="col nested-sortable s12">
  <component  v-for="field in schema.fields"
             :key="field.id"
             :is="field.type"
			 v-bind="field"
			 v-model="values[field.id]">
  </component></div></div>`,
    data() {
        if (this.width === undefined) this.width = 12;
        return {}
    },
    computed: {
    },
    props: ["schema", "values"]
}
);


Vue.component('grid', {
    template: `<div class="col s12"><div class="row gridrow">
			<div :class="'col nested-sortable s12 m' + column.width" :data-column="index" :data-grid="id" v-for="(column,index) in columns">  
				<component v-for="field in column.fields" 
				 :key="field.id"
				 :is="field.type"
				 v-model="$root.data[field.id]"
				 v-bind="field"></component>
			</div></div></div>`,
    data() {
        if (this.width === undefined) this.width = 12;
        return {}
    },
    computed: {
    },
    props: ["id", "label", "value", "columns"]
});


var textField = Vue.component('textField', {
    template: `<div :class="'input-field col s12 m' + width"><label :for="id">{{ label }}</label><input type="text" :id="id" :value="value" @input="updateInput"></div>`,
    data() {
        if (this.width === undefined) this.width = 12;
        return {
        }
    },
    computed: {
    },
    methods: {
        updateInput() {
            this.$emit('input', this.$el.getElementsByTagName("input")[0].value)
        }
    },
    props: ["label", "id", "value", "width"]
});


Vue.component('selectField', {
    template:
        `<div :class="'input-field col s12 m' + (width ? width : '12')">
	<select @change="changeValue" class="select2 no-autoinit" v-model="id" :id="id" :name="id">
	</select><label :for="id" class="active">{{ label }}</label>
	</div>`,
    data() {
        if (this.width === undefined) this.width = 12;
        return {}
    },
    methods: {
        changeValue(evt) {
            this.$emit('input', evt.srcElement.value)
        }
    },
    computed: {
    },
    props: ["label", "id", "options", "value", "width", "source"],
    mounted: function () {
        var vm = this;
        var el = $(this.$el).find('select');

        var dataObj = { data: this.options };
        if (this.source != undefined) {
            dataObj = {
                ajax: {
                    url: function (params) {
                        if (params.term === undefined) {
                            return 'https://restcountries.eu/rest/v2/all?fields=name;flag;alpha3Code'
                        } else {
                            return 'https://restcountries.eu/rest/v2/name/' + params.term + '?fields=name;flag;alpha3Code'
                        }
                    },
                    dataType: 'json',
                    delay: 250,
                    processResults: function (data, params) {
                        params.page = params.page || 1;
                        for (var i = 0; i < data.length; i++) {
                            data[i].id = data[i].alpha3Code;
                            data[i].text = data[i].name;
                        }
                        return {
                            results: data
                        };
                    },
                    cache: true
                },
                minimumInputLength: this.source.minimumInputLength,
                multiple:'multiple'
            };
        }



        el.select2(dataObj)
            .val(this.value)
            .trigger("change")
            // emit event on change.
            .on("change", function () {
                vm.$emit("input", $(this).val());
            });
    },
    watch: {
        value: function (value) {
            // update value
            $(this.$el)
                .val(value)
                .trigger("change");
        },
        options: function (options) {
            // update options
            $(this.$el)
                .empty()
                .select2({ data: options });
        }
    },
    destroyed: function () {
        $(this.$el)
            .off()
            .select2("destroy");
    }
});
