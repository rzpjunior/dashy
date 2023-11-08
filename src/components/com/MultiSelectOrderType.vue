<template>
    <div>
        <v-autocomplete
            v-model="ordertype"
            :items="items"
            :placeholder="placeholder"
            :loading="isLoading"
            item-text="name"
            :search-input.sync="search"
            :menu-props="menuProps"
            @input="adjustOptions"
            @change="selected"
            :disabled="disabled"
            return-object
            clearable
            outlined
            chips
            multiple
            deletable-chips
            class="multi"
            :dense="dense"
            :error-messages="error"
        >
            <template v-slot:label>
                <span v-if="!norequired">Order Type<span class="text-red">*</span></span>
                <span v-else>Order Type</span>
            </template>
            <template slot="item" slot-scope="data">
                {{ data.item.name }}
            </template>
        </v-autocomplete>
    </div>
</template>
<script>
    export default {
        name: 'MultiSelectOrderType',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                menuProps: {
                    disabled: false
                },
                ordertype: []

            };
        },
        props: ['order_type','disabled','clear','label','error','norequired','dense'],
        methods: {
            async remoteSearch(search) { // get data from api
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/config/order_type/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    if (response.data.data) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Order Type'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) { // function for autoselect by id
                if(val){
                    this.ordertype= []
                    for (let i = 0; i < val.length; i++) {
                        this.ordertype.push(val[i])
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            adjustOptions() { // function for adjust options
                if (this.computedCounterValue) {
                    this.menuProps.disabled = true
                } else {
                    this.menuProps.disabled = false
                }
            },
        },
        mounted() {
            this.remoteSearch('',this.aux_data);
        },
        watch: {
            search: { 
                handler: function (val) { // search multi select
                    if(val){
                        this.remoteSearch(val,this.aux_data)
                    } else {
                        this.remoteSearch('',this.aux_data)
                    }
                },
                deep: true
            },
            ordertype: {
                handler: function (val) {  // watch perubahan untuk auto select
                    this.search = ''
                },
                deep: true
            },
            order_type: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>