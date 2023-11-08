<template>
    <v-container fill-height class="main-container">
        <div class="box">
             <v-col cols="12" md="12">
                <v-row>
                    <v-col>
                        <div>Step 1. Download Template</div>
                        <div class="mt-2 text-black60">Download spreadsheet file template</div>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <div class="mt100 pt100">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    class="no-caps bold white--text px-7 mt-16"
                                    @click="downloadTemplate()"
                                    v-privilege="'prb_exp'"
                                >Download</v-btn>
                            </div>
                        </v-card-actions>
                    </v-col>
                    <v-col class="mx-10 px-10 hr-dash-right hr-dash-left">
                        <div>Step 2. Update Template</div>
                        <div class="my-2 text-black60">Update with spreadsheet application</div>
                        <v-img 
                            class="mt-4 mx-16" 
                            width="250px" 
                            src="/img/worktime_new.png"
                        />
                    </v-col>
                    <v-col>
                        <div>Step 3. Upload File<span class="red--text">*</span></div>
                        <div class="my-2 text-black60">Product Box will be created based on data uploaded</div>
                        <div class="mt-5">
                            <UploadExcel
                                @onSelect="onSelectFile"
                                @onDelete="onDeleteFile"
                                :clear="clear_upload"
                                :error="error.id"
                            ></UploadExcel>
                        </div>
                        <v-card-actions class="mt-6">
                            <v-spacer></v-spacer>
                            <v-btn
                                depressed
                                color="#50ABA3"
                                class="no-caps bold white--text px-7"
                                @click="uploadFile()"
                                v-privilege="'prb_upl'"
                                :disabled="disableUpload"
                            >Upload</v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-col>
        </div>
        <div v-if="errorDetail.length > 0" class="box red--text">
            <h3>Error Upload:</h3>
            <div v-for="(item, idx) in errorDetail" :key="idx">
                {{errorDetail[idx].message}}
            </div>
        </div>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    export default {
        name: "ProductBoxCreate",
        data() {
            return {
                overlay: false,
                error: {},
                clear_upload: false,
                value_template_upload: [],
                errorDetail: []
            }
        },
        computed: {
            disableUpload() {
                return (this.value_template_upload.length > 0 && !this.errorDetail.length > 0) ? false : true
            }
        },
        methods: {
            //For download Template Assignment
            downloadTemplate(){
                this.overlay = true
                this.$http.get("/box/export_template",{params:{
                        export:1,
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                    }).catch(e => {
                        this.overlay = false
                });
            },
            // For delete file excel
            onDeleteFile() {
                this.value_template_upload = []
                this.errorDetail = []
            },
            // For select file excel/box/export_template
            async onSelectFile(file) {
                this.overlay = true
                this.value_template_upload = []
                if (file.length == 0) {
                    this.overlay = false
                    this.errorDetail.push({message:'File is Empty'})
                } else {
                    const getKey = (index) => Object.keys(file[0])[index]
                    await file.forEach((item, i) => {
                        this.value_template_upload.push({
                            "Rfid_Code": item.Rfid_Code == null ? '' : String(item.Rfid_Code),
                            "Product_Code": item.Product_Code == null ? '' : String(item.Product_Code),
                            "Total_Weight": item.Total_Weight == null ? parseInt(0) : item.Total_Weight,
                            "Note": item.Note == null ? '' : String(item.Note),
                        })
                        if (i==file.length-1) {
                            this.overlay = false
                        }
                    });
                }
            },
            // For select upload excel
            async uploadFile() {
                this.overlay = true
                this.clear_upload = false
                this.errorDetail = []
                let data = {
                    productBoxes : this.value_template_upload
                }
                await this.$http.post("/box/product_box/upload", data).then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: "Data has been uploaded successfully",
                        type: 'success',
                    });
                    this.$router.push('/smart-fridge/product-box');
                }).catch(e => {
                    this.overlay = false
                    if(e.errors){
                        this.error = e.errors
                        for (var key in this.error) {
                            let getIdx = []
                            let indexRow = ''
                            if (key.includes('rfid_code_.')) {
                                getIdx = key.split("rfid_code_.")
                            }
                            if (key.includes('qty')) {
                                getIdx = key.split("qty")
                            }
                            if (key.includes('product_code_.')) {
                                getIdx = key.split("product_code_.")
                            }
                            indexRow = parseInt(getIdx[1])+1
                            this.errorDetail.push({message:'Data No '+indexRow+': '+this.error[key]})
                        }
                    }
                })
            },
        }
    }
</script>