<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="3"></v-col>
                <v-col cols="6">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-line-scan"
                                name="search"
                                single-line
                                hide-details
                                class="-mt10"
                                v-on="{ ...tooltip }"
                                outlined
                            >
                                <template v-slot:label>
                                    Product RFID
                                </template>
                            </v-text-field>
                        </template>
                        <span>Scan Product RFID</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="3"></v-col>
            </v-row>
        </div>
        <div class="box-table">
            <v-data-table
                :headers="table.fields"
                :items="form.product"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.rfid }}</td>
                        <td>{{ props.item.product_name }}</td>
                        <td>{{ props.item.total_weight }} {{ props.item.uom_name }}</td>
                        <td>{{ props.item.branch_name }}</td>
                        <td>{{ props.item.processed_at | moment("DD/MM/YYYY HH:mm:ss") }}</td>
                        <td>
                            <div v-if="props.item.status == 'new'">
                                <v-chip
                                    :color="statusMaster('new')"
                                    small
                                ><span class="pa-md-1">New</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 'active'">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-1">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 'sold'">
                                <v-chip
                                    :color="statusMaster('paid_on_delivery')"
                                    small
                                ><span class="pa-md-2">Sold</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 'waste'">
                                <v-chip
                                    :color="statusMaster('deleted')"
                                    small
                                ><span class="pa-md-2">Waste</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 'finished'">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    small
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div>
                                    <v-btn
                                        icon
                                        :name="`removeSubCity_${props.index}`"
                                        @click="removeRow(props.index)"
                                    >
                                        <v-img src="/icon/close-new.png" max-height="20px" max-width="20px"></v-img>
                                    </v-btn>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box">
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
                    :disabled="disabledBtnProcess"
                >Finish</v-btn>
            </v-card-actions>
        </div>
        <LoadingBar :value="overlay"/>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        data () {
            return {
                search: '',
                overlay: false,
                error:{},
                ConfirmData:[],
                disabledBtnProcess: true,
                form:{
                    product: [],
                },
                table: {
                    fields: [
                        {
                            text: 'No.',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "5%"
                        },
                        {
                            text: 'RFID',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "20%"
                        },
                        {
                            text: 'Product Name',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "20%"
                        },
                        {
                            text: 'Qty',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "10%"
                        },
                        {
                            text: 'Fridge Name',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "20%"
                        },
                        {
                            text: 'Processed At',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "15%"
                        },
                        {
                            text: 'Status',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "5%"
                        },
                        {
                            text: '',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "5%"
                        }
                    ],
                },
            }
        },
        methods:{
            // For confirm product to Finish
            confirmButton() {
                let sendForm = {
                    rfid: [],
                }
                for (let i = 0; i < this.form.product.length; i++) {
                    sendForm.rfid.push(this.form.product[i].rfid)
                }
                this.ConfirmData = {
                    model : true,
                    title : "Finish Product",
                    text : "Are you sure you want to finish all the products on this page?",
                    urlApi : "/box/product_box_finish",
                    nextPage : "/smart-fridge/product-box",
                    data : sendForm
                }
            },
            // For get product data by RFID
            getProduct(code){
                this.overlay = true
                this.$http.get("/box/box_fridge/"+code).then(response => {
                    let data = response.data.data
                    this.form.product.push({
                        rfid: data.rfid,
                        product_name: data.product_name,
                        total_weight: data.total_weight,
                        uom_name: data.uom_name,
                        branch_name: data.branch_name ? data.branch_name : '-',
                        processed_at: data.processed_at ? data.processed_at : '-',
                        status: data.status
                    })
                    this.search = ""
                    this.overlay = false
                }).catch(e => {
                    this.search = ""
                    this.overlay = false
                })
            },
            // For remove product
            removeRow(idx) {
                this.form.product.splice(idx, 1)
            },
             //For check duplicate Rfid
            checkCode(val) {
                let duplicate = 0
                for (let j = 0; j < this.form.product.length; j++) {
                    if (val == this.form.product[j].rfid) {
                        Vue.$toast.open({
                            position: 'top-right',
                            message: 'Duplicate Product RFID Code',
                            type: 'error',
                        });
                        duplicate += 1
                        this.search = ""
                    }
                }
                if(duplicate == 0){
                    this.getProduct(val)
                    duplicate = 0
                }                
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        computed: {
            // For count total sub district
            totalRow() {
                let total = 0
                for (let i = 0; i < this.form.product.length; i++) {
                    if (this.form.product[i].rfid) {
                        total += 1;
                    }
                }
                return total
            }
        },
        watch: {
            form: {
                handler: function (val) {
                    // For disable button finish
                    if (this.totalRow == this.form.product.length) {
                        if (this.form.product.length > 0) {
                            this.disabledBtnProcess = false
                        } else {
                            this.disabledBtnProcess = true
                        }
                    } else {
                        this.disabledBtnProcess = true
                    }
                },
                deep: true
            },
            search: {
                handler: function (val) {
                    if(val !== ""){
                        let that = this
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.checkCode(val)
                        }, 100);
                    }
                },
                deep: true
            },
        }
    }
</script>