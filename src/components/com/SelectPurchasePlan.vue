<template>
    <v-autocomplete
        v-model="purchase_plans"
        :items="items"
        :loading="isLoading"
        item-text="code"
        name="purchase_plan"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        dense
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }}
        </template>
        <template v-slot:label>
           <span v-if="!norequired">
                Purchase Plan<span :class="disabled?'':'text-red'">*</span>
            </span>
           <span v-else>
                Purchase Plan
            </span>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPurchasePlan',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                placeholder : '',
                purchase_plans:null,
            };
        },
        props: ['purchase_plan','disabled','clear','label','error', 'norequired', 'from', 'to'],
        methods: {
            // ini ke endpoint get all
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                let date = ""
                if (this.from && this.to) {
                    date = "|recognition_date.between:" + this.from + '.' + this.to
                }
                this.$http.get("/purchase/plan/filter",{params:{
                    perpage:20,
                    conditions:'code.icontains:'+search+ date,
                }}).then(response => {
                    if(response.data.data){
                        this.items = response.data.data
                    }else{
                        this.items = []
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Purchase Plan'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            // auto select (biasa untuk page update)
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/purchase/plan/filter",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        if(response.data.data) {
                            this.items.push(response.data.data[0])
                            this.purchase_plans = response.data.data[0]
                        }
                    });
                }
            },
            // event selected
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.purchase_plan){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.purchase_plans = null
                    this.remoteSearch('',true)
                },
                deep: true
            },
            purchase_plan: {
                handler: function (val) {
                    if(val){ // for auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            from: {
                handler: function () {
                    this.remoteSearch(this.search || '')
                },
                deep: true
            },
            to: {
                handler: function () {
                    this.remoteSearch(this.search || '')
                },
                deep: true
            }
        },
    };
</script>