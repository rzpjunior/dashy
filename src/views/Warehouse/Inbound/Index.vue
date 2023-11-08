<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb24">
                <v-col cols="12">Filter</v-col>
                <v-col cols="12" md="3">
                    <v-select
                        v-model="type"
                        :items="types"
                        item-text="text"
                        item-value="value"
                        outlined
                        name="filter_type"
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                    <v-menu
                        ref="menu"
                        v-model="inbound_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    @click:clear="inbound_date = [],inbound_date_input = ''"
                                    v-model="inbound_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        ETA Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="inbound_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="inbound_date_model = false,renderData()"
                            >OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row class="hr-title mb24"/>
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            >
                            </v-text-field>
                        </template>
                    <span>Search by Code</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="3" class="h70">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        label="Warehouse Destination"
                        name="filter_warehouse"
                        :warehouse="warehouse"
                        @selected="warehouseSelected"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table hidden-sm-and-down">
            <v-row>
                <v-col cols="3">
                    <b>Inbound Type Code</b>
                </v-col>
                <v-col cols="1">
                    <b>Total Product</b>
                </v-col>
                <v-col cols="1">
                    <b>Delivery Qty</b>
                </v-col>
                <v-col cols="1">
                    <b>{{switcherRejectReason()}}</b>
                </v-col>
                <v-col cols="1">
                    <b>Total Receive</b>
                </v-col>
                <v-col cols="1">
                    <b>Note</b>
                </v-col>
                <v-col cols="1">
                    <b>{{switcherStockType()}}</b>
                </v-col>
                <v-col cols="3">
                    <b>Goods Receipt</b>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table hidden-sm-and-down">
            <v-progress-circular
                v-if="isLoadingList"
                :size="20"
                indeterminate
                color="#50ABA3"
                class="loadingSpinner"
            />
            <div v-else>
                <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(item,i) in list"
                        :key="i"
                        @click="fetchData(item)"
                    >
                        <v-expansion-panel-header class="-mb22 -mt5">
                            <v-row>
                                <v-col cols="3">
                                    {{item.code}}
                                    <br><br>
                                    <p class="grey--text">{{item.target}}</p>
                                </v-col>
                                <v-col cols="1">
                                    {{item.total_product}} 
                                    <br><br>
                                    <p class="grey--text">{{item.size_product}}</p>
                                </v-col>
                                <v-col cols="1" class="pl20">
                                    {{formatPrice(item.total_delivery)}}
                                </v-col>
                                <v-col cols="1">
                                    {{type === 'purchase_order' ? formatPrice(item.total_reject) : ''}}
                                </v-col>
                                <v-col cols="1" class="pl20">
                                    {{item.total_product}} 
                                    <br><br>
                                    <p class="grey--text">{{item.total_receive}} KG</p>
                                </v-col>
                                <v-col cols="1" class="pl20">
                                    {{item.note}}
                                </v-col>
                                <v-col cols="1" class="pl30">
                                    {{type === 'goods_transfer' ? item.stock_type == 2 ? 'Waste Stock' : 'Good Stock' : ''}}
                                </v-col>
                                <v-col cols="3" class="pl36">
                                    <span class="goodReceiptCode" @click="redirectGRDetail(item.goods_receipt_id)">{{item.goods_receipt_code}}</span>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-progress-circular
                                v-if="isLoadingItems"
                                :size="20"
                                indeterminate
                                color="#50ABA3"
                                class="loadingSpinner"
                            />
                            <div v-else>
                                <v-data-table
                                    :mobile-breakpoint="0"
                                    :items="form.items"
                                    :hide-default-footer="true"
                                    :items-per-page="-1"
                                    :headers="headers"
                                    :class="form.items.length <= 0 ? 'hidden' : ''"
                                >
                                    <template v-slot:item="props">
                                        <tr style="height:48px">
                                            <td class="flex flex-wrap">
                                                <v-row>
                                                    <v-col cols="12">{{(props.index+1)}}. {{props.item.product_code}} - {{props.item.product_name}}</v-col>
                                                </v-row>
                                            </td>
                                            <td>{{ props.item.request_order_qty }} {{props.item.uom}}</td>
                                            <td class="w5">
                                                <vue-numeric
                                                    :name="`deliver_qty${props.index}`"
                                                    placeholder="0,00"
                                                    :class="errDeliveryQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                                    separator="."
                                                    :precision="2"
                                                    v-model="props.item.delivery_qty"
                                                    :disabled="isBeingCreated || isBeingUpdated ? false : true"
                                                    @change="handleTotalReceive(), handleTotalDelivery(), handleTotalReject(), handleReason(props.index)"
                                                ></vue-numeric>
                                                <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errDeliveryQtyMsg(props.index)}}</div>
                                            </td>
                                            <td class="w5">
                                                <vue-numeric
                                                    :name="`reject_qty${props.index}`"
                                                    placeholder="0"
                                                    :class="errReject(props.index) ? 'productNumeric' : 'productNumericErr'"
                                                    separator="."
                                                    :precision="2"
                                                    v-model="props.item.reject_qty"
                                                    :disabled="isBeingCreated || isBeingUpdated ? false : true"
                                                    :hidden="type === 'purchase_order' ? false : true"
                                                    @change="handleTotalReceive(), handleTotalDelivery(), handleTotalReject()"
                                                ></vue-numeric>
                                                <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errRejectMsg(props.index)}}</div>
                                                <SelectGlossary
                                                    v-model="props.item.reject_reason"
                                                    :rejectReason="props.item.reject_reason"
                                                    :dense="true"
                                                    label="Reason"
                                                    class="mt-6 rounded-form-sm"
                                                    :error="errRejectReasonMsg(props.index)"
                                                    v-show="type === 'goods_transfer' ? handleRejectReason(props.item, props.index) : false"
                                                    :disabled="isBeingCreated || isBeingUpdated ? false : true"
                                                    @selected="reasonSelected"
                                                    table="goods_receipt_item"
                                                    attribute="reject_reason"
                                                    @click.native="handleSelectedIndex(props.index, props.item)"
                                                ></SelectGlossary>
                                            </td>
                                            <td class="w5">
                                                {{formatPrice(handleReceiveQty(props.item))}} {{props.item.uom}}<br>
                                                <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errReceiveMsg(props.index)}}</div>
                                            </td>
                                            <td>
                                                <v-text-field
                                                    :name="`note_${props.index}`"
                                                    placeholder="Note"
                                                    outlined
                                                    class="mt-6 rounded-form-sm mb-20"
                                                    v-model="props.item.note"
                                                    dense
                                                    :disabled="isBeingCreated || isBeingUpdated ? false : true"
                                                />
                                            </td>
                                            <td></td>
                                        </tr>
                                    </template>
                                </v-data-table>
                                <v-row>
                                    <v-col cols="12">
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                depressed
                                                color="#50ABA3"
                                                :class="createStatus ? 'no-caps bold' : 'hidden'"
                                                @click="createGR()"
                                                :hidden="true"
                                            >
                                                <span class="text-white">Create Goods Receipt</span>
                                            </v-btn>
                                            <v-btn
                                                depressed
                                                outlined
                                                color="#EBEBEB"
                                                :class="updateStatus ? 'no-caps bold' : 'hidden'"
                                                @click="updateGR()"
                                            >
                                                <span class="updateGRButton">Update Goods Receipt</span>
                                            </v-btn>
                                            <v-btn
                                                depressed
                                                outlined
                                                color="#EBEBEB"
                                                :class="isBeingCreated || isBeingUpdated ? 'main-btn' : 'hidden'"
                                                @click="openModalDiscard"
                                            >
                                                <span class="text-black80">Cancel</span>
                                            </v-btn>
                                            <v-btn
                                                depressed
                                                color="#50ABA3"
                                                :class="isBeingCreated || isBeingUpdated ? 'main-btn white--text' : 'hidden'"
                                                @click="confirmData"
                                            >
                                                Save
                                            </v-btn>
                                        </v-card-actions>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-row v-if="list.length <= 0">
                    <v-col cols="12" class="text-center mt36 mb36">No Data Available</v-col>
                </v-row>
            </div>
        </div>
        <div class="box-start hidden-md-and-up">
            <v-expansion-panels>
                <v-expansion-panel
                    v-for="(item,i) in list"
                    :key="i"
                    @click="fetchData(item)"      
                >
                    <v-expansion-panel-header class="mobileCollapseHeader">
                        <v-col cols="12">
                            {{item.code}}
                            <br><br>
                            <p class="grey--text">{{item.target}}</p>
                            <p class="goodReceiptCode">{{item.gr}}</p>
                            <span class="goodReceiptCode">{{item.goods_receipt_code}}</span>
                        </v-col>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-progress-circular
                            v-if="isLoadingItems"
                            :size="20"
                            indeterminate
                            color="#50ABA3"
                            class="loadingSpinner mb24 mt24"
                        />
                        <div v-else>
                            <v-row :class="form.items.length <= 0 ? 'hidden' : 'pa-4'">
                                <v-col cols="6">
                                    <b>Total Product</b><br>
                                    {{item.total_product}}<br>
                                    <p class="grey--text">{{item.size_product}}</p>
                                </v-col>
                                <v-col cols="6">
                                    <b>Total Receive</b><br>
                                    {{item.total_product}}<br>
                                    <p class="grey--text">{{item.total_receive}} KG</p>
                                </v-col>
                                <v-col cols="6">
                                    <b>Deliver Qty</b><br>
                                    {{formatPrice(item.total_delivery)}}
                                </v-col>
                                <v-col cols="6" :hidden="type === 'purchase_order' ? false : true">
                                    <b>Reject Qty</b><br>
                                    {{type === 'purchase_order' ? formatPrice(item.total_reject) : ''}}
                                </v-col>
                                <v-col cols="6" :hidden="type === 'goods_transfer' ? false : true">
                                    <b>Stock Type</b><br>
                                    {{type === 'goods_transfer' ? item.stock_type == 2 ? 'Waste Stock' : 'Good Stock' : ''}}
                                </v-col>
                                <v-col cols="12">
                                    <table class="tableProductCard">
                                        <tr>
                                            <td><b>Note</b></td>
                                            <td class="tdGRProductItemCreate">{{item.note}}</td>
                                        </tr>
                                    </table>
                                </v-col>
                            </v-row>
                            <v-expansion-panels :class="form.items.length <= 0 ? 'hidden' : ''">
                                <v-expansion-panel
                                    v-for="(item,i) in form.items"
                                    :key="i"
                                >
                                    <v-expansion-panel-header>
                                        <div class="productCardTitle"><span class="productCardIndex">{{i+1}}</span></div>{{item.product_code}} - {{item.product_name}}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row class="ml2 mr2">
                                            <v-col cols="12">
                                                <table class="tableProductCard">
                                                    <tr>
                                                        <td><b>Product Qty</b></td>
                                                        <td class="tdGRProductItemCreate">{{item.request_order_qty}} {{item.uom}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><b>Receive Qty</b></td>
                                                        <td class="tdGRProductItemCreate">{{ formatPrice(handleReceiveQty(item))}} {{item.uom}}</td>
                                                    </tr>
                                                </table><br>
                                                <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errReceiveMsg(i)}}</div>
                                            </v-col>
                                            <v-col :cols="type === 'purchase_order' ? 6 : 12">
                                                <label><b>Delivery Qty</b><span class="text-red">*</span></label>
                                                <vue-numeric
                                                    :name="`deliver_qty${i}`"
                                                    placeholder="0,00"
                                                    :class="errDeliveryQty(i) ? 'productNumeric -ml2' : 'productNumericErr -ml2'"
                                                    separator="."
                                                    :precision="2"
                                                    v-model="item.delivery_qty"
                                                    :disabled="isBeingCreated || isBeingUpdated ? false : true"
                                                    @change="handleTotalReceive(), handleTotalDelivery(), handleTotalReject(), handleReason(i)"
                                                ></vue-numeric>
                                                <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errDeliveryQtyMsg(i)}}</div>
                                            </v-col>
                                            <v-col cols="6" :hidden="type === 'purchase_order' ? false : true">
                                                <label><b>Reject Qty</b><span class="text-red">*</span></label>
                                                <vue-numeric
                                                    :name="`reject_qty${i}`"
                                                    placeholder="0"
                                                    :class="errReject(i) ? 'productNumeric -ml2' : 'productNumericErr -ml2'"
                                                    separator="."
                                                    :precision="2"
                                                    v-model="item.reject_qty"
                                                    :disabled="isBeingCreated || isBeingUpdated ? false : true"
                                                    @change="handleTotalReceive(), handleTotalDelivery(), handleTotalReject()"
                                                ></vue-numeric>
                                                <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errRejectMsg(i)}}</div>
                                            </v-col>
                                            <v-col cols="12" :hidden="type === 'goods_transfer' ? false : true">
                                                <SelectGlossary
                                                    v-model="item.reject_reason"
                                                    :rejectReason="item.reject_reason"
                                                    :dense="true"
                                                    label="Reason"
                                                    class="rounded-form-sm"
                                                    :error="errRejectReasonMsg(i)"
                                                    v-show="type === 'goods_transfer' ? handleRejectReason(item, i) : false"
                                                    :disabled="isBeingCreated || isBeingUpdated ? false : true"
                                                    @selected="reasonSelected"
                                                    table="goods_receipt_item"
                                                    attribute="reject_reason"
                                                    @click.native="handleSelectedIndex(props.index, props.item)"
                                                ></SelectGlossary>
                                            </v-col>
                                            <v-col cols="12" class="-mt24">
                                                <label><b>Note</b></label>
                                                <v-text-field
                                                    :name="`note_${i}`"
                                                    placeholder="Note"
                                                    outlined
                                                    class="rounded-form-sm mb-20"
                                                    v-model="item.note"
                                                    dense
                                                    :disabled="isBeingCreated || isBeingUpdated ? false : true"
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                            <v-row :class="form.items.length > 0 ? 'hidden' : ''">
                                <v-col cols="12" class="pl30">Changes are being made to this document. Please refresh to reload the document</v-col>
                                <v-col cols="12" class="pl30">
                                    <v-btn
                                        depressed
                                        outlined
                                        color="#EBEBEB"
                                        class="no-caps mr4"
                                        @click="fetchData(item)"
                                    >
                                        <span class="text-black80">
                                            <v-icon left>mdi-refresh</v-icon>
                                            <b>Refresh Data</b>
                                        </span>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            depressed
                                            color="#50ABA3"
                                            :class="createStatus ? 'no-caps bold' : 'hidden'"
                                            @click="createGR()"
                                            :hidden="true"
                                        >
                                            <span class="text-white">Create GR</span>
                                        </v-btn>
                                        <v-btn
                                            depressed
                                            outlined
                                            color="#EBEBEB"
                                            :class="updateStatus ? 'no-caps bold' : 'hidden'"
                                            @click="updateGR()"
                                        >
                                            <span class="updateGRButton">Update GR</span>
                                        </v-btn>
                                        <v-btn
                                            depressed
                                            outlined
                                            color="#EBEBEB"
                                            :class="isBeingCreated || isBeingUpdated ? 'main-btn' : 'hidden'"
                                            @click="openModalDiscard"
                                        >
                                            <span class="text-black80">Cancel</span>
                                        </v-btn>
                                        <v-btn
                                            depressed
                                            color="#50ABA3"
                                            :class="isBeingCreated || isBeingUpdated ? 'main-btn white--text' : 'hidden'"
                                            @click="confirmData"
                                        >
                                            Save
                                        </v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
        <v-dialog
                v-model="discardModalIsOpen"
                persistent
                max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Alert in {{isBeingCreated ? 'Create' : 'Update'}} Goods Receipt</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Are you sure to close the row or filtering the data ?</span>
                    <span class="fs16 mt-1">Data that has been inputted will not be saved</span>
                    <v-card-actions class="pb-4">
                        <v-spacer></v-spacer>
                            <v-btn
                                depressed
                                outlined
                                color="#EBEBEB"
                                class="main-btn"
                                @click="discardGR"
                            >
                                <span class="text-black80">Yes</span>
                            </v-btn>
                            <v-btn
                                class="main-btn white--text"
                                depressed
                                color="#50ABA3"
                                @click="closeModalDiscard"
                            >
                                No
                            </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="refreshData"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title><span class="text-title-modal">Refresh Data</span></v-card-title>
                <v-card-text><span class="fs16 mt-1">There's an updated data on this document, are you want to Refresh the Page ?</span></v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="closeModalRefreshData"
                    ><span class="text-black80">No</span></v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="fetchData(selectedPOGT)"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData" @refresh="refreshGR"/>
    </v-container>
</template>

<script>
    export default {
        name: 'Inbound',
        data() {
            return {
                type: 'purchase_order',
                types: [
                    {
                        text:'Purchase Order',
                        value:'purchase_order'
                    },
                    {
                        text:'Goods Transfer',
                        value:'goods_transfer'
                    },
                ],
                isLoadingList: false,
                list: [],
                isLoadingItems: false,
                form: {
                    area_id: '',
                    warehouse_id: '',
                    inbound_id: '',
                    inbound_type: '',
                    note: '',
                    ata_date: '',
                    ata_time: '',
                    pogt: '',
                    updated_at_gr: '',
                    updated_at_pogt: '',
                    items: []
                },
                selectedPOGT: [],
                search: '',
                inbound_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                inbound_date_model : '',
                inbound_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                headers: [
                    { text:'Product', class: 'grey--text text--darken-4', width: '25%', sortable: false},
                    { text:'Product Qty', class: 'grey--text text--darken-4', width: '8%', sortable: false},
                    { text:'Delivery Qty', class: 'grey--text text--darken-4', width: '8%', sortable: false},
                    { text:'', class: 'grey--text text--darken-4', width: '8%', sortable: false},
                    { text:'Receive Qty', class: 'grey--text text--darken-4', width: '8%', sortable: false},
                    { text:'Note', class: 'grey--text text--darken-4', width: '16%', sortable: false},
                    { width: '25%', sortable: false},
                ],
                createStatus: false,
                updateStatus: false,
                isBeingCreated: false,
                isBeingUpdated: false,
                discardModalIsOpen: false,
                discardData: {},
                reject_reason: [],
                ConfirmData: {},
                error: {},
                glossaryIdx: null,
                refreshData: false,
                SelectWarehouse: '',
                warehouse: '',
            }
        },
        async mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
            await self.renderData()
            await self.getWarehouse()
        },
        computed:{
            //to get staff id
            staff() {
                return this.$store.getters.getStaff
            },
        },
        methods: {
            async renderData() { // fetch inbound list
                this.isLoadingList =  true
                this.list = []
                let eta_date = '' 
                if (this.inbound_date.length > 0) {
                    if (this.inbound_date.length == 1) {
                        eta_date = '|eta_date:'+this.inbound_date[0]
                    } else {
                        let date = this.inbound_date[0]
                        let date2 = this.inbound_date[1]
                        if (date > date2) {
                            eta_date = '|eta_date.gte:'+date2+'|eta_date.lte:'+date
                        } else {
                            eta_date = '|eta_date.gte:'+date+'|eta_date.lte:'+date2
                        }
                    }
                }
                await this.$http.get(this.handleURLandEmbedsByType('url'),{params:{
                    perpage:1000,
                    embeds:this.handleURLandEmbedsByType('embeds'),
                    conditions:this.handleConditions()+eta_date,
                    orderby:"-id",
                    is_inbound:"1",
                }}).then(response => {
                    if(response.data.data){
                        if (this.type === 'purchase_order') {
                            response.data.data.map((e) => {
                                this.list.push({
                                    id: e.id,
                                    code: e.code,
                                    target: e.supplier.name,
                                    total_product: e.total_sku + ' Product',
                                    total_delivery: 0,
                                    size_product: e.total_weight.toString() + ' KG',
                                    total_receive: 0,
                                    total_reject: 0,
                                    note: e.note,
                                    goods_receipt_id: this.chooseGoodsReceiptID(e.goods_receipt),
                                    goods_receipt_code: this.chooseGoodsReceiptCode(e.goods_receipt)
                                })
                            })
                        } else {
                            response.data.data.map((e) => {
                                this.list.push({
                                    id: e.id,
                                    code: e.code,
                                    target: e.origin.name,
                                    total_product: e.total_sku + ' Product',
                                    total_delivery: 0,
                                    size_product: e.total_weight.toString() + ' KG',
                                    total_receive: 0,
                                    total_reject: 0,
                                    note: e.note,
                                    goods_receipt_id: this.chooseGoodsReceiptID(e.goods_receipt),
                                    goods_receipt_code: this.chooseGoodsReceiptCode(e.goods_receipt),
                                    stock_type: e.stock_type
                                })
                            })
                        }
                    }
                    if(response.data.data === null){
                        this.list = []
                    }
                });
                this.isLoadingList =  false
            },
            GRStatus(item) { // set gr status
                if (item.gr) {
                    return item.gr
                } 
                return ''
            },
            switcherRejectReason() { // switch reject or reason title based on inbound type
                if (this.type === 'goods_transfer') {
                    this.headers[3].text = ''
                    return 'Reason'
                } else if (this.type === 'purchase_order') {
                    this.headers[3].text = 'Reject Qty'
                    return 'Reject Qty'
                } else {
                    return ''
                }
            },
            switcherStockType() { // chage table header to Stock Type if type is goods_transfer
                if (this.type === 'goods_transfer') {
                    return 'Stock Type'
                } else {
                    return ''
                }
            },
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search)
            },
            getWarehouse() {
            this.loaded = false
            this.$http.get("/user/staff/" + this.staff.id)
                .then(response => {
                    let dataWr = response.data.data
                    this.warehouse = dataWr.warehouse
                });
            },
            resetData() { // Reset before load PO / GT
                this.error = {}
                this.createStatus = false
                this.isBeingCreated = false
                this.updateStatus = false
                this.isBeingUpdated = false
                this.selectedPOGT = []
                this.form = {
                    area_id: '',
                    warehouse_id: '',
                    inbound_id: '',
                    inbound_type: '',
                    note: '',
                    ata_date: '',
                    ata_time: '',
                    items: []
                }
            }, 
            async fetchData(item) { // Fetch PO / GT
                this.isLoadingItems = true
                this.refreshData = false
                this.resetData()
                let res = []
                let url = item.goods_receipt_id === null ? this.handleURLandEmbedsByType('url') : '/warehouse/goods/receipt'
                let idURL = item.goods_receipt_id === null ? item.id : item.goods_receipt_id
                await this.$http.get(url+'/'+idURL).then(response => {
                    res = response.data.data
                    if (item.goods_receipt_id === null) {
                        this.form.inbound_id = res.id
                        this.form.inbound_type = this.type
                        this.form.note =  res.note
                        if (this.type === 'purchase_order') {
                            this.form.area_id = res.warehouse.area.id
                            this.form.warehouse_id = res.warehouse.id
                            this.form.ata_date =  ''
                            this.form.ata_time = ''
                            this.form.pogt = res.id
                            this.form.updated_at_pogt = res.updated_at
                            res.purchase_order_items.map((e) => {
                                this.form.items.push({
                                    product_id: e.product.id,
                                    product_code: e.product.code,
                                    product_name: e.product.name,
                                    request_order_qty: e.order_qty,
                                    uom: e.product.uom.name,
                                    inbound_item_id: e.id,
                                    delivery_qty: e.purchase_qty,
                                    reject_qty: 0,
                                    note: e.note,
                                    reject_reason: 0,
                                    weight: e.weight,
                                })
                            })
                        } else {
                            this.form.area_id = res.destination.area.id
                            this.form.warehouse_id = res.destination.id
                            this.form.ata_date =  ''
                            this.form.ata_time = ''
                            this.form.pogt = res.id
                            this.form.updated_at_pogt = res.updated_at
                            res.goods_transfer_item.map((e) => {
                                this.form.items.push({
                                    product_id: e.product.id,
                                    product_code: e.product.code,
                                    product_name: e.product.name,
                                    request_order_qty: e.delivery_qty,
                                    uom: e.product.uom.name,
                                    inbound_item_id: e.id,
                                    delivery_qty: e.receive_qty,
                                    reject_qty: e.reject_qty,
                                    note: e.note,
                                    reject_reason: 0,
                                    weight: e.weight,
                                })
                            })
                        }
                        this.createStatus = true
                    } else {
                        this.form.inbound_id = res.id
                        this.form.inbound_type = this.type
                        this.form.note =  res.note
                        this.form.area_id = res.warehouse.area.id
                        this.form.warehouse_id = res.warehouse.id
                        this.form.ata_date = this.formatDate(res.ata_date)
                        this.form.ata_time = res.ata_time
                        this.form.pogt = res.goods_transfer ? res.goods_transfer.id : res.purchase_order.id
                        this.form.updated_at_gr = res.updated_at
                        this.form.updated_at_pogt = res.goods_transfer ? res.goods_transfer.updated_at : res.purchase_order.updated_at
                        let idx = 0
                        res.goods_receipt_items.map((e) => {
                            this.form.items.push({
                                product_id: e.product.id,
                                product_code: e.product.code,
                                product_name: e.product.name,
                                request_order_qty: this.type === 'purchase_order' ? res.purchase_order.purchase_order_items[idx].order_qty : res.goods_transfer.goods_transfer_item[idx].delivery_qty,
                                uom: e.product.uom.name,
                                goods_receipt_item_id: e.id,
                                delivery_qty: e.delivery_qty,
                                reject_qty: e.reject_qty,
                                note: e.note,
                                reject_reason: e.reject_reason,
                                weight: e.weight,
                            })
                            idx += 1
                        })
                        this.updateStatus = true
                    }
                    this.handleTotalDelivery()
                    this.handleTotalReceive()
                    this.handleTotalReject()
                });
                this.selectedPOGT = item
                this.isLoadingItems = false
            },
            handleTotalDelivery() { // count total delivery of all products
                let selectedList = this.form.pogt
                let listProducts = this.form.items
                this.list.map((e) => {
                    if (e.id === selectedList) {
                        e.total_delivery = 0
                        listProducts.map((el) => {
                            e.total_delivery += el.delivery_qty 
                        })
                    }
                })
            },
            handleReceiveQty(item) { //count total receive qty based on GR type
                if (this.type === 'goods_transfer') {
                    return item.delivery_qty
                } else {
                    return item.delivery_qty - item.reject_qty
                }
            },
            handleTotalReceive() { // count total recieve of all products
                let selectedList = this.form.pogt
                let listProducts = this.form.items
                this.list.map((e) => {
                    if (e.id === selectedList) {
                        e.total_receive = 0
                        listProducts.map((el) => {
                            if (this.type == 'goods_transfer') {
                                e.total_receive += el.delivery_qty
                            } else {
                                e.total_receive += (el.delivery_qty - el.reject_qty)
                            }
                        })
                    }
                })
            },
            handleTotalReject() { // count total reject of all products
                let selectedList = this.form.pogt
                let listProducts = this.form.items
                this.list.map((e) => {
                    if (e.id === selectedList) {
                        e.total_reject = 0
                        listProducts.map((el) => {
                            e.total_reject += el.reject_qty
                        })
                    }
                })
            },
            handleReason(idx) { // reset reason based on delivery and request order 
                let selectedItem = this.form.items[idx]
                if (selectedItem.delivery_qty === selectedItem.request_order_qty) {
                    selectedItem.reject_reason = 0
                }
            },
            handleRejectReason(item, idx) { // hide show reason based on delivery and request order
                if (item.delivery_qty < item.request_order_qty && item.delivery_qty !== 0) {
                    return true
                }
                return false
            },
            handleSelectedIndex(i, item) { // save index for select reject reason 
                if (item.delivery_qty < item.request_order_qty && item.delivery_qty !== 0) {
                    this.glossaryIdx = i
                } else {
                    this.glossaryIdx = null
                }
            },
            confirmData() { // create / update GR
                if (this.isBeingCreated) {
                    this.$http.get(this.handleURLandEmbedsByType('url')+'/'+this.form.inbound_id).then(response => {
                        let res = response.data.data
                        if (this.form.updated_at_pogt !== res.updated_at) {
                            this.refreshData = true
                        } else {
                            this.ConfirmData = {
                                model: true,
                                title: "Create Goods Receipt",
                                text: "Are you sure want to create this goods receipt?",
                                urlApi: "/warehouse/goods/receipt",
                                nextPage: null,
                                data: this.form,
                                post: true
                            }
                        }
                    })
                }
                if (this.isBeingUpdated) {
                    this.$http.get('/warehouse/goods/receipt/'+this.form.inbound_id).then(response => {
                        let res = response.data.data
                        let grUpdateStatus = res.updated_at
                        let pogtUpdateStatus = res.goods_transfer ? res.goods_transfer.updated_at : res.purchase_order.updated_at
                        if (this.form.updated_at_pogt !== pogtUpdateStatus || this.form.updated_at_gr !== grUpdateStatus) {
                            this.refreshData = true
                        } else {
                            this.ConfirmData = {
                                model: true,
                                title: "Update Goods Receipt",
                                text: "Are you sure want to update this goods receipt?",
                                urlApi: "/warehouse/goods/receipt/" + this.selectedPOGT.goods_receipt_id,
                                nextPage: null,
                                data: this.form
                            }
                        }
                    })
                }
            },
            refreshGR() { //refresh list GR after action
                this.renderData()
            },
            createGR() { // Show action button for create
                this.createStatus = false
                this.isBeingCreated = true
            },
            updateGR() { // Show action button for update
                this.updateStatus = false
                this.isBeingUpdated = true
            },
            openModalDiscard() { // open discard modal
                this.discardModalIsOpen = true
            },
            closeModalDiscard() { // close discard modal
                this.discardModalIsOpen = false
            },
            closeModalRefreshData() { // close modal refresh data
                this.refreshData = false
            },
            discardGR() { // reset PO/GT when discard
                this.discardModalIsOpen = false
                this.fetchData(this.selectedPOGT)
            },
            handleURLandEmbedsByType(type) { // set dynamic url handler based on GR type
                if (this.type === 'purchase_order') {
                    return type === 'url' ? '/purchase/order' : 'supplier_id,warehouse_id,supplier_badge_id'
                } else {
                    return type === 'url' ? '/warehouse/goods/transfer' : 'origin,destination'
                }
            },
            handleConditions(){ //set dynamic conditions
                if(this.type === 'purchase_order'){
                    let warehouse = ''
                    if (this.SelectWarehouse) {
                        warehouse = '|warehouse.id.e:'+this.SelectWarehouse
                    }
                    return 'Or.code.icontains:'+this.search+'%2COr.supplier__name.icontains:'+this.search+warehouse+"|status:1"
                }else{
                    let warehouse = ''
                    if (this.SelectWarehouse) {
                        warehouse = '|destination.id.e:'+this.SelectWarehouse
                    }
                    return 'Or.code.icontains:'+this.search+warehouse+"|status:1"
                }
            },
            chooseGoodsReceiptID(gr) { // select active GR ID
                if (gr.length > 0) {
                    let id = null
                    gr.map((e) => {
                        if (e.status == 1) {
                            id = e.id
                        }
                    })
                    return id
                } else {
                    return null
                }
            },
            chooseGoodsReceiptCode(gr) { // select active GR code
                if (gr.length > 0) {
                    let code = null
                    gr.map((e) => {
                        if (e.status == 1) {
                            code = e.code
                        }
                    })
                    return code
                } else {
                    return null
                }
            },
            reasonSelected(d) { // select reject reason
                this.form.items[this.glossaryIdx].reject_reason = 0
                if (d) {
                    this.form.items[this.glossaryIdx].reject_reason = d.value
                }
            },
            redirectGRDetail(id) { // set url for redirect
                this.$router.push('/warehouse/goods-receipt/detail/'+id)
            },
            errDeliveryQty(idx) {// error style for deliver qty
                for (var key in this.error) {
                    if (key == 'deliver_qty' + idx) {
                        return false
                    }
                }
                return true
            },
            errDeliveryQtyMsg(idx) {// error msg for deliver qty
                for (var key in this.error) {
                    if (key == 'deliver_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            errReject(idx) { // error style for reject qty
                for (var key in this.error) {
                    if (key == 'reject_qty' + idx) {
                        return false
                    }
                }
                return true
            },
            errRejectMsg(idx) { // error message for reject qty
                for (var key in this.error) {
                    if (key == 'reject_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            errReceiveMsg(idx) { // error message for receive qty
                for (var key in this.error) {
                    if (key == 'receive_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            errRejectReason(idx) {// error style for reject reason
                for (var key in this.error) {
                    if (key == 'reject_reason' + idx) {
                        return false
                    }
                }
                return true
            },
            errRejectReasonMsg(idx) {// error msg for reject reason
                for (var key in this.error) {
                    if (key == 'reject_reason' + idx) {
                        return this.error[key]
                    }
                }
            },
        },
        watch: {
            'inbound_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.inbound_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData()
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                let date3 = new Date(this.inbound_date[0])
                                let date4 = new Date(this.inbound_date[1])
                                if (parseInt((date4-date3)/(24*3600*1000)) > 2 || parseInt((date4-date3)/(24*3600*1000)) < -2) {
                                    if (date4 < date3) {
                                        this.inbound_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.inbound_date.splice(1,1)
                                    } else {
                                        this.inbound_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.inbound_date.splice(1,1)
                                    }
                                    this.renderData()
                                } 

                            }
                        }
                    }
                },
                deep: true
            },
            'inbound_date': {
                handler: function (val) {
                    if (val) {
                        this.inbound_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'type': {
                handler: function (val) {
                    if (val) {
                        this.renderData()
                    }
                },
                deep: true
            },
            'search': {
                handler: function () {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData()
                    }, 1000);
                },
                deep: true
            },
        },
    }
</script>

<style scoped> 
    .v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
        padding: 0 !important;
    }
    
    .v-overlay .v-overlay--active .theme--dark {
        z-index: 6 !important;
    }

    .v-data-table>>> .v-data-table-header {
        height: 2px;
    }

    .updateGRButton {
        color: #50ABA3;
    }

    .goodReceiptCode {
        color: #50ABA3;
        text-decoration: underline;
    }

    .mobileCollapseHeader {
        padding: 0 !important;
    }

    .productCardTitle {
        text-align: left;
        margin-right: 15px;
    }

    .productCardIndex {
        background-color: #50ABA3;
        color: white;
        border-radius: 50%;
        padding: 6px 12px;
    }

    .tableProductCard {
        width: 100%;
        margin: auto;
    }

    .tdGRProductItemCreate {
        text-align: right;
    }
    
    .loadingSpinner {
        min-width: 100%;
        margin-top: 10px;
        margin-bottom: 20px;
    }
</style>