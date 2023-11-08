<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
             <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                name="search"
                                v-model="search"
                                prepend-inner-icon="search"
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                outlined
                                dense
                                filled
                                v-privilege="'filter_rdl'"
                            >
                            </v-text-field>
                        </template>
                        <span>Search by code, name, phone number</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
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
                <v-col cols="12" md="3" class="-mt24">
                    <SelectStatus
                        v-model="statuses"
                        :default="1"
                        :dense="true"
                        @selected="statusSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectStatus>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectInvoiceTerm
                        :norequired="true"
                        :dense="true"
                        v-model="invoice_terms"
                        @selected="invoicetermSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectInvoiceTerm>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSalesTerm
                        :norequired="true"
                        v-model="payment_terms"
                        :label="'Payment Term'"
                        :dense="true"
                        @selected="salestermSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectSalesTerm>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        v-model="areas"
                        :aux_data="2"
                        :label="'Finance Area'"
                        :dense="true"
                        @selected="areaSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectBusinessType
                        :norequired="true"
                        :dense="true"
                        v-model="business_type"
                        @selected="businessTypeSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectBusinessType>
                </v-col>
                <v-col cols="6" md="3" class="mtn24">
                    <SelectSuspend
                        v-model="suspend"
                        :default="999"
                        @selected="suspendSelected"
                        :dense="true"
                        v-privilege="'filter_rdl'"
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end"></v-col>
                <v-col cols="4" md="3" class="d-flex justify-end h70">
                    <v-tooltip left v-privilege="'main_olt_exp'">
                        <template v-slot:activator="{ on: tooltip }">
                        <v-icon
                            v-on="{ ...tooltip }"
                            dark
                            color="gray"
                            class="-mt7 mr-1"
                        >
                            mdi-information-outline
                        </v-icon>
                        </template>
                        <span><strong>Export Button</strong><br>You have to choose filter area before export the data</span>
                    </v-tooltip>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="no-caps bold"
                        @click="exportData()"
                        :disabled="disableButton"
                        v-privilege="'main_olt_exp'"
                    ><span class="text-white">Export</span></v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            {{ props.item.code }}<br>
                        <span class="second-color">{{ props.item.name ?  props.item.name : '-' }}</span>
                        </td>
                        <td>{{ props.item.phone_number ?  props.item.phone_number : '-'}}</td>
                        <td>{{ props.item.business_type.name ? props.item.business_type.name : '-'}}</td>
                        <td>{{ props.item.invoice_term.name ? props.item.invoice_term.name : '-'}}</td>
                        <td>{{ props.item.payment_term.name ? props.item.payment_term.name : '-'}}</td>
                        <td>{{ props.item.finance_area.name ? props.item.finance_area.name : '-'}}</td>
                        <td>{{ props.item.payment_group.name ? props.item.payment_group.name : '-'}}</td>
                        <td>
                            <div v-if="props.item.suspended == 1">
                                <span style="color: red">Yes </span>
                            </div>
                            <div v-else>
                                <span>No</span>
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-2">Active </span></v-chip>
                            </div>
                            <div v-else>
                                <v-chip
                                    :color="statusMaster('archived')"
                                    small
                                >Archived </v-chip>
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
                                    <v-list-item v-privilege="'main_olt_rdd'" :to="{ name: 'MerchantDetail', params: { id: props.item.id } }">
                                        <v-list-item-title>Detail</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item  v-privilege="'main_olt_upd'" v-if="props.item.status === 1" :to="{ name: 'MerchantUpdate', params: { id: props.item.id } }">
                                        <v-list-item-title>Update</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <div v-privilege="'main_olt_sus'">
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'main_olt_sus'" @click="changeStatus(props.item.code)">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span v-if="props.item.suspended === 1">Unsuspend</span>
                                                <span v-else>Suspend</span>
                                            </v-list-item-title>
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
    import Vue from 'vue'

    export default {
        name: "Tag",
        data() {
            return {
                showFilter : false,
                loading: false,
                search: '',
                statuses:1,
                invoice_terms:'',
                payment_terms:'',
                business_type: '',
                payment_group: '',
                areas:'',
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Phone Number',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Business Type',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Invoice Term',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Payment Term',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Finance Area',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Payment Group',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Suspend',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width:'3%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width:'2%',
                            sortable: false
                        },
                    ],
                },
                isSuspend:[],
                items:[
                    {
                        user_merchant:{
                            status: ''
                        },
                        business_type:{
                            name: ''
                        },
                        invoice_term:{
                            name: ''
                        },
                        payment_term:{
                            name: ''
                        },
                        finance_area:{
                            name: ''
                        },
                        payment_group:{
                            name: ''
                        }
                    },
                ],
                overlay: false,
                suspend: 999,
            }
        },
        mounted() {
            this.renderData('',this.statuses,'','','','','',this.suspend)
        },
        methods: {
            // For get data from API
            renderData(search,statuses,invoice_terms,payment_terms,areas,business_type,payment_group,suspend){
                this.loading = true;
                if(statuses === 999){statuses = ''}
                else{statuses= "|status:"+statuses}

                if(invoice_terms === '' || invoice_terms === null){invoice_terms = ''}
                else{invoice_terms= "|invoiceterm__id.e:"+invoice_terms}

                if(payment_terms === '' || payment_terms === null){payment_terms = ''}
                else{payment_terms= "|paymentterm__id.e:"+payment_terms}

                if(areas === '' || areas === null){areas = ''}
                else{areas= "|financearea__id.e:"+areas}

                if(business_type === '' || business_type === null){business_type = ''}
                else{business_type = "|businesstype__id.e:"+business_type}

                if(payment_group === '' || payment_group === null){payment_group = ''}
                else{payment_group = "paymentgroup__id.e"+payment_group}
                
                if(suspend === 999){suspend = ''}
                else{suspend= "|suspended:"+suspend}

                this.items = []
                this.$http.get("/customer/merchant",{params:{
                        perpage:100,
                        embeds:'user_merchant_id,term_payment_sls_id,business_type_id,payment_method_id,term_invoice_sls_id,finance_area_id,business_type_id,paymentgroup',
                        conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'+search+'%2COr.phone_number.icontains:'+search+statuses+invoice_terms+payment_terms+areas+business_type+suspend+"|customer_group:1",
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false;
                    if(response.data){
                        this.items = response.data.data
                    }
                    if(this.items){
                        for(let i = 0; i < this.items.length; i++){
                            this.isSuspend[i] = this.items[i].suspended === 1 ? true : false
                        }
                    }else this.items = []
                    this.loading = false;
                });
            },
            // For Export Data with Filter Selected
            exportData(){
                this.overlay = true
                let status = ''
                if(this.statuses === 999){
                    status = ''
                }else{
                    status = this.statuses
                }
                let invoice_terms = ''
                if(this.invoice_terms){
                    invoice_terms = this.invoice_terms
                }
                let payment_terms = ''
                if(this.payment_terms){
                    payment_terms = this.payment_terms
                }
                let areaID = ''
                if(this.areas){
                    areaID = this.areas
                }
                let business_type = ''
                if(this.business_type){
                    business_type = this.business_type
                }
                let suspend = ''
                if(this.suspend === 999){
                    suspend = ''
                }else{
                    suspend = this.suspend
                }
                this.$http.get("/report/rms/main-outlet?export=1",{params:{
                        status:status,
                        term_invoice_sls:invoice_terms,
                        term_payment_sls:payment_terms,
                        area:areaID,
                        business_type:business_type,
                        suspended: suspend,
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                }).catch(e => {
                    this.overlay = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Something Wrong',
                        type: 'error',
                    });
                });
            },
            //For Filter Status
            statusSelected(val) {
                this.statuses = null;
                if (val !== ''  && val !== undefined) {
                    this.statuses = val.value;
                }
            },
            suspendSelected(val) { //select suspend status
                this.suspend = null;
                if (val !== ''  && val !== undefined) {
                    this.suspend = val.value;
                }
            },
            //For Filter Invoice Term
            invoicetermSelected(val) {
                this.invoice_terms = null;
                if (val !== ''  && val !== undefined) {
                    this.invoice_terms = val.id;
                }
            },
            //For Filter Sales Term
            salestermSelected(val) {
                this.payment_terms = null;
                if (val !== ''  && val !== undefined) {
                    this.payment_terms = val.id;
                }
            },
            //For Filter Area
            areaSelected(val) {
                this.areas = null;
                if (val !== ''  && val !== undefined) {
                    this.areas = val.id;
                }
            },
            //For Filter Business Type
            businessTypeSelected(val) {
                this.business_type = null;
                if(val !== '' && val !== undefined){
                    this.business_type = val.id
                }
            },
            //For Filter Payment Group
            paymentGroupSelected(val){
                this.payment_group = null;
                if(val !== '' && val !== undefined){
                    this.payment_group = val.id
                }
            },
            // For Switch Merchant Suspension
            changeStatus(d){
                this.$http.post("/customer/merchant/suspension",{
                        merchant_code:d
                    }).then(response => {
                        this.renderData(this.search,this.statuses,this.invoice_terms,this.payment_terms,this.areas,this.business_type,this.payment_group)
                        let msg = "Customer has been " + response.data.data + " successfully"
                        this.notifToast(msg, "success")
                }).catch(e => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Something Wrong',
                        type: 'error',
                    });
                    this.notifToast("Something went wrong, please try again", "error")
                });
            },
            notifToast(a, b) {
                Vue.$toast.open({
                    position: 'top-right',
                    message: a,
                    type: b,
                });
            },
        },
        computed : {
            //For disable export button if required filter is empty
            disableButton() {
                if (this.areas) {
                    return false
                } else {
                    return true
                }
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                    that.renderData(val,that.statuses,that.invoice_terms,that.payment_terms,that.areas,that.business_type,that.payment_group,that.suspend)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val,this.invoice_terms,this.payment_terms,this.areas,this.business_type,this.payment_group,this.suspend)
                },
                deep: true
            },
            'invoice_terms': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,this.statuses,val,this.payment_terms,this.areas,this.business_type,this.payment_group,this.suspend)
                },
                deep: true
            },
            'payment_terms': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,this.statuses,this.invoice_terms,val,this.areas,this.business_type,this.payment_group,this.suspend)
                },
                deep: true
            },
            'areas': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,this.statuses,this.invoice_terms,this.payment_terms,val,this.business_type,this.payment_group,this.suspend)
                },
                deep: true
            },
            'business_type': {
                handler: function(val){
                    let that = this
                    that.renderData(this.search, this.statuses, this.invoice_terms, this.payment_terms, this.areas, val, this.payment_group,this.suspend)
                },
                deep: true
            },
            'payment_group': {
                handler: function(val){
                    let that = this
                    that.renderData(this.search, this.statuses, this.invoice_terms, this.payment_terms, this.areas, this.business_type, val,this.suspend)
                },
                deep: true
            },
            'suspend': {
                handler: function(val){
                    let that = this
                    that.renderData(this.search, this.statuses, this.invoice_terms, this.payment_terms, this.areas, this.business_type, this.payment_group, val)
                },
                deep: true
            },
        },
    }
</script>
