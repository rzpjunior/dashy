<template>
     <v-container  fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                        maxlength="50"
                    >
                        <template v-slot:label>
                            Name<span style="color:red">*</span>
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
                        Phone Number<span style="color:red">*</span>
                    </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 -mb24">
                    <SelectRole
                        name="filter_role"
                        :norequired="false"
                        :label="'Role'"
                        :division_id="589824"
                        :ishelper="'1'"
                        @selected="roleSelected"
                        :error="error.role_id"
                        :dense="true"
                    ></SelectRole>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 -mb24">
                    <SelectWarehouse
                        name="filter_warehouse"
                        :norequired="false"
                        :aux_data="2"
                        @selected="warehouseSelected"
                        :label="'Warehouse'"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
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
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
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
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: 'HelperCreate',
        data () {
            return {
                show_password:false,
                show_confirm:false,
                form : {
                    name: '',
                    phone_number: '',
                    email : '',
                    password: '',
                    confirm_password : '',
                    role_id : '',
                    warehouse_id: ''
                },
                 emailRules: [
                    v => !!v || 'Please Enter email',
                    v => /.+@.+/.test(v) || 'E-mail must be valid',
                ],
                phoneRules: [
                    v => (v && v.length >= 8) || 'Phone number at least 8 digits',
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => (v && v.length >= 8) || 'Password at least 8 characters',
                    // v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
                    // v => /(?=.*\d)/.test(v) || 'Must have one number',
                    // v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
                ],
                confirmPasswordRules: [
                    (value) => !!value || 'Confirm password is required',
                    (value) =>
                        value === this.form.password || 'The password confirmation does not match.',
                ],
                warehouse : null,
                role: null,
                error : {},
                success : {},
                ConfirmData : {},
                refs : '',

            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        methods:{
            warehouseSelected(d) {
                this.warehouse = null
                this.form.warehouse_id = ""
                if (d) {
                    this.form.warehouse_id = d.id
                    this.warehouse = d
                }
            },
            roleSelected(d) {
                this.role = null
                this.form.role_id = ""
                if (d) {
                    this.form.role_id = d.id
                    this.role = d
                }
            },
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Create Helper",
                    text : "Are you sure want to create this Helper?",
                    urlApi : "/user/helper",
                    nextPage : "/user/helper",
                    data : this.form,
                    post :true
                }
            },
        },
        watch: {
            'form.phone_number': {
                handler: function (val) {
                    let that = this
                    that.form.phone_number = val.replace(/^0+/, '')
                },
                deep: true
            },
        },
    }
</script>
