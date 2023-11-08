<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                v-model="search"
                                prepend-inner-icon="search"
                                name="search"
                                placeholder="Search..."
                                dense
                                outlined
                                filled
                                v-on="{ ...tooltip }"
                                v-privilege="'filter_rdl'"
                            ></v-text-field>
                        </template>
                        <span>Search by payment code, invoice code</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title" />
            <v-row :class="filter ? 'mb24' : ''">
                <v-col>
                    Filter
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon right> mdi-chevron-up </v-icon>
                    </v-btn>
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon right> mdi-chevron-down </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter ? '' : 'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        :norequired="true"
                        @selected="areaSelected"
                        name="filter_area"
                        :dense="true"
                        :aux_data="2"
                        v-privilege="'filter_rdl'"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        :dense="true"
                        @selected="warehouseSelected"
                        :label="'Warehouse'"
                        v-privilege="'filter_rdl'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectMerchant
                        :norequired="true"
                        @selected="merchantSelected"
                        :label="'Customer'"
                        :dense="true"
                        v-privilege="'filter_rdl'"
                    ></SelectMerchant>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="dateType"
                        :items="dateTypes"
                        item-text="text"
                        item-value="text"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="date"
                                    :label="dateType"
                                    prepend-inner-icon="mdi-calendar"
                                    @blur="setDateValidation()"
                                    v-model="date_input"
                                    maxlength="24"
                                    outlined
                                    dense
                                ></v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="right">
                    <v-btn
                        name="create_bulk_payment"
                        v-privilege="'sp_crt_active'"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold mr-4"
                        @click="nextMethod()"
                    >
                        <span class="text-white">Create Active Payment</span>
                    </v-btn>
                    <v-btn
                        name="create_bulk_payment"
                        v-privilege="'sp_cnf'"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold"
                        @click="confirmPaymentDialog = true"
                    >
                        <span class="text-white">Confirm Payment</span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr class="h48">
                        <td>
                            <span v-if="props.item.code">{{props.item.code}}</span>
                            <span v-else>-</span>
                            /
                            <span v-if="props.item.sales_invoice.code">{{ props.item.sales_invoice.code }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="props.item.recognition_date">
                                {{formatDate(props.item.recognition_date)}}
                            </span>
                            <span class="text-black60" v-else>-</span>
                            /
                            <span
                                class="text-black60"
                                v-if="props.item.received_date"
                            >
                                {{ formatDate(props.item.received_date) }}
                            </span>
                            <span class="text-black60" v-else>-</span>
                        </td>
                        <td>{{ formatDate(props.item.sales_invoice.sales_order.delivery_date)}}</td>
                        <td>
                            <span
                                v-if="props.item.sales_invoice.sales_order.branch.merchant.customer_group == 1"
                            >
                                {{ props.item.sales_invoice.sales_order.branch.merchant.name }}
                                <br />
                                <label class="text-black60">
                                    {{ props.item.sales_invoice.sales_order.branch.name }}
                                </label>
                            </span>
                            <span v-else>{{ props.item.sales_invoice.sales_order.branch.merchant.name }}</span>
                        </td>
                        <td>
                            <span>{{ props.item.sales_invoice.sales_order.area.name }}</span>
                            /
                            <span 
                                v-if="props.item.sales_invoice.sales_order.warehouse.name"
                            >
                                {{ props.item.sales_invoice.sales_order.warehouse.name }}
                            </span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="props.item.image_url" class="primary-color" @click="popupImage = true, selectImage(props.index)">Transfer Proof</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <v-row>Rp{{ formatPrice(props.item.amount) }}</v-row>
                            <v-row>{{ props.item.payment_method.name }}</v-row>
                        </td>
                        <td>{{ props.item.paid_off === 1 ? 'Paid Off' : '-' }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                >
                                    <span class="pa-md-2">Active</span>
                                </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                >
                                    <span class="pa-md-2">Finished</span>
                                </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                >
                                    <span class="pa-md-2">Cancelled</span>
                                </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 5">
                                <v-chip
                                    :color="statusMaster('in_progress')"
                                    :text-color="statusMasterText('in_progress')"
                                >
                                    <span class="pa-md-2">In Progress</span>
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
                                        v-privilege="'sp_can_active'"
                                        v-if="props.item.status == 1"
                                        @click="cancelPaymentActive(props.item.id)"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item
                                        v-privilege="'sp_can'"
                                        v-if="props.item.status == 2 || props.item.status == 5"
                                        @click="cancelPayment(props.item.id)"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div v-if="props.item.status == 1 || props.item.status == 2 || props.item.status == 5">
                                        <hr /> 
                                    </div>
                                    <v-list-item @click="seeHistory(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>See History</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div v-if="(props.item.status == 1 || props.item.status == 5) && props.item.payment_method.name !== 'Cash'" v-privilege="'sp_crt_active'">
                                        <hr />
                                    </div>
                                    <v-list-item 
                                        v-if="(props.item.status == 1 || props.item.status == 5) && props.item.payment_method.name !== 'Cash'" 
                                        v-privilege="'sp_crt_active'"
                                        @click="openPopupPaymentProof(props.index)"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Add Payment Proof</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div v-if="props.item.status == 1 || props.item.status == 5" v-privilege="'sp_crt_active'">
                                        <hr />
                                    </div>
                                    <v-list-item 
                                        v-if="props.item.status == 1 || props.item.status == 5" 
                                        v-privilege="'sp_cnf'"
                                        @click="confirmPayment(props.item)"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Confirm Payment</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
                <v-alert
                    slot="no-results"
                    :value="true"
                    color="error"
                    icon="warning"
                >
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
        <ConfirmPaymentDialog :sendData="ConfirmPayment" />
        <AuditLogNew :data="dataAuditLog" />
        <v-dialog v-model="popupImage" persistent max-width="470px">
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="6">
                            Transfer Proof
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="6">
                            <v-btn
                                icon
                                @click="popupImage = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <div class="center">
                        <img
                            class="rounded-form popupImage"
                            :src="transferProof"
                        />
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="popupAddPaymentProof"
            max-width="450px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="11">
                            Add Payment Proof
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="1">
                            <v-btn
                                icon
                                @click="popupAddPaymentProof = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal mt1"/>
                <v-card-text class="my-6">
                    <v-row>
                        <v-col cols="12" class="flex-align-center pt24">
                            <v-row>
                                <UploadImageTable
                                    :minWidth="250"
                                    :minHeight="250"
                                    :maxSize="2000"
                                    :type="'sales_payment'"
                                    :extention="'jpeg'"
                                    :accept="'image/jpeg,image/jpg'"
                                    :bigSize="true"
                                    :forImgName="sales_payment_code"
                                    :imageFromUpdate="payment_proof"
                                    :idx="index"
                                    :errorMsg="error.image"
                                >
                                </UploadImageTable>
                            </v-row>
                        </v-col>                 
                    </v-row>
                </v-card-text>
                <div class="hr-title-modal -mt10"/>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="popupAddPaymentProof = false"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                        :disabled="disabledBtnAddPaymentProof"
                        @click="addPaymentProof()"
                    >
                        Add
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="confirmPaymentDialog" persistent max-width="750px">
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="fs20 bold h70 mt12" cols="12" md="6">
                            Confirm Active Sales Payment
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal mt1" />
                <v-card-text>
                    <v-row>
                        <v-col cols="6" md="6" class="mt24">
                            <v-menu
                                ref="menu"
                                v-model="form.receive_date_confirm_model"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on }">
                                    <div v-on="on">
                                        <v-text-field
                                            name="receive_date_confirm"
                                            prepend-inner-icon="mdi-calendar"
                                            dense
                                            v-model="form.receive_date_confirm"
                                            class="rounded-form-sm"
                                            maxlength="24"
                                            outlined
                                            required
                                        >
                                            <template v-slot:label>
                                                Received Date<span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    no-title
                                    persistent-hint
                                    v-model="form.receive_date_confirm"
                                    name="receive_date_confirm"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="6" md="6" class="mt24">
                            <SelectPaymentMethodTable
                                name="payment_method_confirm"
                                :label="'Payment Method '"
                                :payment_method="form.payment_method_confirm"
                                @selected="paymentMethodConfirmSelected"
                                required
                                :dense="true"
                            ></SelectPaymentMethodTable>
                        </v-col>
                        <v-col cols="6" md="6">
                            <SelectWarehouse
                                :dense="true"
                                :aux_data="2"
                                @selected="warehouseConfirmSelected"
                                :warehouse="form.warehouseConfirm"
                            ></SelectWarehouse>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-data-table
                                :headers="table.selectFields"
                                :items="form.finance_warehouse_confirm"
                                :hide-default-footer="true"
                                :items-per-page="-1"
                            >
                                <template v-slot:item="props">
                                    <tr>
                                        <td>
                                            <SelectFinanceWarehouseTable
                                                :name="`financeWarehouse_${props.index}`"
                                                @click.native="setFinanceWarehouseIdx(props.index)"
                                                @selected="financeWarehouseSelected"
                                                :product="props.item.finance_warehouse"
                                                :refs="
                                                    `${props.index + 1}-${refs},
                                                    ${form.finance_warehouse_confirm.length}`"
                                                :update="update"
                                                :error="errFinanceWarehouse(props.index)"
                                                class="ml10"
                                            ></SelectFinanceWarehouseTable>
                                        </td>
                                        <td>
                                            <div class="d-flex justify-end">
                                                <div
                                                    v-if="props.index == form.finance_warehouse_confirm.length - 1"
                                                >
                                                    <v-btn
                                                        icon
                                                        name="addFinanceWarehouse"
                                                        @click="addFinanceWarehouse()"
                                                        :disabled="form.finance_warehouse_confirm.length == 5"
                                                         v-if="form.finance_warehouse_confirm.length < 5"
                                                    >
                                                        <img
                                                            src="/icon/plus.png"
                                                            height="22px"
                                                            width="22px"
                                                        />
                                                    </v-btn>
                                                </div>
                                                <div
                                                    v-if="form.finance_warehouse_confirm.length != 1"
                                                >
                                                    <v-btn
                                                        icon
                                                        :name="`removeFinanceWarehouse_${props.index}`"
                                                        @click="removeFinanceWarehouse(props.index)"
                                                    >
                                                        <img
                                                            src="/icon/close-new.png"
                                                            height="20px"
                                                            width="20px"
                                                        />
                                                    </v-btn>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pb-7 pr-7">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="
                            (confirmPaymentDialog = false), resetPopUpConfirm()
                        "
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text ml8"
                        depressed
                        color="#50ABA3"
                        @click="nextMethodConfirm()"
                        :disabled="disabledBtnProcess"
                    >
                        Process
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="errorModalIsVisible"
            max-width="30%"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>Cancel Regular Payment</v-card-title>
                <v-card-text>{{errorMsgModal}}</v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text mt8"
                        @click="errorModalIsVisible = false"
                    >Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import Vue from "vue";
export default {
    name: "SalesPayment",
    data() {
        return {
            orderby: "-id",
            overlay: false,
            warehouse: "",
            search: "",
            filter: false,
            loading: false,
            area: "",
            area_id: "",
            ConfirmData: {},
            items: [],
            reload: false,
            table: {
                fields: [
                    {
                        text: "Sales Payment Code / Sales Invoice Code",
                        width: "20%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "Payment Date",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "Delivery Date",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "Customer",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "Area",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "Image",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "Payment Amount",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "Paid Off",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "Status",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false
                    },
                    {
                        text: "",
                        width: "5%",
                        sortable: false
                    },
                ],
                selectFields: [
                    {
                        text: "Finance Warehouse",
                        width: "70%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                ],
            },
            dateType: "Received Date",
            dateTypes: [
                {
                    text: "Payment Date",
                    value: 1,
                },
                {
                    text: "Invoice Date",
                    value: 2,
                },
                {
                    text: "Order Delivery Date",
                    value: 3,
                },
                {
                    text: "Received Date",
                    value: 4,
                },
            ],
            SelectMerchant: "",
            SelectWarehouse: "",
            outlet: false,
            lastPage: 0,
            pagination: {
                page: 0,
                rowsPerPage: 100,
                totalItems: 0,
            },
            statuses: 999,
            date_model: "",
            date_input: new Date(Date.now() + 3600 * 1000 * 7)
                .toISOString()
                .substr(0, 10),
            date: [
                new Date(Date.now() + 3600 * 1000 * 7)
                    .toISOString()
                    .substr(0, 10),
            ],
            status: [
                {
                    text: "All Status",
                    value: 999,
                },
                {
                    text: "Active",
                    value: 1,
                },
                {
                    text: "Finished",
                    value: 2,
                },
                {
                    text: "Cancelled",
                    value: 3,
                },
                {
                    text: "In Progress",
                    value: 5,
                },
            ],
            confirmPaymentDialog: false,
            form: {
                receive_date_confirm: "",
                receive_date_confirm_model: "",
                payment_method_confirm: "",
                payment_method_id_confirm: "",
                warehouseConfirm: "",
                finance_warehouse_confirm: [
                    {
                        finance_warehouse: "",
                        finance_warehouse_id: "",
                    },
                ],
            },
            financeWarehouseIdx: "",
            error: {},
            disabledBtnProcess: true,
            refs: "",
            update: false,
            dataAuditLog: {},
            popupImage: false,
            popupAddPaymentProof: false,
            transferProof: "",
            index: null,
            payment_proof: "",
            sales_payment_code: "",
            errorModalIsVisible: false,
            errorMsgModal: '',
            ConfirmPayment : {},
        };
    },
    mounted() {
        Vue.nextTick(() => {
            this.items = [];
            this.renderData("", this.statuses);
        });
        let self = this;
        this.$root.$on("event_success", function (res) {
            if (res) {
                Vue.nextTick(() => {
                    self.items = [];
                    self.renderData(self.search, self.statuses);
                });
            }
        });
        this.$root.$on('event_error', function(err){
            self.error = err
        });
        this.$root.$on("event_uploadImage", function (image) {
            if(image) {
                self.payment_proof = image.url;
            }
        });
    },
    computed: {
        totalFinanceWarehouse() {
            let total = 0;
            for (
                let i = 0;
                i < this.form.finance_warehouse_confirm.length;
                i++
            ) {
                if (
                    this.form.finance_warehouse_confirm[i].finance_warehouse_id
                ) {
                    total += 1;
                }
            }
            return total;
        },
        disabledBtnAddPaymentProof() {
            if (this.payment_proof) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        //For validation on date input
        setDateValidation() {
            if (!this.date_input || this.date_input == "") {
                this.date_input = new Date(Date.now() + 3600 * 1000 * 7)
                    .toISOString()
                    .substr(0, 10);
                this.date = [
                    new Date(Date.now() + 3600 * 1000 * 7)
                        .toISOString()
                        .substr(0, 10),
                ];
            }
        },
        //For get list sales payment
        renderData(search, statuses) {
            this.loading = true;
            if (statuses === 999) {
                statuses = "";
            } else {
                statuses = "|status:" + statuses;
            }
            let areaID = "";
            if (this.area_id) {
                areaID = "|salesinvoice.salesorder.area.id.e:" + this.area_id;
            } else {
                areaID = "";
            }
            let warehouse = "";
            if (this.SelectWarehouse) {
                warehouse =
                    "|salesinvoice.salesorder.warehouse.id.e:" +
                    this.SelectWarehouse;
            } else {
                warehouse = "";
            }
            let merchant = "";
            if (this.SelectMerchant) {
                merchant =
                    "|salesinvoice.salesorder.branch.merchant.id.e:" +
                    this.SelectMerchant;
            }
            let filterDate = "";
            if (this.date.length > 0) {
                let date = this.date[0];
                if (this.date.length == 1) {
                    switch (this.dateType) {
                        case "Payment Date":
                            filterDate = "|recognition_date:" + date;
                            break;
                        case "Invoice Date":
                            filterDate =
                                "|salesinvoice.recognition_date:" + date;
                            break;
                        case "Order Delivery Date":
                            filterDate =
                                "|salesinvoice.salesorder.delivery_date:" +
                                date;
                            break;
                        case "Received Date":
                            filterDate = "|received_date:" + date;
                            break;
                        default:
                            filterDate = "|received_date:" + date;
                    }
                } else {
                    let date2 = this.date[1];
                    if (date > date2) {
                        switch (this.dateType) {
                            case "Payment Date":
                                filterDate =
                                    "|recognition_date.gte:" +
                                    date2 +
                                    "|recognition_date.lte:" +
                                    date;
                                break;
                            case "Invoice Date":
                                filterDate =
                                    "|salesinvoice.recognition_date.gte:" +
                                    date2 +
                                    "|salesinvoice.recognition_date.lte:" +
                                    date;
                                break;
                            case "Order Delivery Date":
                                filterDate =
                                    "|salesinvoice.salesorder.delivery_date.gte:" +
                                    date2 +
                                    "|salesinvoice.salesorder.delivery_date.lte:" +
                                    date;
                                break;
                            case "Received Date":
                                filterDate =
                                    "|received_date.gte:" +
                                    date2 +
                                    "|received_date.lte:" +
                                    date;
                                break;
                            default:
                                filterDate =
                                    "|received_date.gte:" +
                                    date2 +
                                    "|received_date.lte:" +
                                    date
                        }
                    } else {
                        switch (this.dateType) {
                            case "Payment Date":
                                filterDate =
                                    "|recognition_date.gte:" +
                                    date +
                                    "|recognition_date.lte:" +
                                    date2;
                                break;
                            case "Invoice Date":
                                filterDate =
                                    "|salesinvoice.recognition_date.gte:" +
                                    date +
                                    "|salesinvoice.recognition_date.lte:" +
                                    date2;
                                break;
                            case "Order Delivery Date":
                                filterDate =
                                    "|salesinvoice.salesorder.delivery_date.gte:" +
                                    date +
                                    "|salesinvoice.salesorder.delivery_date.lte:" +
                                    date2;
                                break;
                            case "Received Date":
                                filterDate =
                                    "|received_date.gte:" +
                                    date +
                                    "|received_date.lte:" +
                                    date2;
                                break;
                            default:
                                filterDate =
                                    "|received_date.gte:" +
                                    date +
                                    "|received_date.lte:" +
                                    date2;
                                break;
                        }
                    }
                }
            } else {
                if (this.dateType === "Payment Date") {
                    filterDate =
                        "|recognition_date:" +
                        new Date(Date.now() + 3600 * 1000 * 7)
                            .toISOString()
                            .substr(0, 10);
                }
                if (this.dateType === "Invoice Date") {
                    filterDate =
                        "|salesinvoice.recognition_date:" +
                        new Date(Date.now() + 3600 * 1000 * 7)
                            .toISOString()
                            .substr(0, 10);
                }
                if (this.dateType === "Order Delivery Date") {
                    filterDate =
                        "|salesinvoice.salesorder.delivery_date:" +
                        new Date(Date.now() + 3600 * 1000 * 7)
                            .toISOString()
                            .substr(0, 10);
                }
                if (this.dateType === "Received Date") {
                    filterDate =
                        "|received_date:" +
                        new Date(Date.now() + 3600 * 1000 * 7)
                            .toISOString()
                            .substr(0, 10);
                }
            }
            this.render = true;
            this.$http
                .get("/sales/payment", {
                    params: {
                        page: this.pagination.page,
                        perpage: this.pagination.rowsPerPage,
                        conditions:
                            "Or.code.icontains:" +
                            search +
                            "%2COr.salesinvoice.code.icontains:" +
                            search +
                            statuses +
                            warehouse +
                            areaID +
                            merchant +
                            filterDate,
                        embeds: "salesinvoice.salesorder.area,salesinvoice.salesorder.warehouse,salesinvoice.salesorder.branch.merchant,paymentmethod",
                        orderby: "-id",
                    },
                })
                .then((response) => {
                    this.loading = false;
                    if (response.data.data) {           
                        let item = response.data.data;
                        if (item.length < 1) {
                            this.pagination.totalItems = 0;
                            this.items = [];
                        } else {
                            item.forEach((e) => {
                                this.items.push(e);
                            });
                            this.pagination.totalItems = response.data.total;
                        }
                    }
                });
        },
        // For select filter area
        areaSelected(d) {
            this.area_id = "";
            if (d) {
                this.area_id = d.id;
            }
            Vue.nextTick(() => {
                this.items = [];
                this.renderData(this.search, this.statuses);
            });
        },
        // For Filter Warehouse
        warehouseSelected(d) {
            this.SelectWarehouse = "";
            if (d) {
                this.SelectWarehouse = d.id;
            }
            this.pagination.page = 0;
            this.lastPage = 1;
            Vue.nextTick(() => {
                this.items = [];
                this.renderData(this.search, this.statuses);
            });
        },
        // For Filter Merchant
        merchantSelected(d) {
            this.outlet = false;
            this.SelectMerchant = "";
            if (d) {
                if (d.customer_group == 1) {
                    this.outlet = true;
                }
                this.SelectMerchant = d.id;
            }
            this.pagination.page = 0;
            this.lastPage = 1;
            Vue.nextTick(() => {
                this.items = [];
                this.renderData(this.search, this.statuses);
            });
        },
        //For cancel payment
        cancelPayment(id) {
            this.ConfirmData = {
                model: true,
                status: true,
                statusMsg: "Success to Cancel this Payment",
                title: "Cancel Payment",
                text: "Why was this payment cancelled?",
                urlApi: "/sales/payment/cancel/" + id,
                cancelNote: "Note",
                data: {},
            };
        },
        //For cancel payment active
        cancelPaymentActive(id) {
            this.ConfirmData = {
                model: true,
                status: true,
                statusMsg: "Success to Cancel this Payment",
                title: "Cancel Payment",
                text: "Why was this payment cancelled?",
                urlApi: "/sales/payment/cancel/active/" + id,
                cancelNote: "Note",
                data: {},
            };
        },
        //For go to create bulk payment next process
        nextMethod() {
            this.$router.push("/finance/sp/spb");
        },
        //For select payment method confirm payment
        paymentMethodConfirmSelected(d) {
            this.form.payment_method_confirm = "";
            this.form.payment_method_id_confirm = "";
            if (d !== "") {
                this.form.payment_method_confirm = d;
                this.form.payment_method_id_confirm = d.id;
            }
        },
        // For select warehouse confirm payment
        warehouseConfirmSelected(d) {
            this.form.warehouseConfirm = "";
            if (d) {
                this.form.warehouseConfirm = d;
            }
        },
        // For redirect to confirm payment page
        nextMethodConfirm() {
            this.$router.push("/finance/sp/confirm");
            let data = {
                finance_warehouse_confirm: this.form.finance_warehouse_confirm,
                receive_date_confirm: this.form.receive_date_confirm,
                warehouse_confirm: this.form.warehouseConfirm,
                payment_method_confirm: this.form.payment_method_confirm,
            };
            this.$store.commit("setBulkConfirmPayment", data);
        },
        // For select finance warehouce id
        setFinanceWarehouseIdx(idx) {
            this.financeWarehouseIdx = idx;
        },
        // For Select finance warehouce
        financeWarehouseSelected(d) {
            this.form.finance_warehouse_confirm[
                this.financeWarehouseIdx
            ].finance_warehouse = "";
            this.form.finance_warehouse_confirm[
                this.financeWarehouseIdx
            ].finance_warehouse_id = "";
            if (d) {
                this.form.finance_warehouse_confirm[
                    this.financeWarehouseIdx
                ].finance_warehouse = d;
                this.form.finance_warehouse_confirm[
                    this.financeWarehouseIdx
                ].finance_warehouse_id = d.id;
            }
        },
        //For check duplicate finance warehouse
        errFinanceWarehouse(idx) {
            let holdValue =
                this.form.finance_warehouse_confirm[idx].finance_warehouse_id;
            if (this.form.finance_warehouse_confirm[idx].finance_warehouse_id) {
                for (
                    let j = 0;
                    j < this.form.finance_warehouse_confirm.length;
                    j++
                ) {
                    if (
                        holdValue ==
                            this.form.finance_warehouse_confirm[j]
                                .finance_warehouse_id &&
                        idx != j
                    ) {
                        this.disabledBtnProcess = true;
                        return (
                            "Duplicate Finance Warehouse " +
                            this.form.finance_warehouse_confirm[j]
                                .finance_warehouse.name
                        );
                    }
                }
            }
        },
        // For Add Finance Warehouse
        addFinanceWarehouse() {
            this.update = false;
            this.form.finance_warehouse_confirm.push({
                finance_warehouse: "",
                finance_warehouse_id: "",
            });
            this.refs = false;
            Vue.nextTick(() => {
                this.refs = true;
                this.setFinanceWarehouseIdx(
                    this.form.finance_warehouse_confirm.length - 1
                );
            });
        },
        // For remove customer
        removeFinanceWarehouse(idx) {
            this.form.finance_warehouse_confirm.splice(idx, 1);
            for (var key in this.error) {
                if (key.includes(idx) && key.includes("finance_warehouse_id")) {
                    delete this.error[key];
                }
            }
        },
        // For reset selected delivery, selected warehouse, selected payment method, and selected finance warehouse when cancel confirm payment
        resetPopUpConfirm() {
            this.form.finance_warehouse_confirm = [
                {
                    finance_warehouse: "",
                    finance_warehouse_id: "",
                },
            ];
            this.form.warehouseConfirm = "";
            this.form.payment_method_confirm = "";
            this.form.payment_method_id_confirm = "";
            this.form.receive_date_confirm = "";
        },
        //For see history audit log
        seeHistory(id) {
            this.dataAuditLog = {
                model: true,
                id: id,
                type: "sales_payment",
            };
        },
        // For selected image on unconfirmed payment list
        selectImage(idx) {
            this.transferProof = this.items[idx].image_url
        },
        // For open popup add payment proof
        openPopupPaymentProof(idx) {
            this.popupAddPaymentProof = true
            this.index = idx
            this.payment_proof = this.items[idx].image_url
            this.sales_payment_code = this.items[idx].code
        },
        // For add payment proof
        addPaymentProof(){
            this.overlay = true
            const formAddPaymentProof = {
                image_url: this.payment_proof
            }
            this.$http.put(`/sales/payment/payment_proof/${this.items[this.index].id}`, formAddPaymentProof)
                .then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: 'Data has been saved successfully',
                        type: 'success',
                    });
                    location.reload()
                })
                .catch(e => {
                    this.overlay = false
                    this.error = e.errors
                });
            },
        confirmPayment(item) {// confirm single payment
            this.ConfirmPayment = {
                model : true,
                data: item
            }
        },
    },
    watch: {
        search: {
            handler: function (val) {
                let that = this;
                clearTimeout(this._timerId);
                this._timerId = setTimeout(function () {
                    that.pagination.page = 0;
                    that.lastPage = 1;
                    Vue.nextTick(() => {
                        that.items = [];
                        that.renderData(val, that.statuses);
                    });
                }, 1000);
            },
            deep: true,
        },
        statuses: {
            handler: function (val) {
                this.pagination.page = 0;
                this.lastPage = 1;
                let that = this;
                Vue.nextTick(() => {
                    that.items = [];
                    that.renderData(this.search, val);
                });
            },
            deep: true,
        },
        dateType: {
            handler: function (val) {
                this.dateType = val;
                this.pagination.page = 0;
                this.lastPage = 1;
                let that = this;
                Vue.nextTick(() => {
                    this.items = [];
                    that.renderData(this.search, this.statuses);
                });
            },
            deep: true,
        },
        date_input: {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(
                            val,
                            "YYYY-MM-DD",
                            true
                        ).isValid();
                        if (valid == true) {
                            this.date[0] =
                                this.$moment(val).format("YYYY-MM-DD");
                            if (this.render == true) {
                                this.pagination.page = 0;
                                this.lastPage = 1;
                                Vue.nextTick(() => {
                                    this.items = [];
                                    this.renderData(this.search, this.statuses);
                                });
                            }
                        }
                    } else if (val.length == 24) {
                        let date1 = val.substr(0, 10);
                        let date2 = val.substr(14, 23);
                        let valid1 = this.$moment(
                            date1,
                            "YYYY-MM-DD",
                            true
                        ).isValid();
                        let valid2 = this.$moment(
                            date2,
                            "YYYY-MM-DD",
                            true
                        ).isValid();
                        if (valid1 == true && valid2 == true) {
                            if (this.date.length == 2) {
                                let date3 = new Date(this.date[0]);
                                let date4 = new Date(this.date[1]);
                                if (
                                    parseInt(
                                        (date4 - date3) / (24 * 3600 * 1000)
                                    ) > 30 ||
                                    parseInt(
                                        (date4 - date3) / (24 * 3600 * 1000)
                                    ) < -30
                                ) {
                                    if (date4 < date3) {
                                        this.render = false;
                                        this.date[0] =
                                            this.$moment(date3).format(
                                                "YYYY-MM-DD"
                                            );
                                        this.date.splice(1, 1);
                                    } else {
                                        this.render = false;
                                        this.date[0] =
                                            this.$moment(date3).format(
                                                "YYYY-MM-DD"
                                            );
                                        this.date.splice(1, 1);
                                    }
                                } else {
                                    this.pagination.page = 0;
                                    this.lastPage = 1;
                                    Vue.nextTick(() => {
                                        this.items = [];
                                        this.renderData(
                                            this.search,
                                            this.statuses
                                        );
                                    });
                                }
                            }
                        }
                    }
                }
            },
            deep: true,
        },
        date: {
            handler: function (val) {
                if (val) {
                    this.date_input = this.formatDateRange(val);
                }
            },
            deep: true,
        },
        form: {
            handler: function (val) {
                // for disable button process to create bulk payment
                this.disabledBtnProcess = true;
                if (
                    this.form.warehouseConfirm == "" ||
                    this.form.receive_date_confirm == "" ||
                    this.form.payment_method_confirm == ""
                ) {
                    this.disabledBtnProcess = true;
                } else if (this.form.finance_warehouse_confirm.length > 1) {
                    const isAllFinanceWarehousesFilled =
                        this.form.finance_warehouse_confirm.every(
                            (item) => item.finance_warehouse !== ""
                        );
                    if (isAllFinanceWarehousesFilled) {
                        this.disabledBtnProcess = false;
                        return;
                    }
                } else {
                    this.disabledBtnProcess = false;
                }
            },
            deep: true,
        },
        error: {
            handler: function (val) {
                if(val){
                    if (val.sales_payment) {
                        this.errorModalIsVisible = true
                        this.errorMsgModal = 'Cancel the "Paid-Off Payment" first before cancelling the "Regular Payment"'
                    }
                }
            },
            deep: true
        },
    },
};
</script>