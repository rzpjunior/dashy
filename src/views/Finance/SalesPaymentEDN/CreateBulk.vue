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
                                outlined
                                dense
                                filled
                                v-on="{ ...tooltip }"
                                v-privilege="'filter_rdl'"
                            ></v-text-field>
                        </template>
                        <span>Search by customer name, invoice code</span>
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
                <v-col cols="3" md="3" class="-mt24 -mb24">
                    <SelectWarehouse
                        :dense="true"
                        :aux_data="2"
                        @selected="warehouseSelected"
                        :warehouse="warehouse"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="3" md="3" class="-mt24 -mb24">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="delivery_date"
                                    prepend-inner-icon="mdi-calendar"
                                    dense
                                    v-model="delivery_date"
                                    maxlength="24"
                                    outlined
                                    required
                                >
                                    <template v-slot:label>
                                         Delivery Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            no-title
                            persistent-hint
                            v-model="delivery_date"
                            @input="delivery_date_model = false"
                            name="delivery_date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Received Date: {{ this.received_date }}
        </div>
        <div class="box-table-extra-margin-bottom">
            <v-data-table
                v-model="checkedInvoice"
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="-1"
                :hide-default-footer="true"
                show-select
                item-key="id"
            >
                <template v-slot:item="{ item, index }">
                    <tr style="height: 48px">
                        <td>
                            <v-checkbox
                                v-model="checkedInvoice"
                                name="checked_invoice"
                                multiple
                                :value="item"
                            ></v-checkbox>
                        </td>
                        <td>{{ item.customer }}</td>
                        <td>{{ item.code }}</td>
                        <td>
                            {{ formatDate(item.invoice_date) }} /
                            <div v-if="item.status == 1">
                                 <span>Active</span>
                            </div>
                            <div v-else-if="item.status == 6">
                                <span>Partial</span>
                            </div>
                        </td>
                        <td>
                            <div style="margin-bottom: -30px">
                                <SelectPaymentMethodTable
                                    name="payment_method"
                                    @selected="paymentmethodSelected"
                                    required
                                    :index="index"
                                    :label="'Payment Method'"
                                    :payment_method="item.payment_method"
                                ></SelectPaymentMethodTable>
                            </div>
                        </td>
                        <td>{{ formatPrice(item.total_paid) }} / {{ formatPrice(item.total_charge) }}</td>
                        <td>
                            <vue-numeric
                                :name="`amount_${item.index}`"
                                class="productNumeric"
                                style="margin-left: -8px"
                                placeholder="0"
                                outlined
                                separator="."
                                v-model.number="item.amount"
                                :error-messages="error.amount"
                            ></vue-numeric>
                        </td>
                        <td>
                            <UploadImageTable
                                :minWidth="250"
                                :minHeight="250"
                                :maxSize="2000"
                                :forImgName="item.code"
                                :imageFromUpdate="item.image_url"
                                :errorMsg="error.image"
                                :type="'sales_payment'"
                                :idx="index"
                                :extention="'jpeg'"
                                :accept="'image/jpeg,image/jpg'"
                                @click="selectImage(index)"
                                :isProceed="isProceed"
                            >
                            </UploadImageTable>
                        </td>
                        <td>
                            <v-text-field
                                :name="`note_${item.index}`"
                                single-line
                                hide-details
                                outlined
                                v-model="item.note"
                                dense
                                maxlength="250"
                                class="rounded-form-sm"
                            ></v-text-field>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="totalTransactionBox">
            <div class="box">
                <v-row>
                    <v-col>
                        <v-card-actions>
                            <v-btn text class="btn-text" color="#50ABA3" :disabled="!this.selectedInvoice.length" @click="popupSelectedSalesInvoice = true">List Selected Sales Invoice</v-btn>
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
                                @click="proceedSalesInvoice()"
                                :disabled="disabledBtnProceed"
                            >
                                Proceed
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
                            <v-btn icon @click="popupImage = false">
                                <v-img
                                    src="/icon/close-new.png"
                                    max-height="24px"
                                    max-width="24px"
                                ></v-img>
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
        <v-dialog v-model="popupSelectedSalesInvoice" persistent max-width="900px">
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="6">
                            Selected Sales Invoice
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="table.selectedInvoice"
                        :items="selectedInvoice"
                        :loading="loading"
                        :items-per-page="-1"
                        :hide-default-footer="true"
                        item-key="id"
                    >
                        <template v-slot:item="{ item, index }">
                            <tr style="height: 48px">
                                <td>{{ item.customer }}</td>
                                <td>{{ item.code }}</td>
                                <td>{{ formatPrice(item.amount) }}</td>
                                <td class="right">
                                    <v-btn
                                        icon
                                        :name="`removeSelectedInvoice_${index}`"
                                        @click="removeSelectedInvoice(index)"
                                    >
                                        <v-img
                                            src="/icon/close-new.png"
                                            max-height="20px"
                                            max-width="20px"
                                        ></v-img>
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                    <v-row class="mt16">
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
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="popupSelectedSalesInvoice = false"
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
                        :disabled="disabledBtnSave"
                        @click="confirmButton"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>
<script>
import Vue from 'vue'
export default {
    name: "CreateBulkPaymentEDN",
    data() {
        return {
            items: [],
            error: {},
            ConfirmData: {},
            search: "",
            loading: false,
            filter: true,
            table: {
                fields: [
                    {
                        text: "Customer",
                        width: "15%",
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
                        text: "Invoice Date / Status",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Payment Method",
                        width: "20%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Sales Payment / Invoice Amount",
                        width: "15%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Payment Amount",
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
                        width: "15%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                ],
                selectedInvoice: [
                    {
                        text: "Customer",
                        width: "20%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Sales Invoice Code",
                        width: "15%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Payment Amount",
                        width: "20%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    }
                ]
            },
            received_date: new Date(Date.now() + 3600 * 1000 * 7)
                .toISOString()
                .substr(0, 10),
            so_delivery_date: "",
            delivery_date: "",
            checkedInvoice: [],
            selectedInvoice: [],
            pagination: {
                page: 0,
                rowsPerPage: 100,
                totalItems: 0,
            },
            form: {
                name: "",
            },
            SelectedWarehouse: "",
            warehouse: null,
            delivery_date: new Date(Date.now() + 3600 * 1000 * 7)
                .toISOString()
                .substr(0, 10),
            delivery_date_model: "",
            disabledBtnProceed: true,
            ConfirmData: {},
            popupImage: false,
            popupSelectedSalesInvoice: false,
            transferProof: "",
            isProceed: false
        };
    },
    computed: {
        totalPayment() {
            let total = 0;
            let array = this.selectedInvoice;
            if (array) {
                for (let i = 0; i < array.length; i++) {
                    total += parseFloat(array[i].amount);
                }
            }
            let val = (total / 1).toFixed(2).replace(".", ",");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        disabledBtnSave() {
            if (!this.selectedInvoice.length) {
                return true
            } else {
                return false
            }
        }
    },
    mounted() {
        let self = this;
        this.$root.$on("event_error", function (err) {
            self.error = err;
        });
        this.$root.$on("event_uploadImage", function (image) {
            if(image && self.items[image.index]) {
                Object.assign(self.items[image.index], {image_url: image.url})
            }
        });
    },
    methods: {
        //For select payment method
        paymentmethodSelected(d, index) {
            this.items[index].payment_method = d;
            const compareSelectedPayment = this.checkedInvoice.findIndex(
                (checkedItem) => checkedItem?.id === d.id
            );
            if (compareSelectedPayment) {
                this.checkedInvoice?.[compareSelectedPayment];
            }
        },
        //Fox get list active payment
        async renderData(search) {
            this.loading = true;
            let so_delivery_date = "";
            if (this.delivery_date) {
                so_delivery_date =
                    this.delivery_date + "|" + this.delivery_date;
            }
            let warehouse = "";
            if (this.SelectedWarehouse) {
                warehouse =
                    "|salesorder.warehouse.id.e:" + this.SelectedWarehouse;
            }
            await this.$http
                .get("/finance/sales/invoice/filter", {
                    params: {
                        page: this.pagination.page,
                        perpage: this.pagination.rowsPerPage,
                        embeds: "salesorder.branch.merchant,salesorder,salesorder.paymentgroup",
                        conditions:
                            "Or.code.icontains:" +
                            search +
                            "%2COr.salesorder.branch.name.icontains:" +
                            search +
                            "|salesorder.ordertype.id.e:851968" +
                            "|salesorder.delivery_date:" +
                            this.delivery_date +
                            "|status:6%2COr.status:1" +
                            warehouse,
                        delivery_date: so_delivery_date,
                        orderby: "id",
                    },
                })
                .then((response) => {
                    this.loading = false;
                    let array = response.data.data;

                    if (array === null) {
                        this.items = [];
                        this.pagination.totalItems = 0;
                    } else {
                        array = array.map((item) => {
                            const indexOnCheckedInvoice =
                                this.checkedInvoice.findIndex(
                                    (checkedItem) =>
                                        checkedItem.id === item.id
                                );

                            if (indexOnCheckedInvoice !== -1) {
                                return this.checkedInvoice?.[
                                    indexOnCheckedInvoice
                                ];
                            }
                            return {
                                sales_invoice_id: item.id,
                                customer:
                                    item.sales_order.branch.code +
                                    " - " +
                                    item.sales_order.branch.name,
                                code: item.code,
                                status: item.status,
                                invoice_date: item.recognition_date,
                                delivery_date: item.sales_order.delivery_date,
                                amount: item.total_charge - item.total_paid,
                                total_charge: item.total_charge,
                                total_paid: item.total_paid,
                                id: item.id,
                                note: "",
                                payment_method: null,
                                image_url: "",
                                fix_va: false,
                            };
                        });

                        this.items = array;
                        this.pagination.totalItems = response.data.total;
                    }
                });
        },
        // For Filter Warehouse
        warehouseSelected(d) {
            this.warehouse = null;
            this.SelectedWarehouse = "";
            if (d) {
                this.SelectedWarehouse = d.id;
                this.warehouse = d;
            }
        },
        // For Create Active Payment
        confirmButton() {
            let saveData = {
                sales_invoice_items: [],
            };
            saveData.received_date = this.received_date;
            for (let i = 0; i < this.selectedInvoice.length; i++) {
                saveData.sales_invoice_items.push({
                    payment_method_id:
                        this.selectedInvoice[i].payment_method.id,
                    amount: this.selectedInvoice[i].amount,
                    sales_invoice_id: this.selectedInvoice[i].id,
                    note: this.selectedInvoice[i].note,
                    image_url: this.selectedInvoice[i].image_url,
                    fix_va: this.selectedInvoice[i].fix_va,
                });
            }
            this.ConfirmData = {
                model: true,
                title: "Create Active Payment",
                text: "Are you sure want to create this active payment list?",
                urlApi: "/sales/payment/bulk/active",
                nextPage: "/finance/edn-payment",
                data: saveData,
                post: true,
            };
        },
        // For selected image on unconfirmed payment list
        selectImage(idx) {
            this.popupImage = true;
            this.transferProof = this.items[idx].image_url;
        },
        // To set list selected invoice
        proceedSalesInvoice() {
            const newItems = this.items.filter((item) => this.checkedInvoice.findIndex(checked => checked.id === item.id) === -1)
            this.selectedInvoice = [...this.selectedInvoice, ...this.checkedInvoice]
            this.checkedInvoice = []
            this.items = newItems
            this.isProceed = !this.isProceed
        },
        // For remove selected invoice
        removeSelectedInvoice(idx) {
            this.items.push(this.selectedInvoice[idx])
            this.selectedInvoice.splice(idx, 1)
        }
    },
    watch: {
        checkedInvoice: {
            handler: function (val) {
                this.disabledBtnProceed = true;
                if (this.checkedInvoice.length > 0) {
                    const isAllPaymentMethodsFilled =
                        this.checkedInvoice.every(
                            (item) => item.payment_method !== null
                        );
                    if (isAllPaymentMethodsFilled) {
                        this.disabledBtnProceed = false;
                        return;
                    }
                }
                return;
            },
            deep: true,
        },
        search: {
            handler: function (val) {
                let that = this
                if (this.warehouse && this.delivery_date && val) {
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function () {
                        Vue.nextTick(() => {
                            that.items = []
                            that.renderData(val)
                        });
                    }, 1000);
                } 
            },
            deep: true
        },
        warehouse: {
            handler: function (val) {
                let that = this
                if (this.search && this.delivery_date && val) {
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function () {
                        Vue.nextTick(() => {
                            that.items = []
                            that.renderData(that.search)
                        });
                    }, 1000);
                } 
            },
            deep: true
        },
        delivery_date: {
            handler: function (val) {
                let that = this
                if (this.warehouse && this.search && val) {
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function () {
                        Vue.nextTick(() => {
                            that.items = []
                            that.renderData(that.search)
                        });
                    }, 1000);
                } 
            },
            deep: true
        },
    },

};
</script>