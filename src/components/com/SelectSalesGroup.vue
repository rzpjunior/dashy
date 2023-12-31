<template>
    <v-autocomplete
        v-model="sales_group"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        item-value="code"
        name="salesGroup"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        return-object
        clearable
        outlined
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span class="red--text">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Sales Group<span class="red--text">*</span></span>
                <span v-else>Sales Group</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSalesGroup',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                sales_group:null
            };
        },
        props: ['salesgroup_id','area_id','disabled','clear','label','error', 'norequired', "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                let area = ''
                if(this.area_id)
                area = '|area.id.e:'+this.area_id
                // For get data from api
                this.$http.get("/sales/group",{params:{
                    conditions:'status:1|name.icontains:'+search+area,
                }}).then(response => {
                    if(response)
                    this.items=response.data.data
                    if(this.items === null)
                    this.items = []
                    this.isLoading = false
                    let label = 'Sales Group'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/sales/group",{params:{
                        conditions:'id.e:'+val,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.isLoading = false
                        this.sales_group = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted(){
            if(this.salesgroup_id > 0){
                this.autoSelectByID(this.salesgroup_id)
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val) this.remoteSearch(val) 
                    else this.remoteSearch('')
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.sales_group = null;
                    if(!val) this.remoteSearch('')
                },
                deep: true
            },
            salesgroup_id: { // for get specific data by id
                handler: function (val) {
                    if(val) this.autoSelectByID(val)
                },
                deep: true
            },
            sales_group: { // for get all data when clear or empty search
                handler: function (val) {
                    if(!val) this.remoteSearch('')
                },
                deep: true
            },
            area_id: { // for get sales group based on area
                handler: function (val) {
                    if(val) this.remoteSearch('')
                },
                deep: true
            },
        },
    };
</script>
