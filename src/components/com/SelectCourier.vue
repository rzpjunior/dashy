<template>
    <v-autocomplete
        v-model="couriers"
        :items="items"
        :loading="isLoading"
        item-text='name'
        item-value="id"
        :class="dense?'':'rounded-form'"
        :dense="dense"
        :placeholder="placeholder"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
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
               <span v-if="!norequired">{{ label }}<span style="color:red">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Courier<span style="color:red">*</span></span>
               <span v-else>Courier</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectCourier',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                couriers:null
            };
        },
        props: ['courier','disabled','clear','error','label', "norequired", "vendor_id", "dense"],
        methods: {
            remoteSearch() {
                let vendorId = ''
                if (this.vendor_id) {
                    vendorId = 'vehicleprofiles.couriervendor.id.e:' +this.vendor_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http2.get("/logistic/courier",{params:{
                    embeds:'vehicleprofiles.couriervendor',
                    conditions: vendorId,
                    orderby:'-id',
                }}).then(response => {
                    this.items = []
                    let arr = response.data.data
                    if (arr) {
                        for (let i = 0; i < arr.length; i++) {
                            this.items.push({
                                id: arr[i].id,
                                code: arr[i].code,
                                name: arr[i].name,
                                vehicle_profiles: arr[i].vehicle_profiles
                            })
                        }
                    }
                    if (this.items === null) {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Courier'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if (val.id) {
                    this.$http2.get("/logistic/courier", {
                        params: {
                            conditions: 'id.e:' + val.id,
                        }
                    }).then(response => {
                        this.items.push(response.data.data[0])
                        this.couriers = response.data.data[0]
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
                    } else if(!this.courier){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    if (val == true) {
                        this.couriers = null
                    }
                },
                deep: true
            },
            courier:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            vendor_id: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.remoteSearch('')
                    } else {
                        this.couriers = null
                    }
                },
                deep: true
            },
        },
    };
</script>