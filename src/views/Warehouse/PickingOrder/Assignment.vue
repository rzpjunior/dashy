<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="6" class="mt10">
                    <DetailRowNew :name="'Area'" :value="area"/>
                </v-col>
                <v-col cols="12" md="6" class="mt10">
                    <DetailRowNew :name="'Warehouse'" :value="warehouse"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <DetailRowNew :name="'Delivery Date'" :value="formatDate(this.delivery_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <SelectPicker
                        name="picker"
                        @selected="pickerSelected"
                        :dense="true"
                        :warehouse="warehouse_id"
                        :label="'Lead Picker'"
                        :role_name="'Lead Picker'"
                    >
                    </SelectPicker>
                </v-col>
            </v-row>
        </div>
        <div class="box-start" v-if="error.no_bin">
            <v-data-table
                :headers="headersNoBin"
                :items="transformedToList"
                :items-per-page="5"
            >
                <template v-slot:item="props">
                    <tr style="height: 30px">
                        <td>{{props.item.item}}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-header-table">
            Picking List
        </div>
        <div class="box-body-table">
            <v-data-table
                  :mobile-breakpoint="0"
                  :headers="table.fields"
                  :items="items"
                  :loading="loading"
                  :items-per-page="10"
              >
                  <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.code }}</td>
                        <td><a @click="openSO(props.item.id)" style="color:#50ABA3" href="#">Sales Order Detail</a></td>
                        <td>{{ props.item.total_item_picking_list }}</td>
                        <td>{{ formatPrice(props.item.total_weight_picking_list) }}</td>
                        <td>{{ props.item.total_sales_order }}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <div>
                                <div v-if="assigned = true && props.item.picker_name !== ''" >
                                    {{ props.item.picker_name }}
                                    <v-btn
                                            icon
                                            @click="removePicker(props.item.id)"
                                        >
                                            <img src="/icon/close-new.png" height="20px" width="20px"/>
                                        </v-btn>
                                </div>
                                <div v-else>
                                    <v-btn
                                        v-if="!disableAddPicker"
                                        icon
                                        name="addproduct"
                                        @click="assignPicker(props.item.id)"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                    <v-btn
                                        v-else
                                        icon
                                        name="addproduct"
                                        @click="assignPicker(props.item.id)"
                                        disabled
                                    >
                                        <img src="/icon/plus-disabled.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
              </v-data-table>
        </div>
        <LoadingBar :value="overlay"/>
        <v-dialog
            v-model="modal_SO"
            max-width="802px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Sales Order Detail</span>
                    <v-spacer></v-spacer>
                      <v-btn
                          icon
                          @click="modal_SO = false"
                      >
                          <v-img src="/icon/close-new.png" max-height="20px" max-width="20px"></v-img>
                      </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="table_so.fields_so"
                        :items="items_so"
                        :items-per-page="10"
                        :mobile-breakpoint="0"
                        :loading="loading_so"
                    >
                        <template v-slot:item="props">
                            <tr style="height: 48px;">
                                <td>{{ props.item.code }}</td>
                                <td>{{ props.item.branch.merchant.name }}</td>
                                <td>{{ props.item.branch.merchant.tag_customer_name }}</td>
                                <td>{{ props.item.total_item }}</td>
                                <td>{{ props.item.total_weight }}</td>
                                <td>{{ props.item.wrt.name }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
export default {
    name: 'AssignmentPicker',
    data() {
        return {
            search: '',
            items : [],
            items_so: [],
            overlay: false,
            warehouse_id : '',
            ConfirmData : {},
            clear : false,
            modal_SO: false,
            error : {},
            area : '',
            warehouse : '',
            area_id: '',
            SelectPicker: '',
            assigned: false,
            loading: false,
            loading_so: false,
            disableAddPicker: true,
            items_picking: {},
            delivery_date: '',
            table: {
                fields: [
                    {
                        text:'No',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'PL Code',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Sales Order',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Total Item',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Weight (Kg)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Total SO',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Note',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                        width: '20%'
                    },
                    {
                        text:'Lead Picker',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    }
                ],
            },
            table_so: {
                fields_so: [
                    {
                        text:'Order Code',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Customer Name',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Customer Tag',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Total Item',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Weight (Kg)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'WRT',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                ],
            },
            picker_max_weight: 0,
            routing_status: 3,
            error: {},
            rowBinError: [],
            headersNoBin: [{
                text: 'Bin Error',
                class: 'error--text'
            }],
        }
    },
    computed: {
        transformedToList() { // transform row fail bin error
            return this.rowBinError.map(item => ({ item }));
        }
    },
    mounted() {
        this.renderData()
    },
    methods : {
        assignPicker(id){ // assign Lead Picker
            this.$http.put("/warehouse/picking_order/assign/leadpicker/pl/"+id, {
                staff_id: this.SelectPicker
            }).then(res => {
                this.renderData()
                this.assigned = true
            }).catch(err => {
                this.error = err.errors
            })
        },
        removePicker(id){ // remove Lead Picker from list
            this.$http.put("/warehouse/picking_order/assign/leadpicker/pl/"+id, {
                staff_id: ""
            }).then(res => {
                this.renderData()
                this.assigned = false
            })
        },
        openSO(id){ // open Modal desatil SO
            this.modal_SO = true
            this.loading_so = true
            this.items_so = []
            this.$http.get("/warehouse/picking_order/assign/list-group",{params:{
                    conditions:'warehouse.id.e:'+this.warehouse_id+'|delivery_date:'+this.delivery_date+'|status:1' + '|id.e:' + id,
                    orderby:'-id',
                }}).then(response => {
                this.items_so = response.data.data[0].sales_order
                this.loading_so = false
            });
        },
        renderData(){ // get data from API
            this.loading = true
            this.$http.get("/warehouse/picking_order/"+this.$route.params.id).then(response => {
                this.items_picking = response.data.data
                this.delivery_date = response.data.data.recognition_date
                let dataWr = response.data.data.warehouse
                this.warehouse = dataWr.name
                this.warehouse_id = dataWr.id
                this.area = dataWr.area.name
                this.$http.get("/warehouse/picking_order/assign/list-group",{params:{
                    conditions:'warehouse.id.e:'+this.warehouse_id+'|delivery_date:'+this.delivery_date+'|status:1',
                    orderby:'-id',
                }}).then(response => {
                    this.loading = false
                    if (response.data.data) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                })
                .catch(err => {
                    this.error = err.errors
                })
            });
        },
        pickerSelected(d) { // select Lead Picker
            this.SelectPicker = ""
            this.disableAddPicker = true
            if (d) {
                this.SelectPicker = d.id
                this.disableAddPicker = false
            }
        },
    },
}
</script>