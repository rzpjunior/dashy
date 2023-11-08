<template>
    <v-select
        v-model="value"
        :items="values"
        item-text="text"
        :label="label"
        @change="selected"
        return-object
        outlined
        :class="dense?'':'rounded-form'"
        :dense="dense"
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.text }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.text }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span class="text-red">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Select Boolean<span class="text-red">*</span></span>
               <span v-else>Select Boolean</span>
            </div>
        </template>
    </v-select>
</template>
<script>
    export default {
        name: 'SelectBoolean',
        data() {
            return {
                value:2,
                values:[{
                    text:'Yes',
                    value:1
                },{
                    text:'No',
                    value:2
                }],
            };
        },
        props:['default', 'dense', 'label', 'norequired', 'error'],
        methods: {
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            // default value dinamis (biasa untuk page update)
            default: {
                handler: function (val) { 
                    this.value = val
                },
                deep: true
            },
        }
    };
</script>