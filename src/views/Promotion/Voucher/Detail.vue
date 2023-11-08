<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col>
                    <div class="img-voucher" v-if="item.voucher_content">
                        <v-img
                            class="rounded-form"
                            height="180"
                            width="360"
                            :src="item.voucher_content.image_url"
                        ></v-img>
                    </div>
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        v-if="item.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                    >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="item.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('archived')"
                    >
                        Archived
                    </v-btn>
                    <div class="mx-3"></div>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-if="item.status == 1" @click="archived(item.id)" v-privilege="'vou_arc'">
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="item.status == 1">
                                <hr/>
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
                    <DetailRowNew :name="'Redeem Code'" :value="item.redeem_code? item.redeem_code : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Start Timestamp'" :value="item.start_timestamp | moment('DD/MM/YYYY HH:mm:ss')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Voucher Type'" :value="item.type === 1 ? 'Total Discount' : item.type === 2 ? 'Grand Total Discount' : item.type === 3 ? 'Delivery Discount' : 'Extra EdenPoint'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'End Timestamp'" :value="item.end_timestamp | moment('DD/MM/YYYY HH:mm:ss')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Name'" :value="item.name? item.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Overall Quota'" :value="item.overall_quota? item.overall_quota : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="item.area.name? item.area.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Remaining Overall Quota'" :value="item.rem_overall_quota? item.rem_overall_quota : '-' "/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Business Type'" :value="item.archetype.business_type.name? item.archetype.business_type.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Quota per User'" :value="item.user_quota? item.user_quota : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Archetype'" :value="item.archetype.name? item.user_quota : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Minimum Order Amount'" :value="'Rp '+ formatPrice(item.min_order)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer Tag'" :value="item.tag_customer_name ? item.tag_customer_name:'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Voucher Amount'" :value="'Rp '+ formatPrice(item.disc_amount)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer Name'" :value="item.merchant ? item.merchant.code +' - ' + item.merchant.name :'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Membership Level'" :value="item.membership_level ? item.membership_level.name :'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Membership Lapak'" :value="item.membership_checkpoint ? item.membership_checkpoint.checkpoint :'-'"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Order Channel'" :value="item.channel_voucher? item.channel_voucher : '-'" :align="true"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="item.note? item.note : '-'" :align="true"/>
                </v-col>
                <v-col cols="12" v-if="item.voucher_content" class="-mt24">
                    <DetailRowNew :name="'Term & Condition'" :value="item.voucher_content ? item.voucher_content.term_conditions :'-'" :align="true" />
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table" v-if="item.voucher_items">
            Products
        </div>
        <div class="box-body-table" v-if="item.voucher_items">
            <v-data-table
                :headers="table.fields"
                :items="item.voucher_items"
                :hide-default-footer="true"
                :items-per-page="-1"
                class="mx-6"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.min_qty_disc) }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>
<script>
    import DetailRow from "../../../components/com/DetailRow";

    export default {
        name: "VoucherDetail",
        components: {DetailRow},
        data() {
            return {
                ConfirmData: "",
                dataAuditLog: {},
                loading: true,
                table: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Product Name',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Minimal Qty',
                            class: 'grey--text text--darken-4',
                            width: "12%",
                            sortable: false,
                            align: "center"
                        }
                    ],
                },
                item: {
                    redeem_code: '',
                    name: '',
                    area: {
                        name: '',
                    },
                    archetype: {
                        name: '',
                        business_type: {
                            name: ''
                        }
                    },
                    voucher_content: {
                        image_url: '',
                        term_conditions: ''
                    },
                    merchant: {
                        name: '',
                        code: ''
                    },
                    start_timestamp: '',
                    end_timestamp: '',
                    overall_quota: '',
                    user_quota: '',
                    min_order: '',
                    disc_amount: '',
                    voucher_item: [],
                    term_conditions: '',
                    image_url: '',
                    mobile_voucher: '',
                },
                modalOpen: false,
            }
        },
        methods: {
            async renderData() {
                await this.$http.get("/promotion/voucher/" + this.$route.params.id).then(response => {
                    this.item = response.data.data;
                    this.loading = false
                });
            },
            archived(id) {
                this.ConfirmData = {
                    model: true,
                    statusMsg: "Success to Archive this Voucher",
                    title: "Archive Voucher",
                    nextPage: "/promotion/voucher",
                    text: "Are you sure want to Archive this Voucher?",
                    urlApi: '/promotion/voucher/archive/' + id,
                    data: {}
                }
            },
            seeHistory() {
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "voucher"
                }
            },
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function (res) {
                if (res) {
                    self.renderData()
                }
            });
        },

    }
</script>