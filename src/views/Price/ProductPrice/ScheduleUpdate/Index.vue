<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row :class="showFilter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-if="showFilter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon
                            right
                        >
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon
                            right
                        >
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="showFilter? '':'hidden'">
                <v-col cols="12" md="3">
                    <SelectPriceSet
                        @selected="priceSetFilterSelected"
                        :dense="true"
                        :norequired="true"
                    ></SelectPriceSet>
                </v-col>
                <v-col cols="12" md="3">
                    <v-menu
                        ref="menu"
                        v-model="schedule_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    maxlength="24"
                                    v-model="schedule_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Schedule Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                                range
                                v-model="schedule_date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectUser
                        name="user"
                        :dense="true"
                        :label="'Uploaded By'"
                        :norequired="true"
                        v-model="filter.SelectUpdatedBy"
                        class="pl-4 pr-4"
                        @selected="updatedByFilterSelected"
                    > </SelectUser>
                </v-col>
                <v-col cols="12" md="3">
                    <v-select
                        v-model="filter.statuses"
                        :items="status2"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end"></v-col>
                <v-col cols="12" md="3" class="d-flex justify-end h70">
                    <v-btn
                        v-privilege="'prd_prc_upd'"
                        @click="productPrice=true, error = []"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold mr20 white--text"
                    >Add Schedule</v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.price_set_name }}</td>
                        <td>{{ props.item.schedule_date }} {{ props.item.schedule_time }}</td>
                        <td>{{ props.item.updated_at | moment("DD/MM/YYYY HH:mm:ss") }}</td>
                        <td>{{ props.item.updated_by }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                    small
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                    small
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                    small
                                ><span class="pa-md-2"> Cancelled </span></v-chip>
                            </div>
                        </td>
                        <td>
                            <v-btn
                                v-if="props.item.status == 1"
                                icon
                                :name="`removeproduct_${props.index}`"
                                @click="removeProduct(props.item.id)"
                            >
                                <v-img src="/icon/close-new.png" max-height="20px" max-width="20px"></v-img>
                            </v-btn>    
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog
            v-model="productPrice"
            persistent
            max-width="1280px"
            scrollable
            >
            <v-card class="OpenSans">
                <LoadingBar :value="overlay"/>
                <v-card-title>
                   <span class="text-title-modal">Scheduled Price Set</span>
                    <v-spacer></v-spacer>
                    <v-btn
                        icon
                        @click="productPrice = false"
                    >
                        <v-img src="/icon/close-new.png" max-height="20px" max-width="20px"></v-img>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="table.field_dialog"
                        :items="itemSet"
                        :items-per-page="100"
                        :hide-default-footer="true"
                        :mobile-breakpoint="0"
                    >
                        <template v-slot:item="props">
                            <tr>
                                <td>{{ props.item.name }}</td>
                                <td class="pt-8">
                                    <v-menu
                                        ref="menu"
                                        v-model="props.item.date_model"
                                        :close-on-content-click="true"
                                        transition="scale-transition"
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on">
                                                <v-text-field
                                                    prepend-inner-icon="mdi-calendar"
                                                    outlined
                                                    maxlength="24"
                                                    v-model="props.item.date_input"
                                                    dense
                                                >
                                                    <template v-slot:label>
                                                        Date<span class="red--text">*</span>
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            v-model="props.item.date"
                                        ></v-date-picker>
                                    </v-menu>
                                </td>
                                <td class="pt-8">
                                    <v-select
                                        v-model="props.item.time"
                                        :items="timeList"
                                        item-text="text"
                                        item-value="value"
                                        outlined
                                        dense
                                    >
                                        <template v-slot:label>
                                            Time<span class="red--text">*</span>
                                        </template>
                                    </v-select>
                                </td>
                                <td>
                                    <v-btn
                                        v-if="props.item.status == 1"
                                        icon
                                        class="mx-3"
                                        :name="`removePrice_${props.index}`"
                                        @click="downloadProductPrice(props.item.id)"
                                    >
                                        <v-icon>mdi-download</v-icon>
                                    </v-btn>    
                                </td>
                                <td>
                                    <UploadExcel
                                        @onSelect="onSelectProductPrice"
                                        @onDelete="onDeleteProductPrice"
                                        :sendId="props.index+1"
                                        :themes="'list'"
                                        :clear="clear1"
                                    ></UploadExcel> 
                                </td>
                                <td>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <div v-on="{ ...tooltip }">
                                                <v-btn
                                                    v-if="props.item.saved == false && props.item.upload_disable == true"
                                                    @click="uploadProductPrice(props.index)"
                                                    :disabled="true"
                                                    depressed
                                                    color="#50ABA3"
                                                    class="no-caps bold mr20 white--text"
                                                >Save</v-btn>
                                            </div>
                                        </template>
                                        <span>Save button will active when successfully upload Price Set</span>
                                    </v-tooltip>
                                    <v-btn
                                        v-if="props.item.saved == false && props.item.upload_disable == false"
                                        @click="uploadProductPrice(props.index)"
                                        :disabled="false"
                                        depressed
                                        color="#50ABA3"
                                        class="no-caps bold mr20 white--text"
                                    >Save</v-btn>
                                    <v-btn
                                        v-if="props.item.saved == true"
                                        depressed
                                        color="#50ABA3"
                                        class="no-caps bold mr20 white--text"
                                    ><v-icon>mdi-checkbox-marked-circle-outline</v-icon></v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>        
        <LoadingBar :value="overlay"/>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "ProductPrice",
        data() {
            return {
                showFilter : false,
                filter: {
                    SelectPriceSet: '',
                    SelectUpdatedBy: '',
                    statuses: 999,
                },
                filter_update_product_price: {
                    SelectPriceSet: '',
                    SelectCategory: '',
                    SelectSalable: 1,
                    PriceSet : null,
                },
                productPrice: false,
                disable: false,
                overlay: false,
                absolute: true,
                clear1 : false,
                error: [{
                    id: '',
                }],
                schedule_date_model: '',
                schedule_date: [new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)],
                schedule_date_input: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                status2: [
                    {
                        text: 'All Status',
                        value: 999
                    },
                    {
                        text: 'Active',
                        value: 1
                    },
                    {
                        text: 'Finished',
                        value: 2
                    },
                    {
                        text: 'Cancelled',
                        value: 3
                    },
                ],
                timeList: [
                    {text: '00:00',value: '00:00'},
                    {text: '01:00',value: '01:00'},
                    {text: '02:00',value: '02:00'},
                    {text: '03:00',value: '03:00'},
                    {text: '04:00',value: '04:00'},
                    {text: '05:00',value: '05:00'},
                    {text: '06:00',value: '06:00'},
                    {text: '07:00',value: '07:00'},
                    {text: '08:00',value: '08:00'},
                    {text: '09:00',value: '03:00'},
                    {text: '10:00',value: '10:00'},
                    {text: '11:00',value: '11:00'},
                    {text: '12:00',value: '12:00'},
                    {text: '13:00',value: '13:00'},
                    {text: '14:00',value: '14:00'},
                    {text: '15:00',value: '15:00'},
                    {text: '16:00',value: '16:00'},
                    {text: '17:00',value: '17:00'},
                    {text: '18:00',value: '18:00'},
                    {text: '19:00',value: '19:00'},
                    {text: '20:00',value: '20:00'},
                    {text: '21:00',value: '21:00'},
                    {text: '22:00',value: '22:00'},
                    {text: '23:00',value: '23:00'},
                ],
                table: {
                    fields: [
                        {
                            text:'Price Set',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Schedule',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Uploaded At',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Uploaded By',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'',
                            sortable: false
                        },
                    ],
                    field_dialog: [
                        {
                            text:'Price Set',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Schedule Date and Time',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Download',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Upload',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Action',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                loading : false,
                items:[],
                itemSet:[],
                ConfirmData: {},
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    Vue.nextTick(() => {
                        self.items = []
                        self.renderData()
                    });
                }
            });
            this.getListPriceSet()
        },
        methods: {
             renderData(){
                this.loading = true
                let priceSet = ''
                if(this.filter.SelectPriceSet){
                    priceSet = "price_set_id.e:"+this.filter.SelectPriceSet
                }
                let scheduleDate = ''
                if (this.schedule_date.length > 0) {
                    if (this.schedule_date.length == 1) {
                        if(priceSet){
                            scheduleDate = '|schedule_date:' + this.schedule_date[0]
                        }else{
                            scheduleDate = 'schedule_date:' + this.schedule_date[0]
                        }
                    } else {
                        let date = this.schedule_date[0]
                        let date2 = this.schedule_date[1]
                        if (date > date2) {
                            if(priceSet){
                                scheduleDate = '|schedule_date.gte:' + date2 + '|schedule_date.lte:' + date
                            }else{
                                scheduleDate = 'schedule_date.gte:' + date2 + '|schedule_date.lte:' + date
                            }
                        } else {
                            if(priceSet){
                                scheduleDate = '|schedule_date.gte:' + date + '|schedule_date.lte:' + date2
                            }else{
                                scheduleDate = 'schedule_date.gte:' + date + '|schedule_date.lte:' + date2
                            }
                        }
                    }
                }
                let updatedBy = ''
                if (this.filter.SelectUpdatedBy) {
                    updatedBy = "|created_by.id.e:"+this.filter.SelectUpdatedBy
                }
                let status = ''
                if(this.filter.statuses === 999){
                    status = ''
                }else{
                    status = "|status:" + this.filter.statuses
                }

                this.$http.get("/price/schedule",{params:{
                        embeds:'price_set_id,created_by',
                        conditions: priceSet + scheduleDate + updatedBy + status,
                        orderby:'-id',
                    }})
                    .then(response => {
                    this.items = []
                    let array = response.data.data
                    if(array){
                        for (let i = 0; i < array.length; i++) {
                            this.items.push(
                                {
                                    id: array[i].id,
                                    price_set_name: array[i].price_set.name,
                                    schedule_date: array[i].schedule_date,
                                    schedule_time: array[i].schedule_time+":00",
                                    updated_at: array[i].created_at,
                                    updated_by: array[i].created_by.display_name,
                                    status:  array[i].status
                                }
                            )
                        }
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.loading = false
                    }).catch(err => {
                        this.loading = false
                    });
            },
            // FILTER TABLE PRODUCT PRICE
            priceSetFilterSelected(d){
               this.filter.SelectPriceSet = ""
               if(d) {
                   this.filter.SelectPriceSet= d.id
               }
               this.renderData()
            },
            updatedByFilterSelected(d) {
                this.filter.SelectUpdatedBy = "";
                if (d) {
                    this.filter.SelectUpdatedBy = d.id;
                }
                this.renderData()
            },
            removeProduct(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Cancel this Schedule",
                    title : "Cancel Scheduled Price Set",
                    text : "Are you sure want to cancel this Scheduled Price Set?",
                    urlApi : "/price/schedule/cancel/"+id,
                    cancelNote : "Note",
                    data : {}
                }
            },
            getListPriceSet(){
                this.$http.get("/price/set/filter",{params:{
                        conditions:'status:1',
                    }}).then(responseSet => {
                    this.itemSet = []
                    let arraySet = responseSet.data.data
                    if(arraySet){
                        for (let i = 0; i < arraySet.length; i++) {
                            this.itemSet.push(
                                {
                                    id: arraySet[i].id,
                                    name: arraySet[i].name,
                                    status: arraySet[i].status,
                                    date: new Date(Date.now() + (3600 * 1000 * 24) + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                                    time: '00:00',
                                    prices: [],
                                    upload_disable: true,
                                    saved: false,
                                }
                            )
                        }
                    }
                    if(this.itemSet === null){
                        this.itemSet = []
                    }
                });
            },
            uploadProductPrice(id) {
                this.overlay = true
                this.$http.post("/price/schedule", {
                    price_set_id: this.itemSet[id].id,
                    schedule_date: this.itemSet[id].date,
                    schedule_time: this.itemSet[id].time,
                    prices: this.itemSet[id].prices
                })
                .then(response => {
                    this.overlay = false
                    this.clear1 = false
                    this.$toast.open({
                        position: 'top-right',
                        message: 'Data has been updated successfully',
                        type: 'success',
                    });
                    this.itemSet[id].prices = []
                    this.itemSet[id].saved = true
                }).then(() => {
                    // this.clear1 = true
                }).catch(e => {
                    this.overlay = false
                    this.error[id] = e.errors
                })
            },
            onDeleteProductPrice(ev,id) {
                let i = id-1
                this.itemSet[i].prices = []
                this.itemSet[i].saved = false
            },
            onSelectProductPrice(file,id){
                let i = id-1
                this.itemSet[i].prices = []
                file.forEach((item) => {
                    let value = {};
                    value.product_id = String(item.Product_ID);
                    value.unit_price = parseFloat(item.Unit_Price);
                    value.category_name = String(item.Category)
                    value.salability = parseInt(item.Salable)
                    this.itemSet[i].prices.push(value)
                });
            },
            downloadProductPrice(id) {
                this.overlay = true
                let priceSetID = ''
                if(id){
                    priceSetID = "price_set_id.e:"+id
                }
                this.$http.get("/price/product_price/template?export=1", {params:{
                    conditions: priceSetID + '|product.status:1'
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                    }).catch((err) => {
                        this.overlay = false
                        return Promise.reject({ Error: 'something went wrong', err});
                    });
            },
        },
        watch:{
            'schedule_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            this.items = []
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.schedule_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                Vue.nextTick(() => {
                                    this.items = []
                                    this.renderData()
                                });
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                if (this.schedule_date.length == 2) {
                                    let date3 = new Date(this.schedule_date[0])
                                    let date4 = new Date(this.schedule_date[1])
                                    if (parseInt((date4 - date3) / (24 * 3600 * 1000)) > 30 || parseInt((date4 - date3) / (24 * 3600 * 1000)) < -30) {
                                        if (date4 < date3) {
                                            this.schedule_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.schedule_date.splice(1, 1)
                                        }
                                    } else {
                                        Vue.nextTick(() => {
                                            this.items = []
                                            this.renderData()
                                        });
                                    }
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'schedule_date': {
                handler: function (val) {
                    if (val) {
                        this.schedule_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'filter.statuses': {
                handler: function (val) {
                    let that = this
                    Vue.nextTick(() => {
                        this.items = []
                        that.renderData()
                    });
                },
                deep: true
            },
            'itemSet': {
                handler: function (val) {
                    let self = this
                    if(val){
                        for (let i = 0; i < val.length; i++) {
                            self.itemSet[i].date_input = val[i].date
                            if(val[i].prices.length != 0 && val[i].date && val[i].time){
                                self.itemSet[i].upload_disable = false
                            }else{
                                self.itemSet[i].upload_disable = true
                            }
                        }
                    }
                },
                deep: true
            },
        }
    }
</script>