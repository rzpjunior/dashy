<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="redeem_code"
                        v-model="form.redeem_code"
                        maxlength="20"
                        required
                        outlined
                        dense
                        :error-messages="error.redeem_code"
                        onkeypress="return event.charCode >= 97 && event.charCode <= 122 || event.charCode >= 65 && event.charCode <= 90 || event.charCode >= 48 && event.charCode <= 57"
                    >
                        <template v-slot:label>
                            Redeem Code<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-text-field
                                    name="name"
                                    v-model="form.name"
                                    maxlength="20"
                                    required
                                    outlined
                                    dense
                                    :error-messages="error.name"
                                >
                                    <template v-slot:label>
                                        Name<span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <span>Voucher name displayed on apps</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectGlossary
                        v-model="form.type"
                        outlined
                        :dense="true"
                        :norequired="false"
                        :error="error.type"
                        label="Voucher Type"
                        @selected="typeSelected"
                        table="voucher"
                        attribute="type"
                    ></SelectGlossary>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        required
                        :error="error.area_id"
                        v-model="area"
                        @selected="areaSelected"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectBusinessType
                        name="business_type"
                        @selected="businessTypeSelected"
                        v-model="business_type"
                        :error="error.business_type_id"
                        :dense="true"
                    ></SelectBusinessType>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArchetype
                        :disabled="disabledArchetype"
                        @selected="archetypeSelected"
                        :business_type_id="form.business_type_id"
                        v-model="archetype"
                        :error="error.archetype_id"
                        :dense="true"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCustomerTag
                        name="customer_tag"
                        v-model="customerTag"
                        :watchCustomerTag="customerTag"
                        @selected="customerTagSelected"
                        :attribute="'vou_max_tag'"
                        :error="error.customer_tag"
                        :norequired="true"
                        :clear="disableFieldCustomerName"
                        :disabled="disableFieldCustomerTag"
                        :dense="true"
                    ></SelectCustomerTag>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectMerchant
                        :norequired="true"
                        @selected="merchantSelected"
                        :label="'Customer Name'"
                        :clear="disableFieldCustomerTag"
                        :disabled="disableFieldCustomerName"
                        :business_type="form.business_type_id"
                        :dense="true"
                    ></SelectMerchant>
                </v-col>
                <v-col cols="3" offset="9" class="-mt50">
                    <div class="d-flex justify-end">
                        <div class="mt20 mr16">Customer Name</div>
                        <v-switch
                            color="#50ABA3"
                            inset
                            @click="switchMerchantName()"
                        >
                        </v-switch>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                                                    :error-messages="error.start_timestamp"
                                                    clearable
                                                    @click:clear="start_date = ''"
                                                    dense
                                                >
                                                    <template v-slot:label>
                                                        Start Date<span style="color:red">*</span>
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            v-model="start_date"
                                            @input="start_date_model = false"
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
                                                :error-messages="error.start_timestamp"
                                                dense
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <template v-slot:label>
                                                    Start Time<span style="color:red">*</span>
                                                </template>
                                            </v-text-field>
                                        </template>
                                        <v-time-picker
                                            format="24hr"
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
                <v-col cols="12" md="6" class="-mt24">
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
                                                    :error-messages="error.end_timestamp"
                                                    clearable
                                                    @click:clear="end_date = ''"
                                                    dense
                                                >
                                                    <template v-slot:label>
                                                        End Date<span style="color:red">*</span>
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            v-model="end_date"
                                            @input="end_date_model = false"
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
                                                :error-messages="error.end_timestamp"
                                                dense
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <template v-slot:label>
                                                    End Time<span style="color:red">*</span>
                                                </template>
                                            </v-text-field>
                                        </template>
                                        <v-time-picker
                                            format="24hr"
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
                <v-col cols="12" md="6">
                    <v-text-field
                        name="overall_quota"
                        v-model="form.overall_quota"
                        maxlength="8"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        required
                        outlined
                        dense
                        :error-messages="error.overall_quota"
                    >
                        <template v-slot:label>
                            Overall Quota<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                        name="user_quota"
                        v-model="form.user_quota"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        maxlength="8"
                        required
                        outlined
                        dense
                        :error-messages="error.user_quota"
                    >
                        <template v-slot:label>
                            Quota Per User<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="min_order"
                        v-model="form.min_order"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        maxlength="12"
                        required
                        outlined
                        dense
                        :error-messages="error.min_order"
                    >
                        <template v-slot:label>
                            Minimum Order<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="disc_amount"
                        v-model="form.disc_amount"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        maxlength="12"
                        required
                        outlined
                        dense
                        :error-messages="error.disc_amount"
                    >
                        <template v-slot:label>
                            Voucher Amount<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="100"
                        maxlength="100"
                        outlined
                        dense
                        rows="3"
                    >
                        <template v-slot:label>
                            <div>
                                Note
                            </div>
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="form.voucher_item"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:no-data>
                    <v-btn
                        name="addproduct"
                        @click="addProduct()"
                        depressed
                        color="#50ABA3"
                        class="only-btn white--text"
                    >
                        Add Product
                    </v-btn>
                </template>
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            <SelectProductTable
                                :name="`voucher_item_${props.index}`"
                                @click.native="setProductIdx(props.index)"
                                @selected="productSelected"
                                :product="props.item.product"
                                :sb="1"
                                :error="errPro(props.index)"
                                :refs="`${props.index+1}-${refs},${form.voucher_item.length}`"
                            ></SelectProductTable>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td>
                            <vue-numeric
                                :name="`min_qty_disc${props.index}`"
                                :class="errQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                placeholder="0,00"
                                @focus="productIdx = props.index"
                                :precision="2"
                                v-model="props.item.min_qty_disc"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errQty2(props.index)}}</div>
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div v-if="props.index == form.voucher_item.length-1">
                                    <v-btn
                                        v-if="form.voucher_item.length < 10"
                                        icon
                                        name="addproduct"
                                        @click="addProduct()"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div>
                                    <v-btn
                                        icon
                                        :name="`removeproduct_${props.index}`"
                                        @click="removeVoucherItem(props.index)"
                                    >
                                        <img src="/icon/close-new.png" height="20px" width="20px"/>
                                    </v-btn>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <div class="hr-title-modal"/>
            <div class="pa16 text-black60 fs14">Max. 10 Products</div>
        </div>
        <div class="box-end">
            <v-row>
                <v-col cols="3" offset="9" class="-ma15">
                    <div class="d-flex justify-end">
                        <div class="mt20 mr16">Mobile Voucher</div>
                        <v-switch
                            color="#50ABA3"
                            inset
                            @click="switchPublicVoucher()"
                        >
                        </v-switch>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="showPublicVoucher">
                    <SelectMembershipLevel
                        v-model="form.membership_level_id"
                        outlined
                        :norequired="true"
                        :error="error.membership_level_id"
                        label="Membership Level"
                        @selected="levelSelected"
                    ></SelectMembershipLevel>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="showPublicVoucher">
                    <SelectMembershipCheckpoint
                        :disabled="disabledCheckpoint"
                        v-model="form.membership_checkpoint_id"
                        outlined
                        :norequired="true"
                        :error="error.membership_checkpoint_id"
                        label="Membership Lapak"
                        :level="form.membership_level_id"
                        @selected="checkpointSelected"
                    ></SelectMembershipCheckpoint>
                </v-col>
                <v-col cols="12" md="9" class="-mt14" v-if="showPublicVoucher">
                    <v-textarea
                        name="note"
                        v-model="form.term_conditions"
                        :counter="500"
                        maxlength="500"
                        outlined
                        :error-messages="error.term_conditions"
                        dense
                        rows="6"
                    >
                        <template v-slot:label>
                            Term and Condition<span class="text-red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="3" class="-mt14" v-if="showPublicVoucher">
                    <UploadImage
                        :minWidth="360"
                        :minHeight="180"
                        :maxSize="3000"
                        :forImgName="'v'"
                        :errorMsg="error.image_url"
                        :type="'voucher'"
                        :extention="'jpeg'"
                        :accept="'image/jpeg,image/jpg'"
                        :notUseLabel="true"
                    ></UploadImage>
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
                            v-privilege="'vou_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'vou_crt'"
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
        name: "VoucherCrate",
        data() {
            return {
                disableFieldCustomerName: true,
                disableFieldCustomerTag: false,
                disabledAddProduct: false,
                showPublicVoucher: false,
                ConfirmData: {},
                area: null,
                business_type: null,
                archetype: null,
                customerTag: null,
                disabledArchetype: true,
                disabledCheckpoint: true,
                merchant: null,
                type: null,
                start_time_model: '',
                start_time: '',
                start_date_model: '',
                start_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                end_date_model: '',
                end_date: '',
                end_time_model: '',
                end_time: '23:59',
                form: {
                    redeem_code: '',
                    name: '',
                    type: 0,
                    area_id: '',
                    archetype_id: '',
                    start_timestamp: '',
                    end_timestamp: '',
                    overall_quota: '',
                    user_quota: '',
                    min_order: '',
                    disc_amount: '',
                    note: '',
                    business_type_id: '',
                    customer_tag: [],
                    merchant_id: '',
                    voucher_item: [],
                    term_conditions: '',
                    image_url: '',
                    channel_voucher: ['1','4','6'],
                    membership_level_id: '',
                    membership_checkpoint_id: ''
                },
                table: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Product Name',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: "50%"
                        },
                        {
                            text: 'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Minimal Qty',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                productIdx: '',
                timeProps: {
                    format: "24hr"
                },
                refs: '',
                error: {},
                update: false,
            }
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
            this.$root.$on('event_uploadImage', function (image) {
                self.form.image_url = image
            });
        },
        computed: {
            timeNow() {
                const d = new Date();
                let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
                let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                const time = h + ':' + m
                if (this.start_time === "") {
                    return this.start_time = time
                }
            }
        },
        watch:{
            error: {
                handler: function (val) { // if any error, check info and subtotal again
                    if(val){
                        setTimeout(() => {
                            const element = document.querySelector(".v-messages__message:first-of-type");
                            element.scrollIntoView({block: "center", inline: "center"});
                        }, 500);
                    }
                },
                deep: true
            },
        },
        methods: {
            confirmButton() {
                if (this.start_date && this.start_time) {
                    let value = this.start_date + 'T' + this.start_time
                    this.form.start_timestamp = this.$moment(value).format('YYYY-MM-DDTHH:mm:ssZ')

                } else {
                    this.form.start_timestamp = ""
                }
                if (this.end_date && this.end_time) {
                    let value = this.end_date + 'T' + this.end_time
                    this.form.end_timestamp = this.$moment(value).format('YYYY-MM-DDTHH:mm:ssZ')
                } else {
                    this.form.end_timestamp = ""
                }
                this.ConfirmData = {
                    model: true,
                    title: "Create Voucher",
                    text: "Are you sure want to create this Voucher?",
                    urlApi: "/promotion/voucher",
                    nextPage: "/promotion/voucher",
                    post: true,
                    data: this.form
                }
            },
            areaSelected(d) {
                this.area = null;
                this.form.area_id = '';
                if (d) {
                    this.area = d;
                    this.form.area_id = d.id
                }
            },
            businessTypeSelected(d) {
                this.business_type = null;
                this.form.business_type_id = '';
                this.archetype = null;
                this.form.archetype_id = '';
                this.disabledArchetype = true;
                if (d) {
                    this.business_type = d;
                    this.form.business_type_id = d.id;
                    this.disabledArchetype = false;
                }
            },
            archetypeSelected(d) {
                this.archetype = null;
                this.form.archetype_id = '';
                if (d) {
                    this.archetype = d;
                    this.form.archetype_id = d.id;
                }
            },
            customerTagSelected(d) {
                this.customerTag = null;
                let arr = []
                if (d) {
                    this.customerTag = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                }
                this.form.customer_tag = arr
            },
            merchantSelected(d) { // func select merchant
                this.merchant = null;
                this.form.merchant_id = '';
                if (d) {
                    this.merchant = d;
                    this.form.merchant_id = d.id;
                }
            },
            switchMerchantName() { // func switch merchant name
                if (this.disableFieldCustomerTag) {
                    this.merchant = null;
                    this.form.merchant_id = "";
                    this.disableFieldCustomerTag = false;
                    this.disableFieldCustomerName = true;
                } else {
                    this.customerTag = null;
                    this.customer_tag = [];
                    this.form.customer_tag = [];
                    this.disableFieldCustomerTag = true;
                    this.disableFieldCustomerName = false;
                }
            },
            switchPublicVoucher() { // func switch mobile voucher
                if (!this.showPublicVoucher) {
                    this.showPublicVoucher = true;
                    this.form.channel_voucher = ["2","3"];
                } else {
                    this.showPublicVoucher = false
                    this.form.channel_voucher = ["1","4","6"];
                    this.form.image_url = "";
                    this.form.term_conditions = "";
                }
            },
            setProductIdx(idx) {
                this.productIdx = idx
            },
            productSelected(d) {
                this.form.voucher_item[this.productIdx].product = ''
                this.form.voucher_item[this.productIdx].product_id = ''
                if (d) {

                    this.form.voucher_item[this.productIdx].product = d
                    this.form.voucher_item[this.productIdx].product_id = d.id
                    this.form.voucher_item[this.productIdx].uom = d.uom.name
                }
            },
            addProduct() {
                this.update = false;
                this.form.voucher_item.push(
                    {
                        product_id: "",
                        product: "",
                        uom: "",
                        min_qty_disc: 0,
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.voucher_item.length - 1)
                });
            },
            errPro(idx) {
                for (var key in this.error) {
                    if (key == 'product_id' + idx) {
                        return this.error[key]
                    }
                }
            },
            errQty(idx) {
                for (var key in this.error) {
                    if (key == 'qty' + idx) {
                        return false
                    }
                }
                return true
            },
            errQty2(idx) {
                for (var key in this.error) {
                    if (key == 'qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            removeVoucherItem(idx) {
                this.form.voucher_item.splice(idx, 1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('min_qty_disc')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('product_id')) {
                        delete this.error[key];
                    }
                }

            },
            typeSelected(d) { // type selected
                this.type = null;
                this.form.type = '';
                if (d) {
                    this.type = d;
                    this.form.type = d.value
                }
            },
            levelSelected(d) { // level selected
                this.form.membership_level_id = '';
                this.disabledCheckpoint = true;
                if (d) {
                    this.form.membership_level_id = d.id
                    this.disabledCheckpoint = false;
                }
            },
            checkpointSelected(d) { // checkpoint selected
                this.form.membership_checkpoint_id = '';
                if (d) {
                    this.form.membership_checkpoint_id = d.id
                }
            },
        },
    }
</script>
<style scoped>
    .v-input--reverse >>> .v-input__slot {
        flex-direction: row-reverse;
    }
</style>