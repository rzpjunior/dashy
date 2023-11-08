<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-col  cols="12" md="5" class="-mb24">
                <v-text-field
                    name="phone_number"
                    v-model="form.phone_number"
                    required
                    outlined
                    dense
                    :error-messages="error.phone_number"
                    onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                    maxlength="15"
                >
                    <template v-slot:label>Phone Number<span class="text-red">*</span></template>
                </v-text-field>
            </v-col>
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
                >Create</v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        data () {
            return {
                ConfirmData:[],
                form:{
                    phone_number:''
                },
                error:{},
            }
        },
        methods:{
            confirmButton() {
                let data = {
                    phone_number : this.form.phone_number
                }
                this.ConfirmData = {
                    model : true,
                    title : "Update Phone Number",
                    text : "Are you sure want to update phone number?",
                    urlApi : "/customer/merchant/phone_number/" + this.$route.params.id,
                    nextPage : "/customer/merchant/detail/" + this.$route.params.id,
                    data : data
                }
            },
            renderData(){
                this.$http.get("/customer/merchant/"+ this.$route.params.id)
                    .then(response => {
                        this.form = response.data.data
                    });
            },
        },
        created() {
            this.renderData()
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
    }
</script>
