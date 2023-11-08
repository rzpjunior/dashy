<template>
    <v-container fill-height class="main-container">
        <div class="box">
             <v-col cols="12" md="12">
                <v-row>
                    <v-col>
                        <div>Step 1. Download Template</div>
                        <div class="mt-2 text-black60">Download Eden Farm assignment template</div>
                        <div class="mt-5">
                            <SelectSalesGroup
                                @selected="salesGroupSelected"
                                :dense="true"
                            ></SelectSalesGroup>
                        </div>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <div class="mt-16 pt-13">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    class="no-caps bold white--text px-7 mt-16"
                                    @click="downloadTemplate()"
                                    :disabled="disableButton"
                                    v-privilege="'sla_exp'"
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
                        <div class="my-2 text-black60"> Assignment will be created based on data uploaded</div>
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
                                v-privilege="'sla_upl'"
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
        name: "SalesAsignmentCreate",
        data() {
            return {
                overlay: false,
                error: {},
                clear1: false,
                sales_group_id: "",
                product_template_upload: [],
                errorDetail: []
            }
        },
        computed : {
            //For watch disable download
            disableButton() {
                if (this.sales_group_id) return false
                else return true
            },
            disableUpload() {
                if (this.sales_group_id && this.product_template_upload.length>1 && !this.errorDetail.length>0) return false
                else return true
            }
        },
        methods: {
            //For download Template Assignment
            downloadTemplate(){
                this.overlay = true
                let id = this.sales_group_id
                this.$http.get("/sales/assignment/export",{params:{
                        export:1,
                        sales_group_id:id,
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                    }).catch(e => {
                        this.overlay = false
                });
            },
            // For select sales group filter
            salesGroupSelected(d) {
                this.sales_group_id = '';
                this.clear1 = true
                if(d){
                    this.sales_group_id = d.id
                    this.clear1 = false
                    this.errorDetail = []
                }else{
                    this.product_template_upload = []
                    this.errorDetail = []
                }
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
                file.forEach((item, i) => {
                    this.product_template_upload.push({
                        "sales_group_id": item.Sales_Group_ID == null ? '' : String(item.Sales_Group_ID),
                        "customer_type": item.Customer_Type == null ? '' : String(item.Customer_Type),
                        "branch_id": item.Outlet_ID == null ? '' : String(item.Outlet_ID),
                        "salesperson_id": item.Staff_ID == null ? '' : String(item.Staff_ID),
                        "task": item.Task == null ? '' : String(item.Task),
                        "visit_date": item.Visit_Date == null ? '' : String(item.Visit_Date),
                        "objective_code": item.Objective_Code == null ? '' : String(item.Objective_Code.replace(/ /g, ""))
                    })
                    if(item.Objective_Code){
                        if(item.Objective_Code.includes(" ")){
                            this.errorDetail.push({message:'Please ensure the Objective Code on line no.' + item.No+' contains no spaces between code'})
                            this.overlay = false
                        }
                    }
                    if (i==file.length-1) {
                        this.overlay = false
                    }
                });
                if (file.length == 0) {
                    this.overlay = false
                    this.errorDetail.push({message:'File is Empty'})
                }
            },
            // For convert exel date value to time format used
            ExcelDateToJSDate(date) {    
                if(date){
                    var dateConvert = new Date(Math.round((date - 25569)*86400*1000))
                    var dates = this.$moment(dateConvert).format('YYYY-MM-DD');
                }else var dates=''                        
                return dates;
            },
            // For select upload excel
            uploadFile() {
                this.overlay = true
                this.clear1 = false
                this.errorDetail = []
                let data = {
                    sales_group_id: this.sales_group_id,
                    assignments: this.product_template_upload
                }
                this.$http.post("/sales/assignment/upload", data).then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: "Data has been uploaded successfully",
                        type: 'success',
                    });
                    this.$router.push('/sales/assignment');
                }).catch(e => {
                    this.overlay = false
                    this.error = e.errors
                    for (var key in this.error) {
                        let getIdx = []
                        let objectiveCode = []
                        let indexRow = ''
                        if (key.includes('id_')) {
                            getIdx = key.split("id_")
                        }
                        if (key.includes('sales_group_id_')) {
                            getIdx = key.split("sales_group_id_")
                        }
                        if (key.includes('.sales_group_id')) {
                            getIdx = key.split('.')
                        }
                        if (key.includes('customer_type_')) {
                            getIdx = key.split("customer_type_")
                        }
                        if (key.includes('.customer_type')) {
                            getIdx = key.split('.')
                        }
                        if (key.includes('.branch_id')) {
                            getIdx = key.split('.')
                        }
                        if (key.includes('salesperson_id_')) {
                            getIdx = key.split("salesperson_id_")
                        }
                        if (key.includes('.salesperson_id')) {
                            getIdx = key.split('.')
                        }
                        if (key.includes('task_')) {
                            getIdx = key.split("task_")
                        }
                        if (key.includes('.task')) {
                            getIdx = key.split('.')
                        }
                        if (key.includes('visit_date_')) {
                            getIdx = key.split("visit_date_")
                        }
                        if (key.includes('.visit_date')) {
                            getIdx = key.split('.')
                        }
                        if (key.includes('objective_code_')) {
                            getIdx = key.split("objective_code_")
                            objectiveCode = getIdx[1].split("_")
                            getIdx[1] = objectiveCode[0]
                        }
                        indexRow = parseInt(getIdx[1])+1
                        if(objectiveCode.length > 0){
                            this.errorDetail.push({message:'Data No '+indexRow+': '+objectiveCode[1]+' - '+this.error[key]})
                        }else{
                            this.errorDetail.push({message:'Data No '+indexRow+': '+this.error[key]})
                        }
                    }
                })
            },
        }
    }
</script>