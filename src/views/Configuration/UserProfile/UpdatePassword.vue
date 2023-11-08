<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="6">
                    <v-text-field
                        name="email"
                        v-model="form.email"
                        label="Email*"
                        outlined
                        disabled
                        dense
                        :error-messages="error.phone_number"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="-mb30">
                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="form.password"
                        name="password"
                        label="New Password"
                        outlined
                        dense
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                        :error-messages="error.password"
                        :rules="passwordRules"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="form.confirm_password"
                        name="password"
                        label="Confirm New Password"
                        outlined
                        dense
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show2 ? 'text' : 'password'"
                        @click:append="show2 = !show2"
                        :error-messages="error.password"
                        :rules="confirmPasswordRules"
                    ></v-text-field>
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
                            :disabled="disabledSubmit"
                            class="main-btn white--text"
                            @click="confirmButton()"
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
        name: "UserProfilePassword",
        data () {
            return {
                show: false,
                show2: false,
                disabledSubmit:true,
                form:{
                    id_user:'',
                    email: '',
                    password: '',
                    confirm_password: '',
                },
                error:{},
                ConfirmData:[],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => (v && v.length >= 8) || 'Password at least 8 characters',
                ],
                confirmPasswordRules: [
                    (value) => !!value || 'Confirm password is required',
                    (value) =>
                        value === this.form.password || 'The password confirmation does not match.',
                ],
            }
        },
        methods:{
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Password",
                    text : "Are you sure want to update this password?",
                    urlApi : "/config/user/profile/password",
                    nextPage : "/configuration/usr_profile",
                    data : this.form
                }
            },
            renderData(){
                this.$http.get("/config/user/profile/detail").then(response => {
                    this.form.id_user = response.data.data.user.id;
                    this.form.email = response.data.data.user.email
                });
            },
        },
        created(){
            this.renderData()
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
