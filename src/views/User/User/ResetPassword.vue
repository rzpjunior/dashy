<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb28">
                <v-col cols="12" md="6">
                    <v-text-field
                        :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_password ? 'text' : 'password'"
                        @click:append="show_password = !show_password"
                        name="password"
                        label="Password"
                        v-model="form.password"
                        outlined
                        dense
                        :error-messages="error.password"
                        :rules="passwordRules"
                        maxlength="32"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                        :append-icon="show_confirm ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_confirm ? 'text' : 'password'"
                        @click:append="show_confirm = !show_confirm"
                        name="confirm_password"
                        label="Confirm Password"
                        v-model="form.confirm_password"
                        outlined
                        dense
                        :error-messages="error.confirm_password"
                        :rules="confirmPasswordRules"
                        maxlength="32"
                    >
                    </v-text-field>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row class="-ma16">
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
                            :disabled="disabledSubmit"
                            v-privilege="'usr_rst_pass'"
                        >
                            Save
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
        name: "ResetPassword",
        data () {
            return {
                show_password:false,
                show_confirm:false,
                disabledSubmit:true,
                form:{
                    password:'',
                    confirm_password:''
                },
                error:{},
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
                ConfirmData:[],
            }
        },
        methods: {
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Reset Password",
                    text : "Are you sure want to reset this password?",
                    urlApi : "/user/reset/" + this.$route.params.id_user,
                    nextPage : "/user/user/detail/" + this.$route.params.id,
                    data : this.form
                }
            },
        },
        watch: {
            'form.confirm_password': {
                handler: function (val) {
                    if(val === this.form.password){
                        this.disabledSubmit = false
                    }else{
                        this.disabledSubmit = true
                    }
                },
                deep: true
            },
        },
    }
</script>
