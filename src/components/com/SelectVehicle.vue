<template>
    <v-autocomplete
        v-model="vehicles"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-value="id"
        item-text="name"
        :dense="dense"
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
                <span v-if="!norequired">
                    {{ label }} <span :class="disabled ? '' : 'text-red'">*</span>
                </span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">
                    Vehicle Profile <span :class="disabled ? '' : 'text-red'">*</span>
                </span>
                <span v-else>Vehicle Profile</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectVehicle',
        data() {
            return {
                items: [{
                    warehouse: {
                        name: ""
                    }
                }],
                isLoading: false,
                placeholder: '',
                search: '',
                vehicles: null
            };
        },
        props: ['vehicle', 'disabled', 'clear', 'error', 'label', "norequired", "dense", "warehouse_id", "vendor_id"],
        methods: {
            remoteSearch(search) { // get data from API
                this.placeholder = "Loading items..."
                this.isLoading = true
                let warehouse = ''
                if (this.warehouse_id) {
                    warehouse = '|couriervendor.warehouse.id.e:' + this.warehouse_id
                }
                let vendor = ''
                if (this.vendor_id) {
                    vendor = '|couriervendor.id.e:' + this.vendor_id
                }
                this.$http2.get("/logistic/vehicle_profiles", {
                    params: {
                        perpage: 10,
                        conditions: 'status:1|name.icontains:' + search + warehouse + vendor,
                        orderby: '-id',
                    }
                }).then(response => {
                    this.items = []
                    let arr = response.data.data
                    if (arr) {
                        for (let i = 0; i < arr.length; i++) {
                            this.items.push({
                                id: arr[i].id,
                                code: arr[i].code,
                                name: arr[i].name
                            })
                        }
                    }
                    if (this.items === null) {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Vehicle'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                });
            },
            autoSelectByID(val) { // autoselectbyID
                if (val.id) {
                    this.$http2.get("/logistic/vehicle_profiles", {
                        params: {
                            conditions: 'id.e:' + val.id,
                        }
                    }).then(response => {
                        this.items.push(response.data.data[0])
                        this.vehicles = response.data.data[0]
                    });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: { // watch perubahan search
                handler: function(val) {
                    if (val) {
                        this.remoteSearch(val)
                    } else {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function(val) { // ini untuk clear data
                    if (val == true) {
                        this.vehicles = null
                    }
                },
                deep: true
            },
            warehouse_id: { // watch for warehouse_id
                handler: function(val) {
                    if (val) {
                        this.remoteSearch('')
                    } else {
                        this.vehicles = null
                    }
                },
                deep: true
            },
            vendor_id: { // watch for vendor_id
                handler: function(val) {
                    if (val) {
                        this.remoteSearch('')
                    } else {
                        this.vehicles = null
                    }
                },
                deep: true
            },
            vehicle: { // watch for vehicle
                handler: function(val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if (val) {
                        this.autoSelectByID(val)
                    } else {
                        this.vehicles = null
                    }
                },
                deep: true
            },
        },
    };
</script>