<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        disabled
                        name="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="recognition_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        ofselectedSOet-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="departure_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    @click:clear="form.recognition_date = ''"
                                    :error-messages="error.recognition_date"
                                    v-model="form.recognition_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.recognition_date"
                            @input="recognition_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="350"
                        outlined
                        :error-messages="error.note"
                        required
                        dense
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="12">
                    <v-row class="px-4">
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 1. Download Template
                            </div>
                            <div class="text-black60">
                                Download template based on filters
                            </div>
                            <div class="mt-9 bg-black10" style="border: 2px dashed #AAAAAA; min-height:220px; text-align: center;">
                                <img width="60" class="mt50 mb8" src="/icon/download_new.png" alt=""> <br>
                                <v-btn
                                    @click="downloadTemplate()"
                                    depressed
                                    color="#50ABA3"
                                    class="only-btn white--text rounded-form mt10"
                                >Download Template</v-btn>
                            </div>
                        </v-col>
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 2. Update Template
                            </div>
                            <div class="text-black60">
                                Update with spreadsheet application
                            </div>
                            <v-img width="250px" class="mt-4 ml-6" src="/img/worktime_new.png" alt="" />
                        </v-col>
                        <v-col class="pa-8">
                            <div>
                                Step 3. Upload File<span class="text-red">*</span>
                            </div>
                            <div class="text-black60">
                                Sales Order will be selected based on selected Delivery Date
                            </div>
                            <div class="mt10">
                                <UploadExcel
                                    @onSelect="onSelect"
                                    @onDelete="onDelete"
                                    :error="error.item_upload_assign"
                                ></UploadExcel>
                            </div>
                            <div v-if="errorExcel">
                                <v-img src="/icon/close-2.png" max-height="24px" max-width="24px" class="mt15"></v-img>
                                <div class="ml35 -mt25">
                                    Error of the data were found in the file uploaded. Please
                                    <a style="text-decoration:none;" @click="downloadError">
                                        download the file with marked errors,
                                    </a>
                                    correct the errors and upload the file again.
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            v-privilege="'pco_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="modalConfirm = true"
                            v-privilege="'pco_crt'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="modalConfirm"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Create Picking Order</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Are you sure want to create this Picking Order?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="modalConfirm = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        @click="createPickingOrder()"
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                    >Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style scoped>
.multiple-select-box{
    border: 1px solid #9c9c9c;
    padding: 15px;
    width:100%;
    overflow-x: auto;
    border-radius: 10px;
}
.multiple-select-box::-webkit-scrollbar-thumb {
  background-color: grey;
}
.multiple-select-box::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
#add{
    padding:10px;
    border-radius:80px;
}
#add:hover{
    background: rgb(206, 206, 206);
    padding: 10px;
}
#remove{
    padding:10px;
    border-radius:80px;
}
#remove:hover{
    background: rgb(206, 206, 206);
    padding: 10px;
}
</style>
<script>
import Vue from 'vue'
    export default {
        name: 'PickingOrderCreate',
        data () {
            return {
                errorExcel: false,
                excelLink: '',
                statuses:999,
                modalConfirm: false,
                loaded: true,
                form : {
                    recognition_date:new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                    warehouse_id:"",
                    note:"",
                    item_upload_assign : [],
                },
                table: {
                    fields: [
                        {
                            text:'Product Name',
                            sortable: false,
                        },
                        {
                            text:'UOM',
                            sortable: false
                        },
                        {
                            text:'Total Order',
                            sortable: false
                        },
                        {
                            text:'Packer',
                            width: "40%",
                            sortable: false
                        },
                    ],
                },
                error : {},
                overlay: false,
                success : {},
                ConfirmData : {},
                area : '',
                warehouse : '',
                warehouseDis : true,
                recognition_date_model : '',
                productIdx : '',
                search: '',
                SelectDistrict: '',
                SelectBusinessType: '',
                SelectBranch: '',
                SelectWrt: '',
                SelectPicker: '',
            }
        },
        mounted () {
            let self = this
            self.getWarehouse()
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        computed: {
            //to get staff id
            staff() {
                return this.$store.getters.getStaff
            },
        },
        methods:{
            //for download template
            downloadTemplate() {
                if (this.form.warehouse_id && this.form.recognition_date) {
                    this.$http.get("/warehouse/picking_order/template?delivery_dates="+ this.form.recognition_date +"&warehouse_id="+ this.form.warehouse_id +"&export=1")
                    .then(response => {
                        window.location.href = response.data.file
                    })
                } else {
                    this.error = {recognition_date:'Date cannot be empty'}
                }
            },
            onDelete(ev) {
                this.form.item_upload_assign = []
            },
            onSelect: function(file){
                this.form.item_upload_assign = []
                file.forEach((item) => {
                    this.form.item_upload_assign.push(
                        {
                            sales_order_code:item.Order_Code,
                            helper_str:item.Picker,
                            business_type_str:item.Business_Type,
                            order_type_str:item.Order_Type,
                            merchant_name_str:item.Merchant_Name,
                            order_status_str:item.Order_Status,
                            delivery_code_str:item.Delivery_Code,
                            delivery_status_str:item.Delivery_Status,
                            shipping_address_str:item.Shipping_Address,
                            province_str:item.Province,
                            city_str:item.City,
                            district_str:item.District,
                            sub_district_str:item.Sub_District,
                            postal_code_str:item.Postal_Code,
                            wrt_str:item.WRT,
                            order_weight_str:item.Order_Weight.toString(),
                            payment_term_str:item.Payment_Term,
                            courier_str:item.Courier,
                            vendor_str:item.Vendor,
                            planning_str:item.Planning
                        }
                    )
                });
            },
            //to get warehouse id
            getWarehouse(){
                this.loaded = false
                this.$http.get("/user/staff/"+this.staff.id)
                .then(response => {
                    let dataWr = response.data.data
                    this.warehouse = dataWr.warehouse
                    this.form.warehouse_id = dataWr.warehouse.id
                });

            },
            //to upload and create picking
            createPickingOrder(){
                this.overlay = true
                this.$http.post("/warehouse/picking_order/upload-assign",this.form)
                .then(response => {
                    this.overlay = false
                    this.modalConfirm = false
                    if(response.data.file){
                        this.errorExcel = true
                        this.excelLink = response.data.file
                        Vue.$toast.open({
                            position: 'top-right',
                            message: "Error occured in uploaded file",
                            type: 'error',
                        });
                    }else{
                        Vue.$toast.open({
                            position: 'top-right',
                            message: 'Data has been saved successfully',
                            type: 'success',
                        });
                        this.$router.push("/warehouse/picking-order/detail/"+response.data.data.id)
                    }
                }).catch(e => {
                    this.overlay = false
                });
            },
            downloadError(){
                return window.location.href = this.excelLink
            },
            //to select picker based on id
            pickerSelected(d) {
                this.SelectPicker = ""
                if (d) {
                    this.SelectPicker = d.id
                }
                this.getSalesOrder(this.statuses)
            },
            //to select wrt based on id
            wrtSelected(d) {
                this.SelectWrt= ""
                if (d) {
                    this.SelectWrt = d.id
                }
                this.getSalesOrder(this.statuses)
            },
            //to select business type based on id
            businessTypeSelected(d) {
                this.SelectBusinessType= ""
                if (d) {
                    this.SelectBusinessType = d.id
                }
                this.getSalesOrder(this.statuses)
            },
            //select branch based on id
            branchSelected(d) {
                this.SelectBranch= ""
                if (d) {
                    this.SelectBranch = d.id
                }
                this.getSalesOrder(this.statuses)
            },
            //to select district based on id
            districtSelected(d) {
                this.SelectDistrict= ""
                if (d) {
                    this.SelectDistrict = d.district_id
                }
                this.getSalesOrder(this.statuses)
            },

        },
    }
</script>
