<template>
    <v-container fill-height class="main-container">
        <div class="box-title fs16 bold">
            Basic Info
        </div>
        <div class="box-body">
            <v-row class="mt24">
                <v-col cols="12" md="12" class="-mt48">
                    <v-switch
                        v-model="form.type"
                        inset
                        :true-value="2"
                        :false-value="1"
                        color="dummy"
                        class="switch"
                        disabled
                    >
                        <template #prepend>
                            <span v-if="form.type == 1" class="fs14 mt5 pr10 text-secondary nowrap">Product Section</span>
                            <span v-else class="fs14 mt5 mr10 nowrap">Product Section</span>
                        </template>
                        <template #append>
                            <span v-if="form.type == 2" class="fs14 mt5 text-secondary nowrap">Product Recommendation</span>
                            <span v-else class="fs14 mt5 nowrap">Product Recommendation</span>
                        </template>
                    </v-switch>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="code"
                        v-model="form.code"
                        required
                        outlined
                        dense
                        disabled
                        :error-messages="error.code"
                    >
                        <template v-slot:label>
                            Product Section Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                        :counter="30"
                        maxlength="30"
                    >
                        <template v-slot:label>
                            Product Section Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col v-if="form.type == 1" cols="12" md="6" class="-mt24">
                    <v-select
                        v-model="form.sequence"
                        :items="sequenceNumber"
                        outlined
                        dense
                        required
                        :error-messages="error.sequence"
                    >
                        <template v-slot:label>
                            Product Section Sequence<span class="text-red">*</span>
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <MultiSelectAreaCheckbox 
                        v-model="areas" 
                        @selected="areaSelected"
                        :area="areas"
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
                        :archeType="arche_types"
                        :dense="true"
                        :disbled="false"
                        :aux_data="2"
                        label="Multiselect Archetype"
                    ></MultiSelectArcheTypeCheckbox>
                </v-col>
                <v-col v-if="form.type == 1" cols="12" md="6" class="-mt24">
                    <UploadImageCustomize 
                        :minWidth="360"
                        :minHeight="347"
                        :maxSize="1000"
                        :forImgName="form.name"
                        :imageFromUpdate="form.background_image"
                        :errorMsg="error.background_image"
                        :type="'product-group'"
                        :extention="'jpeg'"
                        :accept="'image/jpeg,image/jpg'"
                    ></UploadImageCustomize>
                </v-col>
                <v-col v-else cols="12" md="6" class="-mt24 hidden">
                    <UploadImageCustomize 
                        :minWidth="360"
                        :minHeight="347"
                        :maxSize="1000"
                        :forImgName="form.name"
                        :imageFromUpdate="form.background_image"
                        :errorMsg="error.background_image"
                        :type="'product-group'"
                        :extention="'jpeg'"
                        :accept="'image/jpeg,image/jpg'"
                    ></UploadImageCustomize>
                </v-col>
            </v-row>
        </div>
        <div class="box-title fs16 bold">
            Period
        </div>
        <div class="box-body">
            <v-row class="mt24">
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
                                        v-model="start_at_model"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on">
                                                <v-text-field
                                                    name="start_at"
                                                    prepend-inner-icon="mdi-calendar"
                                                    outlined
                                                    v-model="start_at"
                                                    maxlength="10"
                                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                                    :error-messages="error.start_at"
                                                    clearable
                                                    @click:clear="start_at = ''"
                                                    dense
                                                >
                                                    <template v-slot:label>
                                                        Start Date<span class="text-red">*</span>
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            v-model="start_at"
                                            @input="start_at_model = false"
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
                                                :value="start_time"
                                                :error-messages="error.start_at"
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
                                        v-model="end_at_model"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on">
                                                <v-text-field
                                                    name="end_at"
                                                    prepend-inner-icon="mdi-calendar"
                                                    outlined
                                                    v-model="end_at"
                                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                                    :error-messages="error.end_at"
                                                    clearable
                                                    @click:clear="end_at = ''"
                                                    dense
                                                >
                                                    <template v-slot:label>
                                                        End Date<span class="text-red">*</span>
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            v-model="end_at"
                                            @input="end_at_model = false"
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
                                                :error-messages="error.end_at"
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
            </v-row>
        </div>
        <div class="box-title fs16 bold">
            Product
        </div>
        <div class="box-body">
            <v-row class="pa16">
                <div class="wp48">
                    <div class="bold fs14 mb16">
                        Product List
                    </div>
                    <div class="border-list">
                        <div class="border-list-title">
                            <v-row class="mx15 mt15">
                                <div class="wp48">
                                    <v-text-field
                                        dense
                                        v-model="search_list"
                                        outlined
                                        filled
                                        placeholder="Search..."
                                        prepend-inner-icon="search"
                                    ></v-text-field>
                                </div>
                                <div class="wp4"/>
                                <div class="wp48">
                                    <SelectProductTag
                                        :norequired="true"
                                        :dense="true"
                                        @selected="productTagSelected"
                                    ></SelectProductTag>
                                </div>
                            </v-row>
                        </div>
                        <div class="border-list-scroll">
                            <div v-if="product_list_filter.length>0">
                                <div v-for="(item, idx) in product_list_filter" :key="idx">
                                    <div :class="product_list_hover==idx?'border-list-item-active':'border-list-item'" @mouseover="product_list_hover=idx" @mouseleave="product_list_hover=-1" @click="selectProduct(idx)">
                                        {{item.code}} - {{item.name}}
                                    </div>
                                </div>
                            </div>
                            <div class="no-product-list" v-else>
                                No Product
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wp4">
                    <div class="move-list-icon">
                        <div>
                            <a @click="selectAllProduct()" v-if="product_list.length > 0">
                                <img src="/icon/angle-double-right-active.svg">
                            </a>
                            <img src="/icon/angle-double-right.svg" v-else>
                        </div>
                        <div>
                            <img src="/icon/exchange-alt.svg" class="my10">
                        </div>
                        <div>
                            <a @click="unselectAllProduct()" v-if="product_selected.length > 0">
                                <img src="/icon/angle-double-left-active.svg">
                            </a>
                            <img src="/icon/angle-double-left.svg" v-else>
                        </div>
                    </div>
                </div>
                <div class="wp48">
                    <div class="bold fs14 mb16">
                        Product Selected<span class="text-red">*</span>
                    </div>
                    <div :class="error.products?'border-list-error':'border-list'">
                        <div class="border-list-title">
                            <v-row class="mx15 mt15">
                                <div class="wp100">
                                    <v-text-field
                                        dense
                                        v-model="search_selected"
                                        outlined
                                        filled
                                        placeholder="Search..."
                                        prepend-inner-icon="search"
                                    ></v-text-field>
                                </div>
                            </v-row>
                        </div>
                        <div class="border-list-scroll">
                            <div v-if="product_selected_filter_search.length>0">
                                <div v-for="(item, idx) in product_selected_filter_search" :key="idx">
                                    <div :class="product_selected_hover==idx?'border-list-item-active':'border-list-item'" @mouseover="product_selected_hover=idx" @mouseleave="product_selected_hover=-1" @click="unselectProduct(item)">
                                        {{item.code}} - {{item.name}}
                                    </div>
                                </div>
                            </div>
                            <div class="no-product-list" v-else>
                                No Product Selected
                            </div>
                        </div>
                    </div>
                    <div class="text-red fs12" v-if="error.products">{{error.products}}</div>
                </div>
            </v-row>
        </div>
        <div class="box-end">
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
                            v-privilege="'psc_crt'"
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
        name: "ProductSectionUpdate",
        data() {
            return {
                ConfirmData: {},
                areas: null,
                arche_types: null,
                start_time_model: '',
                start_time: '',
                start_at_model: '',
                start_at: '',
                current_date: '',
                end_at_model: '',
                end_at: '',
                end_time_model: '',
                end_time: '',
                current_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                sequenceNumber: [1,2,3,4,5],
                form : {
                    name: "",
                    sequence: 1,
                    areas: [],
                    archetypes: [],
                    start_at: "",
                    end_at: "",
                    background_image: "",
                    products: [],
                    type: 1
                },
                product_list_hover :-1,
                product_selected_hover :-1,
                product_list :[],
                product_selected :[],
                error: {},
                search_list : '',
                search_selected : '',
                overlay: false,
                category : ''
            }
        },
        mounted() {
            this.renderData()
            this.getProductList()
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err;
                self.imageError = err.image;
            });
            this.$root.$on('event_uploadImage', function (image) {
                self.form.background_image = image
            });
        },
        computed: {
            // Check for min time
            checkTimeStart() {
                const d = new Date();
                let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
                let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                const time = h + ':' + m
                if (this.current_date == this.start_at) {
                    return time
                }
            },
            // Check for min time
            checkTimeEnd() {
                const d = new Date();
                let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
                let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                const time = h + ':' + m
                if (this.current_date == this.end_at) {
                    return time
                }
            },
            // filter product selected
            product_selected_filter() {
                let uniqueArray = this.product_selected.filter((arr, index, self) =>
                    index === self.findIndex((t) => (t.id === arr.id && t.code === arr.code)))
                return uniqueArray
            },
            // filter & search product selected
            product_selected_filter_search() {
                let search = this.product_selected_filter.filter(post => {
                    return post.code.toLowerCase().includes(this.search_selected.toLowerCase()) || post.name.toLowerCase().includes(this.search_selected.toLowerCase())
                })
                return search
            },
            // filter product selected
            product_list_filter() {
                let uniqueArray = this.product_list.filter((arr, index, self) =>
                    index === self.findIndex((t) => (t.id === arr.id && t.code === arr.code)))
                return uniqueArray
            }
        },
        methods: {
            renderData(){ // for get data
                let self = this
                this.overlay = true
                this.$http.get("/campaign/product-section/" + this.$route.params.id).then(response => {
                    this.overlay = false;
                    if (response.data.data && response.data.data != null) {
                        this.form = response.data.data
                        let data = JSON.parse(JSON.stringify(response.data.data))
                        this.areaSelected(data.area_arr)
                        this.archetypeSelected(data.archetype_arr)
                        this.start_at = this.$moment(data.start_at).format('YYYY-MM-DD')
                        this.start_time = this.$moment(data.start_at).format('HH:mm')
                        this.end_at = this.$moment(data.end_at).format('YYYY-MM-DD')
                        this.end_time = this.$moment(data.end_at).format('HH:mm')
                        this.product_selected = data.product_section_item
                    }
                });
            },
            // Get product list
            getProductList() {
                let page = 100
                if (this.category) {
                    page = 1000
                }
                this.$http.get("campaign/product-section/product", {params :{
                    perpage:page,
                    conditions:'Or.name.icontains:'+this.search_list+'%2COr.code.icontains:'+this.search_list,
                    orderby:'-id',
                    category: this.category
                }}).then(response => {
                    if (response.data.data && response.data.data != null) {
                        this.product_list = response.data.data
                    } else {
                        this.product_list = []
                    }
                });
            },
            //For send data to API
            confirmButton() {
                if (this.start_at && this.start_time) {
                    let value = this.start_at + 'T' + this.start_time
                    this.form.start_at = this.$moment(value).format('YYYY-MM-DDTHH:mm:ssZ');
                } else {
                    this.form.start_at = null
                }
                if (this.end_at && this.end_time) {
                    let value = this.end_at + 'T' + this.end_time
                    this.form.end_at = this.$moment(value).format('YYYY-MM-DDTHH:mm:ssZ');
                } else {
                    this.form.end_at = null
                }
                this.form.products = []
                if (this.product_selected_filter) {
                    this.product_selected_filter.forEach(e => {
                        this.form.products.push(e.id)
                    });
                }
                if (this.form.type == 2) {
                    this.form.background_image = ""
                }
                this.error.background_image = ''
                this.ConfirmData = {
                    model: true,
                    title: "Create Product Section",
                    text: "Are you sure want to update this Product Section?",
                    urlApi: "/campaign/product-section/"+ this.$route.params.id,
                    nextPage: "/campaign/product-section",
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
            productTagSelected(d) { // For select product tag
                this.category = ''
                if (d) {
                    this.category = d.value
                }
                this.getProductList()
                
            },
            selectProduct(idx) { // For select product list
                let json = this.product_list[idx]
                this.product_selected.push(this.product_list[idx])
                this.product_list.splice(idx,1)
                this.product_list.forEach((e, i) => {
                    if (json.id == e.id) {
                        this.product_list.splice(i,1)
                    }
                });
            },
            unselectProduct(item) { // For unselect product selected
                this.product_selected.forEach((e, i) => {
                    if (item.id == e.id) {
                        this.product_list.push(e)
                        this.product_selected.splice(i,1)
                    }
                });
            },
            selectAllProduct() { // For select all product list
                this.product_list.forEach((e,idx) => {
                    this.product_selected.push(e)
                    if (idx+1==this.product_list.length) {
                        this.product_list = []
                    }
                });
            },
            unselectAllProduct() { // For unselect all product selected
                this.product_selected.forEach((e,idx) => {
                    this.product_list.push(e)
                    if (idx+1==this.product_selected.length) {
                        this.product_selected = []
                    }
                });
            },
        },
        watch: {
            'search_list': { // to filter by search box
                handler: function (search) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){ 
                        that.getProductList(search)
                    }, 1000);
                },
                deep: true
            },
            'error': {
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
    }
</script>