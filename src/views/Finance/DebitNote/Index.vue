<template>
    <v-container fill-height class="main-container">    
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            >
                            </v-text-field>
                        </template>
                       <span>Search by Debit Note Code</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
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
                        @click="filter = !filter"
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
            <v-row :class="filter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        name="filter_status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="recognition_date_model"
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
                                    clearable
                                    maxlength="24"
                                    @click:clear="recognition_date = [],recognition_date_input ='',renderData(search,statuses)"
                                    v-model="recognition_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Recognition Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="recognition_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="recognition_date_model = false,renderData(search,statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        name="filter_warehouse"
                        @selected="warehouseSelected"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSupplier
                        :norequired="true"
                        name="filter_supplier"
                        @selected="supplierSelected"
                        :dense="true"
                    ></SelectSupplier>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.code }}</td>
                        <td>{{ props.item.supplier_return.code }}</td>
                        <td>{{ props.item.supplier_return.supplier.name }}</td>
                        <td>{{ props.item.supplier_return.good_receipt.code }}</td>
                        <td>{{ props.item.supplier_return.warehouse.code }} - {{ props.item.supplier_return.warehouse.name }}</td>
                        <td>{{ props.item.total_price }}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                ><span class="pa-md-2"> Cancelled </span></v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item :to="`/finance/debit-note/detail/${props.item.id}`" v-privilege="'dn_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <hr v-if="props.item.status == 1">
                                    <v-list-item v-if="props.item.status == 1" @click="print(props.item.id)" v-privilege="'dn_prt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Print</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    export default {
        name: "DebitNote",
        data() {
            return {
                overlay: false,
                filter : false,
                search: '',
                statuses:999,
                status2:[
                    {
                        text:'All Status',
                        value:999
                    },
                    {
                        text:'Active',
                        value:1
                    },
                    {
                        text:'Finished',
                        value:2
                    },
                    {
                        text:'Cancelled',
                        value:3
                    },
                ],
                recognition_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                recognition_date_model : '',
                recognition_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                loading: false,
                table: {
                    fields: [
                        {
                            text:'Debit Note Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Supplier Return',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Supplier Name',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'GR No',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Amount',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[],
                SelectWarehouse : '',
                SelectSupplier: '',
                overlay: false,
                ConfirmData : {},
                filePdf: ''
            }
        },
        mounted() {
            this.renderData('',this.statuses)
        },
        methods: {
            print(id) {
                this.overlay = true
                this.$http.get("/finance/debit_note/print/" + id)
                    .then(response => {
                        this.filePdf = response.data.file
                        window.open(this.filePdf, '_blank');
                        this.overlay = false
                    })
            },
            //to render data from api
            renderData(search,statuses){
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|supplierreturn.warehouse.id.e:'+this.SelectWarehouse
                }
                let supplier = ''
                if (this.SelectSupplier) {
                    supplier = '|supplierreturn.supplier.id.e:'+this.SelectSupplier
                }
                let recognition_date = ''
                if (this.recognition_date.length > 0) {
                    if (this.recognition_date.length == 1) {
                        recognition_date = '|recognition_date:'+this.recognition_date[0]
                    } else {
                        let date = this.recognition_date[0]
                        let date2 = this.recognition_date[1]
                        if (date > date2) {
                            recognition_date = '|recognition_date.gte:'+date2+'|recognition_date.lte:'+date
                        } else {
                            recognition_date = '|recognition_date.gte:'+date+'|recognition_date.lte:'+date2
                        }
                    }
                }
                this.loading = true;
                this.items = []
                this.$http.get("/finance/debit_note",{params:{
                        embeds:'supplierreturn,supplierreturn.warehouse_id,supplierreturn.supplier_id,supplierreturn.goodsreceipt',
                        conditions:'code.icontains:'+search+statuses+warehouse+recognition_date+supplier,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            //select warehouse based on id
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            //select supplier based on id
            supplierSelected(d) {
                this.SelectSupplier = ""
                if (d) {
                    this.SelectSupplier = d.id
                }
                this.renderData(this.search,this.statuses)
            },
        },
        watch: {
            'search': {//render data when search val filler
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.statuses)
                    }, 1000);
                },
                deep: true
            },
            'statuses': { // render data when status val filled
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val)
                },
                deep: true
            },
            'recognition_date_input': {// watch recognition range date when in array and limit to 30 month
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.recognition_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                if (this.recognition_date.length == 2) {
                                    let date3 = new Date(this.recognition_date[0])
                                    let date4 = new Date(this.recognition_date[1])
                                    if (parseInt((date4-date3)/(24*3600*1000)) > 30 || parseInt((date4-date3)/(24*3600*1000)) < -30) {
                                        if (date4 < date3) {
                                            this.recognition_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.recognition_date.splice(1,1)
                                        } else {
                                            this.recognition_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.recognition_date.splice(1,1)
                                        }
                                    } else {
                                        this.renderData(this.search,this.statuses)
                                    }
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'recognition_date': { //to watch format date range
                handler: function (val) {
                    if (val) {
                        this.recognition_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
