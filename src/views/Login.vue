<template>
    <div>
        <v-app class="login-page">
            <v-main>
                <v-row>
                    <v-col>
                        <v-flex pb-3 class="text-xs-center pb-4" style="margin-top: 114px">
                    <div class="text-center pb-4">
                        <img :src="logo_url"/>
                    </div>
                </v-flex>
                <div style="height:8px"/>
                <v-card class="mx-auto rounded-xl OpenSans" max-width="300">
                    <v-container>
                        <div class="d-flex justify-center pt12">
                            <span class="fs14 bold">Welcome Back</span>
                        </div>
                        <div class="d-flex justify-center px12 pt24">
                            <v-text-field
                                dense
                                outlined
                                prepend-inner-icon="person_outline"
                                label="Username"
                                name="email"
                                type="text"
                                v-model="form.email"
                                :error-messages="error.password"
                            ></v-text-field>
                        </div>
                        <div class="d-flex justify-center px12 -mt10">
                            <v-text-field
                                outlined
                                dense
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show ? 'text' : 'password'"
                                @click:append="show = !show"
                                label="Password"
                                name="password"
                                prepend-inner-icon="mdi-lock-outline"
                                @keyup.enter="onSubmit"
                                :error-messages="error.email"
                                v-model="form.password"
                            ></v-text-field>
                        </div>
                        <div class="d-flex justify-center px12">
                            <v-btn
                                name="loggin-btn"
                                block
                                class="only-btn white--text"
                                depressed
                                color="red"
                                :disabled="validation"
                                @click="onSubmit"
                            ><span>Sign In</span></v-btn
                            >
                        </div>
                        <div class="d-flex justify-center px12 mt16 mb4">
                            <a @click="modalForgetPw = true" style="color:#858585" href="#">Forget Password?</a>
                        </div>
                    </v-container>
                </v-card>
                    </v-col>
                    <v-col>
                        <img src="../../public/img/testgambar.png"/>
                    </v-col>
                </v-row>
               
            </v-main>
        </v-app>
        <LoadingBar :value="overlay"/>
    </div>
</template>
<style scoped>
    .login-page {
        background-image: url("/img/bg_login.png");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        position: relative;
        margin-top : -25px
    }
</style>

<script>
    import axios from 'axios'
    import AuthService from "../services/AuthService.js";

    export default {
        name: "Login",
        data() {
            return {
                modalForgetPw: false,
                form: {
                    email: "",
                    password: "",
                    firebase_token_dashboard : ""
                },
                error: {},
                show: false,
                loading: false,
                overlay: false,
                logo_url: "",
                data: []
            };
        },
        mounted() {
            axios.get('https://queserasera.my.id/motio-interview-3426635/json/2.json').then((response) => {
                console.log(response)
            })
        },
        computed: {
            validation() {
                if (this.form.email.length > 0 && this.form.password.length > 0) {
                    return false
                } else {
                    return true
                }
            }
        },
        created() {
            localStorage.setItem('navbar', '')
            let env = process.env.VUE_APP_LOGO_ENV
            if (env == 'dev') {
                this.logo_url = "/img/telkomlogo.png"
            } else if (env == 'staging') {
                this.logo_url = "/img/telkomlogo.png"
            } else {
                this.logo_url = "/img/telkomlogo.png"
            }
        },
        methods: {
            async onSubmit() {
                this.overlay = true
                localStorage.setItem("priv", "");
                // let token = localStorage.getItem('token_firebase')
                // if (token) {
                //     this.form.firebase_token_dashboard = token
                // }
                try {
                    const response = await AuthService.login(this.form);
                    console.log(response)
                
                } catch (error) {
                    this.overlay = false
                    this.error = error.errors ? error.errors : {email: ''};
                }
            },
        },
    };
</script>
