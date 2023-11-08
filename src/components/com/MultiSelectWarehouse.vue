<template>
    <v-row>
        <v-col cols="12">
            <v-autocomplete
                v-model="warehouses"
                :items="items"
                :loading="isLoading"
                :placeholder="placeholder"
                item-text="name"
                :menu-props="menuProps"
                :search-input.sync="search"
                @change="selected"
                :disabled="disabled"
                return-object
                clearable
                outlined
                chips
                multiple
                deletable-chips
                :class="dense?'multi':'rounded-form multi'"
                :dense="dense"
                :error-messages="error"
            >
                <template v-slot:label>
                    <span v-if="!norequired">Warehouse<span style="color:red">*</span></span>
                    <span v-else>Warehouse</span>
                </template>
                <template slot="selection" slot-scope="data">
                    <v-chip
                        close
                        @click:close="remove(data.item)"
                    >
                        {{ data.item.name }}
                    </v-chip>
                </template>
                <template slot="item" slot-scope="data">
                    {{ data.item.code }} - {{ data.item.name }}
                </template>
            </v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
            <v-checkbox 
                :disabled="disabled"
                class="-mt40"
                label="Select All Warehouse" 
                v-model="all_warehouse"
                @click="allWarehouse(all_warehouse)"
            ></v-checkbox>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        name: 'MultiSelectWarehouse',
        data() {
            return {
                items: [],
                disabledWarehouse: true,
                all_warehouse: false,
                placeholder : '',
                isLoading: false,
                warehouses: [],
                menuProps: {
                    disabled: false
                },
                search:'',
            };
        },
        props: ['warehouse','disabled','clear','area_id','label','error','aux_data', 'norequired', 'attribute','dense'],
        methods: {
            //render data to component
            remoteSearch(search,area_id) {
                if(area_id !== '' && area_id !== undefined && area_id != 65536){
                    area_id = "|area_id.e:"+area_id
                }else{
                    area_id = ''
                }
                let aux = ''
                if (this.aux_data) {
                    aux = '|aux_data:' +this.aux_data
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/config/warehouse/filter",{params:{
                    conditions:'status:1|name.icontains:'+search+area_id+aux,
                }}).then(response => {
                    this.disabledWarehouse = this.disabled
                    if (response.data.data) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Warehouse'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            allWarehouse(d) { // checkbox untuk select all warehouse
                if (d == true) {
                    this.warehouses = this.items
                    this.disabledWarehouse = true
                    this.$emit('selected', this.items)
                } else {
                    this.warehouses = []
                    this.disabledWarehouse = false
                    this.$emit('selected', this.warehouses)
                }
            },
            //auto select when update component
            autoSelectByID(val) {
                if(val){
                    this.warehouses= []
                    for (let i = 0; i < val.length; i++) {
                        this.warehouses.push(val[i])
                    }
                }
            },
            //selected show update
            selected(event) {
                this.$emit('selected', event);
                if (event.length - 1) { // disable checkbox ketika clear 1 item
                    this.all_warehouse = false
                }
            },
            //remove pills from component
            remove (item) {
                const index = this.warehouses.indexOf(item)
                this.warehouses.splice(index, 1)
                this.$emit('selected', this.warehouses);
            },
        },
        watch: {
            search: {
                handler: function (val) {
                    this.remoteSearch('',this.area_id)
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.warehouses = null
                    this.all_warehouse = false
                    this.remoteSearch('',this.area_id)
                },
                deep: true
            },
            warehouse: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            area_id: { // ini fungsi untuk request by area_id
                handler: function (val) {
                    this.all_warehouse = false
                    if(val){ // ini untuk auto select
                        this.remoteSearch('',val)
                    } else {
                        this.warehouses = null
                    }
                },
                deep: true
            },
            warehouses: {
                handler: function (val) {
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>
