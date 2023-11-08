<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
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
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-if="item.status == 1 && currentDatetime < item.end_timestamp" @click="archived(item.id)" v-privilege="'sku_dsc_arc'">
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="item.status == 1 && currentDatetime < item.end_timestamp" v-privilege="'sku_dsc_arc'">
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
                    <DetailRowNew :name="'Promotion Name'" :value="item.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Division'" :value="item.division.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Start Time'" :value="item.start_timestamp | moment('DD/MM/YYYY HH:mm:ss')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'End Time'" :value="item.end_timestamp | moment('DD/MM/YYYY HH:mm:ss')"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Price Set'" :value="item.price_set_name" :align="true" />
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Order Channel'" :value="item.order_channel_name" :align="true" />
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="item.note" :align="true" />
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            <v-row>
                <v-col class="flex-justify-center">
                    Products
                </v-col>
                <v-col>
                    <div class="flex-align-end">
                        <v-btn
                            @click="openTier = false"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="only-btn"
                            v-if="openTier"
                            style="width: 180px;"
                        >
                            <span class="text-white" >Hide All Tier <v-icon class="ml16">mdi-eye-off</v-icon></span>
                        </v-btn>
                        <v-btn
                            @click="openTier = true"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="only-btn"
                            v-else
                            style="width: 180px;"
                        >
                            <span class="text-white" >Show All Tier <v-icon class="ml16">mdi-eye</v-icon></span>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="item.sku_discount_item"
                :hide-default-footer="true"
                :items-per-page="-1"
                class="mx-6"
            >
                <template v-slot:item="props">
                    <tr style="height:48px; vertical-align:unset">
                        <td><div class="mt8 mb8"> {{ props.index + 1 }}</div></td>
                        <td>{{ props.item.product.name }}</td>
                        <td class="center">{{ props.item.product.uom.name }}</td>
                        <td> 
                            <div v-for="(tier, index) in props.item.sku_discount_item_tier" :key="tier.id">
                                <div v-if="openTier"> <div class="mt4 mb4"> {{ tier.tier_level }}</div></div>
                                <div v-else-if="index == 0">{{ tier.tier_level }}</div>
                            </div> 
                        </td>
                        <td class="right"> 
                            <div v-for="(tier, index) in props.item.sku_discount_item_tier" :key="tier.id">
                                <div v-if="openTier"><div class="mt4 mb4 right"> {{ formatPrice(tier.minimum_qty) }}</div></div>
                                <div v-else-if="index == 0" class="right">{{ formatPrice(tier.minimum_qty) }}</div>
                            </div> 
                        </td>
                        <td class="right"> 
                            <div v-for="(tier, index) in props.item.sku_discount_item_tier" :key="tier.id">
                                <div v-if="openTier"><div class="mt4 mb4 right"> {{ formatUnitPrice(tier.disc_amount) }}</div></div>
                                <div v-else-if="index == 0" class="right">{{ formatUnitPrice(tier.disc_amount) }}</div>
                            </div> 
                        </td>
                        <td class="right">{{ formatUnitPrice(props.item.overall_quota) }}</td>
                        <td class="right">{{ formatUnitPrice(props.item.rem_overall_quota) }}</td>
                        <td class="right">{{ props.item.overall_quota_per_user > 0? formatUnitPrice(props.item.overall_quota_per_user):"-" }}</td>
                        <td class="right">{{ props.item.daily_quota_per_user > 0? formatUnitPrice(props.item.daily_quota_per_user):"-" }}</td>
                        <td class="right">{{ props.item.budget > 0? formatPrice(props.item.budget):"-" }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>
<script>
    export default {
        name: "SKUDiscountDetail",
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
                            width: "5%"
                        },
                        {
                            text: 'Product Name',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: "20%"
                        },
                        {
                            text: 'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Tier',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Minimum Qty',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text: 'Amount',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text: 'Overall Quota (Qty)',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text: 'Remaining Overall Quota (Qty)',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text: 'Quota Per User (Qty)',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text: 'Daily Quota Per User (Qty)',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text: 'Budget (IDR)',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                    ],
                },
                item: {
                    status:'',
                    name: '',
                    start_timestamp: '',
                    end_timestamp: '',
                    division: {
                        name: '',
                    },
                    order_channel: '',
                    order_channel_str: [],
                    price_set:'',
                    price_set_name: [],
                    note: '',
                    discount_item:[
                        {
                            product_id: {
                                name: '',
                                uom: {
                                    name: '',
                                },
                            },
                            discount_item_tier:[
                                {
                                    tier_level: '',
                                    minimum_qty: '',
                                    amount: '',
                                }
                            ]
                        }
                    ],
                    overall_quota: '',
                    rem_overall_quota: '',
                    daily_quota_per_user: '',
                    overall_quota_per_user: '',
                },
                currentDatetime : this.$moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
                openTier: false,
            }
        },
        methods: {
            // get detail data sku discount
            async renderData() {
                await this.$http.get("/promotion/sku_discount/" + this.$route.params.id).then(response => {
                    this.item = response.data.data;
                    this.loading = false
                });
            },
            // for achive sku discount
            archived(id) {
                this.ConfirmData = {
                    model: true,
                    statusMsg: "Success to Archive this SKU Discount",
                    title: "Archive SKU Discount",
                    nextPage: "/promotion/sku-discount",
                    text: "Are you sure want to Archive this SKU Discount?",
                    urlApi: '/promotion/sku_discount/archive/' + id,
                    data: {}
                }
            },
            // get history data
            seeHistory() {
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "sku_discount"
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