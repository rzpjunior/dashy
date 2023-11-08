<template>
    <v-autocomplete
        :loading="isLoading"
        v-model="customerTags"
        :items="items"
        :placeholder="placeholder"
        item-text="name"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :dense="dense"
        :class="dense?'multi':'rounded-form multi'"
        :error-messages="error"
    >
        <template v-slot:label>
            <div class="select-item">
                <div v-if="label">
                    <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>{{ label }}</span>
                </div>
                <div v-else>
                    <span v-if="!norequired">Customer Tag<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>Customer Tag</span>
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
        name: 'SelectCustomerTagFilter',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                customerTags: [],
                menuProps: {
                    disabled: false
                },
                search: '',
            };
        },
        props: ['watchCustomerTag', 'disabled', 'clear', 'label', 'error', 'norequired', "dense"],
        methods: {
            //For Render Data
            async remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/customer/tag/filter", {
                    params: {
                        perpage: 20,
                        conditions: 'status:1|name.icontains:' + search,
                    }
                }).then(response => {
                    if (response.data.data) {
                        response.data.data.forEach((value, index) => {
                            this.items.push(response.data.data[index])
                        });
                    }
                    if (this.items === null) {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Customer Tag'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            //Autofill when Update
            autoSelectByID(val) {
                if (val) {
                    this.customerTags = []
                    for (let i = 0; i < val.length; i++) {
                        this.customerTags.push(val[i])
                    }
                }

            },
            //For emit selected item
            selected(event) {
                this.$emit('selected', event);
            },
        },
        mounted() {
            this.remoteSearch('');
            if (this.watchCustomerTag) {
                this.autoSelectByID(this.watchCustomerTag)
            }
        },
        watch: {
            //For Search
            search: {
                handler: function (val) {
                    if (val) {
                        this.remoteSearch(val)
                    }
                },
                deep: true
            },
            //Remove all selected
            clear: {
                handler: function (val) {
                    this.customerTags = [];
                    this.remoteSearch('')
                },
                deep: true
            },
            //For auto select
            watchCustomerTag: {
                handler: function (val) {
                    if (val) {
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            // To search and auto select all
            customerTags: {
                handler: function (val) {
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>