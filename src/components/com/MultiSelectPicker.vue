<template>
    <v-autocomplete
        v-model="pickers"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="name"
        :search-input.sync="search"
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
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Picker<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Picker</span>
            </div>
        </template>
    </v-autocomplete>
</template>

<script>
    export default {
        name: 'MultiSelectPicker',
        data() {
            return {
                items: [],
                placeholder: '',
                isLoading: false,
                pickers: [],
                search: '',
            };
        },
        props: ['picker', 'disabled', 'clear', 'label', 'error', 'aux_data', 'norequired', 'warehouse', 'dense'],
        methods: {
            remoteSearch(search) {
                let warehouse
                if (this.warehouse) {
                    warehouse = "|warehouse_id.e:" + this.warehouse
                } else {
                    warehouse = ''
                }
                this.items = []
                this.isLoading = true
                this.placeholder = "Loading items..."
                // ini ke endpoint get all
                this.$http.get("/user/helper",{params:{
                    perpage: 20,
                    conditions:'status:1|name.icontains:'+search+warehouse+'|role_id.e:1703936',
                    orderby:'-id',
                }}).then(response => {
                    if(response.data.data){
                        response.data.data.forEach((value, index) =>{
                            this.items.push(response.data.data[index])
                        });
                    }
                    this.isLoading = false
                    let label = 'Picker'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                })
            },
            autoSelectByID(val) { // untuk get by ID
                if (val) {
                    this.pickers = []
                    for (let i = 0; i < val.length; i++) {
                        this.packers.push(val[i])
                    }
                }
            },
            selected(event) { // untuk selected komponen
                this.$emit('selected', event);
            },
        },
        watch: {
            search: { // untuk search
                handler: function(val) {
                    if (val) {
                        this.remoteSearch(val)
                    } else {
                        this.remoteSearch('', this.warehouse, this.city_id, this.district_id, this.area_id)
                    }
                },
                deep: true
            },
            clear: {
                handler: function(val) { // untuk clear
                    this.pickers = null
                    this.remoteSearch('', this.warehouse, this.city_id, this.district_id, this.area_id)
                },
                deep: true
            },
            picker: {
                hahandler: function(val) {
                    if (val) { // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.pickers = null
                    }
                },
                deep: true
            },
            pickers: { // untuk search
                handler: function(val) {
                    this.search = ''
                },
                deep: true
            },
            warehouse: { // untuk props warehouse
                handler: function(val) {
                    this.pickers = null
                    if (val !== null && val !== '') { // ini untuk auto select
                        this.remoteSearch('')
                    } else {
                        this.pickers = null
                    }
                },
                deep: true
            }
        },
    };
</script>
