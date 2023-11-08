<template>
    <v-container fill-height class="main-container">
        <div class="box-start" v-for="(item, idx) in items.purchase_order_items" :key="idx">
            <div class="row">
                <div class="col-10 fs16 bold">
                    {{item.product.name}}
                </div>
                <div class="col">
                        <v-icon
                            color="#2EA919"
                            dense
                            v-if="item.purchase_qty >= item.order_qty"
                            >mdi-check-circle
                        </v-icon>

                </div>
            </div>
            <v-row>
                <!-- <v-col class="" cols="12" md="12">
                    <v-col cols="12" md="10">
                    </v-col>
                    <v-col cols="12" md="2">
                    </v-col>
                </v-col> -->
                <v-col cols="12" md="12">
                    <DetailRowNew :name="'Order'" :value="`${item.order_qty} ${item.product.uom.name}`"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Purchase'" :value="`${item.purchase_qty} ${item.product.uom.name}`"/>
                </v-col>
                <v-col cols="12" md="12" v-privilege="'po_mrk'">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="item.purchase_qty < item.order_qty"
                            @click="addMarket = true, editIdx = idx"
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                        >
                            <span>Add</span>
                        </v-btn>
                        <v-btn
                            @click="detailMarket = true, detail = item, editIdx = idx"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-secondary">Detail</span>
                        </v-btn>
                        <v-btn
                            @click="modelReset = true, editIdx = idx"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="only-btn"
                        >
                            <span class="text-cancel">Reset</span>
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <fab
            v-privilege="'po_mrk'"
            position='bottom-right'
            main-icon='save'
            z-index = "10"
            bg-color="#50ABA3"
            icon-size='small'
            @click.native="modelSave = true"
        ></fab>
        <v-dialog
            v-model="addMarket"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title class="d-flex justify-center">
                    <span class="fs18 mt-1 bold">Add Market Purchase</span>
                </v-card-title>
                <v-card-text>
                    <div class="fs14">Stall Name <span style="color:red">*</span></div>
                    <v-text-field
                        name="name"
                        v-model="child.stall"
                        required
                        outlined
                        dense
                    ></v-text-field>
                    <div class="fs14 -mt20">Purchase Qty <span style="color:red">*</span></div>
                    <vue-numeric
                        class="vueNumeric"
                        separator="."
                        placeholder="0,00"
                        :precision="2"
                        v-model="child.qty"
                    ></vue-numeric> 
                    <div class="fs14 mt-2">Purchase Unit Price <span style="color:red">*</span></div>
                    <vue-numeric
                        class="vueNumeric"
                        separator="."
                        placeholder="0"
                        :precision="0"
                        v-model="child.price"
                    ></vue-numeric>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="addMarket=false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="mobile-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="saveItem()"
                        :disabled="disableAdd"
                        depressed
                        color="#50ABA3"
                        class="mobile-btn white--text"
                    >
                        <span>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="detailMarket"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans text-black">
                <v-card-title>
                    <div class="fs16 bold mt-1 text-black">Market Purchase Detail</div>
                    <v-spacer></v-spacer>
                    <div class="flex-justify-end">
                        <v-btn
                            icon
                            @click="detailMarket=false"
                        >
                            <img src="/icon/close-new.png" height="20px" width="20px"/>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="hr-title-modal"></div>
                <v-card-text class="mt-4">
                    <div class="bold text-black">
                        {{detail.product.name}}
                    </div>
                    <div class="row" >
                        <div class="col-4">
                            Order  
                        </div>
                        <div class="col flex-align-end text-black">
                            {{detail.order_qty}} {{detail.product.uom.name}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 -mt24">
                            Purchase  
                        </div>
                        <div class="col flex-align-end text-black -mt24">
                            {{detail.purchase_qty}} {{detail.product.uom.name}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 -mt24">
                            Unit Price  
                        </div>
                        <div class="col flex-align-end text-black -mt24">
                            Rp {{formatUnitPrice(detail.unit_price)}}
                        </div>
                    </div>
                    <div class="my-2">
                        <hr>
                    </div>
                    <div>
                        <v-card outlined v-for="(item, idx) in detail.market_purchase" :key="idx" class="mb16">
                            <div class="pa12">
                                <table class="wp100">
                                    <tbody>
                                        <tr>
                                            <td class="wp20">Stall</td>
                                            <td>: {{item.stall}}</td>
                                            <td class="wp1" rowspan="3">
                                                <v-btn
                                                    v-privilege="'po_mrk'"
                                                    icon
                                                    color="#FC7079"
                                                    @click="removeChild(idx)"
                                                >
                                                    <img src="/icon/delete.png" height="20px" width="20px"/>
                                                </v-btn>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Qty</td>
                                            <td>: {{item.qty}} {{detail.product.uom.name}}</td>
                                        </tr>
                                        <tr>
                                            <td>Price</td>
                                            <td>: Rp. {{formatUnitPrice(item.price)}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </v-card>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="modelSave"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p>
                        Are you sure want to save this Market Purchase ? <br>
                        Unit Price Item will be updated
                    </p>
                </v-card-text>
                <v-card-actions class="pb-4 -mt20">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="modelSave = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="saveMarket()"
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                    >
                        <span>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="modelReset"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p>
                        Are you sure to Reset Purchase Qty for this Product?<br>
                        Purchase Qty will be 0 afterwards
                    </p>
                </v-card-text>
                <v-card-actions class="pb-4 -mt20">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="modelReset = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="resetItem()"
                        depressed
                        color="#FF8D8D"
                        class="main-btn white--text"
                    >
                        <span>Reset</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<style scoped>
.mobile-btn {
    width: 140px;
    text-transform: none !important;
    font-weight: bold;
}
</style>
<script>
import Vue from 'vue'
import fab from 'vue-fab'
export default {
    name: 'MarketPurchase',
    components: {
        fab
    },
    data() {
        return {
            overlay: false,
            addMarket : false,
            detailMarket : false,
            modelSave: false,
            modelReset: false,
            editIdx: 0,
            child : {
                stall : "",
                qty : 0,
                price : 0,
            },
            error : {},
            items : [],
            detail : {
                product : {
                    name : "",
                    uom : {
                        name : ""
                    }
                },
                market_purchase: []
            },
            table: {
                fields: [
                    {
                        width: "100%",
                        sortable: false
                    }
                ]
            },
        }
    },
    computed: {
        //For watch disable add button
        disableAdd() {
            if (this.child.qty != 0 && this.child.price != 0 && this.child.stall) {
                return false
            } else {
                return true
            }
        },
        // maxQty() {
        //     let qty = this.items.purchase_order_items[this.editIdx].order_qty
        //     let min = this.items.purchase_order_items[this.editIdx].purchase_qty
        //     return qty - min
        // }
    },
    created() {
        //For check data offline
        let data = this.$store.state.MarketPO
        if (data != null && data.id == this.$route.params.id) {
            this.items = data
        } else {
            this.renderData()
        }
    },
    methods : {
        //For remove item 
        removeChild(idx) {
            this.items.purchase_order_items[this.editIdx].market_purchase.splice(idx, 1)
        },
        //For reset item
        resetItem(){
            this.items.purchase_order_items[this.editIdx].unit_price = 0
            this.items.purchase_order_items[this.editIdx].purchase_qty = 0
            this.items.purchase_order_items[this.editIdx].subtotal = 0
            this.items.purchase_order_items[this.editIdx].market_purchase = []
            this.modelReset = false
        },
        //For save item
        saveItem(){
            this.items.purchase_order_items[this.editIdx].market_purchase.push(this.child)
            this.child = {
                stall : "",
                qty : 0,
                price : 0,
            }
            this.addMarket = false
        },
        //For save market purchase
        saveMarket() {
            this.modelSave = false
            this.overlay = true
            this.$http.post("/purchase/order/market-purchase/"+this.$route.params.id, this.items).then(response => {
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been update successfully',
                    type: 'success',
                });
                this.$store.commit('setMarketPO', null);
                this.$router.push('/purchase/order/'+this.$route.params.id)
                this.modelSave = false
                this.overlay = false
            }).catch(e => {
                this.error = e.errors
                this.modelSave = false
                this.overlay = false
            });     
        },
        // For get data
        renderData(){
            this.$http.get("/purchase/order/"+this.$route.params.id).then(response => {
                this.items = response.data.data
                if(this.items === null){
                    this.items = {}
                }
            });
        },
    },
    watch : {
        items : {
            handler : function(val) {
                val.purchase_order_items.forEach((e, i) => {
                    let qty = 0
                    let price = 0
                    if (e.market_purchase.length > 0) {
                        let sumall = 0
                        e.market_purchase.forEach(d => {
                            qty += d.qty
                            sumall += d.price*d.qty
                        });
                        price = sumall/qty
                    }
                    e.purchase_qty = qty
                    e.unit_price = price
                    e.subtotal = price * qty
                });
                this.$store.commit('setMarketPO', val);
            },
            deep: true
        }
    }
}
</script>