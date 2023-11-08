<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col class="fs24 bold">
                    {{ items.name }}
                </v-col>
                <v-col class="d-flex justify-end align-end">
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
                                v-privilege="'vhp_upd'"
                                :to="`/logistic/vehicle-profiles/update/${items.id}`"
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
                                v-privilege="'vhp_arc'"
                                v-if="items.status == 1"
                                @click="archived(items.id)"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item
                                v-privilege="'vhp_urc'"
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
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Code'" :value="items.code" />
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Vendor'" :value="items.courier_vendor == null ? '' : items.courier_vendor.name " />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.courier_vendor == null ? '' : items.courier_vendor.warehouse.name " />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Routing Profile'" :value="items.routing_profile.value_name == 'car' ? 'Highway' : 'No Highway'" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Max Koli'" :value="items.max_koli" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Max Weight (KG)'" :value="items.max_weight" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Max Fragile Goods (KG)'" :value="items.max_fragile" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Max Available Vehicles'" :value="items.max_available_vehicle" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Initial Location Cost (Rp)'" :value="formatPrice(items.initial_cost)" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Subsequent Location Cost (Rp)'" :value="formatPrice(items.subsequent_cost)" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Speed Factor'" :value="items.speed_factor" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Skills'" :value="items.skills" />
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
        <AuditLogNew :data="dataAuditLog" />
    </v-container>
</template>

<script>
    export default {
        name: "VendorDetail",
        data() {
            return {
                items: {
                    name: {},
                    routing_profile: {
                        value_name: {}
                    },
                    courier_vendor: {
                        name: '',
                        warehouse: {
                            name: {}
                        }
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
                    statusMsg: "Success to Archive this Vendor",
                    title: "Archive",
                    text: "Are you sure want to Archive this vendor?",
                    urlApi: "/logistic/vehicle_profiles/archive/" + id,
                    data: {},
                    label: 'URL_2'
                }
            },
            unarchived(id) { // unarchive status
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Unarchive this Vendor",
                    title: "Unarchive",
                    text: "Are you sure want to Unarchive this vendor?",
                    urlApi: "/logistic/vehicle_profiles/unarchive/" + id,
                    data: {},
                    label: 'URL_2'
                }
            },
            renderData() { // get detail
                this.$http2.get("/logistic/vehicle_profiles/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                });
            },
            seeHistory() { // get history
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "vehicle_profiles",
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