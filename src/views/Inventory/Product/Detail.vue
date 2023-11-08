<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <div class="img-product ma-2" v-for="(item, idx) in items.product_image" :key="idx">
                    <v-img
                        class="rounded-form"
                        height="180"
                        width="250"
                        :src="item.image_url"
                    ></v-img>
                </div>
            </v-row>
            <v-row>
                <v-col cols="12" md="9" class="fs25 bold">
                    {{items.name}}
                </v-col>
                <v-col cols="12" md="3" class="d-flex justify-end align-end">
                    <v-btn
                        v-if="items.status==1"
                        elevation="0"
                        rounded
                        depressed
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                    >Active
                    </v-btn>
                    <v-btn
                        v-else
                        elevation="0"
                        rounded
                        depressed
                        small
                        class="no-caps mb4"
                        :color="statusMaster('archived')"
                    >Archived
                    </v-btn>
                <v-menu offset-y >
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                    <v-list class="bg-white">
                        <v-list-item v-privilege="'prd_upd'" :to="`/inventory/product/update/${items.id}`">
                            <v-list-item-content>
                                <v-list-item-title>Update</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon>
                                <v-icon>mdi-open-in-new</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                        <hr/>
                        <v-list-item v-privilege="'prd_upd_pur'" :to="`/inventory/product/purchasability/update/${items.id}`">
                            <v-list-item-content>
                                <v-list-item-title>Update purchasability</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon>
                                <v-icon>mdi-open-in-new</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                        <hr/>
                        <v-list-item v-privilege="'prd_upd_sal'" :to="`/inventory/product/salability/update/${items.id}`">
                            <v-list-item-content>
                                <v-list-item-title>Update salability</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon>
                                <v-icon>mdi-open-in-new</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                        <hr/>
                        <v-list-item v-privilege="'prd_upd_sto'" :to="`/inventory/product/storability/update/${items.id}`">
                            <v-list-item-content>
                                <v-list-item-title>Update storability</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon>
                                <v-icon>mdi-open-in-new</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                        <hr/>
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
                <v-col cols="12" md="6" v-if="items.grand_parent">
                    <DetailRowNew :name="'Grand Parent (C0)'" :value="`${items.grand_parent.code} - ${items.grand_parent.name}`"/>
                </v-col>
                <v-col cols="12" md="6" v-if="items.parent">
                    <DetailRowNew :name="'Parent (C1)'" :value="`${items.parent.code} - ${items.parent.name}`"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Category (C2)'" :value="`${items.category.code} - ${items.category.name}`"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Code'" :value="items.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'UOM'" :value="`${items.uom.code} - ${items.uom.name}`"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Weight'" :value="toFixed(items.unit_weight)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew v-if="items.up_code" :name="'Universal Product Code'" :value="items.up_code"/>
                    <DetailRowNew v-else :name="'Universal Product Code'" :value="`-`"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Spare'" :value="`${items.spare_percentage} %`"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt20">
                    <v-row>
                        <v-col >
                            <div class="text-black60">Packable :</div>
                        </v-col>
                        <v-col>
                            <div class="d-flex justify-end -mt20">
                                <v-switch
                                    v-model="packableValue"
                                    color="#50ABA3"
                                    inset
                                    @click="packable()"
                                ></v-switch>
                            </div>
                        </v-col>
                    </v-row>
                    <div class="row">
                    </div>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Tax'" :value="`${items.tax_percentage} %`"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt14">
                    <DetailRowNew :name="'Taxable'" :value="taxable"/>
                </v-col>
                <v-col cols="12" class="-mt14">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <div class="fs16 bold">
                Catalog
            </div>
            <v-row>
                <v-col cols="12" class="mt20">
                    <DetailRowNew :name="'Product Tag'" :value="items.tag_product_str"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew v-if="items.order_min_qty == 0" :name="'Minimal Order Qty'" :value="`-`"/>
                    <DetailRowNew v-else :name="'Minimal Order Qty'" :value="toFixed(items.order_min_qty)"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Description'" :value="items.description" :align="true"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew v-if="items.order_max_qty == 0" :name="'Order Max Quantity'" :value="`-`"/>
                    <DetailRowNew v-else :name="'Order Max Quantity'" :value="toFixed(items.order_max_qty)"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew v-if="items.max_day_delivery_date == 0" :name="'Max Day Delivery Date'" :value="`-`"/>
                    <DetailRowNew v-else :name="'Max Day Delivery Date'" :value="toFixed(items.max_day_delivery_date)"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Exclude Archetype'" :value="items.exclude_archetype_str" :align="true"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Order Channel Restriction'" :value="this.order_channel_restriction" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <div class="fs16 bold">
                Availability
            </div>
            <v-row class="ma5">
                <v-col>
                    <v-switch
                        v-model="items.storability"
                        label="Storability"
                        color="#50ABA3"
                        inset
                        :false-value="2"
                        :true-value="1"
                        disabled
                    ></v-switch>
                    <div class="-mt20 ml54" v-if="items.storability == 1">
                        <v-checkbox
                            v-for="(item, idx) in items.warehouse_sto" :key="idx"
                            v-model="checkbox"
                            color="#50ABA3"
                            disabled
                            :label="`${item.code} - ${item.name} (${item.area.code} - ${item.area.name})`"
                            class="-mb28"
                        ></v-checkbox>
                    </div>
                    <v-switch
                        v-model="items.salability"
                        label="Salability"
                        color="#50ABA3"
                        inset
                        :false-value="2"
                        :true-value="1"
                        class="mt30"
                        disabled
                    ></v-switch>
                    <div class="-mt20 ml54" v-if="items.salability == 1">
                        <v-checkbox
                            v-for="(item, idx) in items.warehouse_sal" :key="idx"
                            v-model="checkbox"
                            color="#50ABA3"
                            :label="`${item.code} - ${item.name} (${item.area.code} - ${item.area.name})`"
                            disabled
                            class="-mb28"
                        ></v-checkbox>
                    </div>
                </v-col>
                <v-col>
                    <v-switch
                        v-model="items.purchasability"
                        label="Purchasability"
                        color="#50ABA3"
                        inset
                        :false-value="2"
                        :true-value="1"
                        disabled
                    ></v-switch>
                    <div class="-mt20 ml54" v-if="items.purchasability == 1">
                        <v-checkbox
                            v-for="(item, idx) in items.warehouse_pur" :key="idx"
                            v-model="checkbox"
                            color="#50ABA3"
                            :label="`${item.code} - ${item.name} (${item.area.code} - ${item.area.name})`"
                            disabled
                            class="-mb28"
                        ></v-checkbox>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <div class="fs16 bold mb18">
                Routing Restriction
            </div>
            <hr class="hr-title" />
            <v-col cols="12" md="6" class="mt20">
                <v-row>
                    <v-col >
                        <div class="text-black60">Fragile Goods :</div>
                    </v-col>
                    <v-col>
                        <div class="d-flex justify-end -mt20">
                            <v-switch
                                v-model="fragileValue"
                                color="#50ABA3"
                                inset
                                @click="fragileGoods()"
                            ></v-switch>
                        </div>
                    </v-col>
                </v-row>
                <v-divider/>
            </v-col>
        </div>
        <AuditLogNew :data="dataAuditLog"/>
        <v-dialog
            v-model="packableModal"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Packable</span>
                </v-card-title>
                <v-card-text>
                    <span v-if="items.packability == 2" class="fs16 mt-1">Are you sure to set this product as packable item ?</span>
                    <span v-if="items.packability == 1" class="fs16 mt-1">Are you sure to set this product as unpackable item ?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="packableNo()"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        @click="packableYes()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="fragileModal"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Fragile Goods</span>
                </v-card-title>
                <v-card-text>
                    <span v-if="items.fragile_goods == 2" class="fs16 mt-1">Are you sure to set this product as fragile goods item ?</span>
                    <span v-else class="fs16 mt-1">Are you sure to set this product as not fragile goods item ?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="fragileNo()"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        @click="fragileYes()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import Vue from 'vue'
    export default {
        name: "DetailProduct",
        data() {
            return {
                checkbox : true,
                dataAuditLog : {},
                packableValue: false,
                fragileValue: false,
                packableModal: false,
                fragileModal: false,
                taxable: "",
                order_channel_restriction: "",
                items : {
                    code: "",
                    unit_weight: "",
                    up_code: "",
                    spare_percentage: "",
                    tax_percentage: "",
                    taxable: "",
                    note: "",
                    tag_product_str: "",
                    order_min_qty: "",
                    description: "",
                    order_max_qty: "",
                    max_day_delivery_date: "",
                    exclude_archetype_str: "",
                    purchasability: "",
                    grand_parent: {
                        code : "",
                        name : ""
                    },
                    parent: {
                        code : "",
                        name : ""
                    },
                    uom : {
                        code : "",
                        name : ""
                    },
                    category : {
                        code : "",
                        name : ""
                    },
                    warehouse_sto : [
                        {
                            code : "",
                            name : "",
                            area : {
                                code : "",
                                name : "",
                            }

                        }
                    ],
                    warehouse_pur : [
                        {
                            code : "",
                            name : "",
                            area : {
                                code : "",
                                name : "",
                            }

                        }
                    ],
                    warehouse_sal : [
                        {
                            code : "",
                            name : "",
                            area : {
                                code : "",
                                name : "",
                            }

                        }
                    ]
                }
            }
        },
        methods:{
            packable(){
                this.renderData()
                if(this.packableValue == true){
                    this.packableModal = true
                }else{
                    this.packableModal = true
                }
            },
            packableNo(){
                this.packableModal = false
                this.renderData()
            },
            packableYes(){
                    if(this.items.packability == 2){
                        this.$http.put("/inventory/product/packable/"+ this.$route.params.id, {})
                        .then(response => {
                            this.packableValue = true
                            Vue.$toast.open({
                                position: 'top-right',
                                message: 'Data has been saved successfully',
                                type: 'success',
                            });
                    });
                    }else{
                        this.$http.put("/inventory/product/unpackable/"+ this.$route.params.id, {})
                        .then(response => {
                            this.packableValue = false
                            Vue.$toast.open({
                                position: 'top-right',
                                message: 'Data has been saved successfully',
                                type: 'success',
                            });
                    });
                }
                this.packableModal = false
            },
            fragileGoods(){
                this.renderData()
                if (this.fragileValue == true){
                    this.fragileModal = true
                } else {
                    this.fragileModal = true
                }
            },
            fragileNo(){
                this.fragileModal = false
                this.renderData()
            },
            fragileYes(){
                if (this.items.fragile_goods == 2) {
                    this.$http.put("/inventory/product/fragile/"+ this.$route.params.id, {})
                    .then(response => {
                        this.fragileValue = true
                        Vue.$toast.open({
                            position: 'top-right',
                            message: 'Data has been saved successfully',
                            type: 'success',
                        });
                    });
                } else {
                    this.$http.put("/inventory/product/notfragile/"+ this.$route.params.id, {})
                    .then(response => {
                        this.fragileValue = false
                        Vue.$toast.open({
                            position: 'top-right',
                            message: 'Data has been saved successfully',
                            type: 'success',
                        });
                    });
                }
                this.fragileModal = false
            },
            renderData(){
                let arr= [];
                this.$http.get("/inventory/product/"+ this.$route.params.id).then(response => {
                    this.items = response.data.data
                    if(this.items.packability == 1){
                        this.packableValue = true
                    }else{
                        this.packableValue = false
                    }
                    if(this.items.taxable === 2){
                        this.taxable = "No"
                    }else{
                        this.taxable = "Yes"
                    }
                    if (this.items.fragile_goods == 1){
                        this.fragileValue = true
                    } else {
                        this.fragileValue = false
                    }
                    if(this.items.order_channel_restriction){
                        for(let i = 0; i < this.items.order_channel_restriction.length; i++){
                            arr[i] = this.items.order_channel_restriction[i].note
                        }
                        this.order_channel_restriction = arr.toString()
                    }
                });
            },
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "product"
                }
            },
            toFixed(val) {
                return Number(val).toFixed(2)
            }
        },
        created() {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData()
                }
            });
        },
    }
</script>