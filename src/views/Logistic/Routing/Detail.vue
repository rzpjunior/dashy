<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <div v-if="items.status == 4">
                <v-alert
                    color="red"
                    outlined
                >
                    <v-icon color="red" class="-mt3">mdi-alert</v-icon> 
                    <span v-if="items.error_response != ''">
                        {{ items.error_response }}
                    </span>
                    <span v-else>
                        Failed Generate Routing, Please Contact the Administrator
                    </span>
                </v-alert>
            </div>
            <v-row>
                <v-col cols="12" md="9" class="fs25 bold">
                    {{items.code}}
                </v-col>
                <v-col cols="12" md="3" class="d-flex justify-end align-end">
                    <v-btn
                        v-if="items.status == 1"
                        class="only-btn mb4 mr20"
                        depressed
                        outlined
                        color="#EBEBEB"
                        small
                        @click="modalDownloadExcel(items)"
                        v-privilege="'rou_exp'"
                    >
                        <span class="text-secondary">
                            <v-icon left>
                                mdi-file-excel-outline
                            </v-icon>
                            Download
                        </span>
                    </v-btn>
                    <v-btn
                        v-if="items.status == 1"
                        elevation="0"
                        rounded
                        depressed
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                        small
                    >
                        Active
                    </v-btn>
                    <v-btn
                        v-else-if="items.status == 2"
                        elevation="0"
                        rounded
                        depressed
                        class="no-caps mb4"
                        :color="statusMaster('archived')"
                        small
                    >
                        Archived
                    </v-btn>
                    <v-btn
                        v-else-if="items.status == 3"
                        elevation="0"
                        rounded
                        depressed
                        class="no-caps mb4"
                        :color="statusMaster('on_delivery')"
                        small
                    >
                        Generating
                    </v-btn>
                    <v-btn
                        v-else-if="items.status == 4"
                        elevation="0"
                        rounded
                        depressed
                        class="no-caps mb4"
                        :color="statusMaster('cancelled')"
                        small
                    >
                        Failed
                    </v-btn>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item
                                v-if="items.status == 1"
                                v-privilege="'rou_arc'"
                                @click="archived(items.id)"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="items.status == '1'"><hr/></div>
                            <v-list-item
                                v-if="items.status == '1'"
                                @click="modalDownloadExcel(items)"
                                v-privilege="'rou_exp'"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Download</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="items.status == '1'"><hr/></div>
                            <v-list-item @click="seeHistory()">
                                <v-list-item-content>
                                    <v-list-item-title>History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mb25">
                    <DetailRowNew :name="'Delivery Date'" :value="formatDate(items.delivery_date)"/>
                </v-col>
                <v-col cols="12" md="6" v-if="items.status != 3">
                    <v-row class="mb1">
                        <v-col >
                            <div class="text-black60">Total Time to Generate :</div>
                        </v-col>
                        <v-col>
                            <div class="d-flex justify-end">
                                <div v-if="time_generate.hours != '0' && time_generate.minutes != '0'">
                                    {{String(time_generate.hours).replace('-','') + ' Hours ' + String(time_generate.minutes).replace('-','') + ' Minutes '}}
                                </div>
                                <div v-if="time_generate.hours != '0' && time_generate.minutes == '0'">
                                    {{String(time_generate.hours).replace('-','') + ' Hours '}}
                                </div>
                                <div v-if="time_generate.hours == '0' && time_generate.minutes != '0'">
                                    {{String(time_generate.minutes).replace('-','') + ' Minutes ' + String(time_generate.seconds).replace('-','') + ' Seconds '}}
                                </div>
                                <div v-if="time_generate.hours == '0' && time_generate.minutes == 0 && time_generate.seconds != '0'">
                                    {{String(time_generate.seconds).replace('-','') + ' Seconds '}}
                                </div>
                                <div v-if="items.created_at == items.response_at">
                                    0 Seconds
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Total Cost (Rp)'" :value="formatPrice(items.total_cost)"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'WRT'" :value="items.wrt" :align="true"/>
                </v-col>
                <v-col cols="12" class="-mt14">
                    <DetailRowNew :name="'Routing Note'" :value="items.routing_goal" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row>
                <v-col class="fs16 bold mb24">
                    Selected Filter Summary
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" v-if="items.status != 3 && items.status != 4">
                    <v-row>
                        <v-col cols="12" md="6" class="-mt24">
                            <DetailRowNew :name="'Total SO'" :value="items.total_sales_order"/>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <DetailRowNew :name="'Routed SO'" :value="items.routed_sales_order"/>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <DetailRowNew :name="'Dropped SO'" :value="items.dropped_sales_order"/>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <DetailRowNew :name="'Routed Branch'" :value="items.total_branch"/>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <DetailRowNew :name="'Routed Weight (KG)'" :value="items.total_weight"/>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <DetailRowNew :name="'Routed Koli'" :value="items.total_koli"/>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <DetailRowNew :name="'Routed Fragile Goods (KG)'" :value="items.total_fragile_weight"/>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" v-else>
                    <v-row>
                        <v-col>
                            <DetailRowNew :name="'Total SO'" :value="items.total_sales_order"/>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Armada Required
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="vehicles"
                :hide-default-footer="true"
                :items-per-page="-1"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>{{props.index + 1}}</td>
                        <td>{{props.item.name}}</td>
                        <td class="text-right">{{props.item.routed}}</td>
                        <td class="text-right">{{props.item.speed_factor}}</td>
                        <td></td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row>
                <v-col class="fs16 bold mb24">
                    Advanced Info
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Retase Routing'" :value="items.multi_batch == '2' ? 'OFF' : 'ON'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'COD Skill'" :value="items.enable_cod == '2' ? 'OFF' : 'ON'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Service Time (Minutes)'" :value="service_time"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Setup Time (Minutes)'" :value="setup_time"/>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
        <AuditLogNew :data="dataAuditLog" />
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    export default {
        name: "RoutingDetail",
        data() {
            return {
                overlay: false,
                items: {
                    warehouse: {
                        name: ''
                    }
                },
                ConfirmData: {},
                dataAuditLog: {},
                vehicles: [],
                hide: true,
                time_generate: {
                    hours: '',
                    minutes: '',
                    seconds: ''
                },
                service_time: '',
                setup_time: '',
                table: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '5px'
                        },
                        {
                            text: 'Vehicle Profile',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Vehicle Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '30%',
                            align: "right"
                        },
                        {
                            text: 'Speed Factor',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '30%',
                            align: "right"
                        },
                        {
                            sortable: false,
                            width: '10%'
                        },
                    ]
                },
            }
        },
        methods: {
            archived(id) { // archive status
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Archive this Routing",
                    title: "Archive Routing",
                    text: "Are you sure want to Archive this Routing?",
                    urlApi: "/logistic/routing/archive/" + id,
                    data: {},
                    label: 'URL_2'
                }
            },
            renderData() { // get detail
                this.$http2.get("/logistic/routing/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                    this.vehicles = response.data.data.available_vehicles
                    let service_time = this.$moment.duration({"seconds": this.items.service_time}).asMinutes() // convert seconds to minutes
                    let setup_time = this.$moment.duration({"seconds": this.items.setup_time}).asMinutes() // convert seconds to minutes
                    let start = this.$moment(this.items.created_at).format("DD/MM/YYYY HH:mm:ss") // Initiate created_at
                    let finish = this.$moment(this.items.response_at).format("DD/MM/YYYY HH:mm:ss") // Initiate response_at
                    let ms = this.$moment(finish,"DD/MM/YYYY HH:mm:ss").diff(this.$moment(start,"DD/MM/YYYY HH:mm:ss")); // Calculate the time
                    let d = this.$moment.duration(ms); // get total from calculate
                    this.time_generate = d
                    this.service_time = service_time // rendering calculate seconds to minutes
                    this.setup_time = setup_time // rendering calculate seconds to minutes
                    this.time_generate.hours = d.hours() // get hours
                    this.time_generate.minutes = d.minutes() // get minutes
                    this.time_generate.seconds = d.seconds() // get seconds
                });
            },
            seeHistory() { // get history
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "routing",
                    label: 'URL_2'
                }
            },
            modalDownloadExcel(d) { // download excel per indeks
                this.overlay = true
                this.$http2.get("/report/tms/routing-detail?export=1", {
                    params: {
                        code: d.code
                    }
                })
                .then(response => {
                    this.overlay = false
                    window.location.href = response.data.file
                })
                .catch(error => {
                    this.overlay = false
                })
            }
        },
        mounted() { // mounted pesan error
            let self = this
            this.$root.$on('event_success', function(res) {
                if (res) {
                    self.renderData()
                }
            });
        },
        created() { // initial render data
            this.renderData()
        },
    }
</script>