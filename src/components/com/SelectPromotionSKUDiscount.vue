<template>
    <v-autocomplete
        v-model="promotion_name"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        item-value='name'
        :no-filter="true"
        :search-input.sync="search"
        @change="selected"
        dense
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
        @click:clear="remoteSearch('')"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Promotion Name<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Promotion Name</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPromotionSKUDiscount',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                placeholder : '',
                promotion_name:null,
            };
        },
        props: ['promotionName','disabled','clear','error', 'label', "norequired", "customerGroup"],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                let business_type = ''
                this.$http.get("/promotion/sku_discount",{params:{
                    "business_type.e": business_type,
                    perpage:10,
                    conditions:'name.icontains:'+search,
                    orderby:'-id',
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Promotion Name'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } 
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.promotion_name = null
                },
                deep: true
            },
        },
    };
</script>