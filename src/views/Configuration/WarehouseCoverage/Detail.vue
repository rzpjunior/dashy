<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="items.sub_district.area.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'City'" :value="items.sub_district.district.city.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'District'" :value="items.sub_district.district.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Subdistrict'" :value="items.sub_district.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Postal Code'" :value="items.sub_district.postal_code" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Main Warehouse'" :value="items.warehouse.name" />
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-justify-center fs16 bold">
                    Warehouse List
                </v-col>
                <v-col class="d-flex justify-end h70">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="no-caps bold mr20"
                        v-privilege="'wrh_cvrg_crt'"
                        @click="openModalWarehouse"
                    >
                        <span class="text-white">Add Warehouse</span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="datas"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.warehouse.name }}</td>
                        <td>{{ props.item.warehouse.warehouse_type_name }}</td>
                        <td>{{ props.item.warehouse.parent_id ? props.item.warehouse.parent_id.name : '-' }}</td>
                        <td>
                            <div v-if="props.item.main_warehouse == 1">
                                <v-chip :color="statusMaster('active')">
                                    <span class="pa-md-2">Yes</span>
                                </v-chip>
                            </div>
                            <div v-else>
                                <v-chip :color="statusMaster('archived')">
                                    No
                                </v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn icon v-on="{ ...menu }">
                                        <v-icon dark>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item
                                        v-privilege="'wrh_cvrg_del'"
                                        @click="deleteWarehouse(props.item.id)"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Delete Warehouse</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div v-if="props.item.warehouse.warehouse_type == 1 && props.item.main_warehouse != 1">
                                        <hr />
                                    </div>
                                    <v-list-item
                                        v-if="props.item.warehouse.warehouse_type == 1 && props.item.main_warehouse != 1"
                                        v-privilege="'wrh_cvrg_upd'"
                                        @click="changeMainWarehouse(props.item.id)"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Change Main Warehouse</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div>
                                        <hr />
                                    </div>
                                    <v-list-item @click="seeHistory(props.item.id)" v-privilege="'filter_rdl'">
                                        <v-list-item-content>
                                            <v-list-item-title>History</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog
            v-model="addWarehouseDialog"
            persistent
            max-width="450px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlayWarehouse" />
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="6">
                            Add Warehouse
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="6">
                            <v-btn
                                icon
                                @click="addWarehouseDialog = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <div class="mt10">
                        <v-row>
                            <v-col cols="12">
                                <SelectWarehouse
                                    :norequired="false"
                                    :aux_data="2"
                                    :dense="true"
                                    :area_id="items.sub_district.area.id"
                                    :warehouse="warehouse"
                                    :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                                    @selected="warehouseSelected"
                                    :error="error.parent_warehouse || error.area_id || error.warehouse_coverage"
                                ></SelectWarehouse>
                            </v-col>
                            <v-col>
                                <v-checkbox 
                                    :disabled="warehouse.warehouse_type != 1"
                                    class="-mt30"
                                    label="Main Warehouse" 
                                    v-model="main_warehouse"
                                    @click="mainWarehouse(main_warehouse)"
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-text>
                <v-card-actions class="pb-4 -mt40">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="addWarehouse()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        :disabled="validation"
                        v-privilege="'wrh_cvrg_crt'"
                    >
                        <span>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    <ConfirmationDialogNew :sendData="ConfirmData" />
    <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>
<script>
    export default {
        name: "WarehouseCoverageDetail",
        data() {
            return {
                ConfirmData: {},
                dataAuditLog: {},
                error: {},
                items: {
                    sub_district: {
                        id: '',
                        name: '',
                        postal_code: '',
                        district: {
                            name: '',
                            city: {
                                name: '',
                            }
                        },
                        area: {
                            id: '',
                            name: ''
                        }
                    },
                    warehouse: {
                        name: '',
                        warehouse_type: ''
                    }
                },
                loading: false,
                addWarehouseDialog: false,
                overlayWarehouse: false,
                main_warehouse: false,
                warehouse: '',
                warehouse_id: '',
                table: {
                    fields: [
                        {
                            text:'No',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Warehouse Name',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Warehouse Type',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Parent Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Main Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        }
                    ],
                },
                datas: [
                    {
                        warehouse: {
                            name: '',
                            parent_id: '',
                            warehouse_type_name: ''
                        }
                    }
                ]
              }
        },
        computed: {
            validation() { // validation for add Warehouse in Dialog
                if (this.warehouse_id) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods:{
            openModalWarehouse() { // open dialog add warehouse
                this.addWarehouseDialog = true;
                this.warehouse = ''
                this.warehouse_id = ''
                this.error = ''
            },
            mainWarehouse(d) { // checkbox main warehouse
                if (d) {
                    this.main_warehouse = d
                }
            },
            warehouseSelected(d) { // warehouse selected
                this.warehouse = ''
                this.warehouse_id = ''
                this.main_warehouse = false
                if (d) {
                    this.warehouse = d
                    this.warehouse_id = d.id
                }
            },
            addWarehouse() { // method for add warehouse to db
                this.overlayWarehouse = true
                this.$http.post('/config/warehouse/coverage', {
                    sub_district_id: this.$route.params.id,
                    warehouse_id: this.warehouse_id,
                    main_warehouse: this.main_warehouse
                })
                .then(res => {
                    let self = this
                    setTimeout(function() {
                        self.overlayWarehouse = false
                        self.addWarehouseDialog = false
                        self.renderData()
                    }, 1000)
                })
                .catch(err => {
                    this.overlayWarehouse = false
                    this.error = err.errors
                })
            },
            deleteWarehouse(id) { // delete warehouse from list sub district
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Remove Warehouse from District",
                    title: "Delete Warehouse",
                    text: "Are you sure to remove this Warehouse from District?",
                    urlApi: "/config/warehouse/coverage/delete/" + id,
                    data: {},
                }
            },
            changeMainWarehouse(id) { // change main warehouse
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Change Main Warehouse",
                    title: "Change Main Warehouse",
                    text: "Are you sure you want to change this Warehouse into a Main Warehouse?",
                    urlApi: "/config/warehouse/coverage/main_warehouse/" + id,
                    data: {},
                }
            },
            renderData() { // get data from db
                this.loading = true
                this.datas = []
                this.$http.get("/config/warehouse/coverage", {
                    params: {
                        conditions: 'subdistrict.id.e:' + this.$route.params.id,
                        embeds: 'warehouse,warehouse.parent_id,subdistrict,subdistrict.area,subdistrict.district,subdistrict.district.city,subdistrict.district.city.province',
                        orderby: 'main_warehouse',
                    }
                }).then(response => {
                    this.loading = false
                    this.datas = response.data.data
                    if (this.datas === null) {
                        this.datas = []
                    }
                    let arr = response.data.data
                    if (arr != null) {
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].main_warehouse == 1) {
                                this.items = arr[i]
                            }
                        }
                    }
                });
            },
            seeHistory(id) { // see history log
                this.dataAuditLog = {
                    model : true,
                    id: id,
                    type: "warehouse_coverage"
                }
            },
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res){
                if (res && this.$route.params.id != undefined) {
                    self.renderData()
                }
            });
            this.$root.$on('event_error', function (err) {
                self.error = err;
            });
        },
    }
</script>