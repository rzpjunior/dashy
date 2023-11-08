<template>
    <v-autocomplete
        v-model="priceSet"
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
            <div class="select-item">
                <div v-if="label">
                    <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>{{ label }}</span>
                </div>
                <div v-else>
                    <span v-if="!norequired">Price Set<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>Price Set</span>
                </div>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'MultiSelectPriceSet',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                menuProps: {
                    disabled: false
                },
                priceSet: [],
            };
        },
        props: ['disabled','clear','label','error','norequired','dense'],
        methods: {
            async remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/price/set/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    if(response.data.data){
                        response.data.data.forEach((value, index) =>{
                            this.items.push(response.data.data[index])
                        });
                    }
                    this.isLoading = false
                    let label = 'Price Set'
                    if (this.label) 
                        label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.priceSet= []
                    for (let i = 0; i < val.length; i++) {
                        this.priceSet.push(val[i])
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            adjustOptions() {
                if (this.computedCounterValue) {
                    this.menuProps.disabled = true
                } else {
                    this.menuProps.disabled = false
                }
            },
        },
        mounted() {
            this.remoteSearch('');
        },
        watch: {
            search: { 
                handler: function (val) { // search multi select
                    if(val){
                        this.remoteSearch(val)
                    } else {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            priceSet: {
                handler: function (val) {  // watch perubahan untuk auto select
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>
