<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
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
                            Banner Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-select
                        v-model="form.queue"
                        :items="queueNumber"
                        outlined
                        dense
                        required
                        :error-messages="error.queue"
                    >
                        <template v-slot:label>
                            Banner Queue<span class="text-red">*</span>
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <MultiSelectAreaCheckbox 
                        v-model="areas" 
                        @selected="areaSelected"
                        :error="error.areas"
                        :dense="true"
                        :aux_data="2"
                        label="Multiselect Area"
                    ></MultiSelectAreaCheckbox>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <MultiSelectArcheTypeCheckbox
                        v-model="arche_types"
                        @selected="archetypeSelected"
                        :error="error.archetypes"
                        :dense="true"
                        :disbled="false"
                        :aux_data="2"
                        label="Multiselect Archetype"
                    ></MultiSelectArcheTypeCheckbox>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectRedirectTo
                        @selected="redirectToSelected"
                        :error="error.navigation_type"
                        table="banner"
                        attribute="navigate_type"
                    ></SelectRedirectTo>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        v-if="form.navigation_type == 1"
                        name="navigation_url"
                        v-model="form.navigation_url"
                        maxlength="2084"
                        required
                        outlined
                        :error-messages="error.navigation_url"
                        dense
                    >
                        <template v-slot:label>
                            URL<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    <SelectProductTag
                        v-if="form.navigation_type == 2"
                        :required="true"
                        :dense="true"
                        @selected="productTagSelected"
                        :error="error.tag_product_id"
                    ></SelectProductTag>
                    <SelectProduct
                        v-if="form.navigation_type == 3"
                        :required="true"
                        :dense="true"
                        @selected="productSelected"
                        :error="error.product_id"
                    ></SelectProduct>
                    <SelectProductSection
                        v-if="form.navigation_type == 6"
                        :area="form.areas"
                        :required="true"
                        :archetype="form.archetypes"
                        @selected="productSectionSelected"
                        :error="error.product_section_id"
                    ></SelectProductSection>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <v-card elevation="0" outlined>
                        <v-card-text>
                            <div class="fs16 text-black">Start Time</div>
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
                            <div class="fs16 text-black">End Time</div>
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
                    <UploadImageBanner 
                        :minWidth="360"
                        :minHeight="180"
                        :maxSize="1000"
                        :forImgName="form.name"
                        :errorMsg="error.image_url"
                        :type="'product-tag'"
                        :extention="'jpeg'"
                        :accept="'image/jpeg,image/jpg'"
                    ></UploadImageBanner>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="only-btn mt10"
                        width="360"
                        @click="preview=true"
                        :disabled="checkImg"
                    >
                        <span v-if="checkImg == false" class="text-secondary"><v-icon class="ml16">mdi-eye</v-icon> Preview</span>
                        <span v-else><v-icon class="ml16">mdi-eye</v-icon> Preview</span>
                    </v-btn>
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
                            v-privilege="'bnr_crt'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="preview"
            persistent
            max-width="800px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" md="6">
                            Preview
                        </v-col>
                        <v-col class="flex-align-end" md="6">
                            <v-btn
                                icon
                                @click="preview=false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-actions class="pb-4">
                    <div class="img-bnr-frame">
                        <v-img
                            class="absolute mt10"
                            width="360"
                            src="/img/mobile-view.png"
                        ></v-img>
                        <v-img
                            class="relative"
                            width="427"
                            src="/img/mobile_frame.png"
                        ></v-img>
                        <v-img
                            class="absolute img-bnr-preview"
                            width="360"
                            height="180"
                            :src="form.image_url"
                        >
                            <div class="absolute ml15">   
                                <span v-for="index in 5" :key="index">
                                    <span v-if="index == form.queue" class="long-dot"></span>
                                    <span v-else class="dot"></span>
                                </span>
                            </div>
                        </v-img>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "BannerCreate",
        data() {
            return {
                ConfirmData: {},
                areas: null,
                arche_types: null,
                start_time_model: '',
                start_time: '',
                start_date_model: '',
                start_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                current_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                end_date_model: '',
                end_date: '',
                end_time_model: '',
                end_time: '23:59',
                queueNumber: [1,2,3,4,5],
                form: {
                    name: '',
                    areas: [],
                    archetypes: [],
                    start_date: '',
                    end_date: '',
                    image_url: '',
                    navigation_type: 0,
                    navigation_url: '',
                    tag_product_id: '',
                    product_id: '',
                    product_section_id :'',
                    queue: 1
                },
                preview: false,
                error: {},
                overlay: false,
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
            error: {
                handler: function (val) { // if any error, auto scroll to error position
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
                if (this.form.navigation_type == 1) {
                    if (!this.form.navigation_url.includes('?hidenavbar=1') && this.form.navigation_url.includes('/blog/')) {
                        this.form.navigation_url += '?hidenavbar=1'
                    }
                }
                this.error.image_url = ''
                this.ConfirmData = {
                    model: true,
                    title: "Create Banner",
                    text: "Are you sure want to create this Banner?",
                    urlApi: "/campaign/banner",
                    nextPage: "/campaign/banner",
                    post: true,
                    data: this.form
                }
            },
            areaSelected(d) { //For select area and set id
                this.areas = null
                this.form.areas = [];
                if (d) {
                    this.areas = d
                    d.forEach(e => {
                        this.form.areas.push(e.id)
                    });
                }
            },
            archetypeSelected(d) { //For select archetype and set id
                this.arche_types = null
                this.form.archetypes = [];
                if (d) {
                    this.arche_types = d
                    d.forEach(e => {
                        this.form.archetypes.push(e.id)
                    });
                }
            },
            redirectToSelected(d) { //For select redirect_to and set id
                this.form.navigation_url = '';
                this.form.tag_product_id = '';
                this.form.product_id = '';
                this.form.product_section_id = '';
                this.form.navigation_type = 0;
                if (d) {
                    this.form.navigation_type = d.value_int;
                }
            },
            productSelected(d) { //For select redirect_value (product) and set id
                this.form.product_id = '';
                if (d) {
                    this.form.product_id = d.id;
                }
            },
            productSectionSelected(d) { //For select redirect_value (product section) and set id
                this.form.product_section_id = '';
                if (d) {
                    this.form.product_section_id = d.id;
                }
            },
            productTagSelected(d) { //For select redirect_value (product_tag) and set id
                this.form.tag_product_id = '';
                if (d) {
                    this.form.tag_product_id = d.id;
                }
            },
        },
    }
</script>
