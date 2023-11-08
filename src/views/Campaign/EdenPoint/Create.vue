<template>
    <v-container fill-height class="main-container">
        <div class="box-title fs16 bold">
            Basic Info
        </div>
        <div class="box-body">
            <v-row class="mt24">
                <v-col cols="12" md="12" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                        :counter="20"
                        maxlength="20"
                    >
                        <template v-slot:label>
                            EdenPoint Campaign Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="3" class="-mt48">
                    <v-switch
                        v-model="selectedSwitch"
                        inset
                        :true-value="1"
                        :false-value="2"
                        color="dummy"
                        class="switch"
                    >
                        <template #prepend>
                            <span v-if="selectedSwitch == 1" class="fs14 mt5 pr10 nowrap">Customer Tag</span>
                            <span v-else class="fs14 mt5 mr10 text-secondary nowrap">Customer Tag</span>
                        </template>
                        <template #append>
                            <span v-if="selectedSwitch == 1" class="fs14 mt5 text-secondary nowrap">Archetype</span>
                            <span v-else class="fs14 mt5 nowrap">Archetype</span>
                        </template>
                    </v-switch>
                </v-col>
                <v-col v-if="selectedSwitch == 1" cols="12" md="12" class="-mt24">
                    <MultiSelectArcheTypeCheckbox
                        v-model="arche_types"
                        @selected="archetypeSelected"
                        :error="error.archetypes"
                        :dense="true"
                        :disbled="false"
                        :aux_data="2"
                        label="Multiselect Archetype"
                        :disabled="disabled.arche_types"
                    ></MultiSelectArcheTypeCheckbox>
                </v-col>
                <v-col v-if="selectedSwitch == 1"  cols="12" md="12" class="-mt24">
                    <MultiSelectAreaCheckbox 
                        v-model="areas" 
                        @selected="areaSelected"
                        :error="error.areas"
                        :dense="true"
                        :aux_data="2"
                        label="Multiselect Area"
                        :disabled="disabled.arche_types"
                    ></MultiSelectAreaCheckbox>
                </v-col>
                <v-col v-else cols="12" md="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <SelectCustomerTag
                                    v-on="{ ...tooltip }"
                                    name="customer_tag"
                                    v-model="customer_tag"
                                    @selected="customerTagSelected"
                                    :error="error.customer_tags"
                                    :dense="true"
                                    attribute="max_ep"
                                    :disabled="disabled.customer_tag"
                                ></SelectCustomerTag>
                            </div>
                        </template>
                       <span>Can select maximum 5 Customer Tags</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <div class="box-title fs16 bold">
            EdenPoint Campaign Info
        </div>
        <div class="box-body">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <div class="text-black60 fs14 -mt20">
                        Multiple of Point (x)<span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="multiple"
                        :class="!error.multiple ? 'formNumericNewLeft' : 'formNumericErrNewLeft'"
                        v-model="form.multiple"
                        dense
                        :max="max_multiple"
                        :min="min_multiple"
                    ></vue-numeric>
                    <div v-if="error.multiple" class="mt-1 ml-3 fs12 text-red">
                        {{ error.multiple }}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <v-card elevation="0" outlined>
                        <v-card-text>
                            <div class="fs16 text-black">Start Time Period</div>
                        </v-card-text>
                        <v-card-text class="-mt12 -mb10">
                            <v-row>
                                <v-col>
                                    <v-menu
                                        ref="menu"
                                        v-model="start_date_model"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on">
                                                <v-text-field
                                                    name="start_date"
                                                    prepend-inner-icon="mdi-calendar"
                                                    outlined
                                                    v-model="start_date"
                                                    maxlength="10"
                                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                                    :error-messages="error.start_date"
                                                    clearable
                                                    @click:clear="start_date = ''"
                                                    dense
                                                >
                                                    <template v-slot:label>
                                                        Start Date<span class="text-red">*</span>
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            v-model="start_date"
                                            @input="start_date_model = false"
                                            :min="current_date"
                                        ></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col>
                                    <v-menu
                                        ref="menuTime"
                                        v-model="start_time_model"
                                        :close-on-content-click="false"
                                        :return-value.sync="start_time"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                name="start_time"
                                                prepend-inner-icon="mdi-clock-outline"
                                                outlined
                                                clearable
                                                maxlength="5"
                                                onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                                                @click:clear="start_time = ''"
                                                v-model="start_time"
                                                :value="timeNow"
                                                :error-messages="error.start_date"
                                                dense
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <template v-slot:label>
                                                    Start Time<span class="text-red">*</span>
                                                </template>
                                            </v-text-field>
                                        </template>
                                        <v-time-picker
                                            format="24hr"
                                            :min="checkTimeStart"
                                            v-if="start_time_model"
                                            v-model="start_time"
                                            full-width
                                            @click:minute="$refs.menuTime.save(start_time)"
                                        ></v-time-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <v-card elevation="0" outlined>
                        <v-card-text>
                            <div class="fs16 text-black">End Time Period</div>
                        </v-card-text>
                        <v-card-text class="-mt12 -mb10">
                            <v-row>
                                <v-col>
                                    <v-menu
                                        ref="menu"
                                        v-model="end_date_model"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on">
                                                <v-text-field
                                                    name="end_date"
                                                    prepend-inner-icon="mdi-calendar"
                                                    outlined
                                                    v-model="end_date"
                                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                                    :error-messages="error.end_date"
                                                    clearable
                                                    @click:clear="end_date = ''"
                                                    dense
                                                >
                                                    <template v-slot:label>
                                                        End Date<span class="text-red">*</span>
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            v-model="end_date"
                                            @input="end_date_model = false"
                                            :min="current_date"
                                        ></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col>
                                    <v-menu
                                        ref="menuEndTime"
                                        v-model="end_time_model"
                                        :close-on-content-click="false"
                                        :return-value.sync="end_time"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                name="end_time"
                                                prepend-inner-icon="mdi-clock-outline"
                                                outlined
                                                clearable
                                                maxlength="5"
                                                onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                                                @click:clear="end_time = ''"
                                                v-model="end_time"
                                                :error-messages="error.end_date"
                                                dense
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <template v-slot:label>
                                                    End Time<span class="text-red">*</span>
                                                </template>
                                            </v-text-field>
                                        </template>
                                        <v-time-picker
                                            format="24hr"
                                            :min="checkTimeEnd"
                                            v-if="end_time_model"
                                            v-model="end_time"
                                            full-width
                                            @click:minute="$refs.menuEndTime.save(end_time)"
                                        ></v-time-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <UploadImageEP 
                        :minWidth="328"
                        :minHeight="328"
                        :maxSize="1000"
                        :forImgName="form.name"
                        :errorMsg="error.image_url"
                        :type="'product-tag'"
                        :extention="'jpeg'"
                        :accept="'image/jpeg,image/jpg'"
                    ></UploadImageEP>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            outlined
                            color="#EBEBEB" 
                            class="main-btn"
                            @click="$router.go(-1)"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'ep_crt'"
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
        name: "EdenPointCampaignCreate",
        data() {
            return {
                ConfirmData: {},
                areas: null,
                arche_types: null,
                customer_tag: null,
                start_time_model: '',
                start_time: '',
                start_date_model: '',
                start_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                current_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                end_date_model: '',
                end_date: '',
                end_time_model: '',
                end_time: '23:59',
                max_multiple: 100,
                min_multiple: 2,
                selectedSwitch: null,
                form: {
                    name: '',
                    campaign_filter_type: 2,
                    areas: [],
                    archetypes: [],
                    customer_tags: [],
                    start_date: '',
                    end_date: '',
                    image_url: '',
                    multiple: 2,
                },
                error: {},
                overlay: false,
                dummy: '',
                disabled: {
                    customer_tag: false,
                    arche_types: true,
                }
            }
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err;
                self.imageError = err.image;
            });
            this.$root.$on('event_uploadImage', function (image) {
                self.form.image_url = image
            });
        },
        computed: {
            // Check and save current time
            timeNow() {
                const d = new Date();
                let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
                let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                const time = h + ':' + m
                if (this.start_time === "") {
                    return this.start_time = time
                }
            },
            // Check for min time
            checkTimeStart() {
                const d = new Date();
                let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
                let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                const time = h + ':' + m
                if (this.current_date == this.start_date) {
                    return time
                }
            },
            // Check for min time
            checkTimeEnd() {
                const d = new Date();
                let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
                let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                const time = h + ':' + m
                if (this.current_date == this.end_date) {
                    return time
                }
            },
            // Check image
            checkImg() {
                if(this.form.image_url){
                    return false
                }else{
                    return true
                }
            }
        },
        watch:{
            //For auto scroll to error position
            error: {
                handler: function (val) {
                    if(val){
                        setTimeout(() => {
                            const element = document.querySelector(".v-messages__message:first-of-type");
                            if(element){
                                element.scrollIntoView({block: "center", inline: "center"});
                            }
                        }, 500);
                    }
                },
                deep: true
            },
        },
        methods: {
            //For send data to API
            confirmButton() {
                if (this.start_date && this.start_time) {
                    let value = this.start_date + 'T' + this.start_time
                    this.form.start_date = this.$moment(value).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    this.form.start_date = ""
                }
                if (this.end_date && this.end_time) {
                    let value = this.end_date + 'T' + this.end_time
                    this.form.end_date = this.$moment(value).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    this.form.end_date = ""
                }
                this.error.image_url = ''
                this.ConfirmData = {
                    model: true,
                    title: "Create EdenPoint Campaign",
                    text: "Are you sure want to create this EdenPoint Campaign?",
                    urlApi: "/campaign/eden-point",
                    nextPage: "/campaign/eden-point",
                    post: true,
                    data: this.form
                }
            },
            //For select area and set id
            areaSelected(d) { 
                this.areas = null
                this.form.areas = [];
                if (d) {
                    this.areas = d
                    d.forEach(e => {
                        this.form.areas.push(e.id)
                    });
                }
            },
            //For select archetype and set id
            archetypeSelected(d) { 
                this.arche_types = null
                this.form.archetypes = [];
                if (d) {
                    this.arche_types = d
                    d.forEach(e => {
                        this.form.archetypes.push(e.id)
                    });
                }
            },
            //For select customer tag and set id
            customerTagSelected(d) { 
                this.customer_tag = null
                this.form.customer_tags = [];
                if (d) {
                    this.customer_tag = d
                    d.forEach(e => {
                        this.form.customer_tags.push(e.id)
                    });
                }
            },
        },
        watch: {
            //For set campaign_filter_type and disable enable between customer tag and area,archetype
            selectedSwitch: {
                handler: function (val) {
                    this.form.campaign_filter_type = val
                    this.form.areas = []
                    this.form.archetypes = []
                    this.form.customer_tags = []
                    this.error.customer_tags = ''
                    this.error.archetypes = ''
                    this.error.areas = ''

                    if (val == 1) {
                        this.disabled.customer_tag = true
                        this.disabled.arche_types = false
                    }
                    else{
                        this.disabled.customer_tag = false
                        this.disabled.arche_types = true
                    }
                },
                deep: true
            },
        },
    }
</script>
