<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="vehicleName"
                        v-model="form.name"
                        required
                        outlined
                        :dense="true"
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Vehicle Name <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :label="'Warehouse'"
                        @selected="warehouseSelected"
                        :dense="true"
                        :norequired="true"
                        :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectVendor
                        name="vendor"
                        :vendor="vendor"
                        @selected="vendorSelected"
                        required
                        :error="error.courier_vendor_id"
                        :dense="true"
                        :warehouse="warehouse_id"
                        :disabled="vendorDisabled"
                    ></SelectVendor>
                </v-col>
                <v-col cols="12" md="6" class="-mt20">
                    <SelectGlossary
                        :glossary="glossary"
                        :dense="true"
                        :norequired="false"
                        :error="error.routing_profile"
                        label="Routing Profile"
                        @selected="profileSelected"
                        table="vehicle_profiles"
                        attribute="routing_profile"
                    ></SelectGlossary>
                </v-col>
                <v-col cols="12" md="6" class="-mt15 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Max Koli <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="weight"
                        :class="!error.max_koli ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="form.max_koli"
                        dense
                        required
                    ></vue-numeric>
                    <div v-if="error.max_koli" class="mt-1 ml-3 fs12 text-red">
                        {{error.max_koli}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt15 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Max Weight (KG) <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="weight"
                        :class="!error.max_weight ? 'formNumericNew' : 'formNumericErrNew'"
                        :precision="2"
                        separator="."
                        placeholder="0"
                        v-model="form.max_weight"
                        dense
                        required
                    ></vue-numeric>
                    <div v-if="error.max_weight" class="mt-1 ml-3 fs12 text-red">
                        {{error.max_weight}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt15 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Max Fragile Goods (KG) <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="fragile"
                        :class="!error.max_fragile ? 'formNumericNew' : 'formNumericErrNew'"
                        :precision="2"
                        separator="."
                        placeholder="0"
                        v-model="form.max_fragile"
                        dense
                    ></vue-numeric>
                    <div v-if="error.max_fragile" class="mt-1 ml-3 fs12 text-red">
                        {{error.max_fragile}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Available Vehicles <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="max_available_vehicle"
                        :class="!error.max_available_vehicle ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="form.max_available_vehicle"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        dense
                    ></vue-numeric>
                    <div v-if="error.max_available_vehicle" class="mt-1 ml-3 fs12 text-red">
                        {{error.max_available_vehicle}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Initial Cost <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="initial_cost"
                        :class="!error.initial_cost ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="form.initial_cost"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        dense
                    ></vue-numeric>
                    <div v-if="error.initial_cost" class="mt-1 ml-3 fs12 text-red">
                        {{error.initial_cost}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Subsequent Cost <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="subsequent_cost"
                        :class="!error.subsequent_cost ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="form.subsequent_cost"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        dense
                    ></vue-numeric>
                    <div v-if="error.subsequent_cost" class="mt-1 ml-3 fs12 text-red">
                        {{error.subsequent_cost}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Speed Factor <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="speed_factor"
                        :class="!error.speed_factor ? 'formNumericNew' : 'formNumericErrNew'"
                        :precision="2"
                        separator="."
                        placeholder="0"
                        v-model="form.speed_factor"
                        dense
                        :max="5"
                        :min="0.1"
                    ></vue-numeric>
                    <div v-if="error.speed_factor" class="mt-1 ml-3 fs12 text-red">
                        {{error.speed_factor}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt20">
                    <MultiSelectGlossary
                        :dense="true"
                        v-model="skills"
                        @selected="skillsSelected"
                        :norequired="true"
                        :error-messages="error.skills"
                        :skill="skillsUpdate"
                    ></MultiSelectGlossary>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-privilege="'vhp_rdl'"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            @click="$router.go(-1)"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            v-privilege="'vhp_upd'"
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                        >
                            Update
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>

<script>
    export default {
        name: "VehicleProfilesCreate",
        data() {
            return {
                ConfirmData: [],
                warehouse: null,
                warehouse_id: '',
                glossary: null,
                skills: [],
                skillsUpdate: null,
                vendor: null,
                vendorDisabled: true,
                form: {
                    id: '',
                    name: '',
                    courier_vendor_id: '',
                    routing_profile: '',
                    max_koli: 0,
                    max_weight: 0,
                    max_fragile: 0,
                    max_available_vehicle: 0,
                    initial_cost: 0,
                    subsequent_cost: 0,
                    speed_factor: 0,
                    skills: []
                },
                error: {}
            }
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('event_error', function(err) {
                self.error = err
            });
        },
        methods: {
            warehouseSelected(d) { // select warehouse
                this.warehouse = ""
                this.warehouse_id = ""
                this.vendorDisabled = true
                if (d) {
                    this.warehouse = d
                    this.warehouse_id = d.id
                    this.vendorDisabled = false
                }
            },
            vendorSelected(d) { // select warehouse  
                this.vendor = null
                this.form.courier_vendor_id = ""
                if (d) {
                    this.vendor = d
                    this.form.courier_vendor_id = d.id
                }
            },
            skillsSelected(d) { // skills selected
                this.skills = null;
                let arr = []
                if (d !== '') {
                    this.skills = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                }
                this.form.skills = arr
            },
            profileSelected(d) { // profile selected
                this.glossary = null;
                this.form.routing_profile = '';
                if (d) {
                    this.glossary = d;
                    this.form.routing_profile = d.id
                }
            },
            renderData() { // renderdata
                let arr = []
                let skillsValue = []
                let skills_id = []
                this.$http2.get("/logistic/vehicle_profiles/" + this.$route.params.id).then(response => {
                    this.items = response.data.data;
                    this.form = {
                        id: this.items.id,
                        name: this.items.name,
                        max_koli: this.items.max_koli,
                        max_weight: this.items.max_weight,
                        max_fragile: this.items.max_fragile,
                        max_available_vehicle: this.items.max_available_vehicle,
                        initial_cost: this.items.initial_cost,
                        subsequent_cost: this.items.subsequent_cost,
                        speed_factor: this.items.speed_factor
                    };
                    if (this.items.courier_vendor) {
                        this.warehouseSelected(this.items.courier_vendor.warehouse)
                        this.vendorSelected(this.items.courier_vendor)
                    }
                    this.profileSelected(this.items.routing_profile)
                    if (this.items.skills) {
                        if (this.items.skills.includes(",")) {
                            arr = this.items.skills.split(",")
                        } else {
                            arr.push(this.items.skills)
                        }
                        this.form.skills = arr
                        for (let i = 0; i < arr.length; i++) {
                            this.$http.get("/logistic/glossary?conditions=value_name:" + arr[i]).then(res => {
                                skillsValue.push(res.data.data[0])
                                skills_id.push(res.data.data[0].id)
                            })
                        }
                    }
                    this.skillsUpdate = skillsValue
                    this.form.skills = skills_id
                });
            },
            confirmButton() {
                this.ConfirmData = { // confirm button
                    model: true,
                    title: "Update Vehicle Profile",
                    text: "Are you sure want to update this Vehicle Profile?",
                    urlApi: "/logistic/vehicle_profiles/" + this.form.id,
                    nextPage: "/logistic/vehicle-profiles",
                    data: this.form,
                    label: 'URL_2'
                }
            }
        }
    }
</script>