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
                        <span>Search by name, phone number</span>
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
                        <v-icon right>
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
                        <v-icon right>
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="showFilter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="regStatus"
                        item-text="text"
                        item-value="value"
                        label="Status"
                        dense
                        outlined
                        v-privilege="'filter_rdl'"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArchetype
                        v-privilege="'filter_rdl'"
                        :aux_data="2"
                        :norequired="true"
                        :dense="true"
                        @selected="archetypeSelected"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectBusinessType
                        v-privilege="'filter_rdl'"
                        :aux_data="2"
                        :label="'Type'"
                        :norequired="true"
                        :dense="true"
                        @selected="typeSelected"
                    ></SelectBusinessType>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        v-privilege="'filter_rdl'"
                        :aux_data="2"
                        :dense="true"
                        @selected="areaSelected"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-autocomplete
                        v-model="selectRequest"
                        :items="requestBy"
                        item-text="text"
                        item-value="value"
                        label="Requested By"
                        dense
                        outlined
                        clearable
                        v-privilege="'filter_rdl'"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSalesPerson
                        :norequired="true"
                        :clear="clearSalesperson"
                        :disabled="disableSalesperson"
                        :dense="true"
                        @selected="salespersonSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectSalesPerson>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col cols="12" md="9" class="h1"/>
                <v-col cols="12" md="3" class="d-flex justify-end h70">
                    <v-tooltip left v-privilege="'pro_cst_exp'">
                        <template v-slot:activator="{ on: tooltip }">
                            <v-icon
                                v-on="{ ...tooltip }"
                                dark
                                color="gray"
                                class="-mt7 mr-1"
                            >mdi-information-outline</v-icon>
                        </template>
                        <span><strong>Export Button</strong><br>You have to choose filter area before export the data</span>
                    </v-tooltip>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="no-caps bold white--text"
                        @click="exportData()"
                        :disabled="disableButton"
                        v-privilege="'pro_cst_exp'"
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
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.phone_number }}</td>
                        <td>{{ props.item.archetype.name }}</td>
                        <td>{{ props.item.business_type_name }}</td>
                        <td v-if="props.item.sub_district.area">{{ props.item.sub_district.area.name }}</td>
                        <td v-else>-</td>
                        <td>
                            {{ props.item.sub_district.district.city.province.name }} - {{
                            props.item.sub_district.district.city.name }}<br>
                            <span class="second-color">
                                {{ props.item.sub_district.district.name }} - {{ props.item.sub_district.name }}
                            </span>
                        </td>
                        <td>
                            <div v-if="props.item.merchant">
                                Yes
                            </div>
                            <div v-else>
                                No
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.salesperson_id != '0'">
                                Salesperson<br>
                                <span class="second-color">
                                {{ props.item.salesperson }}
                                </span>
                            </div>
                            <div v-else>
                                Customer
                            </div>
                        </td>
                        <td>
                            <v-chip
                                class="ma-2"
                                :color="statusMaster(props.item.reg_status === 1 ? 'new' : props.item.reg_status === 2 ? 'registered' : 'decline')"
                                :text-color="statusMasterText(props.item.reg_status === 1 ? 'new' : props.item.reg_status === 2 ? 'registered' : 'decline')"
                                small
                            >
                                {{props.item.reg_status === 1 ? 'New' : props.item.reg_status === 2 ? 'Registered' :
                                'Decline'}}
                            </v-chip>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <template>
                                        <v-btn icon v-on="{ ...menu }">
                                            <v-icon dark>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'pro_cst_rdl'" :to="'/customer/prospect-customer/'+props.item.id ">
                                        <v-list-item-title>Detail</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-privilege="'pro_cst_reg'" @click="regis(props.item.id)"
                                        v-if="props.item.reg_status == 1 && !(props.item.merchant)"
                                    >
                                        <v-list-item-title>Register</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-privilege="'pro_cst_upg'" @click="upgrade(props.item.id)"
                                        v-if="props.item.reg_status == 1 && props.item.merchant"
                                    >
                                        <v-list-item-title>Upgrade</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <div v-privilege="'pro_cst_dec'" v-if="props.item.reg_status == 1">
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'pro_cst_dec'" v-if="props.item.reg_status == 1"
                                        @click="openDeclineDialog(props.item.id)"
                                    >
                                        <v-list-item-title>Decline</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog
                v-model="register"
                persistent
                max-width="402px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Register Prospective Customer</span>
                </v-card-title>
                <v-card-text>
                    <div class="flex-align-center">
                        <v-img
                            width="235"
                            src="/img/register-customer.png"
                        />
                    </div>
                    <SelectArchetype
                        name="archetype_name"
                        @selected="archetypeRegister"
                        :aux_data="2"
                        :dense="true"
                        class="pt-6"
                    ></SelectArchetype>
                </v-card-text>
                <v-card-actions class="d-flex justify-end pb-4">
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="register = false"
                    ><span class="text-black80">Cancel</span></v-btn>
                    <v-btn
                        @click="nextMethod()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        :disabled="this.archetype ? false : true"
                    >Next</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="declineDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Decline</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this prospective customer declined?</span>
                    <SelectDeclineType
                        @selected="selectedDeclineType"
                        :clear="clearDeclineType"
                        :error="error.decline_type_id"
                        :dense="true"
                        class="mt-6"
                    />
                    <v-textarea
                        name="note"
                        v-model="decline_note"
                        :counter="250"
                        maxlength="250"
                        outlined
                        dense
                        :error-messages="error.decline_note"
                        required
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="declineDialog = false,clearDeclineType = true"
                    ><span class="text-black80">Cancel</span></v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="no-caps bold px-7"
                        @click="decline(decline_id)"
                        elevation="0"
                    ><span class="text-white">Save</span></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "ProspectCustomer",
        data() {
            return {
                id: '',
                showFilter : false,
                search: '',
                loading: false,
                openDialog: false,
                type: null,
                area: null,
                archetype: '',
                next: '',
                customerID: '',
                register: false,
                statuses: 1,
                regStatus: [{
                    text: 'All Status',
                    value: 999
                }, {
                    text: 'New',
                    value: 1
                }, {
                    text: 'Registered',
                    value: 2
                }, {
                    text: 'Decline',
                    value: 3
                }],
                table: {
                    fields: [
                        {
                            text: 'Name',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Phone Number',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Archetype',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Type',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Area',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Location',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Request Upgrade',
                            class: 'grey--text text--darken-4',
                            width: "3%",
                            sortable: false
                        },
                        {
                            text: 'Requested By',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Status',
                            width: "2%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "2%",
                            sortable: false
                        },
                    ],
                },
                filter: {
                    type: '',
                    area_id: '',
                    archetype_id: ''
                },
                SelectBusinessType: '',
                SelectArea: '',
                SelectArchetype: '',
                salesperson: '',
                items: [],
                overlay: false,
                selectRequest: '',
                requestBy: [{
                    text: 'Customer',
                    value: 1
                }, {
                    text: 'Salesperson',
                    value: 2
                }],
                clearSalesperson: true,
                disableSalesperson: true,
                declineDialog: false,
                decline_id: "",
                decline_type: "",
                decline_note: "",
                clearDeclineType:false,
                error: {},
            }
        },
        mounted() {
            this.renderData('', this.statuses)
            let self = this
            this.$root.$on('event_success', function (res) {
                if (res) {
                    self.renderData(self.search, self.statuses)
                }
            });
        },
        methods: {
            // For get data from API
            renderData(search, statuses) {
                this.loading = true;
                this.overlay = true;
                this.items = []
                if (statuses === 999) {
                    statuses = ''
                } else {
                    statuses = "|reg_status:" + statuses
                }
                let type = ''
                if (this.SelectBusinessType) {
                    type = '|business_type_name:' + this.SelectBusinessType
                }
                let areaID = ''
                if (this.SelectArea) {
                    areaID = "|sub_district_id.area_id.id.e:" + this.SelectArea
                }
                let archetypeID = ''
                if (this.SelectArchetype) {
                    archetypeID = "|archetype_id.e:" + this.SelectArchetype
                }
                let selectRequest = ''
                if (this.selectRequest == 1) {
                    selectRequest = "|salesperson_id__null:true%2COr.salesperson_id.lte:0"
                } else if (this.selectRequest == 2) {
                    selectRequest = "|salesperson_id.gt:0"
                }
                let salespersonID = ''
                if (this.salesperson) {
                    salespersonID = "|salesperson_id.e:" + this.salesperson
                }
                this.$http.get("/customer/prospect_customer", {
                    params: {
                        perpage: 100,
                        embeds: 'archetype,archetype_id.businesstype,sub_district_id,sub_district_id.area,sub_district_id.district,sub_district_id.district.city,sub_district_id.district.city.province,merchant',
                        conditions: 'name.icontains:' + search + '%2COr.phone_number.icontains:' + search + statuses + type + areaID + archetypeID + salespersonID + selectRequest,
                        orderby: '-id',
                    }
                }).then(response => {
                    this.loading = false;
                    this.overlay = false;
                    this.items = response.data.data
                    if (this.items === null) {
                        this.items = []
                    }
                });
            },
            // For Export Data with Filter Selected
            exportData() {
                this.overlay = true
                let statuses
                if (this.statuses === 999) {
                    statuses = ''
                } else {
                    statuses = this.statuses
                }
                let areaID = ''
                if (this.SelectArea) {
                    areaID = this.SelectArea
                }
                let archetypeID = ''
                if (this.SelectArchetype) {
                    archetypeID = this.SelectArchetype
                }
                let salespersonID = ''
                if (this.salesperson) {
                    salespersonID = this.salesperson
                }
                this.$http.get("/report/cms/prospective-customer?export=1", {
                    params: {
                        area: areaID,
                        status: statuses,
                        archetype: archetypeID,
                        salesperson: salespersonID,
                    }
                }).then(response => {
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
            //Select Archetype for Register Customer
            archetypeRegister(d) {
                this.archetype = '';
                this.next = '';
                if (d) {
                    this.archetype = d
                    if (d.customer_group == 1) {
                        this.next = 'outlet'
                    } else if (d.customer_group == 2) {
                        this.next = 'agent'
                    }
                }
            },
            //For Filter Archetype
            archetypeSelected(d) {
                this.SelectArchetype = '';
                if (d) {
                    this.SelectArchetype = d.id
                }
                this.renderData(this.search, this.statuses)
            },
            //For Filter Type
            typeSelected(d) {
                this.SelectBusinessType = '';
                if (d) {
                    this.SelectBusinessType = d.name;
                }
                this.renderData(this.search, this.statuses)
            },
            //For Filter Area
            areaSelected(d) {
                this.SelectArea = '';
                if (d) {
                    this.SelectArea = d.id;
                }
                this.renderData(this.search, this.statuses)
            },
            //For Filter Salesperson
            salespersonSelected(d) {
                this.salesperson = '';
                if (d) {
                    this.salesperson = d.id;
                }
                this.renderData(this.search, this.statuses)
            },
            //For Decline Customer Registration
            openDeclineDialog(recordID){
                this.error.decline_type_id = ""
                this.decline_id = ""
                this.decline_type = ""
                this.decline_note = ""
                this.clearDeclineType = false
                this.decline_id = recordID
                this.declineDialog = true
            },
            decline(id) {
                this.$http.put("/customer/prospect_customer/decline/"+id,{
                    decline_type_id: this.decline_type,
                    decline_note: this.decline_note,
                }).then(response => {
                    this.declineDialog = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been declined successfully',
                        type: 'success',
                    });
                    this.clearDeclineType = true
                    this.renderData(this.search, this.statuses)
                }).catch(e => {
                    this.error = e.errors
                });
            },
            //For get selected decline type
            selectedDeclineType(d) {
                this.decline_type = ""
                if (d) {
                    this.decline_type = d.value_int
                }
            },
            //For Show Register Popup Dialog
            regis(val) {
                this.customerID = val
                this.register = true
            },
            //Next step if want to register
            nextMethod() {
                let data = {
                    customer: this.customerID,
                    archetype: this.archetype
                }
                this.$store.commit('setProspectCustomer', data);
                if (this.next == 'agent') {
                    this.$router.push('/customer/agent/create')
                } else if (this.next == 'outlet') {
                    this.$router.push('/customer/branch/create')
                }
            },
            //For upgrade existing customer
            upgrade(val) {
                let data = {
                    customer: val,
                    archetype: ""
                }
                this.$store.commit('setProspectCustomer', data);
                this.$router.push('/customer/branch/create')
            }
        },
        computed: {
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
                    this._timerId = setTimeout(function () {
                        that.renderData(val, that.statuses)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this;
                    that.renderData(this.search, val)
                },
                deep: true
            },
            'selectRequest': {
                handler: function (val) {
                    if(val == 2){
                        this.clearSalesperson = false
                        this.disableSalesperson = false
                    }else{
                        this.clearSalesperson = true
                        this.disableSalesperson = true
                    }
                    this.renderData(this.search, this.statuses)
                },
                deep: true
            }
        },
    }
</script>
