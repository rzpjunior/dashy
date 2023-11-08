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
                    <SelectWarehouse
                        :aux_data="2"
                        :warehouse="warehouse"
                        :dense="true"
                        @selected="warehouseSelected"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="forecast_date_model"
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
                                    clearable
                                    @click:clear="(forecast_date = []), (forecast_date_input = '')"
                                    v-model="forecast_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Forecast Date
                                        <span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker v-model="forecast_date_input" scrollable>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCategory
                        :norequired="true"
                        v-model="categories"
                        @selected="categorySelected"
                        :category="categories"
                        :dense="true"
                    ></SelectCategory>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        @click="(modelForecastDemand = true), (clear1 = false)"
                        class="no-caps bold"
                        v-privilege="'frc_dmd_upd'"
                    >
                        <span class="text-white"> Update Forecast Demand </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td> {{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td class="ctr">{{ props.item.product.uom.name }}</td>
                        <td>{{ props.item.product.category.name }}</td>
                        <td>{{ props.item.warehouse.code }} - {{ props.item.warehouse.name }}</td>
                        <td class="ctr">{{ props.item.forecast_qty }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <!-- Dialog -->
        <v-dialog v-model="modelForecastDemand" persistent max-width="900px">
            <v-card class="OpenSans">
                <v-overlay :value="overlay" :z-index="12">
                    <v-progress-circular
                        indeterminate
                        size="84"
                        color="green"
                        width="15"
                    ></v-progress-circular>
                </v-overlay>
                <v-card-title>
                    <div class="flex-row-between full-width">
                        <div class="text-title-modal">
                            Update Forecast Demand
                        </div>
                        <v-btn icon @click="closeModal()" class="mt4">
                            <v-img
                                src="/icon/close-new.png"
                                max-height="24px"
                                max-width="24px"
                            ></v-img>
                        </v-btn>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-alert
                        color="#2A89A7"
                        dark
                        outlined
                    >
                        <v-icon color="#2A89A7" class="-mt3">mdi-alert-circle-outline</v-icon> 
                        Please follow the step to upload Forecast Demand
                    </v-alert>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col
                                    class="border-r-1 border-dashed border-r-lightgrey flex-justify-between"
                                    cols="12"
                                    md="4"
                                >
                                    <div>
                                        <div>Step 1. Download Template</div>
                                        <div class="text-black60 mb20">
                                            Download template based on filters
                                        </div>
                                        <SelectWarehouse
                                            :aux_data="2"
                                            :clear="clear1"
                                            :warehouse="warehouse_download"
                                            @selected="warehouseSelectedDownload"
                                            :dense="true"
                                        ></SelectWarehouse>
                                        <v-menu
                                            ref="menu"
                                            v-model="forecast_date_model_download"
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
                                                        @click:clear="(forecast_date_download = []), (forecast_date_input_download = '')"
                                                        v-model="forecast_date_input_download"
                                                        dense
                                                    >
                                                        <template v-slot:label>
                                                            Forecast Date
                                                            <span class="text-red">*</span>
                                                        </template>
                                                    </v-text-field>
                                                </div>
                                            </template>
                                            <v-date-picker
                                                range
                                                v-model="forecast_date_download"
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    text
                                                    color="primary"
                                                    @click="forecast_date_model_download = false"
                                                    >OK</v-btn
                                                >
                                            </v-date-picker>
                                        </v-menu>
                                        <SelectCategory
                                            :norequired="true"
                                            @selected="categorySelectedDownload"
                                            :category="categories_download"
                                            :clear="clear1"
                                            :dense="true"
                                        ></SelectCategory>
                                    </div>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            :disabled="disableDownloadFilter"
                                            depressed
                                            color="#50ABA3"
                                            @click="downloadForecastDemand()"
                                            class="main-btn white--text"
                                        >
                                            Download
                                        </v-btn>
                                    </v-card-actions>
                                </v-col>
                                <v-col
                                    class="border-r-1 border-dashed border-r-lightgrey"
                                    cols="12"
                                    md="4"
                                >
                                    <div>Step 2. Update Template</div>
                                    <div class="text-black60">
                                        Update with spreadsheet application
                                    </div>
                                    <v-img
                                        width="250px"
                                        class="mt-4 ml-6"
                                        src="/img/worktime_new.png"
                                        alt=""
                                    />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div>
                                        Step 3. Upload File
                                        <span class="text-red">*</span>
                                    </div>
                                    <div class="text-black60">
                                        Forecast Data will be updated based on file
                                    </div>
                                    <div class="mt10">
                                        <UploadExcel
                                            @onSelect="onSelectForecastDemand"
                                            @onDelete="onDeleteForecastDemand"
                                            :error="error.item_upload_assign"
                                        ></UploadExcel>
                                    </div>
                                    <v-card-actions class="mt5">
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            @click="uploadForecastDemand()"
                                            :disabled="uploadDis1"
                                            class="main-btn white--text"
                                            depressed
                                            color="#50ABA3"
                                        >
                                            Upload
                                        </v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    name: "ForecastDemand",
    data() {
        return {
            search: "",
            filter: false,
            loading: false,
            uom: null,
            table: {
                fields: [
                    {
                        text: "Product",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "UOM",
                        align: "center",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Category",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Warehouse",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Forecast Demand",
                        sortable: false,
                        align: "center",
                        class: "grey--text text--darken-4",
                    },
                ],
            },
            items: [],
            forecast_date_input: new Date(Date.now() + 3600 * 1000 * 7).toISOString().substr(0, 10),
            forecast_date_model: "",
            forecast_date: [new Date(Date.now() + 3600 * 1000 * 7).toISOString().substr(0, 10),],
            forecast_date_input_download: new Date(Date.now() + 3600 * 1000 * 7).toISOString().substr(0, 10),
            forecast_date_model_download: "",
            forecast_date_download: [new Date(Date.now() + 3600 * 1000 * 7).toISOString().substr(0, 10),],
            warehouse: "",
            warehouse_download: "",
            categories: "",
            categories_download: "",
            overlay: false,
            modelForecastDemand: false,
            error: {},
            absolute: true,
            uploadDis1: true,
            clear1: false,
            forecast_demand_upload: [],
        };
    },
    mounted() {
        this.renderData(this.search);
    },
    computed: {
        disableDownloadFilter() {
            if (this.warehouse_download && this.forecast_date_input_download) {
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        // For select warehouse filter
        warehouseSelected(d) {
            this.warehouse = null;
            if (d) {
                this.warehouse = d;
            }
            this.renderData(this.search);
        },
        // For select categories filter
        categorySelected(d) {
            this.categories = null;
            if (d) {
                this.categories = d;
            }
            this.renderData(this.search);
        },
        // For select warehouse filter on download
        warehouseSelectedDownload(d) {
            this.warehouse_download = null;
            if (d) {
                this.warehouse_download = d;
            }
        },
        // For select categories filter on download
        categorySelectedDownload(d) {
            this.categories_download = null;
            if (d) {
                this.categories_download = d;
            }
        },
        // For download excel Forecast Demand
        downloadForecastDemand() {
            let warehouse = "";
            if (this.warehouse_download) {
                warehouse = "warehouse.id.e:" + this.warehouse_download.id;
            }
            let category = "";
            if (this.categories_download) {
                category = "|product.category.id.e:" + this.categories_download.id;
            }
            let forecast_date = "";
            if (this.forecast_date_download.length > 0) {
                if (this.forecast_date_download.length == 1) {
                    let date = this.forecast_date_download[0];
                    forecast_date = "|forecast_date.between:" + date + "." + date;
                } else {
                    let date = this.forecast_date_download[0];
                    let date2 = this.forecast_date_download[1];
                    if (date > date2) {
                        forecast_date = "|forecast_date.between:" + date2 + "." + date;
                    } else {
                        forecast_date = "|forecast_date.between:" + date + "." + date2;
                    }
                }
            }
            this.overlay = true;
            this.$http
                .get("/purchase/forecast_demand?export=1", {
                    params: {
                        embeds: "product,product.uom,product.category,warehouse",
                        conditions: warehouse + category + forecast_date,
                    },
                })
                .then((response) => {
                    this.overlay = false;
                    window.location.href = response.data.file;
                });
        },
        // For delete file excel
        onDeleteForecastDemand(ev) {
            this.forecast_demand_upload = [];
            this.uploadDis1 = true;
        },
        // For select file excel
        onSelectForecastDemand(file) {
            this.overlay = true;
            this.forecast_demand_upload = [];
            file.forEach((item, i) => {
                var x = 0;
                for (var obj in item) {
                    if (x > 6) {
                        let value = {};
                        value.warehouse_code = String(item.Warehouse_Code);
                        value.product_code = String(item.Product_Code);
                        value.forecast_date = String(obj);
                        value.forecast_qty = parseFloat(item[obj]);
                        this.forecast_demand_upload.push(value);
                    }
                    x++;
                }
                if (i == file.length - 1) {
                    this.overlay = false;
                    this.uploadDis1 = false;
                }
            });
        },
        // For select upload excel
        uploadForecastDemand() {
            this.overlay = true;
            let data = {
                data: this.forecast_demand_upload,
            };
            this.$http.put("/purchase/forecast_demand", data).then((response) => {
                this.$toast.open({
                    position: "top-right",
                    message: "Data has been updated successfully",
                    type: "success",
                });
                this.closeModal();
                this.overlay = false;
                this.error = {};
                this.renderData(this.search);
            }).then(() => {
                this.clear1 = true;
            }).catch((e) => {
                this.overlay = false;
                this.error = e.errors;
            });
        },
        // For clear filter donwload
        closeModal() {
            this.modelForecastDemand = false;
            this.clear1 = true;
            this.warehouse_download = "";
            this.categories_download = "";
            (this.forecast_date_download = [new Date(Date.now() + 3600 * 1000 * 7).toISOString().substr(0, 10),]),
                (this.forecast_date_input_download = new Date(Date.now() + 3600 * 1000 * 7).toISOString().substr(0, 10));
        },
        // For get data index
        renderData(search) {
            let warehouse = "";
            if (this.warehouse) {
                warehouse = "|warehouse.id.e:" + this.warehouse.id;
            }
            let category = "";
            if (this.categories) {
                category = "|product.category.id.e:" + this.categories.id;
            }
            let forecast_date = "";
            if (this.forecast_date.length > 0) {
                forecast_date = "|forecast_date.between:" + this.forecast_date[0] + "." + this.forecast_date[0];
            }
            this.items = [];
            this.loading = true;
            this.$http.get("/purchase/forecast_demand", {
                params: {
                    perpage: 1000,
                    orderby: "id",
                    embeds: "product,product.uom,product.category,warehouse",
                    conditions:
                        "Or.product.name.icontains:" +
                        search +
                        "%2COr.product.code.icontains:" +
                        search +
                        warehouse +
                        category +
                        forecast_date,
                },
            }).then((response) => {
                this.loading = false;
                this.items = response.data.data;
                if (this.items === null) {
                    this.items = [];
                }
            });
        },
    },
    watch: {
        search: {
            handler: function (val) {
                let that = this;
                clearTimeout(this._timerId);
                this._timerId = setTimeout(function () {
                    that.renderData(val);
                }, 1000);
            },
            deep: true,
        },
        forecast_date_input: {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(val, "YYYY-MM-DD", true).isValid();
                        if (valid == true) {
                            this.forecast_date[0] = this.$moment(val).format("YYYY-MM-DD");
                            this.renderData(this.search);
                        }
                    }
                }
            },
            deep: true,
        },
        forecast_date: {
            handler: function (val) {
                if (val) {
                    this.forecast_date_input = this.formatDateRange(val);
                }
            },
            deep: true,
        },
        forecast_date_input_download: {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(val, "YYYY-MM-DD", true).isValid();
                        if (valid == true) {
                            this.forecast_date_download[0] = this.$moment(val).format("YYYY-MM-DD");
                        }
                    } else if (val.length == 24) {
                        let date1 = val.substr(0, 10);
                        let date2 = val.substr(14, 23);
                        let valid1 = this.$moment(date1, "YYYY-MM-DD", true).isValid();
                        let valid2 = this.$moment(date2, "YYYY-MM-DD", true).isValid();
                        if (valid1 == true && valid2 == true) {
                            if (this.forecast_date_download.length == 2) {
                                let date3 = new Date(this.forecast_date_download[0]);
                                let date4 = new Date(this.forecast_date_download[1]);
                                if (parseInt((date4 - date3) / (24 * 3600 * 1000)) > 6 || parseInt((date4 - date3) / (24 * 3600 * 1000)) < -6) {
                                    if (date4 < date3) {
                                        this.forecast_date_download[0] = this.$moment(date3).format("YYYY-MM-DD");
                                        this.forecast_date_download.splice(1, 1);
                                    } else {
                                        this.forecast_date_download[0] = this.$moment(date3).format("YYYY-MM-DD");
                                        this.forecast_date_download.splice(1, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            deep: true,
        },
        forecast_date_download: {
            handler: function (val) {
                if (val) {
                    this.forecast_date_input_download = this.formatDateRange(val);
                }
            },
            deep: true,
        },
    },
};
</script>
