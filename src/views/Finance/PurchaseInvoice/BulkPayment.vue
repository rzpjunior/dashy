<template>
    <v-container class="px-6">
        <v-col cols="12" class="mt-3">
            <div style="font-size:12px;color:#768F9C;margin-top:-30px" class="mb-4">
                This filter must be filled before upload template
            </div>
            <v-row>
                <v-col cols="12" md="3">
                    <SelectPaymentMethod
                        @selected="publicPaymentMethod"
                        :label="'Payment Method'"
                        :disabled="disfield"
                    ></SelectPaymentMethod>
                </v-col>
            </v-row>
        </v-col>
        <hr class="hr-solid mx-4 mb-8" style="margin-top:-10px">
        <v-col cols="12" md="12">
            <v-row>
                <v-col>
                    <div>
                        Step 1. Download Template
                    </div>
                    <div class="my-2 second-color">
                        Download Bulk Payment template
                    </div>
                    <div style="background: #E8E8E8;border-radius: 10px; text-align:center">
                        <div>
                            <img class="mt-12" src="/icon/download.png">
                        </div>
                        <div class="mt-4">
                            <v-btn
                                class="px-7 mb-12 no-caps white--text"
                                @click="downloadTemplateProduct()"
                                elevation="0"
                                rounded
                                style="background: #768f9c; height:45px"
                                v-privilege="'pp_crt'"
                            >Download</v-btn>
                        </div>
                    </div>
                </v-col>
                <v-col style="border-right: 1px dashed #333;border-left: 1px dashed #333;" class="mx-16 px-16">
                    <div>
                        Step 2. Update Template
                    </div>
                    <div class="my-2 second-color">
                        Update with spreadsheet application
                    </div>
                    <v-img class="mt-4" src="/img/worktime.png"/>
                </v-col>
                <v-col>
                    <div>
                        Step 3. Upload File<span style="color:red">*</span>
                    </div>
                    <div class="my-2 second-color">
                        Bulk Payment will be created based on data uploaded
                    </div>
                    <UploadExcel
                        @onSelect="onSelectFile"
                        @onDelete="onDeleteFile"
                        :disabled="disableUpload"
                        :clear="clear1"
                        :error="error.id"
                    ></UploadExcel>
                    <v-card-actions style="margin-top:5px">
                        <v-spacer></v-spacer>
                    <v-btn
                        class="px-7 no-caps white--text"
                        @click="uploadFile()"
                        elevation="0"
                        v-privilege="'pp_crt'"
                        rounded
                        :disabled="uploadDis1"
                        style="background: #768f9c; height:45px"
                    >Upload</v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-col>
        <v-overlay :z-index="12" :value="overlay">
            <v-progress-circular
                indeterminate
                size="84"
                color="green"
                width=15
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>
<script>
    export default {
        name: "BulkPayment",
        data() {
            return {
                overlay: false,
                error : {},
                uploadDis1 : true,
                clear1 : false,
                SelectPaymentMethod : "",
                data_upload : [],
                disfield : false
            }
        },
        computed : {
            //For watch disable download
            disableUpload() {
                if (this.SelectPaymentMethod) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            //For download Template Product
            downloadTemplateProduct(){
                window.location.href = "https://image-dev-eden.sgp1.digitaloceanspaces.com/TemplateBulkPurchasePayment.xlsx"
            },
            // For select public Price filter
            publicPaymentMethod(d) {
                this.SelectPaymentMethod = ""
                if (d) {
                    this.SelectPaymentMethod = d.id
                }
            },
            // For delete file excel
            onDeleteFile(ev) {
                this.data_upload = []
                this.uploadDis1 = true
                this.error = {}
                this.disfield = false
            },
            // For select file excel
            onSelectFile(file) {
                this.overlay = true
                this.data_upload = []
                let check = true
                file.forEach((item, i) => {
                    if (typeof item.Amount === 'number' && check == true) {
                        let valid = this.$moment(item.Date, 'DD/MM/YYYY', true).isValid()
                        if (valid == true && check == true) {
                            let date = ""
                            if (item.Date instanceof Date) {
                                date = item.Date.toISOString().split('T')[0]
                            } else {
                                date = item.Date.split("/").reverse().join("-")
                            }
                            this.data_upload.push({
                                "payment_date": date,
                                "payment_method_id": this.SelectPaymentMethod,
                                "purchase_invoice_code":  item.Invoice_Code == null ? '' : String(item.Invoice_Code),
                                "bank_payment_voucher_number":  item.Bank_Payment_Voucher_Number == null ? '' : String(item.Bank_Payment_Voucher_Number),
                                "amount": parseFloat(item.Amount.toFixed(2)),
                                "note": item.Note == null ? '' : String(item.Note),
                                "paid_off": item.Paid_Off == null ? '' : String(item.Paid_Off)
                            })
                            if (i==file.length-1) {
                                this.overlay = false
                                this.uploadDis1 = false
                                this.disfield = true
                            }
                        } else {
                            check = false
                            this.uploadDis1 = true
                            this.overlay = false
                            this.error = {
                                id : "Date format is invalid. Please Re-check again"
                            }
                        }
                    } else {
                        check = false
                        this.uploadDis1 = true
                        this.overlay = false
                        this.error = {
                            id : "Amount format is invalid. Please Re-check again"
                        }
                    }
                });
            },
            // For select upload excel
            uploadFile() {
                this.overlay = true
                this.clear1 = false
                let data = {
                    data : this.data_upload
                }
                this.$http.post("finance/purchase/payment/bulk", data).then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: response.data.data,
                        type: 'success',
                    });
                    this.overlay = false
                    this.error = {}
                    this.clear1 = true
                    this.uploadDis1 = true
                    this.$router.push("/finance/purc-invoice")
                }).catch(e => {
                    this.overlay = false
                    this.error = e.errors
                })
            },
        }
    }
</script>
