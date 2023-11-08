<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-col cols="12" class="mt-3">
                <div class="mb-2 grey--text">
                    Select Public Price to download its latest data
                </div>
                <v-row>
                    <v-col cols="12" md="3">
                        <SelectPublicPrice
                            @selected="publicPriceSelected"
                            :dense="true"
                            :norequired="true"
                        ></SelectPublicPrice>
                    </v-col>
                    <v-col cols="12" md="3" offset="6" class="d-flex justify-end">
                        <v-btn
                            class="no-caps bold white--text"
                            depressed
                            color="#50ABA3"
                            @click="downloadPublicPrice()"
                            :disabled="disableButton"
                            v-privilege="'prd_mtc_upl'"
                        >Download</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </div>
        <div class="box">
            <v-col cols="12" md="12">
                <v-row>
                    <v-col>
                        <div>
                            Step 1. Download Template
                        </div>
                        <div class="my-2 text-black60">
                            Download Eden Farm product template
                        </div>
                        <div class="mt-9 bg-black10 download-dashed-box">
                            <img width="60" class="mt50 mb8" src="/icon/download_new.png" alt=""><br>
                            <v-btn
                                @click="downloadTemplateProduct()"
                                v-privilege="'prd_mtc_upl'"
                                depressed
                                color="#50ABA3"
                                class="only-btn white--text rounded-form mt10"
                            >Download Template</v-btn>
                        </div>
                    </v-col>
                    <v-col class="mx-16 px-16 hr-dash-right hr-dash-left">
                        <div>
                            Step 2. Update Template
                        </div>
                        <div class="my-2 text-black60">
                            Update with spreadsheet application
                        </div>
                        <v-img
                            width="250px"
                            class="mt-4 ml-6"
                            src="/img/worktime_new.png"
                            alt=""
                        />
                    </v-col>
                    <v-col>
                        <div>
                            Step 3. Upload File<span class="red--text">*</span>
                        </div>
                        <div class="my-2 text-black60">
                            Product comparison will be updated based on data uploaded
                        </div>
                        <UploadExcel
                            @onSelect="onSelectFile"
                            @onDelete="onDeleteFile"
                            :clear="clear1"
                            :error="error.id"
                        ></UploadExcel>
                        <v-card-actions class="mt5">
                            <v-spacer></v-spacer>
                            <v-btn
                                depressed
                                color="#50ABA3"
                                class="no-caps bold white--text px-7"
                                @click="uploadFile()"
                                v-privilege="'prd_mtc_upl'"
                                :disabled="uploadDis1"
                            >Upload</v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-col>
        </div>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    export default {
        name: "ProductMatching",
        data() {
            return {
                overlay: false,
                error : {},
                uploadDis1 : true,
                clear1 : false,
                SelectPublicPrice : ""
            }
        },
        computed : {
            //For watch disable download
            disableButton() {
                if (this.SelectPublicPrice) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            //For download Public Price
            downloadPublicPrice(){
                this.overlay = true
                let id = this.SelectPublicPrice
                this.$http.get("/scraping/public_product?export=1&public_price_set="+id).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                });
            },
            //For download Template Product
            downloadTemplateProduct(){
                this.overlay = true
                let id = this.SelectPublicPrice
                this.$http.get("/scraping/product_matching").then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                });
            },
            // For select public Price filter
            publicPriceSelected(d) {
                this.SelectPublicPrice = ""
                if (d) {
                    this.SelectPublicPrice = d.id
                }
            },
            // For delete file excel
            onDeleteFile(ev) {
                this.product_template_upload = []
                this.uploadDis1 = true
            },
            // For select file excel
            onSelectFile(file) {
                this.overlay = true
                this.product_template_upload = []
                file.forEach((item, i) => {
                    this.product_template_upload.push({
                        "eden_product_code": String(item.Eden_Product_Code),
                        "eden_product_name": String(item.Eden_Product_Name),
                        "public_product_1": item.Public_Product_1 == null ? '' : String(item.Public_Product_1),
                        "public_product_2": item.Public_Product_2 == null ? '' : String(item.Public_Product_2)
                    })
                    if (i==file.length-1) {
                        this.overlay = false
                        this.uploadDis1 = false
                    }
                });
            },
            // For select upload excel
            uploadFile() {
                this.overlay = true
                this.clear1 = false
                let data = {
                    data : this.product_template_upload
                }
                this.$http.post("/scraping/product_matching", data).then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: response.data.data,
                        type: 'success',
                    });
                    this.overlay = false
                    this.error = {}
                    this.clear1 = true
                    this.uploadDis1 = true
                }).catch(e => {
                    this.overlay = false
                    this.error = e.errors
                })
            },
        }
    }
</script>
