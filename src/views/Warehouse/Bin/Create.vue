<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        v-model="warehouse"
                        :aux_data="2"
                        :label="'Warehouse'"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 -mb1">
                    <SelectProduct
                        name="product"
                        v-model="form.product_id"
                        label="Product"
                        @selected="productSelected"
                        :error="error.product"
                        :dense="true"
                        :warehouse="form.warehouse_id"
                        :disabled="productDisabled"
                        :product="product"
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
                            <div v-if="error.service_time" class="-mb10 fs12 text-red">
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
                    Create
                </v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal"> Duplicate Product </span>
                </v-card-title>
                <v-card-text>
                    Are you sure want to create this existing product in other rack?
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="modelDialog = false, product = null, rack_name = null"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        @click="modelDialog = false"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    name: "CreateBin",
    data() {
        return {
            warehouse: '',
            product: '',
            modelDialog: false,
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
        let self = this
        this.$root.$on('position', data => { // mounted data dari komponen untuk disimpan pada form
            self.form.latitude = data.lat;
            self.form.longitude = data.lng;
        })
        this.$root.$on("event_error", function (err) { // mounted error
            self.error = err;
        });
    },
    methods: {
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
                this.$http.get("/warehouse/bin", { // hit endpoint for checking been in another RACK
                    params: {
                        conditions: 'product.id.e:' + d.id + '|warehouse.id.e:' + this.form.warehouse_id,
                        perpage:10,
                        embeds: 'product_id',
                    }
                }).then(res => {
                    if (res.data.data != null) {
                        this.rack_name = res.data.data[0].name
                        if (this.rack_name != "") {
                            this.modelDialog = true
                        }
                    }
                })
            }
        },
        confirmButton() { // konfirmasi button save untuk menyimpan pada DB
            this.ConfirmData = {
                model: true,
                title: "Create BIN",
                text: "Are you sure want to create this BIN?",
                urlApi: "/warehouse/bin",
                nextPage: "/warehouse/bin",
                withJobs: false,
                post: true,
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