<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :label="'Warehouse'"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        :dense="true"
                        :warehouse_type="'9'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectBranch
                        name="outlet"
                        :dense="true"
                        @selected="branchSelected"
                        :error="error.branch_id"
                        :label="'Outlet'"
                    ></SelectBranch>
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
                                name="username"
                                v-model="form.username"
                                maxlength="50"
                                required
                                outlined
                                v-on="on"
                                dense
                                :rules="usernameRules"
                                :error-messages="error.username"
                            >
                                <template v-slot:label>
                                    Username<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                       <span>Username Fridge</span>
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
                            v-privilege="'usf_rdl'"
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            v-privilege="'usf_crt'"
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
        name: 'UserFridgeCreate',
        data() {
            return {
                ConfirmData: {},
                form: {
                    warehouse_id: '',
                    branch_id: '',
                    username: '',
                    password: '',
                    confirm_password: '',
                },
                show_password:false,
                show_confirm:false,
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
            // Select warehouse  
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                if (d) {
                    this.form.warehouse_id = d.id
                }
            },
            // Select Outlet/Branch  
            branchSelected(d) {
                this.form.branch_id = ""
                if (d) {
                    this.form.branch_id = d.id
                }
            },
            // Confirmation button to create new user
            confirmButton() {
                this.ConfirmData = {
                    model: true,
                    title: "Create User Fridge",
                    text: "Are you sure want to create this User Fridge?",
                    urlApi: "/fridge/user_fridge",
                    nextPage: "/smart-fridge/user-fridge",
                    post: true,
                    data: this.form,
                };
            },
        },
    }
</script>