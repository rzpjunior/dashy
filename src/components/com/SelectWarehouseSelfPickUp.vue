<template>
    <v-autocomplete
        v-model="warehouses"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        name="warehouse"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
            <template v-slot:label>
                <div v-if="label">
                   <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                   <span v-else>{{ label }}</span>
                </div>
                <div v-else>
                   <span v-if="!norequired">Warehouse<span :class="disabled?'':'text-red'">*</span></span>
                   <span v-else>Warehouse</span>
                </div>
            </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectWarehouseSelfPickUp',
        data() {
            return {
                items: [],
                placeholder : 'Select Warehouse',
                isLoading: false,
                search:'',
                warehouses:null
            };
        },
        props: ['warehouse','disabled','clear','label','error','update', 'norequired', 'aux_data', "dense"],
        methods: {
            autoSelectByID(val) {
                if(val){
                    this.items = []
                    this.items.push(val)
                    this.warehouses = val
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.warehouse){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.warehouses = null;
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
            warehouse: {
                handler: function (val) {
                    if(val !== null && val !== ''){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.warehouses = null
                    }
                },
                deep: true
            },
        },
    };
</script>
