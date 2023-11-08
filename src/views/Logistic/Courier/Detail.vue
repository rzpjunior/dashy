<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col class="fs24 bold">
                    {{ items.name }}
                </v-col>
                <v-col cols="12" md="3" class="d-flex justify-end align-end">
                    <v-btn
                        v-if="items.status == 1"
                        elevation="0"
                        rounded
                        depressed
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                    >
                        Active
                    </v-btn>
                    <v-btn
                        v-else
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('archived')"
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
                            <v-list-item
                                v-if="items.status == 1"
                                v-privilege="'ven_upd'"
                                :to="`/logistic/courier/update/${items.id}`"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="items.status == 1">
                                <hr />
                            </div>
                            <v-list-item
                                v-privilege="'ven_arc'"
                                v-if="items.status == 1"
                                @click="archived(items.id)"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item
                                v-privilege="'ven_urc'"
                                v-if="items.status == 2"
                                @click="unarchived(items.id)"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Unarchive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div>
                                <hr />
                            </div>
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
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Code'" :value="items.code" />
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Warehouse'" :value="items.vehicle_profiles && items.vehicle_profiles.courier_vendor != null ? items.vehicle_profiles.courier_vendor.warehouse.name : ''" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Vendor'" :value="items.vehicle_profiles && items.vehicle_profiles.courier_vendor != null ? items.vehicle_profiles.courier_vendor.name : ''" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Vehicle Profile'" :value="items.vehicle_profiles ? items.vehicle_profiles.name : ''" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'License Plate'" :value="items.license_plate" />
                </v-col>
            </v-row>
        </div>
        <div class="box-title fs16 bold">
            Contact
        </div>
        <div class="box-body">
            <v-row>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Phone Number'" :value="items.phone_number" />
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Email'" :value="items.user ? items.user.email : ''" />
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
        <AuditLogNew :data="dataAuditLog" />
    </v-container>
</template>

<script>
    export default {
        name: "CourierDetail",
        data() {
            return {
                items: {
                    name: '',
                    vehicle_profiles: {
                        name: '',
                        warehouse: {
                            name: ''
                        },
                    },
                    user: {
                        email: ''
                    }
                },
                ConfirmData: {},
                dataAuditLog: {}
            }
        },
        methods: {
            archived(id) { // archive status
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Archive this Courier",
                    title: "Archive",
                    text: "Are you sure want to Archive this courier?",
                    urlApi: "/logistic/courier/archive/" + id,
                    data: {},
                    label: 'URL_2'
                }
            },
            unarchived(id) { // unarchive status
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Unarchive this Courier",
                    title: "Unarchive",
                    text: "Are you sure want to Unarchive this courier?",
                    urlApi: "/logistic/courier/unarchive/" + id,
                    data: {},
                    label: 'URL_2'
                }
            },
            renderData() { // get detail
                this.$http2.get("/logistic/courier/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                });
            },
            seeHistory() { // get history
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "courier",
                    label: 'URL_2'
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