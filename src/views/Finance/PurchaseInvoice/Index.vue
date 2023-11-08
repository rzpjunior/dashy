<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                dense
                                v-model="search"
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                                outlined
                                filled
                                v-privilege="'filter_rdl'"
                                placeholder="Search..."
                            >
                            </v-text-field>
                        </template>
                       <span>Search by Invoice Code, Order Code</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="5" class="h1"/>
                <v-col cols="12" md="3">
                    <v-autocomplete
                        v-model="sortby"
                        :items="sorts"
                        item-text="text"
                        name="sort"
                        placeholder="Select Field"
                        @change="funcSort"
                        return-object
                        label="Sort by"
                        outlined
                        dense
                    >
                        <template slot="selection" slot-scope="data">
                            <div class="select-item">
                                {{ data.item.text }}
                            </div>
                        </template>
                        <template slot="item" slot-scope="data">
                            {{ data.item.text }}
                        </template>
                    </v-autocomplete>
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
                    <SelectSupplier
                        name="supplier"
                        :norequired="true"
                        @selected="supplierSelected"
                        v-privilege="'filter_rdl'"
                        :dense="true"
                    ></SelectSupplier>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :norequired="true"
                        @selected="warehouseSelected"
                        v-privilege="'filter_rdl'"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="invoice_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="filter_invoice_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    @click:clear="invoice_date = [],invoice_date_input = '',renderData(search,statuses)"
                                    v-model="invoice_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Invoice Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="invoice_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="invoice_date_model = false,renderData(search,statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="due_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="filter_due_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    @click:clear="due_date = [],due_date_input = '',renderData(search,statuses)"
                                    v-model="due_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Invoice Due Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="due_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="due_date_model = false,renderData(search,statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="ata_date_model"
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
                                    @click:clear="ata_date = [],ata_date_input =''"
                                    v-model="ata_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        GR ATA Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="ata_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="ata_date_model = false"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <router-link  :to="{ name: 'BulkPaymentCreate' }" class="routerLink" v-privilege="'pp_crt'">
                        <v-btn
                            depressed
                            color="#50ABA3"
                            block
                            class="no-caps bold"
                        >
                            <span class="text-white">Create Bulk Payment</span>                
                        </v-btn>
                    </router-link>
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
                    <tr>
                        <td>{{props.item.code}}</td>
                        <td>{{props.item.recognition_date | moment("DD/MM/YYYY")}}</td>
                        <td>{{props.item.due_date | moment("DD/MM/YYYY")}}</td>
                        <td>{{props.item.purchase_order.code}}</td>
                        <td>{{props.item.purchase_order.supplier.name}}</td>

                        <td>Rp. {{formatPrice(props.item.purchase_order.total_charge)}}</td>
                        <td>Rp. {{formatPrice(props.item.total_charge)}}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                >Finished</v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                > Cancelled </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 6">
                                <v-chip
                                    :color="statusMaster('partial')"
                                > Partial </v-chip>
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
                                    <v-list-item v-privilege="'pi_rdd'" :to="`/finance/purc-invoice/${props.item.id}`">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-privilege="'pi_upd'" v-if="props.item.status=='1'" :to="`/finance/purc-invoice/update/${props.item.id}`">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    export default {
        name: "PurchaseInvoice",
        data() {
            return {
                overlay: false,
                ConfirmData : {},
                modalOpen: false,
                search: '',
                loading: false,
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
                    {
                        text:'Partial',
                        value:6
                    },
                ],
                invoice_date_model : '',
                invoice_date_input : '',
                invoice_date : [],
                due_date_model : '',
                due_date_input : '',
                due_date : [],
                ata_date_input : '',
                ata_date_model : '',
                ata_date : [],
                sortby: '-id',
                orderby: '-id',
                sorts:[
                    {
                        text:'Default',
                        value:'-id'
                    },
                    {
                        text:'Invoice Date (A-Z)',
                        value:'recognition_date'
                    },
                    {
                        text:'Invoice Date (Z-A)',
                        value:'-recognition_date'
                    },
                    {
                        text:'Invoice Due Date (A-Z)',
                        value:'due_date'
                    },
                    {
                        text:'Invoice Due Date (Z-A)',
                        value:'-due_date'
                    },
                    {
                        text:'PO Code (A-Z)',
                        value:'purchaseorder.code'
                    },
                    {
                        text:'PO Code (Z-A)',
                        value:'-purchaseorder.code'
                    },
                    {
                        text:'Supplier (A-Z)',
                        value:'purchaseorder.supplier.name'
                    },
                    {
                        text:'Supplier (Z-A)',
                        value:'-purchaseorder.supplier.name'
                    },
                    {
                        text:'Status (A-Z)',
                        value:'status'
                    },
                    {
                        text:'Status (Z-A)',
                        value:'-status'
                    },
                ],
                table: {
                    fields: [
                        {
                            text:'Code',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Invoice Date',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Invoice Due Date',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'PO Code',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Suplier',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Total Order',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Total Invoice',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Status',
                            width: "5%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                items:[],
                confirmation:{
                    valueName: 'Sales Term',
                    action:'',
                    status: '',
                    urlPath:'',
                    parentPath:'/finance/spt/term',
                },
                SelectSupplier : '',
                SelectWarehouse : '',
                filter: false
            }
        },
        created() {
            this.renderData('',this.statuses)
        },
        mounted() {
            this.renderData('',this.statuses)
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search,self.statuses)
                }
            });
        },
        methods: {
            renderData(search,statuses){
                this.loading = true;
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                let supplier = ''
                if (this.SelectSupplier) {
                    supplier = '|purchaseorder.supplier.id.e:'+this.SelectSupplier
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|purchaseorder.warehouse.id.e:'+this.SelectWarehouse
                }
                let invoiceDate = ''
                if (this.invoice_date.length > 0) {
                    if (this.invoice_date.length == 1) {
                        invoiceDate = '|recognition_date:'+this.invoice_date[0]
                    } else {
                        invoiceDate = '|recognition_date.gte:'+this.invoice_date[0]+'|recognition_date.lte:'+this.invoice_date[1]
                    }
                }

                let dueDate = ''
                if (this.due_date.length > 0) {
                    if (this.due_date.length == 1) {
                        dueDate = '|due_date:'+this.due_date[0]
                    } else {
                        dueDate = '|due_date.gte:'+this.due_date[0]+'|due_date.lte:'+this.due_date[1]
                    }
                }

                let ata_date = ''
                if (this.ata_date.length > 0) {
                    if (this.ata_date.length == 1) {
                        ata_date = this.ata_date[0]+'|'+this.ata_date[0]
                    } else {
                        let date = this.ata_date[0]
                        let date2 = this.ata_date[1]
                        if (date > date2) {
                            ata_date = date2+'|'+date
                        } else {
                            ata_date = date+'|'+date2
                        }
                    }
                }

                this.$http.get("/finance/purchase/invoice",{params:{
                        perpage:100,
                        ata_date : ata_date,
                        conditions:'Or.code.icontains:'+search+'%2COr.purchaseorder.code.icontains:'
                        +search+statuses+supplier+warehouse+invoiceDate+dueDate,
                        embeds:'purchaseorder,purchaseorder.warehouse,purchaseorder.supplier,purchaseorder.termpaymentpur,purchaseterm',
                        orderby:this.orderby,
                    }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data

                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            funcSort(event) {
                this.orderby = event.value
                this.renderData(this.search,this.statuses)
            },
            supplierSelected(d) {
                this.SelectSupplier = ""
                if (d) {
                    this.SelectSupplier = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            warehouseSelected(d) {
                this.SelectWarehouse = "";
                if (d) {
                    this.SelectWarehouse = d.id;
                }
                this.renderData(this.search,this.statuses)
            },
        },
        computed: {
            staff () {
                return this.$store.getters.getStaff
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    that.renderData(val,this.statuses)
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val)
                },
                deep: true
            },
            'area_id': {
                handler: function (area_id) {
                    let that = this;
                    that.renderData(this.search,this.statuses)
                },
                deep: true
            },
            'invoice_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.invoice_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.invoice_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.invoice_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.invoice_date.length == 2) {
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'invoice_date': {
                handler: function (val) {
                    if (val) {
                        this.invoice_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'due_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.due_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.due_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.due_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.due_date.length == 2) {
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'due_date': {
                handler: function (val) {
                    if (val) {
                        this.due_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'ata_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.ata_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.ata_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.ata_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.ata_date.length == 2) {
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'ata_date': {
                handler: function (val) {
                    if (val) {
                        this.ata_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>