<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24 -mb24">
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
                    <SelectBusinessType
                        name="area"
                        @selected="businessTypeSelected"
                        :business_type="form.business_type_id"
                        required
                        :dense="true"
                        :error="error.business_type_id"
                        disabled
                    ></SelectBusinessType>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="delivery_fee"
                        v-model="form.delivery_fee"
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
                        v-model="form.min_order"
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
        name: "ConfigurationAreaBusinessPolicyUpdate",
        data () {
            return {
                form:{
                    "area_id": "",
                    "business_type_id": "",
                    "delivery_fee": 0,
                    "min_order": 0
                },
                area : '',
                error:{},
                ConfirmData:{},
            }
        },
        methods:{
            // For select Area
            areaSelected(d) {
                this.area = null;
                this.form.area_id = '';
                if (d) {
                    this.area = d;
                    this.form.area_id = d.id
                }
            },
            // For select Business Type
            businessTypeSelected(d) {
                this.form.business_type_id = ""
                if (d) {
                    this.form.business_type_id = d.id
                }
            },
            // For get data
            renderData(){
                this.$http.get("/config/area/business_policy/"+ this.$route.params.id)
                    .then(response => {
                        this.form = response.data.data
                        this.areaSelected(response.data.data.area)
                        this.businessTypeSelected(response.data.data.business)
                    });
            },
            // For update data to api
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Area Business Policy",
                    text : "Are you sure want to update this Area Business Policy?",
                    urlApi : '/config/area/business_policy/'+ this.$route.params.id,
                    nextPage : "/configuration/area-business-policy",
                    data : {
                        delivery_fee : this.delivery_fee != "" ? parseFloat(this.form.delivery_fee) : 0,
                        min_order: this.min_order != "" ? parseFloat(this.form.min_order) : 0,
                        area_id: this.form.area_id,
                        business_type_id: this.form.business_type_id,
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
