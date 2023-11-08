<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24 -mb38">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        :area="area"
                        required
                        :dense="true"
                        :error="error.area_id"
                        disabled
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="delivery_fee"
                        v-model="delivery_fee"
                        required
                        outlined
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                        dense
                        :error-messages="error.delivery_fee"
                    >
                        <template v-slot:label>
                            Delivery Fee<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="minimum_order"
                        v-model="min_order"
                        required
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                        outlined
                        dense
                        :error-messages="error.min_order"
                    >
                        <template v-slot:label>
                            Minimum Order Free Delivery<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                    <v-menu
                                    ref="menuTime"
                                    v-model="order_time_limit"
                                    :close-on-content-click="false"
                                    :return-value.sync="form.order_time_limit"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            prepend-inner-icon="mdi-clock-outline"
                                            outlined
                                            clearable
                                            maxlength="5"
                                            onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                                            @click:clear="form.order_time_limit = ''"
                                            v-model="form.order_time_limit"
                                            :error-messages="error.order_time_limit"
                                            dense
                                            v-bind="attrs"
                                            v-on="on"
                                        >
                                            <template v-slot:label>
                                                Order Time Limit<span style="color:red">*</span>
                                            </template>
                                        </v-text-field>
                                    </template>
                                    <v-time-picker
                                        format="24hr"
                                        v-if="order_time_limit"
                                        v-model="form.order_time_limit"
                                        full-width
                                        @click:minute="$refs.menuTime.save(form.order_time_limit)"
                                    ></v-time-picker>
                                </v-menu>
                            </div>
                        </template>
                        <span>Daily cut off time for sales order</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPriceSet
                        name="price_set"
                        @selected="pricesetSelected"
                        :price_set="price_set"
                        required
                        :dense="true"
                        :error="error.default_price_set"
                    ></SelectPriceSet>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row class="-ma16">
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
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    export default {
        name: "ConfigurationAreaPolicyUpdate",
        data () {
            return {
                area:null,
                price_set:null,
                order_time_limit:'',
                min_order:'',
                delivery_fee:'',
                time:'',
                form:{
                    delivery_fee: 0.00,
                    min_order: 0.00,
                    order_time_limit: '',
                    area_id: '',
                    price_set_id:''
                },
                error:{},
                ConfirmData:{},
            }
        },
        methods:{
            areaSelected(d) {
                this.area = null;
                this.form.area_id = '';
                if (d) {
                    this.area = d;
                    this.form.area_id = d.id
                }
            },
            pricesetSelected(d) {
                this.price_set = null;
                this.form.price_set_id = '';
                if (d) {
                    this.price_set = d;
                    this.form.price_set_id = d.id
                }
            },
            renderData(){
                this.$http.get("/config/area/policy/"+ this.$route.params.id)
                    .then(response => {
                        let del_fee = response.data.data.delivery_fee
                        let min_or = response.data.data.min_order

                        this.form.delivery_fee = `${del_fee}`
                        this.form.min_order = `${min_or}`
                        this.delivery_fee = `${del_fee}`
                        this.min_order = `${min_or}`

                        this.form = response.data.data

                        this.time = response.data.data.order_time_limit

                        this.areaSelected(response.data.data.area)
                        this.pricesetSelected(response.data.data.default_price_set)
                    });
            },
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Area Policy",
                    text : "Are you sure want to update this Area Policy?",
                    urlApi : '/config/area/policy/'+ this.$route.params.id,
                    nextPage : "/configuration/area_policy",
                    data : {
                        delivery_fee : this.delivery_fee != "" ? parseFloat(this.delivery_fee) : 0,
                        min_order: this.min_order != "" ? parseFloat(this.min_order) : 0,
                        order_time_limit: this.form.order_time_limit,
                        area_id: this.form.area_id,
                        default_price_set: this.form.price_set_id,
                    }
                }
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        created() {
            this.renderData()
        },
    }
</script>
