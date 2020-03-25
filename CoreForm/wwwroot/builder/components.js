
Vue.component('x-form', { 
	template: `<div class="row"><div id="formContainer" v-cloak class="col nested-sortable">
  <component  v-for="field in schema.fields"
             :key="field.id"
             :is="field.type"
			 v-bind="field"
			 v-model="values[field.id]">
  </component></div></div>`,
  data() {
    return {}
  },
  computed:{
  },
  props:["schema", "values"]
}
);


Vue.component('grid', {
  template:`<div class="col s12"><div class="row">
			<div :class="'col nested-sortable s' + column.width" :data-column="index" :data-grid="id" v-for="(column,index) in columns">  
				<component v-for="field in column.fields" 
				 :key="field.id"
				 :is="field.type"
				 v-model="$root.data[field.id]"
				 v-bind="field"></component>
			</div></div></div>`,
  data() {
    return {}
  },
  computed:{
  },
  props:["id", "label", "value", "columns"]
});


var textField = Vue.component('textField', {
  template:`<div :class="'input-field col s' + width"><label :for="id">{{ label }}</label><input type="text" :id="id" :value="value" @input="updateInput"></div>`,
  data() {
    return {
    }
  },
  computed:{
  },
  methods: {
          updateInput () {
              this.$emit('input', this.$el.getElementsByTagName("input")[0].value)
          }
      },
  props:["label","id", "value", "width"]
});


Vue.component('selectField', {
  template:
	`<div :class="'input-field col s' + width">
	<select @change="changeValue" v-model="value" :name="id">
	  <option v-for="answer in answers" :key="answer.value" :value="answer.value">{{ answer.label }}</option>
	</select><label :for="id">{{ label }}</label>
	</div>`,
  data() {
    return {
    }
  },  methods: {
          changeValue: function(evt) {
              this.$emit('input', evt.srcElement.value)
          }
      },
  computed:{
  },
  props:["label","id","answers", "value", "width"]
});
