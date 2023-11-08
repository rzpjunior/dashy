<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{items.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="this.items.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >Active
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >Finished
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >Cancelled
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 7">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('on_delivery')"
                        >On Delivery
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 8">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('delivered')"
                        >Delivered
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 9">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_not_delivered')"
                        >Invoiced not Delivered
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 10">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_on_delivery')"
                        >Invoiced on Delivery
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 11">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_delivered')"
                        >Invoiced Delivered
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 12">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('paid_not_delivered')"
                        >Paid not Delivered
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 13">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('paid_on_delivery')"
                        >Paid on Delivery
                        </v-btn>
                    </div>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item
                                v-if="this.items.status == 1 && this.items.payment_group.id != 65536 && this.items.has_ext_invoice == 2"
                                @click="update(items.id)" 
                                v-privilege="'so_upd'"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item
                                v-if="this.items.status == 8"
                                :to="`/sales-order/update-price/${this.items.id}`"
                                v-privilege="'so_upd_prc'"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Update Price</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item
                                v-if="this.items.status == 1 || this.items.status == 9 || this.items.status == 12"
                                :to="`/warehouse/delivery-order/create/${this.items.id}`"
                                v-privilege="'do_crt'"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Create Delivery</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-if="(this.items.status == 1 || this.items.status == 7 || this.items.status == 8) && this.items.payment_group.id != 65536" :to="`/finance/si/create/${this.items.id}`" v-privilege="'si_crt'">
                                <v-list-item-content>
                                    <v-list-item-title>Create Invoice</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="(this.items.status == 1 || this.items.status == 7 || this.items.status == 8) && this.items.payment_group.id != 65536">
                                <hr>
                            </div>
                            <v-list-item @click="modelDialog= true" v-if="this.items.status == 1" v-privilege="'so_can'">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item v-if="this.items.status != 3" @click="print(items.id)" v-privilege="'so_prt'">
                                <v-list-item-content>
                                    <v-list-item-title>Print</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status != 3">
                                <hr>
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
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Type'" :value="items.order_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Locked By'" v-if="items.is_locked == 1" :value="items.locked_by_name"/>
                    <DetailRowNew :name="'Locked By'" v-else :value="'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Date'" :value="format_order_date"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Delivery Date'" :value="format_delivery_date"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Estimated Outgoing Time'" :value="format_etd_date == null ? '-' : format_etd_date"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Finished Date'" v-if="items.finished_at && items.finished_at != '0001-01-01T00:00:00Z' && items.status == 2" :value="format_finished_date"/>
                    <DetailRowNew :name="'Finished Date'" v-else :value="'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'WRT'" :value="items.wrt.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div class="row">
                        <div class="col mt-1 text-black60">Picking Status :</div>
                            <div class="col mt-1 d-flex justify-end">
                                <div v-if="items.status_picking_order_assign_convert == 'New'">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('active')"
                                >
                                    New
                                </v-btn>
                            </div>
                            <div v-else-if="items.status_picking_order_assign_convert == 'On Progress'">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('on_process')"
                                >
                                    On Progress
                                </v-btn>
                            </div>
                            <div v-else-if="items.status_picking_order_assign_convert == 'Need Approval'">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('partial')"
                                >
                                    Need Approval
                                </v-btn>
                            </div>
                            <div v-else-if="items.status_picking_order_assign_convert == 'Picked'">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('picked')"
                                >
                                    Picked
                                </v-btn>
                            </div>
                            <div v-else-if="items.status_picking_order_assign_convert == 'Checking'">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('invoiced_on_delivery')"
                                >
                                    Checking
                                </v-btn>
                            </div>
                            <div v-else-if="items.status_picking_order_assign_convert == 'Finished'">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('finished')"
                                >
                                    Finished
                                </v-btn>
                            </div>
                            <div v-else>
                                -
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-3"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Order Note'" :value="items.note" :align="true"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Cancellation Note'" v-if="items.cancellation_note" :value="items.cancellation_note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <div class="fs16 bold mb48">
                Customer Info
            </div>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer'" :value="items.branch.merchant.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="items.branch.merchant.customer_group==1">
                    <DetailRowNew :name="'Outlet'" :value="items.branch.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer Type'" :value="items.archetype.business_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Term'" :value="items.term_payment_sls.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Invoice Term'" :value="items.term_invoice_sls.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Group'" :value="items.payment_group.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Sales Person'" :value="items.salesperson.name"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Billing Address'" :value="items.billing_address" :align="true" v-if="items.branch.merchant.customer_group==1"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Shipping Address'" :value="items.shipping_address" :align="true"/>
                </v-col>
            </v-row>
            <div class="row mt12 -mb36">
                <div class="col" v-if="items.branch.merchant.customer_group==1">
                </div>
                <div class="col" v-else>
                </div>
                <div style="width:5%"/>
                <div class="col" v-if="items.branch.merchant.customer_group==1">
                </div>
                <div class="col" v-else>
                </div>
            </div>
            <div class="row">
                <div class="col">
                </div>
            </div>
        </div>
        <div class="box-header-table">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items.sales_order_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.name }}<br>
                            <span class="text-black60" v-if="props.item.discount_qty > 0">
                                Qty Discount {{ props.item.discount_qty }} {{ props.item.product.uom.name }}
                            </span>
                        </td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td class="right">{{ formatPrice(props.item.order_qty) }}</td>
                        <td class="right">{{ formatUnitPrice(props.item.unit_price) }}</td>
                        <td class="right">{{ props.item.sku_disc_amount > 0? formatPrice(props.item.sku_disc_amount):'-' }}</td>
                        <td class="right">{{ formatPrice(props.item.subtotal) }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row>
                <v-col v-if="this.$store.state.staff.role.id != 524288" cols="12" md="6">
                    <DetailRowNew :name="'Voucher Code'" :value="items.vou_redeem_code" v-if="items.vou_redeem_code"/>
                    <DetailRowNew :name="'Voucher Code'" :value="'-'" v-else/>
                    <v-alert
                        v-if="(items.voucher && items.voucher.type == 4)"
                        color="#EBEBEB"
                        dark
                        outlined
                        style="border-radius: 10px; padding: 10px;"
                    >
                        <img
                            src="/icon/EdenPoint-Icon.svg"
                            alt="icon buy"
                            height="26px"
                            width="26px"
                            class="ml10 vertical-middle"
                        />
                        <span class="text-black pl8">Cashback EdenPoint {{formatUnitPrice(items.voucher.disc_amount)}}</span>
                    </v-alert>
                </v-col>
                <v-col v-else cols="12" md="6">
                    <DetailRowNew :name="'Voucher Name'" :value="items.voucher.name" v-if="items.vou_redeem_code"/>
                    <DetailRowNew :name="'Voucher Name'" :value="'-'" v-else/>
                </v-col>
                <v-col class="text-black60" cols="12" md="6">
                    <div class="row">
                        <div class="col">
                            Total :
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{formatPrice(items.total_price)}}
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="items.voucher && items.voucher.type == 1">
                            <div class="col">
                                Total Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(items.vou_disc_amount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Delivery Fee :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(items.delivery_fee)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="items.voucher && items.voucher.type == 3">
                            <div class="col">
                                Delivery Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(items.vou_disc_amount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="items.point_redeem_amount != 0">
                            <div class="col">
                                EdenPoint :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(items.point_redeem_amount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="items.voucher && items.voucher.type == 2">
                            <div class="col">
                                Grand Total Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(items.vou_disc_amount)}}
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total (Rp) :
                        </div>
                        <div class="col d-flex justify-end">
                            {{formatPrice(items.total_charge)}}
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="ma12 wp100">
            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'do_rdd'">
                        <div class="bold">
                            Delivery Order
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="items.delivery_order">
                            <div v-for="(item, idx) in items.delivery_order" :key="idx" >
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/warehouse/delivery-order/detail/${item.id}`" 
                                            target="_blank"
                                        >
                                            {{item.code}}
                                        </router-link>
                                    </v-col>
                                    <v-col class="d-flex justify-end">
                                        <div v-if="item.status == 1 || item.status == 5 || item.status == 6 || item.status == 7">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('active')"
                                            >Active
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 2">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('finished')"
                                            >Finished
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 3">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('cancelled')"
                                            > Cancelled
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 4">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('deleted')"
                                            > Deleted
                                            </v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-divider class="my-3"/>
                            </div>
                        </div>
                        <v-row v-else>
                            <v-col class="flex-align-center">
                                No data to display
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'si_rdd'">
                        <div class="bold">
                            Sales Invoice
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="items.sales_invoice">
                            <div v-for="(item, idx) in items.sales_invoice" :key="idx">
                                <div v-if="item.term_invoice_sls.code == 'SIT0002' && item.status !== 3 && items.status !== 4">
                                    <v-dialog
                                        v-model="modalPrintInvoice"
                                        max-width="402px"
                                    >
                                        <v-overlay style="z-index: 6 !important;" :value="overlayPrintInvoice">
                                            <v-progress-circular
                                                indeterminate
                                                size="84"
                                                color="green"
                                                width=15
                                            ></v-progress-circular>
                                        </v-overlay>
                                        <v-card class="OpenSans">
                                            <v-card-title>
                                                <span class="text-title-modal">Print Invoice</span>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    icon
                                                    @click="modalPrintInvoice = false"
                                                >
                                                    <img src="/icon/close-new.png" height="20px" width="20px"/>
                                                </v-btn>
                                            </v-card-title>
                                            <v-card-text>
                                                <span>Don't forget to print this invoice</span>
                                            </v-card-text>
                                            <v-card-actions class="pb-6 mr12">
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    @click="printInvoice(items.sales_invoice[items.sales_invoice.length-1].id)"
                                                    depressed
                                                    color="#50ABA3"
                                                    class="main-btn white--text"
                                                >
                                                    <v-icon left>
                                                        mdi-printer
                                                    </v-icon>
                                                    Print
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </div>
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/finance/si/detail/${item.id}`" 
                                            target="_blank"
                                        >
                                            {{item.code}}
                                        </router-link>
                                    </v-col>
                                    <v-col class="d-flex justify-end">
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
                                        <div v-else-if="item.status == 2">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('finished')"
                                            >Finished
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 3">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('cancelled')"
                                            > Cancelled
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 7">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('on_delivery')"
                                            > On Delivery
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 8">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('delivered')"
                                            > Delivered
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 9">
                                            <v-btn
                                                elevation="0"
                                                small
                                                rounded
                                                class="no-caps"
                                                :color="statusMaster('invoiced_not_delivered')"
                                            > Invoiced not Delivered
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 10">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('invoiced_on_delivery')"
                                            > Invoiced on Delivery
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 11">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('invoiced_delivered')"
                                            > Invoiced Delivered
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 12">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('paid_not_delivered')"
                                            > Paid not Delivered
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 13">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('paid_on_delivery')"
                                            > Paid on Delivery
                                            </v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-divider class="my-3"/>
                            </div>
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
        <AuditLogNew :data="dataAuditLog"/>
        <LockDialog :model="updateCheck" :locked_by="locked_by_name"/>
        <LoadingBar :value="overlay"/>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Cancel Sales Order</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this sales order cancelled?</span>
                    <SelectCancelType
                        @selected="selectedCancelType"
                        :error="error.cancel_type"
                        :dense="true"
                        class="mt-6"
                    />
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        maxlength="100"
                        :error-messages="error.note"
                        required
                        rows="3"
                    >
                        <template v-slot:label>
                            Note<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="modelDialog = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="cancelOrder()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "SODetail",
        data() {
            return {
                modalLockSO: false,
                overlay: false,
                overlayPrintInvoice: false,
                modalPrintInvoice: false,
                id_so: '',
                id_si: '',
                items: {
                    order_type: {
                        name: ""
                    },
                    wrt: {
                        name: ""
                    },
                    warehouse: {
                        name: ""
                    },
                    branch: {
                        name: "",
                        merchant: {
                            name: "",
                            customer_group: ""
                        },
                        archetype: {
                            business_type: {
                                name: ""
                            },
                        },
                    },
                    archetype: {
                        business_type: {
                            name: ""
                        },
                    },
                    term_payment_sls: {
                        name: ""
                    },
                    term_invoice_sls: {
                        name: ""
                    },
                    salesperson: {
                        name: ""
                    },
                    payment_group: {
                        name: ""
                    },
                    voucher: {
                        name: "",
                        type: ""
                    },
                    sales_order_items: [{
                        product: {
                            name: "",
                            uom:{
                                name: "",
                            }
                        }
                    }]
                },
                dataAuditLog: {},
                modelDialog: false,
                note: {
                    note: "",
                    cancel_type: 0,
                },
                error: {},
                table: {
                    fields: [
                        {
                            text: 'No.',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Product',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'UOM',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Order Qty',
                            width: "12%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            align: "right"
                        },
                        {
                            width: "12%",
                            text: 'Unit Price',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            align: "right"
                        },
                        {
                            text: 'Discount Amount',
                            width: "12%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            align: "right"
                        },
                        {
                            text: 'Subtotal',
                            width: "12%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            align: "right"
                        },
                        {
                            text: 'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        }
                    ],
                },
                user_id: '',
                updateCheck: false,
                locked_by_name: '',
            }
        },
        created() {
            this.user_id = this.$store.state.staff.id / 65536
            Vue.nextTick(() => {
                this.renderData()
                let self = this
                setTimeout(function () {
                    self.id_so = self.$route.params.id
                }, 500);
            });
        },
        computed: {
            format_order_date() {
                if (this.items.recognition_date)
                    return this.$moment(this.items.recognition_date).format('DD/MM/YYYY')
            },
            format_finished_date() {
                if (this.items.finished_at)
                    return this.$moment(this.items.finished_at).format('DD/MM/YYYY HH:mm:ss')
            },
            format_delivery_date() {
                if (this.items.delivery_date)
                    return this.$moment(this.items.delivery_date).format('DD/MM/YYYY')
            },
            format_etd_date() {
                if (this.items.etd)
                    return this.$moment(this.items.etd).format('DD/MM/YYYY HH:mm')
            },
        },
        methods: {
            selectedCancelType(d) {
                this.note.cancel_type = 0
                if (d) {
                    this.note.cancel_type = d.value
                }
            },
            update(id) {
                this.overlay = true
                this.id_so = id
                this.$http.get("/sales/order/" + this.id_so)
                    .then(responseCheck => {
                        let locked_by_id = responseCheck.data.data.locked_by
                        let locked = responseCheck.data.data.is_locked
                        let locked_checking = responseCheck.data.data.status_picking_order_assign
                        let order_type_check = responseCheck.data.data.order_type.id
                        if(locked_checking == 6){
                            this.overlay = false
                            this.modalLockSO = true
                        } else{
                            if (locked == 1 && order_type_check == 655360) {
                                if (locked_by_id == this.user_id) {
                                    this.$router.push('/sales-order/update/' + this.id_so);
                                } else {
                                    this.overlay = false
                                    this.updateCheck = true
                                    this.locked_by_name = responseCheck.data.data.locked_by_name
                                }
                            } else {
                                if (order_type_check == 655360) {
                                    this.$http.put('/sales/order/lock/' + this.id_so, {})
                                        .then(responseLock => {
                                            this.$router.push('/sales-order/update/' + this.id_so);
                                        })
                                } else {
                                    this.$router.push('/sales-order/update/' + this.id_so);
                                }
                            } 
                        }
                    })
            },
            print(id) {
                this.overlay = true
                this.id_so = id
                this.$http.get("/sales/order/print/" + this.id_so)
                    .then(response => {
                        if (response) {
                            this.filePdf = response.data.file
                        }
                        window.open(this.filePdf, '_blank');
                        this.overlay = false
                    })
            },
            printInvoice(id) {
                this.overlayPrintInvoice = true
                this.id_si = id
                this.$http.get("/finance/sales/invoice/print/" + this.id_si)
                    .then(response => {
                        if (response) {
                            this.filePdf = response.data.file
                        }
                        window.open(this.filePdf, '_blank');
                        this.overlayPrintInvoice = false
                    })
            },
            cancelOrder() {
                this.$http.put("/sales/order/cancel/" + this.$route.params.id, this.note).then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been cancelled successfully',
                        type: 'success',
                    });
                    this.renderData()
                    this.modelDialog = false
                }).catch(e => {
                    this.error = e.errors
                });
            },
            seeHistory() {
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "sales_order"
                }
            },
            renderData() {
                this.$http.get("/sales/order/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                    if (this.items.salesperson === null) {
                        this.items.salesperson = ""
                    }
                    if (response.data.data.sales_invoice) {
                        let arr = response.data.data.sales_invoice
                        for (let i = 0; i < arr.length; i++) {
                            if (response.data.data.sales_invoice.length > 0) {
                                if (this.items.term_invoice_sls.code == 'SIT0002' && this.items.sales_invoice[i].status !== 3 && this.items.sales_invoice[i].status !== 4) {
                                    this.modalPrintInvoice = true
                                }
                            }
                        }
                    }

                });
            },
        }
    }
</script>
