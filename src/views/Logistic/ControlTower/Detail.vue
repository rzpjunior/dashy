<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col class="fs24 bold">
                    {{ items.code }}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        v-if="items.status == 1"
                        elevation="0"
                        rounded
                        depressed
                        small
                        class="no-caps mb4"
                        :color="statusMaster('new')"
                    >
                        New
                    </v-btn>
                    <v-btn
                        v-if="items.status == 2"
                        elevation="0"
                        rounded
                        depressed
                        small
                        class="no-caps mb4"
                        :color="statusMaster('on_delivery')"
                    >
                        On Progress
                    </v-btn>
                    <v-btn
                        v-if="items.status == 3"
                        elevation="0"
                        rounded
                        depressed
                        small
                        class="no-caps mb4"
                        :color="statusMaster('finished')"
                    >
                        Finished
                    </v-btn>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item @click="seeHistory()">
                                <v-list-item-content>
                                    <v-list-item-title>History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="items.status == 1 || items.status == 2">
                                <hr />
                            </div>
                            <v-list-item
                                v-if="items.status == 1 || items.status == 2"
                                v-privilege="'ctrl_twr_can'"
                                @click="cancelBulkData = items.id, cancelBulkDialog = true"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mb25">
                    <DetailRowNew :name="'Courier'" :value="`${items.courier.code} - ${items.courier.name}`" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-row class="mb1">
                        <v-col>
                            <div class="text-black60">Phone Number</div>
                        </v-col>
                        <v-col>
                            <div class="d-flex justify-end">
                                <a 
                                    v-bind:href="'https://wa.me/62' + items.courier.phone_number + '?text=%2APesan%20dari%20EdenFarm%20Control%20Tower%3A%2A%0A'"
                                    target="_blank"
                                >
                                    +62{{items.courier.phone_number}}
                                </a>
                                <v-img 
                                    src="/img/whatsapp-icon.svg"
                                    max-height="25"
                                    max-width="25"
                                    class="ml10"
                                ></v-img>
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt12 -mb12">
                    <DetailRowNew :name="'Vendor'" :value="items.courier.vehicle_profiles.courier_vendor.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt12">
                    <DetailRowNew :name="'Vehicle'" :value="items.courier.vehicle_profiles.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'License Plate'" :value="items.courier.license_plate" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.courier.vehicle_profiles.courier_vendor.warehouse.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Start Time'" :value="start_time" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Finish Time'" :value="finish_time" />
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col cols="12" md="6">
                    <v-row>
                        <div class="flex-justify-center">
                            <v-col>
                                Total SO: {{total_so ? total_so : '-'}}
                                |
                                Delivery Return: {{total_return ? total_return : '-'}}
                                |
                                Self-Pickup: {{total_selfPickup ? total_selfPickup : '-'}}
                                |
                            </v-col>
                        </div>
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <div class="box-body">
            <v-row>
                <v-col cols="12" md="5">
                    <div class="scroll-list fill-height">
                        <div
                            class="d-flex justify-center"
                            v-if="isLoadingItems"
                        >
                            <div class="mt15">
                                <div class="text-center">
                                    <v-progress-circular
                                        :size="20"
                                        indeterminate
                                        color="#50ABA3"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="ma12 wp100" v-else>
                            <v-row
                                v-for="(item, index) in dataDrs"
                                :key="index"
                            >
                                <v-col>
                                    <div
                                        class="d-flex justify-center scroll-list fill-height"
                                        v-if="error"
                                    >
                                        <div class="mt15">
                                            <div class="text-center">
                                                <v-col>
                                                    <div class="-mt24 -ml15 -mr15">
                                                        <div class="text-center bold">No Data Available</div>
                                                    </div>
                                                </v-col>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="box-col-ep -ml15 mr15 -mb10" v-else>
                                        <v-row class="-mr30">
                                            <v-col cols="12" md="6">
                                                <v-row>
                                                    <div class="flex-justify-center">
                                                        <v-col>
                                                            <v-btn
                                                                fab
                                                                depressed
                                                                x-small
                                                                class="bold mb4 mr20"
                                                                :color="statusMaster('new')"
                                                            >
                                                                <span class="fs12">{{index + 1}}</span>
                                                            </v-btn>
                                                            <router-link
                                                                :to="`/logistic/control-tower/detail/${$route.params.id}`"
                                                                @click.native="detailSO = item, deliveryReturn = item.delivery_run_return, postPoneDelivery = item.postpone_delivery_log, detailDialog = true, currentPage = index + 1, checkPage()"
                                                            >
                                                                <span class="-ml15">{{ item.sales_order.code }}</span>
                                                            </router-link>
                                                        </v-col>
                                                    </div>
                                                </v-row>
                                            </v-col>
                                            <v-col class="d-flex justify-end align-end">
                                                <v-btn
                                                    v-if="item.status == 1"
                                                    elevation="0"
                                                    rounded
                                                    depressed
                                                    small
                                                    class="no-caps mb4"
                                                    :color="statusMaster('new')"
                                                >
                                                    New
                                                </v-btn>
                                                <v-btn
                                                    v-if="item.status == 2"
                                                    elevation="0"
                                                    rounded
                                                    depressed
                                                    small
                                                    class="no-caps mb4"
                                                    :color="statusMaster('on_delivery')"
                                                >
                                                    On Progress
                                                </v-btn>
                                                <v-btn
                                                    v-if="item.status == 3"
                                                    elevation="0"
                                                    rounded
                                                    depressed
                                                    small
                                                    class="no-caps mb4"
                                                    :color="statusMaster('finished')"
                                                >
                                                    Finished
                                                </v-btn>
                                                <v-btn
                                                    v-if="item.status == 4"
                                                    elevation="0"
                                                    rounded
                                                    depressed
                                                    small
                                                    class="no-caps mb4"
                                                    :color="statusMaster('draft')"
                                                >
                                                    Postponed
                                                </v-btn>
                                                <v-btn
                                                    v-if="item.status == 5"
                                                    elevation="0"
                                                    rounded
                                                    depressed
                                                    small
                                                    class="no-caps mb4"
                                                    :color="statusMaster('cancelled')"
                                                >
                                                    Failed
                                                </v-btn>
                                                <v-menu offset-y>
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn icon v-on="on">
                                                            <v-icon>mdi-dots-vertical</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <v-list class="bg-white">
                                                        <v-list-item
                                                            v-if="item.status != 3 && item.status != 5"
                                                            v-privilege="'ctrl_twr_can'"
                                                            @click="cancelData = item.id, modelDialog = true"
                                                        >
                                                            <v-list-item-content>
                                                                <v-list-item-title>Cancel</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="d-flex justify-end align-end">
                                                <v-btn
                                                    v-if="item.delivery_run_return"
                                                    elevation="0"
                                                    rounded
                                                    depressed
                                                    small
                                                    class="no-caps -mt16 mr10"
                                                    :color="statusMaster('failed')"
                                                >
                                                    Delivery Return
                                                </v-btn>
                                                <v-btn
                                                    v-if="item.sales_order.order_type.name == 'Self Pickup'"
                                                    elevation="0"
                                                    rounded
                                                    depressed
                                                    small
                                                    class="no-caps -mt16"
                                                    :color="statusMaster('failed')"
                                                >
                                                    Self-Pickup
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" class="-mt15">
                                                Delivery Date
                                            </v-col>
                                            <v-col class="d-flex justify-end align-end -mt15">
                                                {{formatDate(item.sales_order.delivery_date)}}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" class="-mt24">
                                                WRT
                                            </v-col>
                                            <v-col class="d-flex justify-end align-end -mt24">
                                                {{item.sales_order.wrt.name}}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" class="-mt24">
                                                Note
                                            </v-col>
                                            <v-col class="d-flex justify-end align-end -mt24">
                                                {{ item.note ? item.note : '-' }}
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="7">
                    <div
                        class="d-flex justify-center scroll-list fill-height"
                        v-if="loadingMaps"
                    >
                        <div class="mt15">
                            <div class="text-center">
                                <v-progress-circular
                                    :size="20"
                                    indeterminate
                                    color="#50ABA3"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div
                            class="d-flex justify-center scroll-list fill-height"
                            v-if="error"
                        >
                            <div class="mt15">
                                <div class="text-center">
                                    <v-col>
                                        <div class="mt10 -ml15 -mr15">
                                            <div class="text-center bold">No Data Available</div>
                                        </div>
                                    </v-col>
                                </div>
                            </div>
                        </div>
                        <l-map
                            :options="options"
                            style="height: 500px; width: 100%;"
                            :center="centerData"
                            v-else
                        >
                            <l-tile-layer
                                :options="options"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <v-marker-cluster
                                :options="clusterOptions"
                            >
                                <div
                                    v-for="(item, idx) in dataDrs"
                                    :key="idx"
                                >
                                <!-- FOR CUSTOMER PIN POINT -->
                                    <l-marker
                                        v-if="item.step_type == 2"
                                        :visible="true"
                                        :draggable="false"
                                        :lat-lng="[
                                            item.customer_latitude,
                                            item.customer_longitude
                                        ]"
                                    >
                                        <l-icon
                                            :icon-size="[30, 40]"
                                            :icon-anchor="staticAnchor"
                                        >
                                            <v-btn
                                                v-if="item.status == 1"
                                                elevation="24"
                                                fab
                                                depressed
                                                small
                                                class="bold mb4"
                                                :color="statusMaster('new')"
                                            >
                                                <span class="fs16">{{idx + 1}}</span>
                                            </v-btn>
                                            <v-btn
                                                v-if="item.status == 2"
                                                elevation="24"
                                                fab
                                                depressed
                                                small
                                                class="bold mb4"
                                                :color="statusMaster('on_delivery')"
                                            >
                                                <span class="fs16">{{idx + 1}}</span>
                                            </v-btn>
                                            <v-btn
                                                v-if="item.status == 3"
                                                elevation="24"
                                                fab
                                                depressed
                                                small
                                                class="bold mb4"
                                                :color="statusMaster('finished')"
                                            >
                                                <span class="fs16">{{idx + 1}}</span>
                                            </v-btn>
                                            <v-btn
                                                v-if="item.status == 4"
                                                elevation="24"
                                                fab
                                                depressed
                                                small
                                                class="bold mb4"
                                                :color="statusMaster('draft')"
                                            >
                                                <span class="fs16">{{idx + 1}}</span>
                                            </v-btn>
                                            <v-btn
                                                v-if="item.status == 5"
                                                elevation="24"
                                                fab
                                                depressed
                                                small
                                                class="bold mb4"
                                                :color="statusMaster('cancelled')"
                                            >
                                                <span class="fs16">{{idx + 1}}</span>
                                            </v-btn>
                                        </l-icon>
                                        <l-popup>
                                            {{ item.sales_order.code }} <br />
                                            {{ item.sales_order.branch.name }} <br />
                                            {{ item.sales_order.wrt.name }}
                                        </l-popup>
                                    </l-marker>
                                </div>
                            </v-marker-cluster>
                            <!-- FOR START AND FINISH LOCATION PIN POINT -->
                            <l-marker
                                :visible="true"
                                :draggable="false"
                                :lat-lng="[
                                    dataDrs[0].delivery_run_sheet.starting_latitude,
                                    dataDrs[0].delivery_run_sheet.starting_longitude
                                ]"
                            >
                                <l-popup>
                                    Start At: {{formatTime(dataDrs[0].delivery_run_sheet.started_at)}} <br>
                                    Finish At: {{dataDrs[0].delivery_run_sheet.finished_at == '0001-01-01T00:00:00Z' ? '-' : formatTime(dataDrs[0].delivery_run_sheet.finished_at)}}
                                </l-popup>
                            </l-marker>
                            <!-- FOR COURIER LOCATION PIN POINT -->
                            <l-marker
                                :visible="true"
                                :draggable="false"
                                :lat-lng="[
                                    courier.latitude,
                                    courier.longitude
                                ]"
                            > 
                                <l-icon
                                    :icon-size="[30, 40]"
                                    :icon-anchor="staticAnchor"
                                    icon-url="../../../img/emergency.png"
                                    v-if="courier.emergency_mode == 1 && courier.latitude && courier.longitude"
                                ></l-icon>
                                <l-icon
                                    :icon-size="[25, 40]"
                                    :icon-anchor="staticAnchor"
                                    icon-url="../../../img/car.png"
                                    v-if="courier.emergency_mode == 2 && courier.vehicle_profiles.routing_profile.value_name == 'car' && courier.latitude && courier.longitude"
                                ></l-icon>
                                <l-icon
                                    :icon-size="[30, 40]"
                                    :icon-anchor="staticAnchor"
                                    icon-url="../../../img/motorcycle.png"
                                    v-if="courier.emergency_mode == 2 && courier.vehicle_profiles.routing_profile.value_name == 'bike' && courier.latitude && courier.longitude"
                                ></l-icon>
                            </l-marker>
                        </l-map>
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="cancelBulkDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlay" />
                <v-card-title>
                    <span class="text-title-modal">Cancel Delivery Run Sheet</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this delivery run sheet cancelled?</span>
                    <v-textarea
                        name="note"
                        v-model="cancelNoteBulk"
                        :counter="100"
                        outlined
                        required
                        maxlength="100"
                        class="mt-6"
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
                        @click="cancelBulkDialog = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="cancelBulkDrs()"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlay" />
                <v-card-title>
                    <span class="text-title-modal">Cancel Delivery Run Sheet Item</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this delivery run sheet cancelled?</span>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        required
                        maxlength="100"
                        class="mt-6"
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
                        @click="modelDialog = false, note == ''"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="cancelDrs()"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="detailDialog"
            persistent
            max-width="1280"
        >
            <v-card class="pa-3">
                <v-row class="pa-3 mb30">
                    <v-col class="fs20 bold flex-justify-center">
                        <router-link
                            :to="`/sales-order/detail/${detailSO.sales_order.id}`"
                            target="_blank"
                            v-privilege="'so_rdd'"
                        >
                            {{ detailSO.sales_order.code }}
                        </router-link>
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <span class="bold mr10 mt4">{{ currentPage }} / {{ dataDrs.length }} Sales Order</span>
                        <v-btn
                            icon
                            class="-mr10 -mt3"
                            @click="prevPage"
                            :disabled="disabledPrev"
                        >
                            <v-icon>
                                mdi-arrow-left-drop-circle-outline
                            </v-icon>
                        </v-btn>
                        <v-btn
                            icon
                            class="-mt3"
                            @click="nextPage"
                            :disabled="disabledNext"
                        >
                            <v-icon>
                                mdi-arrow-right-drop-circle-outline
                            </v-icon>
                        </v-btn>
                        <span class="mr10 fs30 -mt10">|</span>
                        <v-btn
                            v-if="detailSO.status == 1"
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('new')"
                        >
                            New
                        </v-btn>
                        <v-btn
                            v-if="detailSO.status == 2"
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('on_delivery')"
                        >
                            On Progress
                        </v-btn>
                        <v-btn
                            v-if="detailSO.status == 3"
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >
                            Finished
                        </v-btn>
                        <v-btn
                            v-if="detailSO.status == 4"
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('draft')"
                        >
                            Postponed
                        </v-btn>
                        <v-btn
                            v-if="detailSO.status == 5"
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >
                            Failed
                        </v-btn>
                        <v-btn
                            icon
                            class="-mt1"
                            @click="detailDialog = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="-mt24">
                            <DetailRowNew :name="'Merchant'" :value="detailSO.sales_order.branch.name" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24 mb10">
                            <v-row class="-mb1">
                                <v-col>
                                    <div class="text-black60">Phone Number</div>
                                </v-col>
                                <v-col>
                                    <div class="d-flex justify-end">
                                        <a 
                                            v-bind:href="'https://wa.me/62' + detailSO.sales_order.branch.phone_number + '?text=EdenFarm%0A%0AHai%2C%20kurir%20anda%20sedang%20dalam%20perjalanan%20untuk%20mengantar%20pesanan%20anda.%20Mohon%20ditunggu%20ya'"
                                            target="_blank"
                                        >
                                            +62{{detailSO.sales_order.branch.phone_number}}
                                        </a>
                                        <v-img 
                                            src="/img/whatsapp-icon.svg"
                                            max-height="25"
                                            max-width="25"
                                            class="ml10"
                                        ></v-img>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider/>
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'Delivery Date'" :value="formatDate(detailSO.sales_order.delivery_date)" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'WRT'" :value="detailSO.sales_order.wrt.name" />
                        </v-col>
                        <v-col class="-mt24">
                            <DetailRowNew :name="'Shipping Address'" :value="detailSO.sales_order.branch.shipping_address + ', ' + detailSO.sales_order.branch.sub_district.concat_address + ', ' + detailSO.sales_order.branch.sub_district.postal_code" :align="true" />
                        </v-col>
                    </v-row>
                    <div class="left fs20 bold mt24 mb48">
                        <span>Receiver</span>
                    </div>
                    <v-row>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="`Recipient's Name`" :value="detailSO.recipient_name ? detailSO.recipient_name : '-'" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'Payment Type'" :value="detailSO.sales_order.term_payment_sls.name ? detailSO.sales_order.term_payment_sls.name : '-'" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'Money Received'" :value="detailSO.money_received ? 'Rp. ' + formatPrice(detailSO.money_received) : '-'" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'Total Invoice'" :value="detailSO.sales_order.sales_invoice ? 'Rp. ' + formatPrice(detailSO.sales_order.sales_invoice[0].total_charge) : '-'" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'Start Time'" :value="detailSO.started_at == '0001-01-01T00:00:00Z' ? '-' : formatTime(detailSO.started_at)" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'Arrival Time'" :value="detailSO.arrival_time == '0001-01-01T00:00:00Z' ? '-' : formatTime(detailSO.arrival_time)" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'Finish Time'" :value="detailSO.finished_at == '0001-01-01T00:00:00Z' ? '-' : formatTime(detailSO.finished_at)" />
                        </v-col>
                        <v-col cols="12" md="4" class="-mt24">
                            <DetailRowNew :name="'Delivery'" :value="detailSO.unpunctual_detail == 0 ? '-' : detailSO.unpunctual_detail == 1 ? 'EARLY' : 'LATE'" />
                        </v-col>
                        <v-col cols="12" class="-mt24">
                            <DetailRowNew :name="'Reason Late/Early'" :value="detailSO.unpunctual_reason_value == '' ? '-' : detailSO.unpunctual_reason_value" />
                        </v-col>
                        <v-col cols="12" class="-mt24">
                            <DetailRowNew :name="'Reason Inaccurate Location'" :value="detailSO.far_delivery_reason == '' ? '-' : detailSO.far_delivery_reason" />
                        </v-col>
                        <v-col cols="12" class="-mt24">
                            <span class="text-black60">Photo:</span>
                            <v-row>
                                <v-col cols="3">
                                    <v-row>
                                        <v-col>
                                            <DisplayPhotoOverlay
                                                v-if="detailSO.delivery_evidence_image_url"
                                                :title="'Delivery Image'"
                                                :src="detailSO.delivery_evidence_image_url"
                                            />
                                        </v-col>
                                        <v-col>
                                            <DisplayPhotoOverlay
                                                v-if="detailSO.transaction_evidence_image_url"
                                                :title="'Transaction Image'"
                                                :src="detailSO.transaction_evidence_image_url"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12">
                            <DetailRowNew :name="'Delivery Note'" :value="detailSO.note ? detailSO.note : '-'" :align="true" />
                        </v-col>
                    </v-row>
                    <div class="mt30" v-if="detailSO.postpone_delivery_log">
                        <div class="box-header-table">
                            Postponed History
                        </div>
                        <div class="box-body-table">
                            <v-data-table
                                :mobile-breakpoint="0"
                                :headers="tablePostpone.fields"
                                :items="postPoneDelivery"
                            >
                                <template v-slot:item="props">
                                    <tr style="height: 48px">
                                        <td>{{ props.index + 1 }}</td>
                                        <td>{{ props.item.postpone_reason }}</td>
                                        <td>{{ props.item.started_at == '0001-01-01T00:00:00Z' ? '-' : formatTime(props.item.started_at) }}</td>
                                        <td>{{ props.item.postponed_at == '0001-01-01T00:00:00Z' ? '-' : formatTime(props.item.postponed_at) }}</td>
                                        <td>
                                            <DisplayPhotoOverlay
                                                v-if="props.item.postpone_evidence"
                                                :title="'Postponed Image'"
                                                :src="props.item.postpone_evidence"
                                                class="rounded-form-sm"
                                            />
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                    <div v-if="detailSO.delivery_run_return">
                        <div class="box-header-table">
                            Products
                        </div>
                        <div class="box-body-table">
                            <v-data-table
                                :mobile-breakpoint="0"
                                :headers="tableReturn.fields"
                                :items="deliveryReturn.delivery_run_return_item"
                            >
                                <template v-slot:item="props">
                                    <tr style="height: 48px">
                                        <td>{{ props.index + 1 }}</td>
                                        <td>{{ props.item.delivery_order_item.product.name }}</td>
                                        <td>{{ props.item.delivery_order_item.product.uom.name }}</td>
                                        <td>{{ props.item.delivery_order_item.deliver_qty }}</td>
                                        <td>{{ props.item.receive_qty }}</td>
                                        <td>{{ formatPrice(props.item.subtotal) }}</td>
                                        <td>{{ props.item.return_reason_value }}</td>
                                        <td>
                                            <DisplayPhotoOverlay
                                                v-if="props.item.return_evidence"
                                                :title="'Return Waste Image'"
                                                :src="props.item.return_evidence"
                                                class="rounded-form-sm"
                                            />
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                        <div class="box-end">
                            <v-row>
                                <v-col cols="12" md="6" class="text-black60 -mt35">
                                    <div class="row">
                                        <div class="col">Total (Rp)</div>
                                        <div class="col d-flex justify-end text-black">
                                            {{ formatPrice(deliveryReturn.total_price) }}
                                        </div>
                                    </div>
                                    <div class="-mt10">
                                        <div class="row">
                                            <div class="col">Delivery Fee (Rp)</div>
                                            <div class="col d-flex justify-end text-black">
                                                {{ detailSO.sales_order.delivery_fee ? formatPrice(detailSO.sales_order.delivery_fee) : '-' }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="-mt10">
                                        <div class="row">
                                            <div class="col">Discount (Rp)</div>
                                            <div class="col d-flex justify-end text-black">
                                                - {{ detailSO.sales_order.vou_disc_amount ? formatPrice(detailSO.sales_order.vou_disc_amount) : '' }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="-mt10">
                                        <div class="row">
                                            <div class="col">Edenpoint</div>
                                            <div class="col d-flex justify-end text-black">
                                                - {{ detailSO.sales_order.point_redeem_amount ? formatPrice(detailSO.sales_order.point_redeem_amount) : '' }}
                                            </div>
                                        </div>
                                    </div>
                                    <v-divider class="my-4" />
                                    <div class="row fs20 text-black bold -mt10 mb2">
                                        <div class="col">Grand Total (Rp):</div>
                                        <div class="col d-flex justify-end">
                                            {{ formatPrice(deliveryReturn.total_charge) }}
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <AuditLogNew :data="dataAuditLog" />
    </v-container>
</template>

<script>
    export default {
        name: "ControlTowerDetail",
        data() {
            return {
                showCounted: 1,
                currentPage: 1,
                disabledNext: false,
                disabledPrev: false,
                userLocation: {
                    lat: 0,
                    lng: 0,
                },
                options: {
                    zoom: 10,
                    maxZoom: 19,
                    minZoom: 5 ,
                    maxNativeZoom: 19
                },
                clusterOptions: {
                    disableClusteringAtZoom: 20,
                    maxClusterRadius: 50
                    
                },
                staticAnchor: [16, 37],
                items: {
                    code: '',
                    courier: {
                        code: '',
                        name: '',
                        phone_number: '',
                        license_plate: '',
                        vehicle_profiles: {
                            name: '',
                            courier_vendor: {
                                name: '',
                                warehouse: {
                                    name: ''
                                }
                            }
                        }
                    }
                },
                start_time: '',
                finish_time: '',
                total_so: '',
                total_return: '',
                total_selfPickup: '',
                dataDrs: [{
                    note: '',
                    customer_latitude: 0,
                    customer_longitude: 0,
                    status: '',
                    delivery_run_sheet: {
                        started_at: '',
                        finished_at: '',
                        arrival_time: ''
                    },
                    sales_order: {
                        id: '',
                        code: '',
                        delivery_date: '',
                        branch: {
                            name: '',
                            phone_number: '',
                            shipping_address: ''
                        },
                        wrt: {
                            name: ''
                        },
                        order_type: {
                            name: ''
                        }
                    },
                }],
                courier: {
                    latitude: 0,
                    longitude: 0,
                    emergency_mode: 0,
                    vehicle_profiles: {
                        routing_profile: {
                            value_name: ''
                        }
                    }
                },
                centerData: {
                    lat: 0,
                    lng: 0
                },
                cancelNoteBulk: '',
                cancelData: '',
                cancelBulkData: '',
                modelDialog: false,
                cancelBulkDialog: false,
                note: {
                    note: '',
                },
                overlay: false,
                isLoadingItems: false,
                loadingMaps: false,
                dataAuditLog: {},
                detailDialog: false,
                detailSO: {
                    note: '',
                    money_received: '',
                    recipient_name: '',
                    started_at: '',
                    finished_at: '',
                    arrival_time: '',
                    unpunctual_detail: '',
                    unpunctual_reason_value: '',
                    far_delivery_reason: '',
                    sales_order: {
                        code: '',
                        delivery_date: '',
                        shipping_address: '',
                        total_charge: '',
                        vou_disc_amount: '',
                        point_redeem_amount: '',
                        delivery_fee: '',
                        branch: {
                            name: '',
                            phone_number: '',
                            sub_district: {
                                concat_address: '',
                                postal_code: ''
                            }
                        },
                        sales_inovoice: [
                            {
                                total_charge: ''
                            }
                        ],
                        wrt: {
                            name: ''
                        },
                        term_payment_sls: {
                            name: ''
                        }
                    },
                    delivery_run_return: {},
                    postpone_delivery_log: {}
                },
                postPoneDelivery: [{
                    postpone_reason: '',
                    postpone_evidence: '',
                    started_at: '',
                    postponed_at: '',
                }],
                deliveryReturn: [{
                    delivery_run_return_item: [{
                        return_evidence: '',
                        receive_qty: '',
                        subtotal: '',
                        return_reason_value: '',
                        delivery_order_item: {
                            deliver_qty: '',
                            product: {
                                name: '',
                                uom: {
                                    name: ''
                                }
                            }
                        }
                    }],
                    total_charge: '',
                    total_price: '',
                }],
                tablePostpone: {
                    fields: [
                        {
                            text: 'No.',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Reason',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Start Time',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Postponed Time',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Evidence (Image)',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                    ],
                },
                tableReturn: {
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
                            text: 'Delivery Qty',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Receive Qty',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Total Price (Rp)',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Return Waste Image',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        }
                    ],
                },
                error: ''
            }
        },
        mounted() {
            this.getUserPosition()
            this.getDetailData()
            this.getDataMaps()
            this.defaultData()
        },
        methods: {
            defaultData() { // default data DRS
                this.dataDrs.slice(0, this.showCounted)
            },
            checkPage() { // checking page from index List Data
                if (this.showCounted * this.currentPage >= this.dataDrs.length && this.dataDrs.length !== 1) {
                    this.disabledNext = true
                    this.disabledPrev = false
                } else if(this.currentPage <= 1 && this.dataDrs.length !== 1) {
                    this.disabledNext = false
                    this.disabledPrev = true
                } else if (this.currentPage <= 1 && this.dataDrs.length === 1) {
                    this.disabledNext = true
                    this.disabledPrev = true
                } else {
                    this.disabledNext = false
                    this.disabledPrev = false
                }
            },
            nextPage() { // method for next data
                this.detailSO = this.dataDrs.slice(this.showCounted * this.currentPage, this.showCounted * this.currentPage + this.showCounted)[0]
                this.deliveryReturn = this.dataDrs.slice(this.showCounted * this.currentPage, this.showCounted * this.currentPage + this.showCounted)[0].delivery_run_return
                this.postPoneDelivery = this.dataDrs.slice(this.showCounted * this.currentPage, this.showCounted * this.currentPage + this.showCounted)[0].postpone_delivery_log
                this.currentPage++
                this.checkPage()
            },
            prevPage() { // method for next data
                this.currentPage--
                this.postPoneDelivery = this.dataDrs.slice(this.showCounted * this.currentPage - this.showCounted, this.showCounted * this.currentPage)[0].postpone_delivery_log
                this.deliveryReturn = this.dataDrs.slice(this.showCounted * this.currentPage - this.showCounted, this.showCounted * this.currentPage)[0].delivery_run_return
                this.detailSO = this.dataDrs.slice(this.showCounted * this.currentPage - this.showCounted, this.showCounted * this.currentPage)[0]
                this.checkPage()
            },
            async getUserPosition() { // get user default location
                if (navigator.geolocation) {
                    // get GPS position
                    navigator.geolocation.getCurrentPosition(pos => {
                        // set the user location
                        this.userLocation = {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        };
                    });
                }
            },
            cancelBulkDrs() { // cancel DRS Item
                this.overlay = true
                this.$http2.put("/logistic/control_tower", {
                    delivery_run_sheet_id: this.cancelBulkData,
                    note: this.cancelNoteBulk
                }).then(response => {
                    this.getDataMaps()
                    this.note = {
                        note: '',
                    }
                    this.cancelBulkDialog = false
                    this.overlay = false
                    this.getDetailData()
                    this.getDataMaps()
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been cancel successfully',
                        type: 'success',
                    });
                }).catch(error => {
                    this.cancelBulkDialog = false
                    this.overlay = false
                })
            },
            cancelDrs() { // cancel DRS Item
                this.overlay = true
                this.$http2.put("/logistic/control_tower/" + this.cancelData, this.note).then(response => {
                    this.getDataMaps()
                    this.note = {
                        note: '',
                    }
                    this.modelDialog = false
                    this.overlay = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been cancel successfully',
                        type: 'success',
                    });
                }).catch(error => {
                    this.modelDialog = false
                    this.overlay = false
                })
            },
            getDetailData() { // get data detail
                this.$http2.get("/logistic/control_tower/" + this.$route.params.id)
                .then(response => {
                    this.items = response.data.data
                    this.start_time = this.$moment(response.data.data.started_at).format('HH:mm:ss')
                    this.finish_time = this.$moment(response.data.data.finished_at).format('HH:mm:ss')
                    if (this.items.finished_at == "0001-01-01T00:00:00Z") {
                        this.finish_time = '-'
                    }
                });
            },
            getDataMaps() { // get data MAPS
                this.loadingMaps = true
                this.isLoadingItems = true
                this.$http2.post("/logistic/control_tower/" + this.$route.params.id, {
                }).then(response => {
                    this.loadingMaps = false
                    this.isLoadingItems = false
                    this.total_so = response.data.data.total_sales_order
                    this.total_return = response.data.data.total_delivery_return
                    this.total_selfPickup = response.data.data.total_self_pickup
                    this.dataDrs = response.data.data.delivery_run_sheet_items
                    this.courier = response.data.data.couriers
                    this.centerData = {
                        lat: this.dataDrs[0].delivery_run_sheet.starting_latitude,
                        lng: this.dataDrs[0].delivery_run_sheet.starting_longitude
                    }
                    this.checkPage()
                }).catch(error => {
                    this.error = error
                    this.loadingMaps = false
                    this.isLoadingItems = false
                })
            },
            seeHistory() { // get history
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "delivery_run_sheet",
                    label: 'URL_2'
                }
            },
        },
    }
</script>