<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" md="1">
                    <v-img
                        width="64px"
                        height="64px"
                        src="img/ava_home_user.png"
                    ></v-img>
                </v-col>
                <v-col cols="12" md="11" class="flex-justify-center fs20 bold">
                    Welcome {{ staff.display_name }}!
                </v-col>
            </v-row>
        </div>
        <div class="box" v-privilege="'sls_dash_rd'">
            <v-row>
                <v-col cols="12" md="5">
                    <div class="fs16 bold">
                        Sales Summary 
                        <v-tooltip right>
                            <template v-slot:activator="{ on: tooltip }">
                                <v-icon
                                    v-on="{ ...tooltip }"
                                    dark
                                    right
                                >
                                    mdi-information-outline
                                </v-icon>
                            </template>
                            <span>Sales of the month</span>
                        </v-tooltip>
                    </div>
                    <div class="fs14">
                        {{ selectedDate == null ? currentDate : selectedDate }}
                    </div>
                </v-col>
                <v-col cols="12" md="3" class="h80">
                    <v-select
                        v-model="months"
                        outlined
                        label="Months"
                        dense
                        :items="monthsItems"
                        v-privilege="'sls_dash_fil'"
                        clearable
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="h80">
                    <v-select
                        v-model="years"
                        outlined
                        label="Years"
                        dense
                        :items="yearsItems"
                        v-privilege="'sls_dash_fil'"
                        clearable
                    ></v-select>
                </v-col>
                <v-col cols="12" md="1">
                    <button
                        :disabled="searchDisable"
                        @click="search"
                        class="btn-search-home"
                    >
                        <v-icon color="white"> search </v-icon>
                    </button>
                </v-col>
            </v-row>
            <v-row class="hr-title" />
            <v-row>
                <v-col cols="12" md="12">
                    <v-card>
                        <v-progress-linear
                            v-if="!loaded"
                            indeterminate
                            color="#50ABA3"
                        ></v-progress-linear>
                    </v-card>
                    <line-chart
                        class="pt-3"
                        v-if="loaded"
                        :chartData="chartData"
                    ></line-chart>
                </v-col>
            </v-row>
        </div>
        <div class="ma12 wp100" v-privilege="'sls_dash_rd'">
            <v-row>
                <v-col cols="12" md="4">
                    <div class="box-col24">
                        <v-row class="text-secondary" v-if="!comload">
                            <v-col cols="12" md="10"> Transaction </v-col>
                            <v-col cols="12" md="2" class="flex-align-end">
                                <img
                                    src="icon/new/buy.svg"
                                    alt="icon buy"
                                    height="26px"
                                    width="26px"
                                />
                            </v-col>
                        </v-row>
                        <v-row v-if="!comload">
                            <v-col class="flex-align-end fs24 bold">
                                {{ formatNumberTransaction(total_transaction) }}
                            </v-col>
                        </v-row>
                        <v-card>
                            <v-progress-linear
                                v-if="comload"
                                indeterminate
                                color="#50ABA3"
                            ></v-progress-linear>
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="12" md="4">
                    <div class="box-col24">
                        <v-row class="text-secondary" v-if="!comload">
                            <v-col cols="12" md="10"> Total Price (Rp) </v-col>
                            <v-col cols="12" md="2" class="flex-align-end">
                                <img
                                    src="icon/new/subtract.svg"
                                    alt="icon subtract"
                                    height="26px"
                                    width="26px"
                                />
                            </v-col>
                        </v-row>
                        <v-row v-if="!comload">
                            <v-col class="flex-align-end fs24 bold">
                                {{ formatPrice(total_charge) }}
                            </v-col>
                        </v-row>
                        <v-card>
                            <v-progress-linear
                                v-if="comload"
                                indeterminate
                                color="#50ABA3"
                            ></v-progress-linear>
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="12" md="4">
                    <div class="box-col24">
                        <v-row class="text-secondary" v-if="!comload">
                            <v-col cols="12" md="10"> Tonnage (Kg) </v-col>
                            <v-col cols="12" md="2" class="flex-align-end">
                                <img
                                    src="icon/new/weight.svg"
                                    alt="icon weight"
                                    height="26px"
                                    width="26px"
                                />
                            </v-col>
                        </v-row>
                        <v-row v-if="!comload">
                            <v-col class="flex-align-end fs24 bold">
                                {{ formatNumber(total_weight) }}
                            </v-col>
                        </v-row>
                        <v-card>
                            <v-progress-linear
                                v-if="comload"
                                indeterminate
                                color="#50ABA3"
                            ></v-progress-linear>
                        </v-card>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-title bg-linier text-white" v-privilege="'sls_dash_rd'">
            <div class="fs16 bold">
                Top Products
                <v-tooltip right color="black">
                    <template v-slot:activator="{ on: tooltip }">
                        <v-icon v-on="{ ...tooltip }" color="white" right>
                            mdi-information-outline
                        </v-icon>
                    </template>
                    <span>Product sold with highest revenue</span>
                </v-tooltip>
            </div>
            <div class="fs14">
                {{ selectedDate == null ? currentDate : selectedDate }}
            </div>
        </div>
        <div class="box-body-table" v-privilege="'sls_dash_rd'">
            <v-data-table
                :headers="table.fields"
                :mobile-breakpoint="0"
                :items="items"
                :loading="loading"
                :items-per-page="5"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>{{ props.item.name }}</td>
                        <td>{{ formatPrice(props.item.total) }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <NotifRevamp :page="'home'" />
    </v-container>
</template>
<script>
import LineChart from "../components/LineChart.vue";

export default {
    components: { LineChart },
    name: "Home",
    data() {
        return {
        priv: localStorage.getItem("priv"),
        loaded: false,
        chartData: {
            labels: [],
            datasets: [
            {
                label: "Total Price",
                fill: false,
                borderColor: "#8DC53F",
                borderWidth: 3,
                data: [],
            },
            ],
        },
        modeDesktop: null,
        months: null,
        years: null,
        selectedDate: null,
        comload: false,
        absolute: true,
        loading: false,
        opacity: 0.1,
        total_transaction: "",
        total_charge: "",
        total_weight: "",
        currentDate: null,
        monthsItems: [],
        yearsItems: [],
        table: {
            fields: [
            {
                text: "Product Name",
                class: "grey--text text--darken-4",
                sortable: false,
            },
            {
                text: "Product Revenue",
                class: "grey--text text--darken-4",
                sortable: false,
            },
            ],
        },
        items: [],
        };
    },
    methods: {
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace(".", ",");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        formatNumber(value) {
            let val = (value / 1).toFixed(2).replace(".", ".");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        formatNumberTransaction(value) {
            let val = (value / 1).toFixed(0).replace(".", ".");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        async search() {
            if (this.priv.includes("sls_dash_rd")) {
                this.comload = true;
                this.loading = true;
                this.loaded = false;
                const dates = this.months + "-" + this.years;
                this.selectedDate =
                this.monthsItems[this.months - 1].text + " " + this.years;
                this.items = [];
                this.$http
                .get("/dashboard/overview", {
                    params: {
                        date: dates,
                    },
                })
                .then((response) => {
                    if (response) {
                        this.total_transaction = response.data.data.total_transaction;
                        this.total_charge = response.data.data.total_charge;
                        this.total_weight = response.data.data.total_weight;
                        this.comload = false;
                        this.items = response.data.data.top_revenue;
                        this.loading = false;
                        if (this.items === null) {
                            this.items = [];
                        }
                    }
                });

                this.$http
                .get("/dashboard/graph", {
                    params: {
                        date: dates,
                    },
                })
                .then((response) => {
                    if (response) {
                        let arr = response.data.data;
                        this.chartData.labels = [];
                        this.chartData.datasets[0].data = [];
                        for (let i = 0; i < arr.length; i++) {
                            if (response.data.data.length > 0) {
                                this.chartData.labels.push(response.data.data[i].day);
                                this.chartData.datasets[0].data.push(
                                    response.data.data[i].total_price
                                );
                            }
                        }
                        this.loaded = true;
                        this.comload = false;
                    }
                });
            }
        },
        checkMaintenance() {
            this.$http.get("/auth/checkmaintenance").then((response) => {
                return response;
            });
        },
        dateNow() {
            const today = new Date();
            const y = today.getFullYear();
            const m = today.toLocaleString("default", { month: "long" });
            this.currentDate = m + " " + y;
            this.months = today.getMonth() + 1;
            this.years = y;
            this.search();
        },
        getOptionDate() {
            for (let i = 0; i < 12; i++) {
                this.monthsItems.push({
                    text: this.$moment().month(i).format("MMMM"),
                    value: i + 1,
                });
            }
            const today = new Date();
            const y = today.getFullYear();
            for (let i = 2019; i <= y; i++) {
                this.yearsItems.push({ text: String(i), value: i });
            }
        },
    },
    mounted() {
        this.getOptionDate();
        this.checkMaintenance();
        this.dateNow();
        window.onresize = () => {
            this.modeDesktop = window.screen.width > 1024;
        };
    },
    created() {
        this.modeDesktop = window.screen.width > 1024;
    },
    computed: {
        searchDisable() {
            return !(this.months && this.years);
        },
        staff() {
            return this.$store.getters.getStaff;
        },
    },
    };
</script>
