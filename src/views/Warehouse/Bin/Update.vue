<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        v-model="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :label="'Warehouse'"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        :dense="true"
                        disabled
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 -mb1">
                    <SelectProduct
                        name="product"
                        :product="product"
                        label="Product"
                        @selected="productSelected"
                        :error="error.product"
                        :dense="true"
                        :warehouse="form.warehouse_id"
                        :disabled="productDisabled"
                    ></SelectProduct>
                    <div v-if="rack_name" class="-mt24 mb20 fs12 text-red">
                        {{'Product is inside in ' + rack_name}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt18 mb10">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                        disabled
                    >
                        <template v-slot:label>
                            Bin Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt20 mb24">
                    <v-row>
                        <v-col>
                            <div class="text-black60 fs14 -mt20">
                                Service Time (Minutes)
                            </div>
                            <vue-numeric
                                name="service_minutes"
                                :class="!error.service_time ? 'formNumericNew' : 'formNumericErrNew'"
                                placeholder="00"
                                v-model="service_minutes"
                                dense
                            ></vue-numeric>
                            <div v-if="error.service_time" class="-mb10 ">
                                {{error.service_time}}
                            </div>
                        </v-col>
                        <v-col>
                            <div class="text-black60 fs14 -mt20">
                                Service Time (Seconds)
                            </div>
                            <vue-numeric
                                name="service_seconds"
                                :class="!error.service_time ? 'formNumericNew' : 'formNumericErrNew'"
                                placeholder="00"
                                v-model="service_seconds"
                                dense
                                :min="0"
                                :max="59"
                            ></vue-numeric>
                            <div v-if="error.service_time" class="-mb10 fs12 text-red">
                                {{error.service_time}}
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="12" class="-mt20">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="100"
                        maxlength="100"
                        outlined
                        rows="3"
                    >
                        <template v-slot:label>Note</template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-start" v-show="warehouse != ''">
            <v-row>
                <v-col cols="12" md="6" class="left fs16 bold">
                    Maps
                </v-col>
            </v-row>
            <v-row>
                <v-col class="-mt10 mb10">
                    <v-alert
                        color="#2A89A7"
                        dark
                        outlined
                    >
                        <v-icon color="#2A89A7">mdi-alert-circle-outline</v-icon> 
                        Determine the pinpoints of the rack location
                    </v-alert>
                </v-col>
            </v-row>
            <Maps
                :warehouse="warehouse"
                :update="dataUpdate"
            >
            </Maps>
        </div>
        <div class="box">
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    depressed
                    outlined
                    color="#EBEBEB"
                    class="main-btn"
                    @click="$router.go(-1)"
                    v-privilege="'bin_rdl'"
                >
                    <span class="text-black80">Cancel</span>
                </v-btn>
                <v-btn
                    depressed
                    color="#50ABA3"
                    class="main-btn white--text"
                    @click="confirmButton()"
                    v-privilege="'bin_upd'"
                >
                    Update
                </v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
export default {
    name: "UpdateBin",
    data() {
        return {
            dataUpdate: '',
            warehouse: '',
            product: '',
            service_minutes: 0,
            service_seconds: 0,
            productDisabled: true,
            rack_name: '',
            error: {},
            form: {
                name: '',
                warehouse_id: '',
                product_id: '',
                latitude: 0,
                longitude: 0,
                service_time: '',
                note: ''
            },
            ConfirmData: {}
        }
    },
    mounted() {
        this.renderData()
        let self = this
        this.$root.$on('position', data => { // receive data from maps component
            self.form.latitude = data.lat;
            self.form.longitude = data.lng;
        })
        this.$root.$on("event_error", function (err) {
            self.error = err;
        });
    },
    methods: {
        renderData() { // get data from API
            this.$http.get('/warehouse/bin/' + this.$route.params.id , {
                params: {
                    embeds: 'warehouse.bininfo'
                }
            }).then(response => {
                this.dataUpdate = response.data.data
                this.warehouseSelected(response.data.data.warehouse)
                if (response.data.data.product.id != 0) { // handle for product if product id = 0 (Sentry Error)
                    this.productSelected(response.data.data.product)
                }
                this.form.name = response.data.data.name
                this.form.note = response.data.data.note
                if (this.dataUpdate.service_time) { // convert time seconds to minutes
                    let service_time = this.$moment.duration({"seconds": this.dataUpdate.service_time})
                    this.service_minutes = service_time.minutes()
                    this.service_seconds = service_time.seconds()
                }
            })
        },
        warehouseSelected(d) { // select warehouse
            this.warehouse = ""
            this.form.warehouse_id = ""
            this.productDisabled = true
            if (d) {
                this.warehouse = d
                this.form.warehouse_id = d.id
                this.productDisabled = false
            }
            
        },
        productSelected(d) { // select product
            this.product = ""
            this.form.product_id = ""
            this.rack_name = ""
            if (d) {
                this.product = d
                this.form.product_id = d.id
                if (d.id != 0) {
                    this.$http.get("/warehouse/bin", { // hit endpoint for checking been in another RACK
                        params: {
                            conditions: 'product.id.e:' + d.id + '|warehouse.id.e:' + this.form.warehouse_id,
                            perpage:10,
                            embeds: 'product_id',
                        }
                    }).then(res => {
                        if (res.data.data != null) {
                            this.rack_name = res.data.data[0].name
                        }
                    })
                }
            }
        },
        confirmButton() { // confirmation button to save
            this.ConfirmData = {
                model: true,
                title: "Update BIN",
                text: "Are you sure want to update this BIN?",
                urlApi: "/warehouse/bin/update/" + this.$route.params.id,
                nextPage: "/warehouse/bin",
                data: {
                    name: this.form.name,
                    warehouse_id: this.form.warehouse_id,
                    service_time: this.service_minutes + ':' + this.service_seconds,
                    product_id: this.form.product_id,
                    latitude: this.form.latitude,
                    longitude: this.form.longitude,
                    note: this.form.note
                }
            }
        },
    },
    watch: {
        'form': {
            handler: function(val) {
                this.$root.$emit('dataBIN', val)
            },
            deep: true
        },
    }
}
</script>