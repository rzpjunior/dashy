<template>
    <div>
        <v-dialog
            v-model="sendData.model"
            max-width="1037px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="11">
                            Confirm Payment
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="1">
                            <v-btn
                                icon
                                @click="sendData.model = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal mt1"/>
                <v-card-text class="mt-6">
                    <v-row>
                        <v-col cols="12" md="6">
                            <DetailRowNew :name="'Payment Method'" :value="sendData.data.payment_method && sendData.data.payment_method.name ? sendData.data.payment_method.name : '-'"/>
                            <v-menu
                                ref="menu"
                                v-model="received_date_model"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on }">
                                    <div v-on="on">
                                        <v-text-field
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            required
                                            clearable
                                            dense
                                            readonly
                                            @click:clear="received_date = ''"
                                            v-model="received_date"
                                            maxlength="10"
                                            onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                            :error-messages="error.received_date"
                                        >
                                            <template v-slot:label>
                                                Payment Date<span style="color:red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    name="received_date"
                                    no-title
                                    v-model="received_date"
                                    @input="received_date_model = false"
                                ></v-date-picker>
                            </v-menu>
                            <v-text-field
                                name="bank_receive_num"
                                v-model="bank_receive_num"
                                required
                                outlined
                                maxlength="50"
                                dense
                                :error-messages="error.bank_receive_num"
                            >
                                <template v-slot:label>
                                    Bank Receive Voucher Number<span style="color:red;">*</span>
                                </template>
                            </v-text-field>
                            <v-checkbox
                                name="paid_off"
                                v-model="paid_off"
                                :label="'Paid Off'"
                                class="-mt12"
                            ></v-checkbox>
                        </v-col>
                        <v-col cols="12" md="6">
                            <DetailRowNew :name="'Payment Channel'" :value="sendData.data.payment_channel ? sendData.data.payment_channel : '-'"/>
                            <DetailRowNew :name="'Amount'" :value="sendData.data.amount ? formatPrice(sendData.data.amount) : '-'"/>
                            <img
                                v-if="sendData.data.image_url !== '' && sendData.data.image_url !== null"
                                class="rounded-form preview-image"
                                :src="sendData.data.image_url"
                            />
                            <div
                                v-else
                                class="rounded-form image-box text-black60 mt-2"
                            >
                                <p>No image</p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text mt8"
                        @click="confirmSalesPayment()"
                    >Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        name : "ConfirmPaymentDialog",
        data () {
            return {
                overlay: false,
                bank_receive_num: '',
                paid_off: false,
                ConfirmData: {},
                error: {},
                received_date_model : false,
                received_date : ''
            }
        },
        props: {sendData: {}},
        mounted() {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
                self.imageError = err.image;
            });
        },
        methods: {
            confirmSalesPayment() { // confirm single sales payment
                let self = this
                let confirmData = {
                    payment_date: this.$moment(self.received_date).format('YYYY-MM-DD'),
                    bank_receive_num: self.bank_receive_num,
                    items: [{
                        id: self.sendData.data.id,
                        amount: self.sendData.data.amount,
                        paid_off: self.paid_off ? 1 : 2,
                        note: self.sendData.data.note,
                    }],
                };
                self.sendData.model = false
                this.ConfirmData = {
                    model: true,
                    status: true,
                    title: "Confirm Payment",
                    text: "Are you sure want to confirm this payment list?",
                    urlApi: "/sales/payment/bulk/confirm",
                    data: confirmData,
                };
            },
        },
        watch: {
            'sendData.model': {
                handler: function (val) {
                    if (val) {
                        this.bank_receive_num = ''
                        this.paid_off = false
                        this.error = {}
                    }
                },
                deep: true
            },
            'sendData.data.received_date': {
                handler: function (val) {
                    if (val) {
                        this.received_date = this.formatDate(val)
                    }
                },
                deep: true
            },
        },
    }
</script>

<style scoped>
    .preview-image {
        width: 250px;
        height: 250px;
    }
    
    .image-box {
        width:250px;
        height:250px;
        background: #EBEBEB;
        border-style:dashed;
        border-color:gray;
        border-width:1px;
        text-align: center;
        padding-top: 120px;
    }
</style>