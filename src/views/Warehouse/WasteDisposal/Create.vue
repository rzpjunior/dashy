<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="recognition_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="departure_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    @click:clear="form.recognition_date = ''"
                                    :error-messages="error.recognition_date"
                                    v-model="form.recognition_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Departure Date<span class="text-red">*</span>
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
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        :aux_data="2"
                        :area="area"
                        :error="error.area_id"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :aux_data="2"
                        :area_id="form.area_id"
                        :warehouse="warehouse"
                        :disabled="warehouseDis"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
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
                        rows="3"
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col cols="12" md="12">
                    <v-row class="px-4">
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 1. Download Template
                            </div>
                            <div class="text-black60">
                                Download template based filter
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
                                Product stock will be updated based on selected warehouse
                            </div>
                            <div class="mt10">
                                <UploadExcel
                                    @onSelect="onSelect"
                                    @onDelete="onDelete"
                                    :error="error.waste_disposal_items || error.waste_disposal_invalid"
                                ></UploadExcel>
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
                            v-privilege="'wd_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'wd_crt'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: 'CreateGoodsTransfer',
        data () {
            return {
                form : {
                    recognition_date:new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                    area_id:"",
                    warehouse_id:"",
                    note:"",
                    waste_disposal_items : [],
                },
                error : {},
                success : {},
                ConfirmData : {},
                area : '',
                warehouse : '',
                warehouseDis : true,
                recognition_date_model : '',
                disabledBtn : false,
                uploadProduct: false,
                file: false,

            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
                if (err.product_id || err.dispose_qty) {
                    self.disabledBtn = false
                }
            });
        },
        methods:{
            onDelete(ev) {
                this.form.waste_disposal_items = []
            },
            onSelect: function(file){
                this.form.waste_disposal_items = []
                file.forEach((item) => {
                    let note = ""
                    if (item.Note) {
                        note = String(item.Note)
                    }
                    this.form.waste_disposal_items.push(
                        {
                            product_id:item.Product_ID,
                            dispose_qty:parseFloat(item.Quantity),
                            note:note
                        }
                    )
                });
            },
            downloadTemplate() {
                if (this.form.warehouse_id) {
                    this.$http.get("/warehouse/waste/disposal/export/form?export=1&warehouse_id="+this.form.warehouse_id)
                    .then(response => {
                        window.location.href = response.data.file
                    })
                } else {
                    this.error = {warehouse_id:'Please enter warehouse'}
                }
            },
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Create Waste Disposal",
                    text : "Are you sure want to create this waste disposal?",
                    urlApi : "/warehouse/waste/disposal",
                    nextPage : "/warehouse/waste-disposal",
                    data : this.form,
                    post : true
                }
            },
            areaSelected(d) {
                this.form.area_id = ""
                this.warehouse = ""
                this.area = ""
                this.form.warehouse_id = ""
                this.warehouseDis = true
                if (d) {
                    this.area = d
                    this.form.area_id = d.id
                    this.warehouseDis = false
                }
            },
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                this.warehouse = ""
                if (d) {
                    this.warehouse = d
                    this.form.warehouse_id = d.id
                }
            },
        }
    }
</script>
