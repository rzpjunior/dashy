<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6">
                    <v-text-field
                        name="bank_receive_num"
                        v-model="bank_receive_num"
                        required
                        outlined
                        maxlength="50"
                        dense
                        :error-messages="error.bank_receive_num"
                    >
                        <template v-slot:label>
                            Bank Receive Voucher Number<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-menu
                        ref="menu"
                        v-model="payment_date_model"
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
                                    required
                                    clearable
                                    dense
                                    @click:clear="payment_date = ''"
                                    v-model="payment_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error-messages="error.payment_date"
                                >
                                    <template v-slot:label>
                                        Payment Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            name="payment_date"
                            no-title
                            v-model="payment_date"
                            @input="payment_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-table-extra-margin-bottom">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr>
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
                            <span v-else>
                                {{ props.item.sales_invoice.sales_order.branch.merchant.name }}
                            </span>
                            <div class="fs12" style="color: red">
                                {{ errConfirm(props.index) }}
                            </div>
                        </td>
                        <td>{{ props.item.code }}</td>
                        <td>
                            {{ props.item.sales_invoice.code }}
                        </td>
                        <td>
                            {{ formatDate(props.item.received_date) }}
                        </td>
                        <td>
                            <v-row>Rp. {{formatPrice(props.item.sales_invoice.total_charge)}}</v-row>
                            <v-row>{{ props.item.payment_method.name }}</v-row>
                        </td>
                        <td>
                            {{ props.item.sales_invoice.sales_order.warehouse.name }}
                        </td>
                        <td>
                            <span v-if="props.item.image_url" class="primary-color" @click="popupImage = true, selectImage(props.index)">Transfer Proof</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="props.item.note !== ''">
                                {{props.item.note}}
                            </span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <v-checkbox
                                name="paid_off"
                                v-model="props.item.paid_off"
                                :false-value="2 || 0"
                                :true-value="1"
                            ></v-checkbox>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`amount_${props.index}`"
                                class="productNumeric -ml8"
                                placeholder="0,00"
                                separator="."
                                v-model.number="props.item.amount"
                                :error-messages="error.amount"
                            ></vue-numeric>
                        </td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                > <span class="pa-md-2"> Active </span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 5">
                                <v-chip
                                    :color="statusMaster('in_progress')"
                                > In Progress </v-chip>
                            </div>
                        </td>
                        <td>
                            <v-btn
                                icon
                                :name="`removepayment_${props.index}`"
                                @click="
                                    setPaymentIdx(props.index),
                                        (confirmRemove = true)
                                "
                            >
                                <v-img
                                    src="/icon/close.png"
                                    max-height="20px"
                                    max-width="20px"
                                ></v-img>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="totalTransactionBox">
            <div class="box">
                <v-row>
                    <v-col class="text-black" offset="6" cols="12" md="6">
                        <div class="row fs20 bold">
                            <div class="col">Total Payment :</div>
                            <div class="col d-flex justify-end">
                                {{ totalPayment }}
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <v-row class="hr-title" />
                <v-row>
                    <v-col>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                @click="$router.go(-1)"
                                depressed
                                outlined
                                color="#EBEBEB"
                                class="main-btn"
                            >
                                <span class="text-black80">Cancel</span>
                            </v-btn>
                            <v-btn
                                depressed
                                color="#50ABA3"
                                class="main-btn white--text"
                                @click="confirmButton()"
                                :disabled="disabledBtn"
                            >
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </div>
        </div>
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
        <v-dialog v-model="confirmRemove" persistent max-width="470px">
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Remove From List</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">
                        Are you sure want to remove this Payment from
                        unconfirmed payment list?
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="confirmRemove = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                        @click="removePayment(paymentIdx), (confirmRemove = false)"
                        :disabled="disabledBtn"
                    >
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>
<script>
import Vue from "vue";
export default {
    name: "ConfirmPayment",
    data() {
        return {
            items: [],
            error: {},
            ConfirmData: {},
            loading: false,
            table: {
                fields: [
                    {
                        text: "Customer",
                        width: "15%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Payment Code",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Invoice Code",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Received Date",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Invoice Amount",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Warehouse",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Image",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Note",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Paid Off",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Payment Amount",
                        width: "24%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Status",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "",
                        width: "2%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                ],
            },
            payment_date_model: "",
            payment_date: new Date(Date.now() + 3600 * 1000 * 7)
                .toISOString()
                .substr(0, 10),
            paymentIdx: "",
            bank_receive_num: "",
            confirmRemove: false,
            disabledBtn: false,
            receive_date_confirm: "",
            warehouse_confirm: "",
            payment_method_confirm: "",
            finance_warehouse_confirm: "",
            popupImage: false,
            transferProof: ""
        };
    },
    created() {
        let data = this.$store.state.BulkConfirmPayment;
        if (data != null) {
            this.payment_method_confirm = data.payment_method_confirm.id;
            this.receive_date_confirm = data.receive_date_confirm;
            this.warehouse_confirm = data.warehouse_confirm.id;
            for (let i = 0; i < data.finance_warehouse_confirm.length; i++) {
                if (i == 0) {
                    this.finance_warehouse_confirm =
                        data.finance_warehouse_confirm[0].finance_warehouse_id;
                } else {
                    this.finance_warehouse_confirm =
                        this.finance_warehouse_confirm +
                        "," +
                        data.finance_warehouse_confirm[i].finance_warehouse_id;
                }
            }
        }
    },
    mounted() {
        let self = this;
        this.$root.$on("event_error", function (err) {
            self.error = err;
        });
        Vue.nextTick(() => {
            this.items = [];
            this.renderData();
        });
        this.$root.$on("event_success", function (res) {
            if (res) {
                Vue.nextTick(() => {
                    self.items = [];
                    self.renderData();
                });
            }
        });
    },
    methods: {
        // For get data from API
        renderData() {
            this.loading = true;
            let receive_date = "";
            if (this.receive_date_confirm) {
                receive_date = "received_date:" + this.receive_date_confirm;
            } else {
                receive_date = "";
            }
            let finance_warehouse = "";
            if (this.finance_warehouse_confirm) {
                finance_warehouse = this.finance_warehouse_confirm;
            } else {
                finance_warehouse = "";
            }
            let warehouse = "";
            if (this.warehouse_confirm) {
                warehouse =
                    "|salesinvoice.salesorder.warehouse.id.e:" +
                    this.warehouse_confirm;
            } else {
                warehouse = "";
            }
            let payment_method = "";
            if (this.payment_method_confirm) {
                payment_method =
                    "|paymentmethod.id.e:" + this.payment_method_confirm;
            } else {
                payment_method = "";
            }
            this.$http
                .get("/sales/payment", {
                    params: {
                        embeds: "paymentmethod,salesinvoice,salesinvoice.salesorder,salesinvoice.salesorder.area,salesinvoice.salesorder.branch,salesinvoice.salesorder.branch.merchant,salesinvoice.salesorder.warehouse",
                        conditions:
                            receive_date +
                            warehouse +
                            payment_method +
                            "|status.in:1.5",
                        created_by: finance_warehouse,
                        orderby: "-id",
                    },
                })
                .then((response) => {
                    this.loading = false;
                    let array = response.data.data;
                    if (array === null) {
                        this.items = [];
                    } else {
                        array.forEach((e) => {
                            this.items.push(e);
                        });
                    }
                });
        },
        // For select the payment index to be deleted
        setPaymentIdx(idx) {
            this.paymentIdx = idx;
        },
        // For remove payment
        removePayment(idx) {
            this.items.splice(idx, 1);
            for (var key in this.error) {
                if (key == "id_" + idx) {
                    delete this.error[key];
                }
            }
        },
        // For confirm payment
        confirmButton() {
            let confirmData = {
                payment_date: "",
                bank_receive_num: "",
                items: [],
            };
            let paid_off_conv = "";
            confirmData.payment_date = this.payment_date;
            confirmData.bank_receive_num = this.bank_receive_num;
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].paid_off === 1) {
                    paid_off_conv = 1;
                } else {
                    paid_off_conv = 2;
                }
                confirmData.items.push({
                    id: this.items[i].id,
                    amount: this.items[i].amount,
                    paid_off: paid_off_conv,
                    note: this.items[i].note,
                });
            }
            this.ConfirmData = {
                model: true,
                title: "Confirm Payment",
                text: "Are you sure want to confirm this payment list?",
                urlApi: "/sales/payment/bulk/confirm",
                nextPage: "/finance/sp",
                data: confirmData,
                put: true,
            };
        },
        // For show error confirm payment
        errConfirm(idx) {
            for (var key in this.error) {
                if (key == "id_" + idx) {
                    return this.error[key];
                }
            }
        },
        // For selected image on unconfirmed payment list
        selectImage(idx) {
            this.transferProof = this.items[idx].image_url
        }
    },
    computed: {
        totalPayment() {
            let total = 0;
            let array = this.items;
            if (array) {
                for (let i = 0; i < array.length; i++) {
                    total += parseFloat(array[i].amount);
                }
            }
            let val = (total / 1).toFixed(2).replace(".", ",");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
    },
    watch: {
        items: {
            handler: function (val) {
                this.disabledBtn = true;
                if (this.items.length > 0) {
                    this.disabledBtn = false;
                } else {
                    this.disabledBtn = true;
                }
            },
            deep: true,
        },
    },
};
</script>