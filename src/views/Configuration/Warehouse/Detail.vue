<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{datas.name}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="datas.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >Active
                        </v-btn>
                    </div>
                    <div v-else>
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('archived')"
                        >Archive
                        </v-btn>
                    </div>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-privilege="'wrh_upd'" :to="{ name: 'WarehouseUpdate', params: { id: datas.id } }">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div>
                                <hr />
                            </div>
                            <v-list-item @click="seeHistory()" v-privilege="'filter_rdl'">
                                <v-list-item-content>
                                    <v-list-item-title>History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Code'" :value="datas.code" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Name'" :value="datas.pic_name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Phone Number'" :value="datas.phone_number" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Alternative Phone Number'" :value="datas.alt_phone_number" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="datas.area.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'City'" :value="datas.sub_district.district.city.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'District'" :value="datas.sub_district.district.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Subdistrict'" :value="datas.sub_district.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse Type'" :value="datas.warehouse_type" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Parent Warehouse'" :value="datas.parent_id.name" v-if="datas.parent_id != null" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'SO Picking Limit'" :value="datas.limit_sls_ord_pl" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Weight Picking Limit (KG)'" :value="datas.limit_weight_pl" />
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Address'" :value="datas.street_address" :align="true"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Notes'" :value="datas.note" :align="true" />
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Warehouse Coverage
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
                        <td>{{ props.item.sub_district.district.city.province.name }}</td>
                        <td>{{ props.item.sub_district.district.city.name }}</td>
                        <td>{{ props.item.sub_district.district.name }}</td>
                        <td>{{ props.item.sub_district.name }}</td>
                        <td>{{ props.item.sub_district.postal_code }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn icon v-on="{ ...menu }">
                                        <v-icon dark>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item
                                        v-privilege="'wrh_rdd'"
                                        :to="`/configuration/warehouse-coverage/detail/${props.item.sub_district.id}`"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Update Warehouse Coverage</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
              </v-data-table>
        </div>
    <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>
<script>
    export default {
        name: "WarehouseDetail",
        data() {
            return {
                dataAuditLog: {},
                datas:{
                    code: '',
                    street_address: '',
                    phone_number: '',
                    area: {
                        name: ''
                    },
                    pic_name: '',
                    note: '',
                    warehouse_type: '',
                    parent_id: {
                        name: ''
                    },
                    sub_district: {
                        name: '',
                        district: {
                            name: '',
                            city: {
                                name: ''
                            }
                        },
                    },
                },
                loading:true,
                table: {
                    fields: [
                        {
                            text:'No',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Province',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'City',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'District',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Subdistrict',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Postal Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        }
                    ],
                },
                items: [
                    {
                        sub_district:{
                            id: '',
                            name: '',
                            postal_code: '',
                            district: {
                                name: '',
                                city: {
                                    name: '',
                                    province: 
                                    {
                                        name: ''
                                    }
                                }
                            }
                        }
                    }
                ],
                loading:true,
              }
        },
        methods:{
            renderData(){
                this.$http.get("/config/warehouse/"+ this.$route.params.id).then(response => {
                    this.datas = response.data.data
                    if (this.datas.warehouse_type) { // get data for glossary from detail ID
                        this.$http.get("/config/glossary?conditions=table:warehouse|attribute:warehouse_type|value_int:" + this.datas.warehouse_type)
                        .then(res => {
                            this.datas.warehouse_type = res.data.data[0].value_name
                        })
                    }
                });
            },
            renderDataCoverage(){
                this.$http.get("/config/warehouse/coverage", {params: {
                  embeds: "warehouse,subdistrict,subdistrict.district,subdistrict.district.city,subdistrict.district.city.province",
                  conditions:"warehouse_id.e:"+this.$route.params.id
                }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "warehouse"
                }
            },
        },
        created() {
            this.renderData()
            this.renderDataCoverage()
        },
    }
</script>