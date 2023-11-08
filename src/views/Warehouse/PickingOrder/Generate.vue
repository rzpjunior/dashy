<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        disabled
                        name="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        ofselectedSOet-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="departure_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    @click:clear="delivery_date = '', getSummary()"
                                    :error-messages="error.delivery_date"
                                    v-model="delivery_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="delivery_date"
                            @input="delivery_date_model = false, getSummary()"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <MultiSelectWrt
                        v-model="wrts"
                        name="wrt"
                        :dense="true"
                        @selected="wrtSelected"
                        :area_id="area_id"
                        :error="error.wrt_id"
                        :norequired="true"
                    ></MultiSelectWrt>
                </v-col>
                <v-col cols="12" md="6" class="-mt36">
                    <v-switch
                        v-model="switchHub"
                        color="#50ABA3"
                        inset
                        label="Filter by HUB"
                        @click="hubSwitch(switchHub)"
                    ></v-switch>
                </v-col>
                <v-col cols="12" class="mb24 -mt24">
                    <v-card elevation="0" outlined>
                        <v-card-text class="mt24 -mb10">
                            <v-row v-if="switchHub == false">
                                <v-col cols="12" md="6" class="-mt24">
                                    <SelectCity
                                        name="city"
                                        @selected="citySelected"
                                        :area_id="area_id"
                                        :norequired="true"
                                        :error="error.city_id"
                                        :dense="true"
                                    ></SelectCity>
                                </v-col>
                                <v-col cols="12" md="6" class="-mt24">
                                    <MultiSelectDistrict
                                        name="district_id"
                                        :dense="true"
                                        @selected="districtSelected"
                                        :area_id="area_id"
                                        :city_id="city_id"
                                        :norequired="true"
                                        :disabled="districtDisabled"
                                    ></MultiSelectDistrict>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols="12" class="-mt24">
                                    <SelectWarehouse
                                        name="filter_hub"
                                        :norequired="true"
                                        :aux_data="2"
                                        @selected="selectHub"
                                        :area_id="area_id"
                                        :label="'HUB'"
                                        :error="error.warehouse_coverage"
                                        :dense="true"
                                        :warehouse_type="2"
                                        :parent_id="SelectWarehouse"
                                    ></SelectWarehouse>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <MultiSelectBusinessType
                        name="business_type"
                        :dense="true"
                        :business_type="business_type"
                        @selected="businessTypeSelected"
                        :checkbox="true"
                        :error="error.business_type_id"
                        :norequired="true"
                        :aux_data="2"
                    ></MultiSelectBusinessType>
                </v-col>
                <v-col cols="12" md="6" class="-mt25 mb10">
                    <MultiSelectOrderType
                        name="order_type"
                        :dense="true"
                        :order_type="order_type"
                        @selected="orderTypeSelected"
                        :checkbox="true"
                        :error="error.sales_order_type_id"
                        :norequired="true"
                    ></MultiSelectOrderType>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb30">
                    <div class="text-black60 fs14 -mt20">
                        Max Sales Order<span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="weight"
                        :class="!error.limit_sales_order ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="limit_sls_order"
                        dense
                    ></vue-numeric>
                    <div v-if="error.limit_sales_order" class="mt-1 ml-3 fs12 text-red">
                        {{error.limit_sales_order}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb30">
                    <div class="text-black60 fs14 -mt20">
                        Max Weight (KG)<span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="weight"
                        :class="!error.limit_weight ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="limit_weight"
                        dense
                    ></vue-numeric>
                    <div v-if="error.limit_weight" class="mt-1 ml-3 fs12 text-red">
                        {{error.limit_weight}}
                    </div>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="note"
                        :counter="350"
                        outlined
                        :error-messages="error.note"
                        required
                        dense
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="6" class="left fs16 bold mb10">
                    Selected Filter Summary
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col >
                            <div class="text-black60">Total SO :</div>
                        </v-col>
                        <v-col>
                            <v-progress-linear
                                v-if="loader"
                                indeterminate
                                class="mt10"
                            >
                            </v-progress-linear>
                            <div v-if="loader == false" class="d-flex justify-end">
                                {{items.total_sales_order}}
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col>
                            <div class="text-black60">Total Weight (KG) :</div>
                        </v-col>
                        <v-col>
                            <v-progress-linear
                                v-if="loader"
                                indeterminate
                                class="mt10"
                            >
                            </v-progress-linear>
                            <div v-if="loader == false" class="d-flex justify-end">
                                {{items.total_weight}}
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col >
                            <div class="text-black60">Maximum SO Weight :</div>
                        </v-col>
                        <v-col>
                            <v-progress-linear
                                v-if="loader"
                                indeterminate
                                class="mt10"
                            >
                            </v-progress-linear>
                            <div v-if="loader == false" class="d-flex justify-end">
                                {{items.highest_sales_order_weight}}
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col >
                            <div class="text-black60">Maximum SO Item Weight :</div>
                        </v-col>
                        <v-col>
                            <v-progress-linear
                                v-if="loader"
                                indeterminate
                                class="mt10"
                            >
                            </v-progress-linear>
                            <div v-if="loader == false" class="d-flex justify-end">
                                {{items.highest_sales_order_item_weight}}
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            v-privilege="'pco_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="generatePickingList()"
                            v-privilege="'pco_crt'"
                        >
                            Generate
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<style scoped>
    .multiple-select-box {
        border: 1px solid #9c9c9c;
        padding: 15px;
        width: 100%;
        overflow-x: auto;
        border-radius: 10px;
    }

    .multiple-select-box::-webkit-scrollbar-thumb {
        background-color: grey;
    }

    .multiple-select-box::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    #add {
        padding: 10px;
        border-radius: 80px;
    }

    #add:hover {
        background: rgb(206, 206, 206);
        padding: 10px;
    }

    #remove {
        padding: 10px;
        border-radius: 80px;
    }

    #remove:hover {
        background: rgb(206, 206, 206);
        padding: 10px;
    }
</style>
<script>
    import Vue from 'vue'

    export default {
        name: 'GeneratePickingList',
        data() {
            return {
                modalGenerate: false,
                delivery_date_model: '',
                delivery_date: new Date(Date.now() + (3600 * 1000 * 24)).toISOString().substr(0, 10),
                error: {},
                overlay: false,
                loader: true,
                warehouse: '',
                note: '',
                SelectWarehouse: '',
                limit_sls_order: '',
                limit_weight: '',
                districts: [],
                district_id: [],
                wrts: [],
                wrt_id: [],
                area_id: '',
                wr: '',
                items: {},
                city_id: '',
                districtDisabled: true,
                business_type: null,
                business_type_id: [],
                order_type: null,
                order_type_id: [],
                switchHub: false,
                hub_id: ''
            }
        },
        mounted() {
            let self = this
            self.getWarehouse()
            self.getSummary()
            self.$root.$on('event_error', function (err) {
                self.error = err
            });
        },
        computed: {
            //to get staff id
            staff() {
                return this.$store.getters.getStaff
            }
        },
        methods: {
            getWarehouse() { // get data warehouse from User ID
                this.loaded = false
                this.$http.get("/user/staff/" + this.staff.id)
                    .then(response => {
                        this.dataWr = response.data.data
                        this.warehouse = this.dataWr.warehouse
                        this.SelectWarehouse = this.dataWr.warehouse.id
                        this.area_id = this.dataWr.area.id
                        this.limit_sls_order = this.dataWr.warehouse.limit_sls_ord_pl
                        this.limit_weight = this.dataWr.warehouse.limit_weight_pl
                        this.getSummary()
                    });
            },
            getSummary() { // render filter summary
                this.loader = true
                this.$http.post('warehouse/picking_order/assign/summary', {
                    delivery_date: this.delivery_date,
                    warehouse_id: this.SelectWarehouse,
                    district_id: this.district_id,
                    wrt_id: this.wrt_id,
                    city_id: this.city_id,
                    business_type_id: this.business_type_id,
                    sales_order_type_id: this.order_type_id,
                    hub_picking_list: this.switchHub,
                    hub_id: this.hub_id
                })
                .then(response => {
                    this.items = response.data.data
                    this.loader = false
                })
                .catch(err => {
                    this.loader = false
                    this.error = err.errors
                })
            },
            generatePickingList() { // save generate picking list to database
                let self = this
                self.overlay = true
                self.$http.post("/warehouse/picking_order/assign/list-generate", {
                    delivery_date: self.delivery_date,
                    warehouse_id: self.SelectWarehouse,
                    limit_sales_order: self.limit_sls_order,
                    limit_weight: self.limit_weight,
                    district_id: self.district_id,
                    wrt_id: self.wrt_id,
                    city_id: self.city_id,
                    note: self.note,
                    business_type_id: self.business_type_id,
                    sales_order_type_id: self.order_type_id,
                    hub_picking_list: self.switchHub,
                    hub_id: self.hub_id
                }).then(res => {
                    let timer = setInterval(function () {
                        self.$http.get("/jobs/" + res.data.data.jobs_id).then(responses => {
                            if (responses.data.data.status === 4) {
                                clearTimeout(timer);
                                self.overlay = false
                                self.$router.push("/warehouse/picking-order/detail/" + res.data.data.id)
                            } else {
                                self.overlay = true
                            }
                        });
                    }, 2000);
                }).catch(err => {
                    self.error = err.errors
                    self.overlay = false
                })
            },
            citySelected (d) { // select filter city
                this.city_id = ''
                this.districtDisabled = true
                this.subdistrictDisabled = true
                if (d) {
                    this.city_id = d.city_id
                    this.districtDisabled = false
                }
                this.getSummary()
            },
            districtSelected(d) { // select District
                this.districts = null;
                this.district_id = [];
                let arr = []
                if (d !== '') {
                    this.districts = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                }
                this.district_id = arr
                this.getSummary()
            },
            //select wrt based on id
            wrtSelected(d) {
                this.wrts = null;
                let arr = []
                if (d !== '') {
                    this.wrts = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                }
                this.wrt_id = arr
                this.getSummary()
            },
            businessTypeSelected(d) { // select business type
                this.business_type = null;
                let arr = []
                if (d !== '') {
                    this.business_type = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                }
                this.business_type_id = arr
                this.getSummary()
            },
            orderTypeSelected(d) { // select order type
                this.order_type = null;
                let arr = []
                if (d !== '') {
                    this.order_type = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                }
                this.order_type_id = arr
                this.getSummary()
            },
            selectHub(d) { // hub selected
                this.hub_id = ''
                this.error.warehouse_coverage = ""
                if (d) {
                    this.hub_id = d.id
                }
                this.getSummary()
            },
            hubSwitch(d) { // switch hub or city filter
                if (d == true) {
                    this.city_id = ''
                    this.district_id = []
                } else {
                    this.hub_id = ''
                }
                this.getSummary()
            }
        },
    }
</script>
