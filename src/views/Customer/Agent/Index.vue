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
                            ></v-text-field>
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
                <v-col cols="12" md="3" class="mtn24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                        v-privilege="'filter_rdl'"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectBusinessType
                        :norequired="true"
                        :aux_data="2"
                        :dense="true"
                        @selected="SelectBusinessTypeFilter"
                        v-privilege="'filter_rdl'"
                    >
                    </SelectBusinessType>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectArea
                        :aux_data="2"
                        :dense="true"
                        name="area"
                        @selected="areaSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectArchetype
                        :norequired="true"
                        @selected="archetypeSelected"
                        :aux_data="2"
                        :dense="true"
                        :business_type_id="SelectBusinessType"
                        :customer_group="2"
                        :statusArch="1"
                        v-privilege="'filter_rdl'"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectPriceSet
                        @selected="pricesetSelected"
                        :norequired="true"
                        :dense="true"
                        v-privilege="'filter_rdl'"
                    ></SelectPriceSet>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectSalesPerson
                        :norequired="true"
                        :dense="true"
                        @selected="salespersonSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectSalesPerson>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        :dense="true"
                        name="warehouse"
                        @selected="warehouseSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectPaymentGroup
                        :norequired="true"
                        :dense="true"
                        @selected="paymentgroupSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectPaymentGroup>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
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
            <v-row style="height:48px">
                <v-col class="flex-align-end"></v-col>
                <v-col cols="12" md="3" class="d-flex justify-end h70">
                     <v-btn
                        depressed
                        color="#50ABA3"
                        to="/customer/agent/create"
                        class="no-caps bold mr20"
                        v-privilege="'agt_crt'"
                    >
                        <span class="text-white">Create Agent</span>
                    </v-btn>
                    <v-tooltip left v-privilege="'agt_exp'">
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
                        v-privilege="'agt_exp'"
                    ><span class="text-white">Export</span></v-btn>
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
                        <td>{{ props.item.merchant.code ? props.item.merchant.code : '-'}}<br>
                        <span class="second-color">{{ props.item.merchant.name ? props.item.merchant.name : '-'}}</span></td>
                        <td>{{ props.item.merchant.phone_number ? props.item.merchant.phone_number : '-'}}</td>
                        <td>{{ props.item.merchant.business_type.name ? props.item.merchant.business_type.name : '-'}}<br>
                        <span class="second-color">{{ props.item.archetype.name ? props.item.archetype.name : '-'}}</span></td>
                        <td>
                            <div v-if="props.item.salesperson">
                                {{ props.item.salesperson.name ? props.item.salesperson.name : '-'}}
                            </div>
                            <div v-else>
                                -
                            </div>
                        </td>
                        <td>{{ props.item.price_set.name ? props.item.price_set.name : '-'}}</td>
                        <td>{{ props.item.area.name ? props.item.area.name : '-'}}</td>
                        <td>{{ props.item.warehouse.name ? props.item.warehouse.name : '-'}}</td>
                        <td>{{ props.item.merchant.payment_group.name ? props.item.merchant.payment_group.name : '-'}}</td>
                        <td>
                            <div v-if="props.item.merchant.suspended === 1">
                                <span class="text-red">Yes </span>
                            </div>
                            <div v-else>
                                <span>No</span>
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.merchant.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-2">Active </span></v-chip>
                            </div>
                            <div v-if="props.item.merchant.status == 2">
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
                                    <v-list-item v-privilege="'agt_rdd'" :to="`/customer/agent/detail/${props.item.merchant.id}`" >
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-privilege="'agt_upd'" v-if="props.item.merchant.status == 1" :to="`/customer/agent/update/${props.item.merchant.id}`" >
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-privilege="'main_olt_sus'">
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'main_olt_sus'" @click="changeStatus(props.item.merchant.code)">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span v-if="props.item.merchant.suspended === 1">Unsuspend</span>
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
        <v-overlay style="z-index: 6 !important;" :value="overlay">
            <v-progress-circular
                indeterminate
                size="84"
                color="green"
                width=15
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>
<script>
    import Vue from 'vue'

    export default {
        name: "Tag",
        data() {
            return {
                showFilter : false,
                modalOpen: false,
                search: '',
                loading: false,
                statuses:1,
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
                            sortable: false
                        },
                        {
                            text:'Salesperson',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Price Set',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Warehouse',
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
                            class: 'grey--text text--darken-4',
                            width: "5%",
                            sortable: false
                        },
                        {
                            width: "2%",
                            sortable: false
                        },
                    ],
                },
                items:[
                    {
                        merchant:{
                            code: '',
                            name: '',
                            phone_number: '',
                            status: '',
                            business_type:{
                                name: ''
                            },
                            payment_group:{
                                name: ''
                            },
                            suspended: ''
                        },
                        user_merchant:{
                            status: ''
                        },
                        archetype:{
                            name: ''
                        },
                        salesperson:{
                            name: ''
                        },
                        price_set:{
                            name: ''
                        },
                        area:{
                            name: ''
                        },
                        warehouse:{
                            name: ''
                        },
                    }
                ],
                isSuspend:[],
                SelectBusinessType : '',
                SelectArea : '',
                SelectArchetype : '',
                SelectPriceSet : '',
                SelectSalesPerson : '',
                SelectPaymentGroup : '',
                SelectWarehouse : '',
                overlay: false,
                suspend: 999,
            }
        },
        mounted() {
            this.renderData('',this.statuses,this.suspend)
        },
        methods: {
            // For get data from API
            async renderData(search,statuses,suspend){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|merchant.status:"+statuses
                }
                let sbt = ''
                if (this.SelectBusinessType) {
                    sbt = '|merchant.businesstype__id.e:'+this.SelectBusinessType
                }
                let area = ''
                if (this.SelectArea) {
                    area = '|area__id.e:'+this.SelectArea
                }
                let archetype = ''
                if (this.SelectArchetype) {
                    archetype = '|archetype__id.e:'+this.SelectArchetype
                }
                let priceset = ''
                if (this.SelectPriceSet) {
                    priceset = '|priceset__id.e:'+this.SelectPriceSet
                }
                let salesperson = ''
                if (this.SelectSalesPerson) {
                    salesperson = '|salesperson__id.e:'+this.SelectSalesPerson
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|warehouse__id.e:'+this.SelectWarehouse
                }
                let paymentgroup = ''
                if (this.SelectPaymentGroup) {
                    paymentgroup = '|merchant.paymentgroup__id.e:'+this.SelectPaymentGroup
                }
                if(suspend === 999){
                    suspend = ''
                }else{
                    suspend= "|merchant.suspended:"+suspend
                }
                await this.$http.get("/customer/agent",{params:{
                        perpage:100,
                        embeds:'merchant.user_merchant_id,merchant_id,area_id,archetype_id,price_set_id,warehouse_id,salesperson_id,sub_district_id,merchant.business_type_id,merchant.payment_group_sls_id',
                        conditions:'main_branch:1|merchant.customer_group:2|Or.merchant.name.icontains:'+search+'%2COr.merchant.code.icontains:'
                        +search+'%2COr.merchant.phone_number.icontains:'+search+statuses+sbt+area+archetype+priceset+salesperson+paymentgroup+warehouse+suspend,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items){
                        for(let i = 0; i < this.items.length; i++){
                            this.isSuspend[i] = this.items[i].merchant.suspended == 1 ? true : false
                        }
                    }else this.items = []
                    
                });
            },
            // For Export Data with Filter Selected
            async exportData(){
                this.overlay = true
                let statuses
                if(this.statuses === 999){
                    statuses = ''
                }else{
                    statuses = this.statuses
                }
                let sbt = ''
                if(this.SelectBusinessType){
                    sbt = this.SelectBusinessType
                }
                let areaID = ''
                if(this.SelectArea){
                    areaID = this.SelectArea
                }
                let archetypeID = ''
                if(this.SelectArchetype){
                    archetypeID = this.SelectArchetype
                }
                let priceset = ''
                if(this.SelectPriceSet){
                    priceset = this.SelectPriceSet
                }
                let salesperson = ''
                if(this.SelectSalesPerson){
                    salesperson = this.SelectSalesPerson
                }
                let warehouse = ''
                if(this.SelectWarehouse){
                    warehouse = this.SelectWarehouse
                }
                let paymentgroup = ''
                if(this.SelectPaymentGroup){
                    paymentgroup = this.SelectPaymentGroup
                }
                let suspend
                if(this.suspend === 999){
                    suspend = ''
                }else{
                    suspend = this.suspend
                }
                await this.$http.get("/report/rms/agent?export=1",{params:{
                        status:statuses,
                        business_type:sbt,
                        area:areaID,
                        archetype:archetypeID,
                        price_set:priceset,
                        salesperson:salesperson,
                        warehouse:warehouse,
                        payment_group:paymentgroup,
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
            // For Filter Business Type
            SelectBusinessTypeFilter(d) {
                this.SelectBusinessType = ""
                this.SelectArchetype = ""
                if (d) {
                    this.SelectBusinessType = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            // For Filter Area
            areaSelected(d) {
                this.SelectArea = ""
                if (d) {
                    this.SelectArea = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            // For Filter Archetype
            archetypeSelected(d) {
                this.SelectArchetype = ""
                if (d) {
                    this.SelectArchetype = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            // For Filter Price Set
            pricesetSelected(d) {
                this.SelectPriceSet = ""
                if (d) {
                    this.SelectPriceSet = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            // For Filter Sales Person
            salespersonSelected(d) {
                this.SelectSalesPerson = ""
                if (d) {
                    this.SelectSalesPerson = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            // For Filter Payment Group
            paymentgroupSelected(d) {
                this.SelectPaymentGroup = ""
                if (d) {
                    this.SelectPaymentGroup = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            // For Filter Warehouse
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            // For Switch Merchant Suspension
            changeStatus(d){
                this.$http.post("/customer/merchant/suspension",{
                        merchant_code:d
                    }).then(response => {
                        this.renderData(this.search, this.statuses)
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
            suspendSelected(val) { //select suspend status
                this.suspend = null;
                if (val !== ''  && val !== undefined) {
                    this.suspend = val.value;
                }
            },
        },
        computed : {
            //For disable export button if required filter is empty
            disableButton() {
                if (this.SelectArea) {
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
                        that.renderData(val, that.statuses,that.suspend)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this

                    that.renderData(this.search,val,this.suspend)
                },
                deep: true
            },
            'suspend': {
                handler: function (val) {
                    let that = this

                    that.renderData(this.search,this.statuses,val)
                },
                deep: true
            }
        },
    }
</script>
