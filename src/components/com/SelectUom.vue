<template>
    <v-autocomplete
        v-model="uoms"
        :items="items"
        :loading="isLoading"
        item-text="name"
        name="uom"
        :search-input.sync="search"
        :placeholder="placeholder"
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
           <span v-if="!norequired">
                UOM<span :class="disabled?'':'text-red'">*</span>
            </span>
           <span v-else>
                UOM
            </span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectUom',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                uoms:null,
                placeholder : '',
            };
        },
        props: ['uom','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/inventory/uom/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'UOM'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    // ini ke endpoint detail
                    this.$http.get("/inventory/uom/filter",{params:{
                            conditions:'id.e:'+val.id,
                        }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.uoms = response.data.data[0]
                    });
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
                    } else if(!this.uom){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.uoms = null
                    this.remoteSearch('','')
                },
                deep: true
            },
            uom: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }

                },
                deep: true
            }
        },
    };
</script>