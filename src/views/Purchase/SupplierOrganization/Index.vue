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
                        <span>Search by code and name</span>
                    </v-tooltip>
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
                    <v-menu
                        ref="menu"
                        v-model="created_date_model"
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
                                    @click:clear="created_date = [],created_date_input = '', renderData(search, statuses)"
                                    v-model="created_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Created Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="created_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="created_date_model = false, renderData(search, statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCity
                        @selected="citySelected"
                        :norequired="true"
                        :dense="true"
                    ></SelectCity>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSupplierType
                        :dense="true"
                        name="SupplierType"
                        :norequired="true"
                        @selected="suppliertypeSelected"
                    >
                    </SelectSupplierType>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'SupplierOrganizationCreate' }"
                        class="no-caps bold"
                        v-privilege="'sor_crt'"
                    >
                        <span class="text-white"> Create Supplier Organization </span>
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
                            {{ props.item.name }}<br />
                            <span class="text-black60">{{
                                props.item.code
                            }}</span>
                        </td>
                        <td>{{ formatDate(props.item.created_at) }}</td>
                        <td>{{ props.item.sub_district ? props.item.sub_district.district.city.name : "-" }}</td>
                        <td>{{ props.item.supplier_type ? props.item.supplier_type.name : '-' }}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                    ><span class="pa-md-2">Active</span></v-chip
                                >
                            </div>
                            <div v-else>
                                <v-chip
                                    :color="statusMaster('archived')"
                                    :text-color="statusMasterText('archived')"
                                    >Archived</v-chip
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
                                        :to="`/purchase/supplier-organization/update/${props.item.id}`"
                                        v-privilege="'sor_upd'"
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
                                    <v-list-item
                                        :to="`/purchase/supplier-organization/${props.item.id}`"
                                        v-privilege="'sor_rdd'"
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
    name: "SupplierOrganization",
    data() {
        return {
            filter: false,
            search: "",
            loading: false,
            statuses: 999,
            supplier_type: null,
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
                        class: "grey--text text--darken-4",
                        width: "20%",
                        sortable: false,
                    },
                    {
                        text: "City",
                        class: "grey--text text--darken-4",
                        width: "20%",
                        sortable: false,
                    },
                    {
                        text: "Type",
                        width: "20%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Note",
                        class: "grey--text text--darken-4",
                        width: "10%",
                        sortable: false,
                    },
                    {
                        text: "Status",
                        class: "grey--text text--darken-4",
                        width: "15%",
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
            selectedCity: "",
            created_date_model : "",
            created_date_input : "",
            created_date : [],
        };
    },
    mounted() {
        this.renderData("", this.statuses,"");
    },
    methods: {
        // get list, search & filter by status
        renderData(search, statuses, typeId) {
            this.loading = true;
            this.items = [];
            if (statuses === 999) {
                statuses = "";
            } else {
                statuses = "|status:" + statuses;
            }
            let created_date = ""
            if (this.created_date.length > 0) {
                if (this.created_date.length == 1) {
                    created_date = "|created_at.between:" + this.created_date[0] + "." + this.created_date[0] + " 23:59:59"
                } else {
                    let date = this.created_date[0]
                    let date2 = this.created_date[1]
                    created_date = "|created_at.between:" + date + "." + date2 + " 23:59:59"
                }
            }
            let city = ''
            if(this.selectedCity){
                city = "|sub_district_id.district.city.id.e:" + this.selectedCity
            }else{
                city = ""
            }
            if(typeId){
                typeId =  "|supplier_type_id.e: " + typeId;
            }else{
                typeId = ""
            }
            this.$http.get("/purchase/supplier/organization", {
                params: {
                    perpage: 100,
                    conditions:
                        "Or.name.icontains:" +
                        search +
                        "%2COr.code.icontains:" +
                        search +
                        statuses + created_date + city,
                    embeds: 'subdistrict,subdistrict.district,subdistrict.district.city,subdistrict.district.city.province',
                    orderby: "-id",
                },
            }).then((response) => {
                this.items = response.data.data;
                if (this.items === null) {
                    this.items = [];
                }
            }).finally(() => (this.loading = false));
        },
        // selected city
        citySelected(d) {
            this.selectedCity = "";
            if (d) {
                this.selectedCity = d.city_id;
            }
            this.renderData(this.search, this.statuses);
        },
        // Select Supplier Type
        suppliertypeSelected(d) {
            this.supplier_type = null;
            if (d) {
                this.supplier_type = d;
            }
        },
    },
    watch: {
        search: {
            handler: function (val) {
                let that = this;
                clearTimeout(this._timerId);
                this._timerId = setTimeout(function () {
                    that.renderData(val, that.statuses, that.supplier_type ? that.supplier_type.id : "" );
                }, 1000);
            },
            deep: true,
        },
        statuses: {
            handler: function (val) {
                let that = this;
                that.renderData(this.search, val, this.supplier_type ? this.supplier_type.id : "");
            },
            deep: true,
        },
        supplier_type: {
            handler: function (val) {
                this.renderData(
                    this.search,
                    this.statuses,
                    val ? val.id : ""
                );
            },
            deep: true,
        },
        created_date_input: {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(val, "YYYY-MM-DD", true).isValid()
                        if (valid == true) {
                            this.created_date[0] = this.$moment(val).format("YYYY-MM-DD")
                            this.renderData(this.search, this.statuses)
                        }
                    } else if (val.length == 24) {
                        let date1 = val.substr(0,10)
                        let date2 = val.substr(14,23)
                        let valid1 = this.$moment(date1, "YYYY-MM-DD", true).isValid()
                        let valid2 = this.$moment(date2, "YYYY-MM-DD", true).isValid()
                        if (valid1 == true && valid2 == true) {
                            this.created_date[0] = this.$moment(date1).format("YYYY-MM-DD")
                            this.created_date[1] = this.$moment(date2).format("YYYY-MM-DD")
                            if (this.created_date.length == 2) {
                                this.renderData(this.search, this.statuses)
                            }
                        }
                    }
                }
            },
            deep: true
        },
        created_date: {
            handler: function (val) {
                if (val) {
                    this.created_date_input = this.formatDateRange(val)
                }
            },
            deep: true
        },
    },
};
</script>
