<template>
    <v-container fill-height class="main-container">
        <div class="box pb-0">
            <v-row>
                <v-col>
                    <v-text-field
                        name="phone_number"
                        v-model="form.phone_number"
                        maxlength="15"
                        dense
                        required
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        outlined
                        :error-messages="error.phone_number"
                    >
                        <template v-slot:label>
                            Phone Number<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col>
                </v-col>
            </v-row>
        </div>
        <div class="box">
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
                >Save</v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: 'UpdatePhoneNumber',
        data () {
            return {
                form : {
                    phone_number : ""
                },
                salesperson : null,
                error : {},
                ConfirmData : {}
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        methods:{
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Phone Number",
                    text : "Are you sure want to Update phone number?",
                    urlApi : "/customer/agent/phonenumber/"+this.$route.params.id,
                    nextPage : "/customer/agent/detail/"+this.$route.params.id,
                    data : this.form
                }
            },
            renderData(){
                this.$http.get("/customer/agent/"+this.$route.params.id).then(response => {
                    this.form.phone_number = response.data.data[0].merchant.phone_number
                });
            },
        },
        created(){
            this.renderData()
        },
    }
</script>
