<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-autocomplete
                    v-model="dns"
                    :items="items"
                    :loading="isLoading"
                    :placeholder="placeholder"
                    item-value="code"
                    item-text="code"
                    :search-input.sync="search"
                    @change="selected"
                    return-object
                    clearable
                    outlined
                    persistent-hint
                    :dense="dense"
                    :error-messages="error"
                >
                    <template slot="item" slot-scope="data">
                        {{data.item.code}} - {{ formatPrice(data.item.total_price) }}
                    </template>
                    <template v-slot:label>
                        <div v-if="label">
                            <span v-if="!norequired">{{ label }}</span>
                            <span v-else>{{ label }}</span>
                        </div>
                        <div v-else>
                            <span v-if="!norequired">Debit Note</span>
                            <span v-else>Debit Note</span>
                        </div>
                    </template>
                </v-autocomplete>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'MultiSelectDN',
        data() {
            return {
                all_Dn: false,
                items: [],
                placeholder: '',
                isLoading: false,
                dns: [],
                temp: [],
                search: '',
            };
        },
        props: ['dn', 'disabled', 'clear', 'label', 'checkbox', 'error', 'aux_data', 'norequired', 'area_id', 'dense', 'total_price', 'sr_id'],
        methods: {
            remoteSearch(search) {
                let sr_id = ''
                if (this.sr_id) {
                    sr_id = '|supplierreturn.supplier.id.e:' + this.sr_id
                }
                let total_price = ''
                if (this.total_price) {
                    total_price = '|totalprice.lte:' + this.total_price
                }
                this.placeholder = "Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/finance/debit_note", {
                    params: {
                        conditions: 'status:1|code.icontains:' + search + sr_id + total_price,
                        orderby: '-id'
                    }
                }).then(response => {
                    if (response.data.data) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Debit Note'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                });
            },
            autoSelectByID(val) { // auto select by ID 
                if (val) {
                    this.dns = []
                    for (let i = 0; i < val.length; i++) {
                        this.dns.push(val[i])
                    }
                }
            },
            selected(e) { // select komponen
                this.$emit('selected', e);
            },
        },
        watch: {
            search: { // untuk search
                handler: function(val) {
                    if (val) {
                        if (this.computedCounterValue < this.maxSelected) {
                            this.remoteSearch(val)
                        }
                    } else if (!this.dn) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: { // untuk clear
                handler: function(val) { // untuk clear
                    this.dns = null;
                    this.remoteSearch('', this.area_id)
                },
                deep: true
            },
            dn: { // perubahan untuk auto select 
                handler: function(val) {
                    if (val !== null) { // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            dns: { // untuk search
                handler: function(val) {
                    this.search = ''
                },
                deep: true
            },
            area_id: { // ini untuk props area
                handler: function(val) {
                    this.dns = null
                    this.all_Dn = false                    
                    if (val) {
                        this.remoteSearch('', val)
                    } 
                },
                deep: true
            },
            total_price:{
                handler: function (val) { 
                    this.remoteSearch('')
                },
                deep: true
            },
            sr_id:{
                handler: function (val) { 
                    this.remoteSearch('')
                },
                deep: true
            }
        },
    };
</script>