<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template
                            v-slot:activator="{ on: tooltip }"
                            v-privilege="'filter_rdl'"
                        >
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
                        <span>Search by code </span>
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
            <v-row class="hr-title" />
            <v-row :class="filter ? 'mb24' : ''">
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
                        <v-icon right> mdi-chevron-up </v-icon>
                    </v-btn>
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon right> mdi-chevron-down </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter ? '' : 'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        outlined
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        name="filter_warehouse"
                        :norequired="true"
                        :aux_data="2"
                        :dense="true"
                        @selected="warehouseSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="purchase_plan_date_model"
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
                                    @click:clear="purchase_plan_date = [],purchase_plan_date_input = '', renderData(search, supplierOrganizationId ? supplierOrganizationId : '', fieldPurchaserId ? fieldPurchaserId : '', statuses)"
                                    v-model="purchase_plan_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Purchase Plan Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="purchase_plan_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="purchase_plan_date_model = false, renderData(search, supplierOrganizationId ? supplierOrganizationId : '', fieldPurchaserId ? fieldPurchaserId : '', statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="eta_date_model"
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
                                    @click:clear="eta_date = [],eta_date_input = '', renderData(search, supplierOrganizationId ? supplierOrganizationId : '', fieldPurchaserId ? fieldPurchaserId : '', statuses)"
                                    v-model="eta_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Estimated Arrival Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="eta_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="eta_date_model = false, renderData(search, supplierOrganizationId ? supplierOrganizationId : '', fieldPurchaserId ? fieldPurchaserId : '', statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSupplierOrganization
                        :dense="true"
                        name= "SupplierOrganization"
                        :norequired="true"
                        @selected="supplierOrganizationSelected">
                    </SelectSupplierOrganization>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectUser
                        name="field_purchaser"
                        @selected="fieldPurchaserSelected"
                        :label="'Field Purchaser'"
                        :dense="true"
                        norequired="true"
                        :is_field_purchaser="true"
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        to="/purchase/plan/create"
                        class="no-caps bold"
                        v-privilege="'ppl_crt'"
                    >
                        <span class="text-white"> Create Purchase Plan </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :loading="loading"
                :items="items"
                :items-per-page="10"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>
                            <span class="text-black60">{{
                                props.item.code
                            }}</span>
                        </td>
                        <td>{{ formatDate(props.item.recognition_date) }}</td>
                        <td>
                            {{ props.item.supplier_organization.name }}<br />
                            <span class="text-black60">{{
                                props.item.supplier_organization.code
                            }}</span>
                        </td>
                        <td>{{ props.item.warehouse.name }}</td>
                        <td>{{ formatPrice(props.item.total_price) }}</td>
                        <td>{{ formatDate(props.item.eta_date) }}</td>
                        <td>{{ (props.item.total_purchase_qty / props.item.total_purchase_plan_qty * 100).toFixed(2) + ' %' }}</td>
                        <td>
                            {{ props.item.assigned_to ? props.item.assigned_to.name : '-' }}<br />
                            <span class="text-black60">{{
                                props.item.assigned_to ? props.item.assigned_to.code : '-'
                            }}</span>
                        </td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                    ><span class="pa-md-2">Active</span></v-chip
                                >
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                    ><span class="pa-md-2">Finished</span></v-chip
                                >
                            </div>
                            <div v-else>
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                    >Cancelled</v-chip
                                >
                            </div>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn icon v-on="{ ...menu }"
                                        ><v-icon dark
                                            >mdi-dots-vertical</v-icon
                                        ></v-btn
                                    >
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item
                                        :to="`/purchase/plan/${props.item.id}`"
                                        v-privilege="'ppl_rdd'"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Detail</v-list-item-title
                                            >
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item
                                        :to="`/purchase/plan/update/${props.item.id}`"
                                        v-privilege="'ppl_upd'"
                                        v-if="props.item.status === 1" 
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Update</v-list-item-title
                                            >
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
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "PurchasePlan",
    data() {
        return {
            search: "",
            loading: false,
            filter: false,
            statuses: 999,
            supplierOrganizationId: null,
            fieldPurchaserId: null,
            orderby: "-id",
            sortby: "-id",
            sorts:[
                {
                    text:"Default",
                    value:"-id"
                },
                {
                    text:"Estimated Arrival Date (A-Z)",
                    value:"eta_date"
                },
                {
                    text:"Estimated Arrival Date (Z-A)",
                    value:"-eta_date"
                },
                {
                    text:"Total Price (A-Z)",
                    value:"total_price"
                },
                {
                    text:"Total Price (Z-A)",
                    value:"-total_price"
                },
            ],
            selectedWarehouse: "",
            purchase_plan_date_model : "",
            purchase_plan_date_input : "",
            purchase_plan_date : [],
            eta_date_model : "",
            eta_date_input : "",
            eta_date : [],
            table: {
                fields: [
                    {
                        text: "Code",
                        width: "10%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Date",
                        width: "10%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Supplier Organization",
                        width: "10%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Warehouse",
                        width: "10%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Total Price",
                        width: "10%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Estimated Arrival Date",
                        width: "10%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Completion Progress",
                        width: "10%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Field Purchaser",
                        width: "10%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Status",
                        class: "grey--text text--darken-4",
                        width: "10%",
                        sortable: false,
                    },
                    {
                        text: "",
                        class: "grey--text text--darken-4",
                        width: "5%",
                        sortable: false,
                    },
                ],
            },
            items: [],
            status:[
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
        };
    },
    mounted() {
        this.renderData("","","",this.statuses);
    },
    methods: {
        // get list, search & filter by status
        renderData(search, organizationId, fieldPurchaserId, statuses) {
            this.loading = true;
            this.items = [];
            if(organizationId){
                organizationId = "|supplier_organization_id.e:" + organizationId;
            }else{
                organizationId = ""
            }
            if(fieldPurchaserId){
                fieldPurchaserId = "|assigned_to.id.e:" + fieldPurchaserId;
            }else{
                fieldPurchaserId = ""
            }
            if (statuses === 999) {
                statuses = "";
            } else {
                statuses = "|status:" + statuses;
            }
            let warehouse = ""
            if (this.selectedWarehouse) {
                warehouse = "|warehouse.id.e:" + this.selectedWarehouse
            }
            let purchase_plan_date = ""
            if (this.purchase_plan_date.length > 0) {
                if (this.purchase_plan_date.length == 1) {
                    purchase_plan_date = "|recognition_date:" + this.purchase_plan_date[0]
                } else {
                    let date = this.purchase_plan_date[0]
                    let date2 = this.purchase_plan_date[1]
                    if (date > date2) {
                        purchase_plan_date = "|recognition_date.gte:" + date2 + "|recognition_date.lte:" + date
                    } else {
                        purchase_plan_date = "|recognition_date.gte:" + date + "|recognition_date.lte:" + date2
                    }
                }
            }
            let eta_date = ""
            if (this.eta_date.length > 0) {
                if (this.eta_date.length == 1) {
                    eta_date = "|eta_date:" + this.eta_date[0]
                } else {
                    let date = this.eta_date[0]
                    let date2 = this.eta_date[1]
                    if (date > date2) {
                        eta_date = "|eta_date.gte:" + date2 + "|eta_date.lte:" + date
                    } else {
                        eta_date = "|eta_date.gte:" + date + "|eta_date.lte:" + date2
                    }
                }
            }
            this.$http.get("/purchase/plan", {
                params: {
                    perpage: 100,
                    conditions: "code.icontains:" + search + organizationId + fieldPurchaserId + statuses + warehouse + purchase_plan_date + eta_date,
                    orderby: this.orderby,
                },
            }).then((response) => {
                this.items = response.data.data;
                if (this.items === null) {
                    this.items = [];
                }
            }).finally(() => (this.loading = false));
        },
        // Select Organization 
        supplierOrganizationSelected(d){
            this.supplierOrganizationId = null
            if (d) {
                this.supplierOrganizationId = d.id
            }
            this.renderData(this.search, this.supplierOrganizationId ? this.supplierOrganizationId : "", this.fieldPurchaserId ? this.fieldPurchaserId : '', this.statuses)
        },
        // For select field purchaser
        fieldPurchaserSelected(d) {
            this.fieldPurchaserId = null;
            if (d) {
                this.fieldPurchaserId = d.id;
            }
            this.renderData(this.search, this.supplierOrganizationId ? this.supplierOrganizationId : "", this.fieldPurchaserId ? this.fieldPurchaserId : '', this.statuses)
        },
        // sort list pp
        funcSort(event) {
            this.orderby = event.value
            this.renderData(this.search, this.supplierOrganizationId ? this.supplierOrganizationId : "", this.fieldPurchaserId ? this.fieldPurchaserId : '', this.statuses)
        },
        // selected warehouse
        warehouseSelected(d) {
            this.selectedWarehouse = ""
            if (d) {
                this.selectedWarehouse = d.id
            }
            this.renderData(this.search, this.supplierOrganizationId ? this.supplierOrganizationId : "", this.fieldPurchaserId ? this.fieldPurchaserId : '', this.statuses)
        },
    },
    watch: {
        search: {
            handler: function (val) {
                let that = this;
                clearTimeout(this._timerId);
                this._timerId = setTimeout(function () {
                    that.renderData(val, that.supplierOrganizationId ? that.supplierOrganizationId : '', that.fieldPurchaserId ? that.fieldPurchaserId : '', that.statuses);
                }, 1000);
            },
            deep: true,
        },
        statuses: {
            handler: function (val) {
                let that = this;
                that.renderData(that.search, that.supplierOrganizationId ? that.supplierOrganizationId : '', that.fieldPurchaserId ? that.fieldPurchaserId : '', val);
            },
            deep: true,
        },
        purchase_plan_date_input: {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(val, "YYYY-MM-DD", true).isValid()
                        if (valid == true) {
                            this.purchase_plan_date[0] = this.$moment(val).format("YYYY-MM-DD")
                            this.renderData(this.search, this.supplierOrganizationId ? this.supplierOrganizationId : "", this.fieldPurchaserId ? this.fieldPurchaserId : '', this.statuses)
                        }
                    } else if (val.length == 24) {
                        let date1 = val.substr(0,10)
                        let date2 = val.substr(14,23)
                        let valid1 = this.$moment(date1, "YYYY-MM-DD", true).isValid()
                        let valid2 = this.$moment(date2, "YYYY-MM-DD", true).isValid()
                        if (valid1 == true && valid2 == true) {
                            this.purchase_plan_date[0] = this.$moment(date1).format("YYYY-MM-DD")
                            this.purchase_plan_date[1] = this.$moment(date2).format("YYYY-MM-DD")
                            if (this.purchase_plan_date.length == 2) {
                                this.renderData(this.search, this.supplierOrganizationId ? this.supplierOrganizationId : "", this.fieldPurchaserId ? this.fieldPurchaserId : '', this.statuses)
                            }
                        }
                    }
                }
            },
            deep: true
        },
        purchase_plan_date: {
            handler: function (val) {
                if (val) {
                    this.purchase_plan_date_input = this.formatDateRange(val)
                }
            },
            deep: true
        },
        eta_date_input: {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(val, "YYYY-MM-DD", true).isValid()
                        if (valid == true) {
                            this.eta_date[0] = this.$moment(val).format("YYYY-MM-DD")
                            this.renderData(this.search, this.supplierOrganizationId ? this.supplierOrganizationId : "", this.fieldPurchaserId ? this.fieldPurchaserId : '', this.statuses)
                        }
                    } else if (val.length == 24) {
                        let date1 = val.substr(0,10)
                        let date2 = val.substr(14,23)
                        let valid1 = this.$moment(date1, "YYYY-MM-DD", true).isValid()
                        let valid2 = this.$moment(date2, "YYYY-MM-DD", true).isValid()
                        if (valid1 == true && valid2 == true) {
                            this.eta_date[0] = this.$moment(date1).format("YYYY-MM-DD")
                            this.eta_date[1] = this.$moment(date2).format("YYYY-MM-DD")
                            if (this.eta_date.length == 2) {
                                this.renderData(this.search, this.supplierOrganizationId ? this.supplierOrganizationId : "", this.fieldPurchaserId ? this.fieldPurchaserId : '', this.statuses)
                            }
                        }
                    }
                }
            },
            deep: true
        },
        eta_date: {
            handler: function (val) {
                if (val) {
                    this.eta_date_input = this.formatDateRange(val)
                }
            },
            deep: true
        },
    },
};
</script>
