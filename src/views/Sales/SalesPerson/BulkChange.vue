<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" md="4" class="px-10">
                    <div>Step 1. Download Template</div>
                    <div class="mt-2 text-black60">Download spreadsheet template</div>
                    <div class="mt-5">
                        <SelectArea 
                            @selected="areaSelected"
                            :dense="true"
                            :aux_data="2"
                            v-privilege="'filter_rdl'"
                        ></SelectArea>
                        <SelectSalesGroup
                            @selected="salesGroupSelected"
                            :dense="true"
                            :area_id="this.area_id"
                            :disabled="disableGroup"
                            :clear="clearGroup"
                            v-privilege="'filter_rdl'"
                        ></SelectSalesGroup>
                        <SelectSalesPerson
                            v-model="salesperson_id"
                            :norequired="true"
                            :dense="true"
                            @selected="salespersonSelected"
                            v-privilege="'filter_rdl'"
                        ></SelectSalesPerson>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="no-caps bold white--text px-7 mt-10"
                            @click="downloadTemplate()"
                            :disabled="disableButton"
                            v-privilege="'sps_blk_exp'"
                        >Download</v-btn>
                    </v-card-actions>
                </v-col>
                <v-col cols="12" md="4" class="px-10 hr-dash-right hr-dash-left">
                    <div>Step 2. Update Template</div>
                    <div class="my-2 text-black60">Update with spreadsheet application</div>
                    <v-img 
                        class="mt-4 mx-16" 
                        width="250px" 
                        src="/img/worktime_new.png"
                    />
                </v-col>
                <v-col cols="12" md="4" class="px-10">
                    <div>Step 3. Upload File<span class="red--text">*</span></div>
                    <div class="my-2 text-black60">Data will be updated based on data uploaded</div>
                    <div class="mt-5">
                        <v-tooltip top :disabled="!disableButton">
                            <template v-slot:activator="{ on: tooltip }">
                                <div v-on="{ ...tooltip }">
                                    <UploadExcel
                                        @onSelect="onSelectFile"
                                        @onDelete="onDeleteFile"
                                        :clear="clear1"
                                        :disabled="disableButton"
                                        :error="error.id"
                                    ></UploadExcel>
                                </div>
                            </template>
                            <span>Please select sales group before upload</span>
                        </v-tooltip>
                    </div>
                    <v-card-actions class="mt-6">
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="no-caps bold white--text px-7"
                            @click="uploadFile()"
                            v-privilege="'sps_blk_upl'"
                            :disabled="disableUpload"
                        >Upload</v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
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
        name: "SalespersonChangeCreate",
        data() {
            return {
                overlay: false,
                error: {},
                clear1: false,
                area_id: "",
                sales_group_id: "",
                salesperson_id: "",
                product_template_upload: [],
                errorDetail: [],
                clearGroup:false
            }
        },
        computed : {
            //For watch disable download
            disableButton() {
                if (this.sales_group_id && this.area_id) return false
                else return true
            },
            disableUpload() {
                if (this.sales_group_id && this.product_template_upload.length>0) return false
                else return true
            },
            disableGroup() {
                if (this.area_id) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            //For download Template File
            downloadTemplate(){
                this.overlay = true
                let areaID = this.area_id
                let salesGroupID = this.sales_group_id
                let salespersonID = ''
                if (this.salesperson_id) {
                    salespersonID = this.salesperson_id
                }
                this.$http.get("/customer/branch/export",{params:{
                        export:1,
                        area_id: areaID,
                        sales_group_id:salesGroupID,
                        salesperson_id: salespersonID,
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                    }).catch(e => {
                        this.overlay = false
                });
            },
            //For Filter by Area
            areaSelected(d){
                this.area_id = ''
                this.sales_group_id = ''
                this.clearGroup = true
                this.clear1 = true
                this.onDeleteFile()
                if(d){
                    this.area_id = d.id;
                    this.clearGroup = false;
                    this.clear1 = false
                }else{
                    this.product_template_upload = []
                }
            },
            // For select sales group filter
            salesGroupSelected(d) {
                this.sales_group_id = ''
                this.clear1 = true
                this.onDeleteFile()
                if(d){
                    this.sales_group_id = d.id
                    this.clear1 = false
                }else{
                    this.product_template_upload = []
                }
            },
            //For Filter Salesperson
            salespersonSelected(d) {
                this.salesperson_id = '';
                if (d) {
                    this.salesperson_id = d.id;
                }
                this.renderData()
            },
            // For delete file excel
            onDeleteFile(ev) {
                this.product_template_upload = []
                this.errorDetail = []
            },
            // For select file excel
            onSelectFile(file) {
                this.overlay = true
                this.product_template_upload = []
                const getKey = (index) => Object.keys(file[0])[index]
                file.forEach((item, i) => {
                    this.product_template_upload.push({
                        "branch_code": item[getKey(3)] == null ? '' : item[getKey(3)],
                        "new_salesperson_code": item[getKey(7)] == null ? '' : item[getKey(7)]
                    })
                    if (i==file.length-1) {
                        this.overlay = false
                    }
                });
                if (file.length == 0) {
                    this.overlay = false
                    this.errorDetail.push({message:'File is Empty'})
                }
            },
            // For select upload excel
            uploadFile() {
                this.overlay = true
                this.clear1 = false
                this.errorDetail = []
                let data = {
                    data: this.product_template_upload
                }
                this.$http.post("/customer/branch/salesperson/bulk", data).then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: "Data has been uploaded successfully",
                        type: 'success',
                    });
                    this.$router.push('/sales/person');
                }).catch(e => {
                    this.overlay = false
                    this.error = e.errors
                    for (var key in this.error) {
                        let getIdx = ''
                        let indexRow = ''
                        if (key.includes('.branch_code')) {
                            getIdx = key.split('.')
                        }
                        if (key.includes('.new_salesperson_code')) {
                            getIdx = key.split('.')
                        }
                        indexRow = parseInt(getIdx[1])+1
                        if (indexRow) this.errorDetail.push({message:'Data at row number '+indexRow+': '+this.error[key]})
                        else this.errorDetail.push({message:this.error[key]})
                    }
                })
            },
        }
    }
</script>