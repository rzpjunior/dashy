<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                name="promotion_name"
                                v-model="form.name"
                                maxlength="50"
                                required
                                outlined
                                dense
                                :error-messages="error.name"
                                onkeypress="return event.charCode >= 97 && event.charCode <= 122 || event.charCode >= 65 && event.charCode <= 90 || event.charCode >= 48 && event.charCode <= 57 || event.charCode == 32"
                                v-on="{ ...tooltip }"
                            >
                                <template v-slot:label>
                                    Promotion Name<span class="text-red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                        <span>Promotion name can't be the same as other promotion</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectDivision
                        name="division"
                        v-model="division"
                        @selected="divisionSelected"
                        :error="error.division_id"
                        :division="division"
                        :dense="true"
                        required
                        disabled
                    > </SelectDivision>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-card elevation="0" outlined v-on="{ ...tooltip }">
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
                                                            :error-messages="error.start_period"
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
                                                        :error-messages="error.start_period"
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
                        </template>
                        <span>Start time can't be less than the current time</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-card elevation="0" outlined v-on="{ ...tooltip }">
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
                                                            :error-messages="error.end_period"
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
                                                        :error-messages="error.end_period"
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
                        </template>
                        <span>End time can't be less than Start time</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <MultiSelectPriceSet
                        name="price_set"
                        required
                        v-model="price_set"
                        @selected="priceSetSelected"
                        :dense="true"
                        :error="error.price_set"
                    ></MultiSelectPriceSet>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectOrderChannel
                        :orderchannel="orderchannel"
                        name="orderchannel"
                        :dense="true"
                        :error="error.order_channel"
                        @selected="orderChannelSelected"
                        v-model="form.order_channel"
                        :norequired="false"
                        disabled
                    ></SelectOrderChannel>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        maxlength="250"
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
            <v-row>
                <v-col class="flex-justify-center">
                    Products
                </v-col>
                <v-col>
                    <div class="flex-align-end" v-if="bulkBtn">
                        <v-btn
                            @click="modalBulkProduct = true, form.items = [], error={}"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="only-btn"
                        >
                            <span class="text-white" >Upload Bulk Product</span>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="form.items"
                :hide-default-footer="true"
                :items-per-page="-1"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr class="removeHover"  style="height:48px; vertical-align: baseline;">
                        <td>{{ props.index + 1 }}</td>
                        <td class="sticky">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on: tooltip }">
                                    <div v-on="{ ...tooltip }">
                                        <SelectProductTable
                                            :name="`product_${props.index}`"
                                            @click.native="setProductIdx(props.index)"
                                            @selected="productSelected"
                                            :product="props.item.product"
                                            :sb="1"
                                            :error="errPro(props.index)"
                                            :warehouse="form.warehouse_id"
                                            :refs="`${props.index+1}-${refs},${form.items.length}`"
                                            :class="errPro(props.index) ? 'formProductErr' : ''"
                                        ></SelectProductTable>
                                    </div>
                                </template>
                                <span>Products cannot be duplicated</span>
                            </v-tooltip>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <!-- Minimal Qty Tier 1-->
                        <td>1<span class="text-red">*</span></td>
                        <td> 
                            <vue-numeric
                                :name="`minimum_qty${props.index}`"
                                :class="errMinQty(props.index,0) || errMinQty2(props.index) ? 'productNumericErr' : 'productNumeric'"
                                separator="."
                                placeholder="0,00"
                                @focus="productIdx = props.index"
                                :precision="2"
                                :max="min_qty"
                                @blur="addTier(props.index, 0)"
                                v-model="props.item.item_tier[0].minimum_qty"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errMinQty(props.index,0)}}</div>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errMinQty2(props.index)}}</div>
                        </td>
                        <!-- Amount  Tier 1-->
                        <td> 
                            <vue-numeric
                                :name="`amount${props.index}`"
                                :class="errAmount(props.index, 0) ? 'productNumericErr' : 'productNumeric'"
                                separator="."
                                @focus="productIdx = props.index"
                                :max="max_amount"
                                v-model="props.item.item_tier[0].amount"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errAmount(props.index, 0)}}</div>
                        </td>
                        <!-- Close Button -->
                        <td>
                            <div v-if="form.items[props.index].item_tier.length != 1">
                                <v-btn
                                    icon
                                    :name="`removetier_${props.index}`"
                                    @click="removeTier(props.index)"
                                >
                                    <img src="/icon/close-new.png" height="20px" width="20px"/>
                                </v-btn>
                            </div>
                        </td>
                        <!-- Overall Quota -->
                        <td> 
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on: tooltip }">
                                    <div v-on="{ ...tooltip }">
                                        <vue-numeric
                                            :name="`overall_quota${props.index}`"
                                            :class="errOveQuo(props.index) ? 'productNumericErr' : 'productNumeric'"
                                            placeholder="0"
                                            separator="."
                                            maxlength="7"
                                            @focus="productIdx = props.index"
                                            v-model="props.item.overall_quota"
                                            onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                                        ></vue-numeric>
                                        <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errOveQuo(props.index)}}</div>
                                    </div>
                                </template>
                                <span>Overall quota can't be less than the last tier</span>
                            </v-tooltip>
                        </td>
                        <!-- Quota Per User -->
                        <td> 
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on: tooltip }">
                                    <div v-on="{ ...tooltip }">
                                        <vue-numeric
                                            separator="."
                                            maxlength="5"
                                            :name="`overall_quota_per_user${props.index}`"
                                            :class="errQuoUser(props.index) ? 'productNumericErr' : 'productNumeric'"
                                            @focus="productIdx = props.index"
                                            v-model="props.item.overall_quota_per_user"
                                            onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                                        ></vue-numeric>
                                        <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errQuoUser(props.index)}}</div>
                                    </div>
                                </template>
                                <span>Quota per User can't be less than the last tier</span>
                            </v-tooltip>
                        </td>
                        <!-- Daily Quota Per User -->
                        <td> 
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on: tooltip }">
                                    <div v-on="{ ...tooltip }">
                                        <vue-numeric
                                            separator="."
                                            maxlength="5"
                                            :name="`daily_quota_per_user${props.index}`"
                                            :class="errDaiQuoUser(props.index) ? 'productNumericErr' : 'productNumeric'"
                                            @focus="productIdx = props.index"
                                            v-model="props.item.daily_quota_per_user"
                                            onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                                        ></vue-numeric>
                                        <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errDaiQuoUser(props.index)}}</div>
                                    </div>
                                </template>
                                <span>Daily Quota per User can't be less than the last tier</span>
                            </v-tooltip>
                        </td>
                        <!-- Budget -->
                        <td> 
                            <vue-numeric
                                separator="."
                                maxlength="9"
                                :name="`budget${props.index}`"
                                :class="errBudget(props.index) ? 'productNumericErr' : 'productNumeric'"
                                @focus="productIdx = props.index"
                                v-model="props.item.budget"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errBudget(props.index)}}</div>
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div v-if="props.index == form.items.length-1">
                                    <v-btn
                                        icon
                                        name="addproduct"
                                        @click="addProduct()"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div v-if="form.items.length != 1">
                                    <v-btn
                                        icon
                                        :name="`removeproduct_${props.index}`"
                                        @click="removeProductItem(props.index)"
                                    >
                                        <img src="/icon/close-new.png" height="20px" width="20px"/>
                                    </v-btn>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <!--Next Tier-->
                    <template v-for="(item, idx) in props.item.item_tier">
                        <tr class="removeHover" style="height:48px; vertical-align: baseline;" v-if="idx != 0" :key="props.index + ',' + idx">
                            <td></td>
                            <td class="sticky"></td>
                            <td></td>
                            <td>{{idx+1}}</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <div v-on="{ ...tooltip }">
                                            <vue-numeric
                                                :name="`minimum_qty${props.index}`"
                                                :class="errMinQty(props.index,idx) ? 'productNumericErr' : 'productNumeric'"
                                                separator="."
                                                placeholder="0,00"
                                                @focus="productIdx = props.index"
                                                :precision="2"
                                                :max="min_qty"
                                                @blur="addTier(props.index, idx)"
                                                v-model="props.item.item_tier[idx].minimum_qty"
                                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44"
                                            ></vue-numeric>
                                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errMinQty(props.index,idx)}}</div>
                                        </div>
                                    </template>
                                    <span>Minimum qty can't less than before tier</span>
                                </v-tooltip>
                            </td>
                            <td> 
                                <vue-numeric
                                    :name="`amount${props.index}`"
                                    :class="errAmount(props.index, 1) ? 'productNumericErr' : 'productNumeric'"
                                    separator="."
                                    @focus="productIdx = props.index"
                                    :max="max_amount"
                                    v-model="props.item.item_tier[idx].amount"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44"
                                ></vue-numeric>
                                <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errAmount(props.index, idx)}}</div>
                            </td>
                            <!-- Close Button -->
                            <td>
                                <v-btn
                                    v-if="form.items[props.index].item_tier.length-1 != idx"
                                    icon
                                    :name="`removetier_${props.index,idx}`"
                                    @click="removeTier(props.index,idx)"
                                >
                                    <img src="/icon/close-new.png" height="20px" width="20px"/>
                                </v-btn>
                            </td>
                            <td colspan="5"></td>
                        </tr>
                    </template>
                </template>
            </v-data-table>
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
                            v-privilege="'sku_dsc_crt'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <!-- Dialog Bulk Product-->
        <v-dialog
            v-model="modalBulkProduct"
            persistent
            max-width="1200px"
            scrollable
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlay"/>
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" md="6">
                            Bulk Product
                        </v-col>
                        <v-col class="flex-align-end" md="6">
                            <v-btn
                                icon
                                @click="modalBulkProduct=false, clearBulk=true, errorMessage = '', btnUploadBulk=true, addProduct()"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal"/>
                <v-card-text class="mt5">
                    <v-alert
                        color="#2A89A7"
                        dark
                        outlined
                    >
                        <v-icon color="#2A89A7" class="-mt3">mdi-alert-circle-outline</v-icon> 
                        Please follow the step to upload Bulk Product
                    </v-alert>
                    <v-row class="mt20 mb10">
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 1. Download Template
                            </div>
                            <div class="text-black60">
                                Download template to create your bulk product
                            </div>
                            <div class="mt-3 bg-black10" style="border: 2px dashed #AAAAAA; min-height:220px; text-align: center;">
                                <div>
                                    <img width="60" class="mt50 mb8" src="/icon/download_new.png" alt="">
                                </div>
                                <div class="mt-4">
                                    <v-btn
                                        @click="downloadTempBulkProduct()"
                                        depressed
                                        color="#50ABA3"
                                        class="only-btn white--text rounded-form mt10"
                                    >Download Template</v-btn>
                                </div>
                            </div>
                        </v-col>
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 2. Update Template
                            </div>
                            <div class="text-black60">
                                Update with spreadsheet application
                            </div>
                            <v-img width="250px" class="mt-2" src="/img/worktime_new.png" alt="" />
                        </v-col>
                        <v-col class="pa-8">
                            <div>
                                Step 3. Upload File<span class="text-red">*</span>
                            </div>
                            <div class="text-black60">
                                Product will be create on list after upload
                            </div>
                            <div class="mt10">
                                <UploadExcel
                                    @onSelect="onSelectBulkProduct"
                                    @onDelete="onDeleteBulkProduct"
                                    :clear="clearBulk"
                                    :error="errorMessage"
                                ></UploadExcel>
                            </div>
                            <v-card-actions class="mt20">
                                <v-spacer></v-spacer>
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    class="main-btn white--text"
                                    :disabled="btnUploadBulk"
                                    @click="cfmBulkProduct=true, modalBulkProduct=false"
                                >
                                    Upload
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- Dialog Bulk Product - Confirmation-->
        <v-dialog
            v-model="cfmBulkProduct"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Create Bulk Product</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Are you sure to create this bulk product?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="cfmBulkProduct=false, modalBulkProduct=true"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="uploadBulkProduct(), cfmBulkProduct=false, clearBulk=true"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: "SKUDiscountCreate",
        data() {
            return {
                ConfirmData: {},
                price_set: null,
                division:null,
                orderchannel:[],
                custAppOrderChannel:[
                    {
                        note: "Customer Mobile App Android",
                        value: 2
                    },
                    {
                        note: "Customer Mobile App iOS",
                        value: 3
                    }
                ],
                start_time_model: '',
                start_time: '',
                start_date_model: '',
                start_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                current_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                end_date_model: '',
                end_date: '',
                end_time_model: '',
                end_time: '23:59',
                max_amount: 99999.99,
                min_qty: 99999.99,
                form: {
                    name: '',
                    division_id: '',
                    start_period: '',
                    end_period: '',
                    price_set: [],
                    order_channel:[],
                    note: '',
                    items:[],
                },
                table: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Product Name*',
                            class: 'grey--text text--darken-4 sticky',
                            sortable: false,
                            width: "250px"
                        },
                        {
                            text: 'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Tier',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Minimum Qty*',
                            width: "150px",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Amount*',
                            width: "150px",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Overall Quota (Qty)*',
                            width: "150px",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Quota Per User (Qty)',
                            width: "150px",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Daily Quota Per User (Qty)',
                            width: "150px",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Budget (IDR)',
                            width: "150px",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                editedProduct: false,
                titleField: false,
                productIdx: '',
                refs: '',
                error: {},
                update: false,
                changeField: false,
                modalBulkProduct: false,
                dataBulkProduct: [],
                cfmBulkProduct: false,
                productDetail: {},
                bulkBtn: false,
                btnUploadBulk: true,
                errorMessage: '',
                clearBulk: false,
                overlay: false,
            }
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
            let division = this.$store.getters.getStaff.role.division.id;
            this.$http.get("/config/division/" + division).then(response => {
                this.division = response.data.data
                this.form.division_id = response.data.data.id
                this.orderchannel = this.custAppOrderChannel // set defaul customer app only
                this.orderChannelSelected(this.orderchannel)
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
            // Check for min time for Start Time
            checkTimeStart() {
                const d = new Date();
                let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
                let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                const time = h + ':' + m
                if (this.current_date == this.start_date) {
                    return time
                }
            },
            // Check for min time End Time
            checkTimeEnd() {
                const d = new Date();
                let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
                let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                const time = h + ':' + m
                if (this.current_date == this.end_date) {
                    return time
                }
            },
        },
        watch:{
            error: {
                handler: function (val) { // if any error, check info and subtotal again
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
            confirmButton() {
                if (this.start_date && this.start_time) {
                    let value = this.start_date + 'T' + this.start_time
                    this.form.start_period = this.$moment(value).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    this.form.start_period = ""
                }
                if (this.end_date && this.end_time) {
                    let value = this.end_date + 'T' + this.end_time
                    this.form.end_period = this.$moment(value).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    this.form.end_period = ""
                }
                this.ConfirmData = {
                    model: true,
                    title: "Create SKU Discount",
                    text: "Are you sure want to create this SKU Discount?",
                    urlApi: "/promotion/sku_discount",
                    nextPage: "/promotion/sku-discount",
                    post: true,
                    data: this.form
                }
            },
            // Save division id into form
            divisionSelected(d) {
                this.division = null;
                this.form.division_id = '';
                if (d !== '' && d !== undefined) {
                    this.division = d;
                    this.form.division_id = d.id;
                }
            },
            // Save array of price set id into form
            priceSetSelected(d) {
                this.price_set = null;
                let arr = []
                if (d) {
                    this.price_set = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                    this.bulkBtn = true;
                    if (this.form.items.length == 0) {
                        this.form.items.push(
                            {
                                product_id: "",
                                product: "",
                                uom:"",
                                overall_quota: 0,
                                overall_quota_per_user: 0,
                                daily_quota_per_user: 0,
                                item_tier: [
                                    {
                                        minimum_qty: 0,
                                        amount: 0
                                    }
                                ]
                            },
                        )
                    }
                }
                this.form.price_set = arr
            },
            // Save array of order channel value into form
            orderChannelSelected(d) {
                this.orderchannel = null;
                let arr = []
                if (d) {
                    this.orderchannel = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].value + '');
                    }
                }
                this.form.order_channel = arr
            },
            //set product index
            setProductIdx(idx) {
                this.productIdx = idx
            },
            // Mapping product after selected
            productSelected(d) {
                this.form.items[this.productIdx].product = ''
                this.form.items[this.productIdx].product_id = ''
                if (d) {
                    this.form.items[this.productIdx].product = d
                    this.form.items[this.productIdx].product_id = d.id
                    this.form.items[this.productIdx].uom = d.uom.name
                }
            },
            //Add Tier
            addTier(idx, idx2) {
                if (this.form.items[idx].item_tier.length-1 == idx2 && this.form.items[idx].item_tier[idx2].minimum_qty != 0) {
                    this.form.items[idx].item_tier.push(
                        {
                            minimum_qty: 0,
                            amount: 0
                        }
                    )
                }
            },
            // Initial add new product in table
            addProduct() {
                this.update = false;
                this.form.items.push(
                    {
                        product: "",
                        product_id: "",
                        uom: "",
                        overall_quota: 0,
                        overall_quota_per_user: 0,
                        daily_quota_per_user: 0,
                        budget:0,
                        item_tier: [
                            {
                                minimum_qty: 0,
                                amount: 0
                            }
                        ]
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.items.length - 1)
                });
            },
            // Show erorr message if product not valid
            errPro(idx) {
                for (var key in this.error) {
                    if (key == 'product_id' + idx) {
                        return this.error[key]
                    }
                }
            },
            // Show erorr message if Minimum Qty not valid
            errMinQty(index, idx) {
                for (var key in this.error) {
                    if (key == 'minimum_qty' + index + '_' + idx) {
                        return this.error[key]
                    }
                }
            },
            // Show erorr message if Minimum Qty not valid
            errMinQty2(index) {
                for (var key in this.error) {
                    if (key == 'item_tier' + index) {
                        return this.error[key]
                    }
                }
            },
            // Show erorr message if amount not valid
            errAmount(index, idx) {
                for (var key in this.error) {
                    if (key == 'amount' + index + '_' + idx) {
                        return this.error[key]
                    }
                }
            },
            // Show erorr message if over quota not valid
            errOveQuo(idx) {
                for (var key in this.error) {
                    if (key == 'overall_quota' + idx) {
                        return this.error[key]
                    }
                }
            },
            // Show erorr message if daily quota per user not valid
            errDaiQuoUser(idx) {
                for (var key in this.error) {
                    if (key == 'daily_quota_per_user' + idx) {
                        return this.error[key]
                    }
                }
            },
            // Show erorr message if quota per user not valid
            errQuoUser(idx) {
                for (var key in this.error) {
                    if (key == 'overall_quota_per_user' + idx) {
                        return this.error[key]
                    }
                }
            },
            // Show erorr message if budget not valid
            errBudget(idx) {
                for (var key in this.error) {
                    if (key == 'budget' + idx) {
                        return this.error[key]
                    }
                }
            },
            // For remove Product Item if klik x in row table
            removeProductItem(idx) {
                this.form.items.splice(idx, 1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('product_id')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('minimum_qty')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('amount')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('overall_quota')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('daily_quota_per_user')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('overall_quota_per_user')) {
                        delete this.error[key];
                    }
                }
            },
            // For remove  Tier if klik in row table
            removeTier(idx, idx_tier){
                this.form.items[idx].item_tier.splice(idx_tier,1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('minimum_qty')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('amount')) {
                        delete this.error[key];
                    }
                }
            },
            // For download excel template bulk product
            downloadTempBulkProduct() {
                window.location.href = process.env.VUE_APP_BULK_SKUDISCOUNT
            },
            // For listing bulk product
            onSelectBulkProduct(file){
                this.errorMessage = file.length == 0 ? "No rows found" : ""
                this.dataBulkProduct = []
                this.overlay = true
                let errProduct = []
                file.forEach(item => {
                    this.$http.get("/inventory/product?",{params:{
                        conditions: 'code:' + item.product_code,
                    }}).then(response => {
                        if(response.data.data){
                            let value = {};
                            value.no = item.no;
                            value.product = response.data.data[0];
                            value.product_id = response.data.data[0].id;
                            value.uom = response.data.data[0].uom.name;
                            value.overall_quota = item.overall_quota;
                            value.overall_quota_per_user = item.quota_per_user;
                            value.daily_quota_per_user = item.daily_quota_per_user;
                            value.budget = item.budget;
                            value.tier = item.tier;
                            value.minimum_qty = item.minimum_qty;
                            value.amount = item.amount;
                            this.dataBulkProduct.push(value)
                        }
                        else{
                            errProduct.push(item.product_code)
                        }
                    }).then(() => {
                        if(errProduct.length > 0){
                            errProduct = [...new Set(errProduct)] // Distinct data errProduct
                            this.errorMessage = 'Product code ' + errProduct.join(", ") + ' not found'
                            this.btnUploadBulk = true
                        }
                    });
                });
                this.btnUploadBulk = file.length == 0? true : false
                this.clearBulk = false
                this.overlay = false
            },
            // push data to form.items when button upload clicked
            uploadBulkProduct(){
                this.overlay = true
                //sorting data bulk product
                this.dataBulkProduct.sort(function (a, b) {
                    return a.no - b.no;
                });
                let bulkIdx = -1;
                this.dataBulkProduct.forEach(item => {
                    if(item.tier == 1){
                        bulkIdx = bulkIdx + 1
                        let value = {};
                        value.item_tier = []

                        value.product = item.product
                        value.product_id = item.product_id
                        value.uom = item.uom
                            
                        value.overall_quota = item.overall_quota;
                        value.overall_quota_per_user = item.overall_quota_per_user;
                        value.daily_quota_per_user = item.daily_quota_per_user;
                        value.budget = item.budget;

                        value.item_tier.push({
                            minimum_qty: item.minimum_qty,
                            amount: item.amount
                        })

                        this.form.items.push(value)
                    }
                    else{
                        this.form.items[bulkIdx].item_tier.push({
                            minimum_qty: item.minimum_qty,
                            amount: item.amount
                        })
                    }
                });
                this.form.items.forEach((item) => {
                    item.item_tier.push({
                            minimum_qty: 0,
                            amount: 0
                        })
                });
                this.overlay = false
            },
            // remove error message, re-init var
            onDeleteBulkProduct() {
                this.dataBulkProduct = []
                this.btnUploadBulk = true
                this.errorMessage = ""
            },
        },
    }
</script>
