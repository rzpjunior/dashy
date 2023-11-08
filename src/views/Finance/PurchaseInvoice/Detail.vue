<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{purchaseInvoiceDetail.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="purchaseInvoiceDetail.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >
                            Active
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >
                            Finished
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >
                            Cancelled
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.status == 6">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('partial')"
                        >
                            Partial
                        </v-btn>
                    </div>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-privilege="'pp_crt'" @click="dialog = true" v-if="purchaseInvoiceDetail.status == 1 || purchaseInvoiceDetail.status == 6">
                                <v-list-item-content>
                                    <v-list-item-title>Create Payment</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="purchaseInvoiceDetail.is_paid == 1" v-privilege="'pp_rdl'" :to="{ name: 'PurchasePaymentList', params: { id: purchaseInvoiceDetail.id } }">
                                <v-list-item-content>
                                    <v-list-item-title>Payment List</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'pi_upd'" :to="{ name: 'PurchaseInvoiceUpdate', params: { id: purchaseInvoiceDetail.id } }" v-if="purchaseInvoiceDetail.status == 1">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="purchaseInvoiceDetail.status == 1">
                                <hr/>
                            </div>
                            <v-list-item v-privilege="'pi_can'" @click="changeStatus(purchaseInvoiceDetail.id)" v-if="purchaseInvoiceDetail.status == 1">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="purchaseInvoiceDetail.status == 1">
                                <hr/>
                            </div>
                            <v-list-item v-privilege="'pi_rdd'" @click="seeHistory(purchaseInvoiceDetail.id)">
                                <v-list-item-content>
                                    <v-list-item-title>See History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="purchaseInvoiceDetail.status != 3">
                                <hr/>
                            </div>
                            <v-list-item @click="popupTaxInvoice = true" v-privilege="'pi_add_tax_invoice'" v-if="purchaseInvoiceDetail.status != 3">
                                <v-list-item-content>
                                    <v-list-item-title>Add Tax Invoice</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Purchase Invoice Date'" :value="formatDate(purchaseInvoiceDetail.recognition_date)"/>
                    <DetailRowNew :name="'Payment Term'" :value="purchaseInvoiceDetail.purchase_order.term_payment_pur.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Purchase Invoice Due Date'" :value="formatDate(purchaseInvoiceDetail.due_date)"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="purchaseInvoiceDetail.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs16 bold">
                    Purchase Order Info
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >
                            Active
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >
                            Finished
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >
                            Cancelled
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 7">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('on_delivery')"
                        >
                            On Delivery
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 8">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('delivered')"
                        >
                            Delivered
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 9">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_not_delivered')"
                        >
                            Invoiced Not Delivered
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 10">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_on_delivery')"
                        >
                            Invoiced On Delivery
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 11">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_delivered')"
                        >
                            Invoiced Delivered
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 12">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('paid_not_delivered')"
                        >
                            Paid not Delivered
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 13">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('paid_on_delivery')"
                        >
                            Paid on Delivery
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Purchase Order Code'" :value="purchaseInvoiceDetail.purchase_order.code"/>
                    <DetailRowNew :name="'Purchase Order Date'" :value="formatDate(purchaseInvoiceDetail.purchase_order.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier'" :value="purchaseInvoiceDetail.purchase_order.supplier.name"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table -mt4">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :hide-default-footer="true"
                :items="items"
                :loading="loading"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.purchase_order_item.order_qty) }}</td>
                        <td>
                            <span v-if="props.item.good_receipt_item">
                                {{ formatPrice(props.item.good_receipt_item.receive_qty) }}
                            </span>
                            <span v-else>
                                {{ formatPrice(0) }}
                            </span>
                        </td>
                        <td>{{ formatPrice(props.item.invoice_qty) }}</td>
                        <td>{{ formatPrice(props.item.tax_percentage) }}</td>
                        <td>
                            <span v-if="props.item.include_tax === 1">Yes</span>
                            <span v-else>No</span>
                        </td>
                        <td>
                            <div v-if="props.item.include_tax === 1">
                                <span>{{ formatPrice(Math.round(props.item.unit_price_tax * (100 / (100 + props.item.tax_percentage)))) }}</span>
                                /
                                <span v-if="props.item.tax_percentage">{{ formatPrice(Math.round(props.item.unit_price_tax)) }}</span>
                                <span v-else>0</span>
                            </div>
                            <div v-else>
                                <span>{{ formatPrice(Math.round(props.item.unit_price)) }}</span>
                                /
                                <span v-if="props.item.tax_percentage">{{ formatPrice(Math.round(props.item.unit_price * (100 + props.item.tax_percentage) /100)) }}</span>
                                <span v-else>0</span>
                            </div>
                        </td>
                        <td>{{ formatPrice(props.item.tax_amount) }}</td>
                        <td>{{ formatPrice(props.item.subtotal) }}</td>
                        <td>
                            <span v-if="props.item.note">{{ props.item.note }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Adjustment Note'" :value="purchaseInvoiceDetail.adj_note"/>
                </v-col>
                <v-col class="text-black60" cols="12" md="6">
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Total:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(purchaseInvoiceDetail.total_price)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Total Tax Amount:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{ totalTaxAmount }}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Total Debit Note:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{ totalDebitNote }}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Delivery Fee:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(purchaseInvoiceDetail.delivery_fee)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Adjustment (Rp):
                            </div>
                            <div class="col d-flex justify-end text-black" v-if="purchaseInvoiceDetail.adjustment == 2">
                                - {{formatPrice(purchaseInvoiceDetail.adj_amount)}}
                            </div>
                            <div class="col d-flex justify-end text-black" v-else>
                                {{formatPrice(purchaseInvoiceDetail.adj_amount)}}
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="-mt15 fs20 text-black bold">
                        <div class="row">
                            <div class="col">
                                Grand Total Invoice (Rp):
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(purchaseInvoiceDetail.status === 3 ? purchaseInvoiceDetail.total_charge + debitNote : purchaseInvoiceDetail.total_charge)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt15 fs20 text-black bold">
                        <div class="row">
                            <div class="col">
                                Remaining Amount (Rp):
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(purchaseInvoiceDetail.status === 3 ? purchaseInvoiceDetail.remaining_amount + debitNote : purchaseInvoiceDetail.remaining_amount)}}
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <div class="row d-flex align-end justify-end pa20">
                    <v-btn
                        elevation="0"
                        class="no-caps px-7"
                        @click="$router.go(-1)"
                    >
                        Back
                    </v-btn>
                </div>
            </v-row>
        </div>
        <div class="ma12 wp100">
            <v-row>
                <v-col cols="12" md="6" v-if="isNotCancelled">
                    <div class="box-col" v-privilege="'dn_rdd'">
                        <div class="bold">
                            Debit Note
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="purchaseInvoiceDetail.debit_note">
                            <div v-for="(item, idx) in purchaseInvoiceDetail.debit_note" :key="idx" >
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/finance/debit-note/detail/${item.id}`" 
                                            target="_blank"
                                        >
                                            {{item.code}}
                                        </router-link>
                                    </v-col>
                                    <v-col class="d-flex justify-end">
                                        <span class="mr-8">
                                           Total Amount: {{formatPrice(item.total_price)}}
                                        </span>
                                        <div v-if="item.status == 1">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('active')"
                                            >Active
                                            </v-btn>
                                        </div>
                                        <div v-if="item.status == 2">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('finished')"
                                            >Finished
                                            </v-btn>
                                        </div>
                                        <div v-if="item.status == 3">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('cancelled')"
                                            >Cancelled
                                            </v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>
                            <v-divider class="my-3"/>
                        </div>
                        <v-row v-else>
                            <v-col class="flex-align-center">
                                No data to display
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="box-col">
                        <div class="bold">
                            Purchase Tax Invoice
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="purchaseInvoiceDetail.tax_invoice_url">
                            <v-row>
                                <v-col class="d-flex align-center">
                                    {{ purchaseInvoiceDetail.tax_invoice_number }}
                                </v-col>
                                <v-col class="d-flex justify-end">
                                    <div v-for="(item, idx) in tax_invoice_url" :key="idx">
                                        <div>
                                            <a :href="`${item}`" target="_blank" class="text-secondary">DOC {{ idx + 1}}</a>
                                            <span v-if="idx + 1 !== tax_invoice_url.length">, </span>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                        <v-row v-else>
                            <v-col class="flex-align-center">
                                No data to display
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <v-dialog
            v-model="dialog"
            max-width="1037px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="11">
                            Create Payment
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="1">
                            <v-btn
                                icon
                                @click="dialog = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal mt1"/>
                <v-card-text class="mt-6">
                    <v-row>
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
                                            name="payment_date"
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            required
                                            clearable
                                            @click:clear="payment_date = ''"
                                            v-model="payment_date"
                                            maxlength="10"
                                            onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Purchase Payment Date <span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    no-title
                                    v-model="payment_date"
                                    @input="payment_date_model = false"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="6">
                            <SelectPaymentMethod
                                name="payment_method"
                                :label="'Payment Method '"
                                @selected="paymentmethodSelected"
                                required
                                :dense="true"
                                :error="error.payment_method_id"
                            ></SelectPaymentMethod>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-text-field
                                name="bank_payment_voucher_number"
                                v-model="bank_payment_voucher_number"
                                required
                                outlined
                                maxlength="20"
                                dense
                                :error-messages="error.bank_payment_voucher_number"
                            >
                                <template v-slot:label>
                                    Bank Payment Voucher Number<span class="text-red">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt45">
                            <div class="fs12">
                                Amount <span class="text-red">*</span>
                            </div>
                            <vue-numeric
                                name="paid_amount"
                                class="productNumeric -ml1 -mt1"
                                placeholder="0,00"
                                separator="."
                                :precision="2"
                                required
                                v-model.number="amount"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                                :error-messages="error.amount"
                            >
                                <template v-slot:label>
                                    Amount <span class="text-red">*</span>
                                </template>
                            </vue-numeric>
                        </v-col>                        
                    </v-row>
                </v-card-text>
                <div class="hr-title-modal -mt28"/>
                <v-card-text>
                    <v-row>
                        <v-col class="d-flex">
                            <v-checkbox
                                name="paid_off"
                                v-model="paid_off"
                                :label="'Paid Off'"
                            ></v-checkbox>
                            <v-checkbox
                                class="ml26"
                                name="with_image"
                                v-model="with_image"
                                :label="'With Image'"
                            ></v-checkbox>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="d-flex -mt20">
                            <v-textarea
                                v-model="note"
                                name="adj_note"
                                required
                                outlined
                                rows="4"
                            >
                                <template v-slot:label>
                                    <div>
                                        Note
                                    </div>
                                </template>
                            </v-textarea>
                            <SelectSingleImageNew 
                                v-if="with_image" 
                                :forImgName="purchaseInvoiceDetail.code" 
                                :errorMsg="error.image" 
                                :maxSize="2" 
                                :extention="'JPG'"
                                class="ml32"
                            ></SelectSingleImageNew>
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
                        @click="dialog = false"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                        @click="createPurchasePayment()"
                    >
                        Pay
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="popupTaxInvoice"
            max-width="1037px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="11">
                            Add Tax Invoice
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="1">
                            <v-btn
                                icon
                                @click="popupTaxInvoice = false, resetFormTaxInvoice()"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal mt1"/>
                <v-card-text class="mt-6">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field
                                name="tax_invoice_number"
                                required
                                outlined
                                maxlength="50"
                                dense
                                v-model="tax_invoice_number"
                                :error-messages="error.tax_invoice_number"
                            >
                                <template v-slot:label>
                                    Tax Invoice number<span class="text-red">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" class="-mt24">
                            <v-row>
                                <UploadFileMultiple 
                                    class="ma-3"
                                    title="Tax Invoice"
                                    :name="purchaseInvoiceDetail.code" 
                                    :error="error.tax_invoice_url"
                                    :directory="'invoice'"
                                />
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
                        @click="popupTaxInvoice = false, resetFormTaxInvoice()"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                        @click="addTaxInvoice()"
                        :disabled="disabledButton"
                    >
                        Add
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>

<script>
    export default {
        name: "PurchaseInvoiceDetail",
        data() {
            return {
                dialog: false,
                overlay: false,
                pdfControlValue: {
                    showLayout: false,
                    floatLayout: true,
                    enableDownload: false,
                    previewModal: false,
                    paginateElementsByHeight: 900,
                    pdfQuality: 2,
                    pdfFormat: 'a4',
                    pdfOrientation: 'portrait',
                    pdfContentWidth: '800px',
                    manualPagination: true,
                },
                loading: false,
                table: {
                    fields: [
                        {
                            text:'No',
                            width: "3%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Product',
                            width: "13%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'UOM',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Order Qty',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Received Qty',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Invoice Qty',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Tax',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Include Tax',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Unit Price non Tax / Unit Price Tax',
                            width: "12%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Tax Amount',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Subtotal',
                            width: "8%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Note',
                            width: "12%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                    ],
                },
                items: [],
                ConfirmData: {},
                purchaseInvoiceDetail:{
                    purchase_order: {
                        term_payment_pur: {
                            name: '',
                        },
                        supplier: {
                            name: '',
                        }
                    }
                },
                loading:true,
                error:{},
                payment_date_model: '',
                payment_date: new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                payment_method:'',
                payment_method_id: '',
                amount: 0,
                paid_off: false,
                with_image: false,
                note: '',
                image: '',
                total_amount: 0,
                total_charge: 0,
                bank_payment_voucher_number: '',
                dataAuditLog: {},
                popupTaxInvoice: false,
                tax_invoice_number: '',
                tax_invoice_url: [],
                isNotCancelled: true,
                debitNote: 0,
            }
        },
        computed: {
            staff () {
                return this.$store.getters.getStaff
            },
            totalTaxAmount() {
                let total = 0;
                let array = this.items;
                for (let i = 0; i < array.length; i++) {
                    total += Math.round(array[i].tax_amount);
                }
                let val = (total / 1).toFixed(2).replace(".", ",");
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            totalDebitNote() { // calculating total of active debit note
                this.debitNote = 0
                let total = 0;
                let array = this.purchaseInvoiceDetail.debit_note;
                if (array) {
                    for (let i = 0; i < array.length; i++) {
                        total += Math.round(array[i].total_price);
                    }
                }
                this.debitNote = total
                let val = (total / 1).toFixed(2).replace(".", ",");
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            disabledButton() {
                if (!this.tax_invoice_number || !this.tax_invoice_url) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods:{
            // For see history
            seeHistory(id) {
                this.dataAuditLog = {
                    model : true,
                    id: id,
                    type: "purchase_invoice"
                }
            },
            // For get api detail purchase invoice
            async renderData(){
                this.loading=true
                    await this.$http.get("/finance/purchase/invoice/"+this.$route.params.id)
                    .then(response => {
                        this.loading = false
                        this.purchaseInvoiceDetail = response.data.data
                        this.items = response.data.data.purchase_invoice_items
                        this.tax_invoice_url = response.data.data.tax_invoice_url.split(',')
                        this.isNotCancelled =  response.data.data.status != 3 ? true : false;
                        if(this.items === null){
                            this.items = []
                        }
                        this.total_charge = response.data.data.total_charge
                        this.$http.get("/finance/purchase/payment",{params:{
                                embeds:'purchaseinvoice,purchaseinvoice.purchaseorder,paymentmethod',
                                conditions:"purchaseinvoice.id.e:"+this.$route.params.id,
                            }}).then(responsePayment => {
                                if (responsePayment.data.data) {
                                    for (let i=0;i<responsePayment.data.data.length; i++) {
                                        if(responsePayment.data.data[i].amount && (responsePayment.data.data[i].status === 2)){
                                            this.total_amount += parseFloat(responsePayment.data.data[i].amount)
                                            this.amount = this.total_charge -  this.total_amount
                                        }
                                    }
                                }
                        });
                        if (this.amount == 0) {
                            this.amount = this.total_charge
                        }
                        this.loading = false
                    });
            },
            // For create purchase payment
            createPurchasePayment() {
                this.overlay = true
                let paidOff = ''
                if (this.paid_off == true) {
                    paidOff = 1
                } else {
                    paidOff = 2
                }

                this.form = {
                    recognition_date : this.payment_date,
                    payment_method_id: this.payment_method_id,
                    amount: parseFloat(this.amount),
                    paid_off: paidOff,
                    note: this.note,
                    image_url: this.image,
                    purchase_invoice_id: this.purchaseInvoiceDetail.id,
                    bank_payment_voucher_number : this.bank_payment_voucher_number
                }
                this.$http.post('/finance/purchase/payment',this.form)
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
            // For change status
            changeStatus(id) {
                this.ConfirmData = {
                    model : true,
                    statusMsg : "Success to Cancel this Purchase Invoice",
                    title : "Cancel Purchase Invoice",
                    text : "Why was this purchase invoice cancelled?",
                    urlApi : "/finance/purchase/invoice/cancel/"+id,
                    nextPage : "/finance/purc-invoice/:id",
                    cancelNote : "Note",
                    noDisable : true,
                    data : {}
                }
            },
            // For select payment payment
            paymentmethodSelected(d) {
                this.payment_method = '';
                this.payment_method_id = '';
                if (d !== '') {
                    this.payment_method = d;
                    this.payment_method_id = d.id
                }
            },
            // For reset form add tax invoice
            resetFormTaxInvoice(){
                this.tax_invoice_url = []
                this.tax_invoice_number = ""
            },
            // For add tax invoice
            addTaxInvoice(){
                this.overlay = true
                const formAddTaxInvoice = {
                    tax_invoice_number: this.tax_invoice_number,
                    tax_invoice_url: this.tax_invoice_url.join()
                }
                this.$http.put(`/finance/purchase/invoice/${this.purchaseInvoiceDetail.id}/tax-invoice`, formAddTaxInvoice)
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
            }
        },
        created() {
            this.renderData()
        },
        mounted () {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    window.location.reload();
                }
            });
            this.$root.$on('event_error', function(err){
                self.error = err
                self.imageError = err.image;
            });
            this.$root.$on('event_singleImage', function(image){
                self.image = image
            });
            this.$root.$on('event_multipleFile', function (url) {
                self.tax_invoice_url = url
            });
        },
        watch: {
            with_image: {
                handler: function (val) { // ini untuk clear data
                    if(val == false){
                        this.image = ''
                    }
                },
                deep: true
            },
        },
    }
</script>