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
                        Hide<v-icon right>mdi-chevron-up</v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show<v-icon right> mdi-chevron-down</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="showFilter? '':'hidden'">
                <v-col cols="6" md="3" class="mtn24">
                    <SelectStatus
                        v-model="statuses"
                        @selected="statusSelected"
                        v-privilege="'filter_rdl'"
                        :default="1"
                        :dense="true"
                    ></SelectStatus>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectMainOutlet
                        @selected="mainOutletSelected"
                        v-privilege="'filter_rdl'"
                        :norequired="true"
                        :dense="true"
                    ></SelectMainOutlet>
                </v-col>
                <v-col cols="6" md="3" class="mtn24">
                    <SelectArea
                        @selected="areaSelected"
                        v-privilege="'filter_rdl'"
                        :aux_data="2"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectArchetype
                        @selected="archetypeSelected"
                        v-privilege="'filter_rdl'"
                        :norequired="true"
                        :aux_data="2"
                        :dense="true"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectPriceSet
                        @selected="pricesetSelected"
                        v-privilege="'filter_rdl'"
                        :norequired="true"
                        :dense="true"
                    ></SelectPriceSet>
                </v-col>
                <v-col cols="12" md="3" class="mtn24">
                    <SelectSalesPerson
                        @selected="salespersonSelected"
                        v-privilege="'filter_rdl'"
                        :norequired="true"
                        :dense="true"
                    ></SelectSalesPerson>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end"></v-col>
                <v-col class="d-flex justify-end h70">
                     <v-btn
                        depressed
                        color="#50ABA3"
                        to="/customer/branch/create"
                        class="no-caps bold mr20"
                        v-privilege="'olt_crt'"
                    >
                        <span class="text-white">Create Outlet</span>
                    </v-btn>
                    <v-tooltip left v-privilege="'olt_exp'">
                        <template v-slot:activator="{ on: tooltip }">
                            <v-icon
                                v-on="{ ...tooltip }"
                                dark
                                color="gray"
                                class="-mt7 mr-1"
                            >mdi-information-outline</v-icon>
                        </template>
                        <span><strong>Export Button</strong><br>You have to choose area before export the data</span>
                    </v-tooltip>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="no-caps bold white--text"
                        @click="exportData()"
                        :disabled="disableButton"
                        v-privilege="'olt_exp'"
                    >Export</v-btn>
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
                        <td>{{ props.item.code }}</td>
                        <td>{{ props.item.name }}<br>
                        <span class="second-color">{{ props.item.merchant.code }} - {{ props.item.merchant.name }}</span></td>
                        <td>{{ props.item.phone_number }}</td>
                        <td>{{ props.item.archetype.name }}</td>
                        <td v-if="props.item.salesperson">{{ props.item.salesperson.name }}</td>
                            <td v-else>-</td>
                        <td>{{ props.item.price_set.name }}</td>
                        <td>{{ props.item.area.name }}</td>
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
                                    <v-list-item :to="{ name: 'BranchDetail', params: { id: props.item.id } }" v-privilege="'olt_rdd'">
                                        <v-list-item-title>Detail</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item :to="{ name: 'BranchUpdate', params: { id: props.item.id } }" v-privilege="'olt_upd'">
                                        <v-list-item-title>Update</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
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
        name: "Branch",
        data() {
            return {
                showFilter : false,
                loading: false,
                search: '',
                statuses:1,
                area_id:'',
                SelectArchetype:'',
                SelectPriceSet:'',
                SelectMainOutlet:'',
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Name',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Phone Number',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Archetype',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Sales Person',
                            width: "15%",
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
                            width: "7%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "3%",
                            sortable: false
                        },
                    ],
                },
                items:[],
                overlay: false,
            }
        },
        mounted() {
            this.renderData('',this.statuses)
        },
        methods: {
            // For get data from API
            renderData(search,statuses,areaID){
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                if(areaID){
                    areaID = "|area.id.e:"+areaID
                }else{
                    areaID = ''
                }
                let mainoutlet = ''
                if (this.SelectMainOutlet) {
                    mainoutlet = '|merchant__id.e:'+this.SelectMainOutlet
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
                this.loading = true;
                this.items = []
                this.$http.get("/customer/branch",{params:{
                        perpage:100,
                        embeds:'merchant_id,area_id,archetype_id,price_set_id,warehouse_id,salesperson_id,sub_district_id,sub_district_id.area',
                        conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'
                        +search+'%2COr.phone_number.icontains:'+search+statuses+areaID+archetype+priceset+salesperson+mainoutlet+'|merchant.customer_group:1',
                        orderby:'-id',
                    }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
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
                let areaID = ''
                if(this.area_id){
                    areaID = this.area_id
                }
                let mainoutlet = ''
                if(this.SelectMainOutlet){
                    mainoutlet = this.SelectMainOutlet
                }
                let archetype = ''
                if(this.SelectArchetype){
                    archetype = this.SelectArchetype
                }
                let priceset = ''
                if(this.SelectPriceSet){
                    priceset = this.SelectPriceSet
                }
                let salesperson = ''
                if(this.SelectSalesPerson){
                    salesperson = this.SelectSalesPerson
                }
                this.$http.get("/report/rms/outlet?export=1",{params:{
                        status:status,
                        area:areaID,
                        merchant:mainoutlet,
                        archetype:archetype,
                        price_set:priceset,
                        salesperson:salesperson
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
                if (val !== ''  && val !== undefined){
                    this.statuses = val.value;
                }
            },
            //For Filter Main Outlet
            mainOutletSelected(d) {
                this.SelectMainOutlet = ""
                if (d) {
                    this.SelectMainOutlet = d.id
                }
                this.renderData(this.search,this.statuses,this.area_id)
            },
            //For Filter Area
            areaSelected(d){
                this.area_id = '';
                if(d !== '' && d !== undefined){
                    this.area_id = d.id;
                }
            },
            //For Filter Archetype
            archetypeSelected(d) {
                this.SelectArchetype = ""
                if (d) {
                    this.SelectArchetype = d.id
                }
                this.renderData(this.search,this.statuses,this.area_id)
            },
            //For Filter Price Set
            pricesetSelected(d) {
                this.SelectPriceSet = ""
                if (d) {
                    this.SelectPriceSet = d.id
                }
                this.renderData(this.search,this.statuses,this.area_id)
            },
            //For Filter Sales Person
            salespersonSelected(d) {
                this.SelectSalesPerson = ""
                if (d) {
                    this.SelectSalesPerson = d.id
                }
                this.renderData(this.search,this.statuses,this.area_id)
            },
        },
        computed : {
            //For disable export button if required filter is empty
            disableButton() {
                if (this.area_id) {
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
                        that.renderData(val,that.statuses,that.area_id)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val,this.area_id)
                },
                deep: true
            },
            'area_id': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,this.statuses,val)
                },
                deep: true
            },
        },
    }
</script>
