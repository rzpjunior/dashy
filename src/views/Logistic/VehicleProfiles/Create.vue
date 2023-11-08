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
                        :error="error.warehouse_id"
                        :dense="true"
                        :norequired="true"
                        :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectVendor
                        name="vendor"
                        v-model="vendor"
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
                        v-model="routing_profile"
                        outlined
                        :dense="true"
                        :norequired="false"
                        :error="error.routing_profile"
                        label="Routing Profile"
                        @selected="profileSelected"
                        table="vehicle_profiles"
                        attribute="routing_profile"
                    >
                    </SelectGlossary>
                </v-col>
                <v-col cols="12" md="6" class="-mt10 mb24">
                    <div class="text-black60 fs14 -mt24">
                        Max Koli <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="weight"
                        :class="!error.max_koli ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="form.max_koli"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        dense
                    ></vue-numeric>
                    <div v-if="error.max_koli" class="mt-1 ml-3 fs12 text-red">
                        {{error.max_koli}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Max Weight (KG) <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="weight"
                        :class="!error.max_weight ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="form.max_weight"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        dense
                    ></vue-numeric>
                    <div v-if="error.max_weight" class="mt-1 ml-3 fs12 text-red">
                        {{error.max_weight}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Max Fragile Goods (KG) <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="fragile"
                        :class="!error.max_fragile ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0"
                        v-model="form.max_fragile"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        dense
                    ></vue-numeric>
                    <div v-if="error.max_fragile" class="mt-1 ml-3 fs12 text-red">
                        {{error.max_fragile}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Max Available Vehicles <span class="text-red">*</span>
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
                        Speed Factor <span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="speed_factor"
                        :class="!error.speed_factor ? 'formNumericNew' : 'formNumericErrNew'"
                        :precision="2"
                        separator="."
                        placeholder="0"
                        v-model="form.speed_factor"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        dense
                        :max="5"
                        :min="0.1"
                    ></vue-numeric>
                    <div v-if="error.speed_factor" class="mt-1 ml-3 fs12 text-red">
                        {{error.speed_factor}}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Initial Location Cost (Rp) <span class="text-red">*</span>
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
                        Subsequent Location Cost (Rp) <span class="text-red">*</span>
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
                <v-col cols="12" md="6" class="-mt20">
                    <MultiSelectGlossary
                        :dense="true"
                        v-model="skills"
                        :norequired="true"
                        @selected="skillsSelected"
                        :error-messages="error.skills"
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
                            v-privilege="'vhp_crt'"
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                        >
                            Create
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
                ConfirmData: {},
                vendor: null,
                vendorDisabled: true,
                form: {
                    name: '',
                    courier_vendor_id: '',
                    routing_profile: '',
                    max_koli: 0,
                    max_weight: 0,
                    max_fragile: 0,
                    max_available_vehicle: 0,
                    initial_cost: 0,
                    subsequent_cost: 0,
                    speed_factor: 1,
                    skills: []
                },
                warehouse: '',
                warehouse_id: '',
                routing_profile: [],
                skills: [],
                error: {}
            }
        },
        mounted() {
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
            vendorSelected(d) { // vendor selected
                this.vendor = null;
                this.form.courier_vendor_id = "";
                if (d !== '' && d !== undefined) {
                    this.vendor = d;
                    this.form.courier_vendor_id = d.id
                }
            },
            skillsSelected(d) { // vendor selected
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
                this.routing_profile = null;
                if (d) {
                    this.form.routing_profile = d.id
                }
            },
            confirmButton() { // confirm button send to API
                this.ConfirmData = {
                    model: true,
                    title: "Create Vehicle Profile",
                    text: "Are you sure want to create this Vehicle Profile?",
                    urlApi: "/logistic/vehicle_profiles",
                    nextPage: "/logistic/vehicle-profiles",
                    post: true,
                    data: this.form,
                    label: 'URL_2'
                }
            }
        },
    }
</script>