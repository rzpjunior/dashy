<template>
    <v-container fill-height class="main-container">
        <div class="box-title fs16 bold">
            Basic Info
        </div>
        <div class="box-body">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="code"
                        v-model="form.code"
                        required
                        outlined
                        :error-messages="error.code"
                        dense
                        disabled
                    >
                        <template v-slot:label>
                            Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="campaign_name"
                        v-model="form.campaign_name"
                        required
                        outlined
                        :counter="100"
                        maxlength="100"
                        :error-messages="error.campaign_name"
                        dense
                    >
                        <template v-slot:label>
                            Campaign Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <MultiSelectAreaCheckbox 
                        @selected="areaSelected"
                        :error="error.area"
                        :aux_data="2"
                        :area="area"
                    ></MultiSelectAreaCheckbox>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <MultiSelectArcheTypeCheckbox 
                        @selected="archetypeSelected"
                        :error="error.archetype"
                        :archeType="archetype"
                        :aux_data="2"
                    ></MultiSelectArcheTypeCheckbox>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectRedirectTo
                        @selected="redirectToSelected"
                        :error="error.redirect_to"
                        :redirect_to="redirect_to"
                        :attribute="'redirect_to'"
                        :table="'notification_campaign'"
                    ></SelectRedirectTo>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectProduct
                        v-if="form.redirect_to == 1"
                        :required="true"
                        :dense="true"
                        @selected="redirectValueSelected"
                        :product="product"
                        :error="error.product_id"
                    ></SelectProduct>
                    <SelectProductTag
                        v-if="form.redirect_to == 2"
                        :required="true"
                        :product_tag="product_tag"
                        :dense="true"
                        @selected="redirectValueSelected2"
                        :error="error.tag_product_id"
                    ></SelectProductTag>
                    <v-text-field
                        v-if="form.redirect_to == 4"
                        name="redirect_value"
                        v-model="form.redirect_value"
                        maxlength="2084"
                        required
                        outlined
                        :error-messages="error.url"
                        dense
                    >
                        <template v-slot:label>
                            URL<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
        </div>
        <div class="box-title-end fs16 bold">
            Push Notification Info
        </div>
        <div class="box-body">
            <v-row class="mt24">
                <v-col cols="12" md="12" class="-mt24">
                    <v-text-field
                        name="title"
                        v-model="form.title"
                        required
                        outlined
                        :counter="100"
                        maxlength="100"
                        :error-messages="error.title"
                        dense
                    >
                        <template v-slot:label>
                           Notification Title<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="message"
                        v-model="form.message"
                        :counter="150"
                        maxlength="150"
                        outlined
                        rows="3"
                        :error-messages="error.message"
                    >
                        <template v-slot:label>
                           Message<span class="text-red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="mx12 mb12 -mt4 wp100">
            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col">
                        <div class="fs14 bold">
                            Schedule Push Notification
                        </div>
                        <div class="w130">
                            <v-switch
                                v-model="form.push_now"
                                inset
                                :true-value="1"
                                :false-value="2"
                                color="#50ABA3"
                            >
                                <template v-slot:label>
                                    <span class="fs14">Push Now</span>
                                </template>
                            </v-switch>
                        </div>
                        <v-row v-if="form.push_now == 2">
                            <v-col>
                                <v-menu
                                    ref="menu"
                                    v-model="send_date_model"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <div v-on="on">
                                            <v-text-field
                                                name="send_date"
                                                prepend-inner-icon="mdi-calendar"
                                                outlined
                                                v-model="send_date"
                                                maxlength="10"
                                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                                :error-messages="error.scheduled_at"
                                                clearable
                                                readonly
                                                v-on="on" 
                                                v-bind="attrs"
                                                @click:clear="send_date = ''"
                                                dense
                                            >
                                                <template v-slot:label>
                                                    Send Date<span style="color:red">*</span>
                                                </template>
                                            </v-text-field>
                                        </div>
                                    </template>
                                    <v-date-picker
                                        v-model="send_date"
                                        @input="send_date_model = false"
                                        :min="min_date"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col>
                                <v-menu
                                    ref="menuTime"
                                    v-model="send_time_model"
                                    :close-on-content-click="false"
                                    :return-value.sync="send_time"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <div v-on="on" v-bind="attrs">
                                            <v-text-field
                                                name="send_time"
                                                prepend-inner-icon="mdi-clock-outline"
                                                outlined
                                                clearable
                                                readonly
                                                v-on="on" 
                                                v-bind="attrs"
                                                maxlength="5"
                                                onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                                                @click:clear="send_time = ''"
                                                v-model="send_time"
                                                :error-messages="error.scheduled_at"
                                                dense
                                            >
                                                <template v-slot:label>
                                                    Send Time<span style="color:red">*</span>
                                                </template>
                                            </v-text-field>
                                        </div>
                                    </template>
                                    <v-time-picker
                                        format="24hr"
                                        v-if="send_time_model"
                                        v-model="send_time"
                                        full-width
                                        :allowed-minutes="allowedMinutes"
                                        @click:minute="$refs.menuTime.save(send_time)"
                                    ></v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </div>
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
                            v-privilege="'pnt_upd'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <LoadingBar :value="overlay"/>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    export default {
        name : 'PushNotificationUpdate',
        data () {
            return {
                ConfirmData:{},
                form:{
                    "campaign_name": "",
                    "area": [],
                    "archetype": [],
                    "redirect_to": 0,
                    "redirect_value": "",
                    "title": "",
                    "message": "",
                    "push_now": 2,
                    "scheduled_at": null
                },
                error:{},
                min_date: new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                send_time_model: '',
                send_time: '',
                send_date_model: '',
                send_date: '',
                product: '',
                product_tag: '',
                archetype: '',
                area: '',
                overlay : false,
                redirect_to : ''
            }
        },
        created() {
            this.renderData()
        },
        methods:{
            allowedMinutes: m => m % 10 === 0, // Allow menit hanya kelipatan 10
            renderData(){ // for get data
                let self = this
                this.overlay = true
                this.$http.get("/campaign/push-notification/" + this.$route.params.id).then(response => {
                    this.overlay = false;
                    if (response.data.data && response.data.data != null) {
                        this.form = response.data.data
                        let data = JSON.parse(JSON.stringify(response.data.data))
                        this.areaSelected(data.area_arr)
                        this.archetypeSelected(data.archetype_arr)
                        this.$http.get("/config/glossary",{params:{
                            conditions:'attribute:redirect_to|value_int:'+data.redirect_to,
                        }}).then(response => { 
                            if (response.data.data.length>0 && response.data.data != null) {
                                this.redirectToSelected(response.data.data[0])
                            }
                        });
                        if (data.redirect_to == 1) {
                            setTimeout(function(){
                                self.redirectValueSelected({"id":data.redirect_value})
                            }, 500);
                        } else if (data.redirect_to == 2) {
                            setTimeout(function(){
                                self.redirectValueSelected2({"id":data.redirect_value})
                            }, 500);
                        } else if (data.redirect_to == 4) {
                            setTimeout(function(){
                                self.form.redirect_value = data.redirect_value
                            }, 500);
                        }
                        if (data.push_now == 2) {
                            this.send_date = this.$moment(data.scheduled_at).format('YYYY-MM-DD')
                            this.send_time = this.$moment(data.scheduled_at).format('HH:mm')
                        }
                    } else {
                        this.form = {
                            "campaign_name": "",
                            "area": [],
                            "archetype": [],
                            "redirect_to": 0,
                            "redirect_value": "",
                            "title": "",
                            "message": "",
                            "push_now": 2,
                            "scheduled_at": null
                        }
                    }
                });
            },
            confirmButton() { // for send data to api
                if (this.form.push_now == 2) {
                    if (this.send_date && this.send_time) {
                        let value = this.send_date + 'T' + this.send_time
                        this.form.scheduled_at = this.$moment(value).format('YYYY-MM-DDTHH:mm:ssZ')
                    } else {
                        this.form.scheduled_at = null
                    }
                } else {
                    this.form.scheduled_at = this.$moment(new Date).format('YYYY-MM-DDTHH:mm:ssZ')
                }
                if (this.form.redirect_to == 4) {
                    if (!this.form.redirect_value.includes('?hidenavbar=1')) {
                        this.form.redirect_value += '?hidenavbar=1'
                    }
                }
                this.ConfirmData = {
                    model : true,
                    title : "Update Push Notification",
                    text : "Are you sure want to Update this Push Notification?",
                    urlApi : '/campaign/push-notification/'+ this.$route.params.id,
                    nextPage : '/campaign/push-notification',
                    data : this.form
                }
            },
            areaSelected(d) { // for select area and set id
                this.area = null
                this.form.area = [];
                if (d) {
                    this.area = d
                    d.forEach(e => {
                        this.form.area.push(parseInt(e.id))
                    });
                }
            },
            archetypeSelected(d) { // for select archetype and set id
                this.archetype = null
                this.form.archetype = [];
                if (d) {
                    this.archetype = d
                    d.forEach(e => {
                        this.form.archetype.push(parseInt(e.id))
                    });
                }
            },
            redirectToSelected(d) { // for select redirect_to and set id
                this.redirect_to = null
                this.product = null
                this.product_tag = null
                this.form.redirect_to = 0;
                this.form.redirect_value = '';
                if (d) {
                    this.redirect_to = d
                    this.form.redirect_to = d.value_int;
                }
            },
            redirectValueSelected(d) { // for select redirect_value (product) and set id
                this.product = null
                this.form.redirect_value = '';
                if (d) {
                    this.product = d
                    this.form.redirect_value = d.id;
                }
            },
            redirectValueSelected2(d) { // for select redirect_value (product_tag) and set id
                this.product_tag = null
                this.form.redirect_value = '';
                if (d) {
                    this.product_tag = d
                    this.form.redirect_value = d.id;
                }
            },
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
    }
</script>
