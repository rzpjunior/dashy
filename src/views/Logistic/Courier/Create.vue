<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        :dense="true"
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Courier Name <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="phone_number"
                        v-model="form.phone_number"
                        required
                        outlined
                        dense
                        :error-messages="error.phone_number"
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        maxlength="15"
                        :rules="phoneRules"
                    >
                        <template v-slot:label>
                            Phone Number <span class="text-red">*</span>
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
                        :norequired="true"
                        :dense="true"
                        :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectVendor
                        name="vendor"
                        v-model="vendor_id"
                        @selected="vendorSelected"
                        :norequired="true"
                        :error="error.courier_vendor_id"
                        :dense="true"
                        :disabled="vendorDisabled"
                        :warehouse="warehouse_id"
                    ></SelectVendor>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectVehicle
                        name="vehicle"
                        @selected="vehicleProfilesSelected"
                        :error="error.vehicle_profile_id"
                        :dense="true"
                        :disabled="vehicleDisabled"
                        :vendor_id="vendor_id"
                    ></SelectVehicle>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="license_plate"
                        v-model="form.license_plate"
                        required
                        outlined
                        :dense="true"
                        :error-messages="error.license_plate"
                    >
                        <template v-slot:label>
                            License Plate <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <div class="fs16 bold">
                Credential
            </div>
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                name="email"
                                v-model="form.email"
                                required
                                outlined
                                :rules="emailRules"
                                :error-messages="error.email"
                                v-on="on"
                                dense
                            >
                                <template v-slot:label>
                                    Email<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                       <span>Email Company</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_password ? 'text' : 'password'"
                        @click:append="show_password = !show_password"
                        name="password"
                        v-model="form.password"
                        outlined
                        :error-messages="error.password"
                        :rules="passwordRules"
                        maxlength="32"
                        dense
                    >
                        <template v-slot:label>
                            Password<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        :append-icon="show_confirm ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_confirm ? 'text' : 'password'"
                        @click:append="show_confirm = !show_confirm"
                        name="confirm_password"
                        v-model="form.confirm_password"
                        outlined
                        :error-messages="error.confirm_password"
                        :rules="confirmPasswordRules"
                        maxlength="32"
                        dense
                    >
                        <template v-slot:label>
                            Confirm Password<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-privilege="'cou_rdl'"
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            v-privilege="'cou_crt'"
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
        name: 'CreateCourier',
        data() {
            return {
                ConfirmData: {},
                form: {
                    name: '',
                    phone_number: '',
                    license_plate: '',
                    vehicle_profile_id: '',
                    email: '',
                    password: '',
                    confirm_password: '',
                },
                show_password:false,
                show_confirm:false,
                warehouse: '',
                warehouse_id: '',
                vendor_id: '',
                vendorDisabled: true,
                vehicleDisabled: true,
                phoneRules: [
                    v => (v && v.length >= 8) || 'Phone number at least 8 digits',
                ],
                emailRules: [
                    v => !!v || 'Please Enter email',
                    v => /.+@.+/.test(v) || 'E-mail must be valid',
                ],
                phoneRules: [
                    v => (v && v.length >= 8) || 'Phone number at least 8 digits',
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => (v && v.length >= 8) || 'Password at least 8 characters'
                ],
                confirmPasswordRules: [
                    (value) => !!value || 'Confirm password is required',
                    (value) =>
                        value === this.form.password || 'The password confirmation does not match.',
                ],
                error: {},
            }
        },
        mounted() {
            let self = this;
            this.$root.$on("event_error", function(err) {
                self.error = err;
            });
        },
        methods: {
            warehouseSelected(d) { // select warehouse  
                this.warehouse = ""
                this.warehouse_id = ""
                this.vendor = ''
                this.form.vehicle_profile_id = ''
                this.vendorDisabled = true
                this.vehicleDisabled = true
                if (d) {
                    this.warehouse = d
                    this.warehouse_id = d.id
                    this.vendorDisabled = false
                }
            },
            vendorSelected(d) { // vendor selected
                this.vendor = ''
                this.vehicleDisabled = true
                if (d) {
                    this.vendor_id = d.id
                    this.vehicleDisabled = false
                }
            },
            vehicleProfilesSelected(d) { // vehicle profile selected
                this.form.vehicle_profile_id = '';
                if (d) {
                    this.form.vehicle_profile_id = d.id
                }
            },
            confirmButton() { // confirmation button
                this.ConfirmData = {
                    model: true,
                    title: "Create Courier",
                    text: "Are you sure want to create this Courier?",
                    urlApi: "/logistic/courier",
                    nextPage: "/logistic/courier",
                    post: true,
                    data: this.form,
                    label: 'URL_2'
                };
            },
        },
        watch: {
            'form.phone_number': {
                handler: function(val) {
                    let that = this
                    that.form.phone_number = val.replace(/^0+/, '')
                },
                deep: true
            },
        },
    }
</script>