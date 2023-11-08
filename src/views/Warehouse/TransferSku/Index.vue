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
                        <span>Search by transfer sku code </span>
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
                        :items="regStatus"
                        item-text="text"
                        item-value="value"
                        label="Status"
                        dense
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        @selected="warehouseSelected"
                        :label="'Warehouse'"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="transfer_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="filter_transfer_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    @click:clear="
                                        (transfer_date = []),
                                            (transfer_date_input = ''),
                                            renderData(search, statuses)
                                    "
                                    v-model="transfer_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label> Date </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="transfer_date"
                            @input="
                                (transfer_date_model = false),
                                    renderData(search, statuses)
                            "
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'TransferSKUCreate' }"
                        class="no-caps bold"
                        v-privilege="'tfs_crt'"
                    >
                        <span class="text-white"> Create Transfer SKU </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :items-per-page="10"
                :loading="loading"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>{{ props.item.code }}</td>
                        <td>
                            {{ formatPrice(props.item.total_discrepancy) }}
                        </td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip :color="statusMaster('active')"
                                    ><span class="pa-md-2">Active</span></v-chip
                                >
                            </div>
                            <div v-if="props.item.status == 2">
                                <v-chip :color="statusMaster('finished')"
                                    >Finished</v-chip
                                >
                            </div>
                            <div v-if="props.item.status == 3">
                                <v-chip :color="statusMaster('cancelled')"
                                    >Cancelled</v-chip
                                >
                            </div>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <template>
                                        <v-btn icon v-on="{ ...menu }">
                                            <v-icon dark
                                                >mdi-dots-vertical</v-icon
                                            ></v-btn
                                        >
                                    </template>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item
                                        v-privilege="'tfs_rdd'"
                                        :to="{
                                            name: 'TransferSKUDetail',
                                            params: { id: props.item.id },
                                        }"
                                    >
                                        <v-list-item-title>
                                            Detail
                                        </v-list-item-title>
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
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>
<script>
export default {
    name: "TransferSKUList",
    data() {
        return {
            id: "",
            search: "",
            filter: false,
            loading: false,
            SelectWarehouse: "",
            items: [],
            ConfirmData: {},
            transfer_date_model: "",
            transfer_date_input: new Date(Date.now() + 3600 * 1000 * 7)
                .toISOString()
                .substr(0, 10),
            transfer_date: [
                new Date(Date.now() + 3600 * 1000 * 7)
                    .toISOString()
                    .substr(0, 10),
            ],
            statuses: 999,
            regStatus: [
                {
                    text: "All Status",
                    value: 999,
                },
                {
                    text: "Active",
                    value: 1,
                },
                {
                    text: "Finished",
                    value: 2,
                },
                {
                    text: "Cancelled",
                    value: 3,
                },
            ],
            table: {
                fields: [
                    {
                        text: "Transfer SKU Code",
                        width: "30%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Balance(Kg)",
                        width: "30%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Status",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                ],
            },
        };
    },
    mounted() {
        this.renderData("", this.statuses);
    },
    methods: {
        // get list & filter berdasarkan pencarian code, status, date, & warehouse
        renderData(search, statuses) {
            this.loading = true;
            if (statuses === 999) {
                statuses = "";
            } else {
                statuses = "|status:" + statuses;
            }
            let returnDate = "";
            if (this.transfer_date.length > 0) {
                if (this.transfer_date.length == 1) {
                    returnDate = "|recognition_date:" + this.transfer_date[0];
                } else {
                    let date = this.transfer_date[0];
                    let date2 = this.transfer_date[1];
                    if (date > date2) {
                        returnDate =
                            "|recognition_date.gte:" +
                            date2 +
                            "|recognition_date.lte:" +
                            date;
                    } else {
                        returnDate =
                            "|recognition_date.gte:" +
                            date +
                            "|recognition_date.lte:" +
                            date2;
                    }
                }
            }
            let warehouse = "";
            if (this.SelectWarehouse) {
                warehouse = "|warehouse.id.e:" + this.SelectWarehouse;
            }
            this.items = [];
            this.$http
                .get("/warehouse/transfer_sku", {
                    params: {
                        perpage: 100,
                        conditions:
                            "code.icontains:" +
                            search +
                            returnDate +
                            warehouse +
                            statuses,
                        orderby: "-id",
                    },
                })
                .then((res) => {
                    this.items = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // untuk warehouse yang dipilih
        warehouseSelected(d) {
            this.SelectWarehouse = "";
            if (d) {
                this.SelectWarehouse = d.id;
            }
            this.renderData(this.search, this.statuses);
        },
        // confirm ubah status transfer sku
        confirm(id) {
            this.ConfirmData = {
                model: true,
                status: true,
                title: "Confirm Transfer SKU",
                text: "Are you sure to confirm this Transfer SKU? Stock will be updated",
                urlApi: "warehouse/transfer_sku/confirm/" + id,
                data: {},
            };
        },
    },
    watch: {
        // debounce search transfer list by code
        search: {
            handler: function (val) {
                let that = this;
                clearTimeout(this._timerId);
                this._timerId = setTimeout(function () {
                    that.renderData(val, that.statuses);
                }, 500);
            },
            deep: true,
        },
        // filter by status ketika ada perubahan status
        statuses: {
            handler: function (val) {
                let that = this;
                that.renderData(this.search, val);
            },
            deep: true,
        },
        // filter by date ketika ada perubahan date dari inputan user
        transfer_date_input: {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(
                            val,
                            "YYYY-MM-DD",
                            true
                        ).isValid();
                        if (valid == true) {
                            this.transfer_date[0] =
                                this.$moment(val).format("YYYY-MM-DD");
                            this.renderData(this.search, this.statuses);
                        }
                    } else if (val.length == 24) {
                        let date1 = val.substr(0, 10);
                        let date2 = val.substr(14, 23);
                        let valid1 = this.$moment(
                            date1,
                            "YYYY-MM-DD",
                            true
                        ).isValid();
                        let valid2 = this.$moment(
                            date2,
                            "YYYY-MM-DD",
                            true
                        ).isValid();
                        if (valid1 == true && valid2 == true) {
                            this.transfer_date[0] =
                                this.$moment(date1).format("YYYY-MM-DD");
                            this.transfer_date[1] =
                                this.$moment(date2).format("YYYY-MM-DD");
                            if (this.transfer_date.length == 2) {
                                this.renderData(this.search, this.statuses);
                            }
                        }
                    }
                }
            },
            deep: true,
        },
        // filter by date ketika ada perubahan date yang dipilih
        transfer_date: {
            handler: function (val) {
                if (val) {
                    this.transfer_date_input = this.formatDateRange(val);
                }
            },
            deep: true,
        },
    },
};
</script>