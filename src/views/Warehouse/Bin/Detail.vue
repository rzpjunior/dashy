<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{items.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
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
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-if="items.status == 1" :to="`/warehouse/bin/update/${items.id}`" v-privilege="'bin_upd'">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="items.status == '1'"><hr/></div>
                            <v-list-item
                                v-if="items.status == 1"
                                @click="archived(items.id)"
                                v-privilege="'bin_arc'"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
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
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'BIN Name'" :value="items.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-row class="mb1">
                        <v-col >
                            <div class="text-black60">Service Time :</div>
                        </v-col>
                        <v-col>
                            <div class="d-flex justify-end">
                                <div v-if="time_generate.minutes && time_generate.seconds">
                                    {{ time_generate.minutes + ' Minutes ' + time_generate.seconds + ' Seconds ' }}
                                </div>
                                <div v-else-if="time_generate.minutes != '0' && time_generate.seconds == '0'">
                                    {{ time_generate.minutes + ' Minutes ' }}
                                </div>
                                <div v-else-if="time_generate.minutes == '0' && time_generate.seconds != '0'">
                                    {{ time_generate.seconds + ' Seconds ' }}
                                </div>
                                <div v-else>
                                    {{ '' }}
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" class="-mt10">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items.product"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.uom.name }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
        <AuditLogNew :data="dataAuditLog" />
    </v-container>
</template>

<script>
    export default {
        name: "DetailBin",
        data() {
            return {
                items: {
                    warehouse: {
                        name: ''
                    },
                    product: [
                        {
                            name: '',
                            uom: {
                                name: ''
                            }
                        }
                    ],
                    name: ''
                },
                time_generate: {
                    minutes: '',
                    seconds: ''
                },
                table: {
                    fields: [
                        {
                            text: 'No.',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: '8%'
                        },
                        {
                            text: 'Product Name',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'UOM',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                    ],
                },
                ConfirmData: {},
                dataAuditLog: {},
                vehicles: [],
                hide: true,
            }
        },
        methods: {
            archived(id) { // archive status
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Archive this BIN",
                    title: "Archive BIN",
                    text: "Are you sure want to Archive this BIN?",
                    urlApi: "/warehouse/bin/archive/" + id,
                    data: {},
                }
            },
            renderData() { // get detail
                this.$http.get("/warehouse/bin/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                    let arr = response.data.data.product
                    this.items.product = [arr]
                    if (this.items.service_time) { // convert time seconds to minutes
                        let service_time = this.$moment.duration({"seconds": this.items.service_time})
                        this.time_generate.minutes = service_time.minutes()
                        this.time_generate.seconds = service_time.seconds()
                    } 
                });
            },
            seeHistory() { // get history
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "bin",
                }
            },
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