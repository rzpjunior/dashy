<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="3">
                    <SelectArea
                        name="filter_area"
                        :aux_data="2"
                        @selected="areaSelected"
                        :norequired="true"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectWarehouse
                        name="filter_warehouse"
                        :aux_data="2"
                        :area_id="SelectArea"
                        :warehouse="warehouse"
                        @selected="warehouseSelected"
                        :norequired="true"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date_model"
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
                                    @click:clear="delivery_date = [],delivery_date_input = ''"
                                    v-model="delivery_date_input"
                                    maxlength="24"
                                    :rules="[rules.required]"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date <span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="delivery_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="delivery_date_model = false, renderWidgets()"
                            >OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectWrt
                      :norequired="true"
                      :area="SelectArea"
                      @selected="wrtSelected"
                      :disabled="disWrt"
                      :dense="true"
                  ></SelectWrt>
                </v-col>
            </v-row>
        </div>
        <div class="mt24 mr12 ml12 wp100">
            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'sls_dash_rd'">
                        <v-row>
                            <v-col cols="12" md="7" class="fs16 bold">
                                <div class="mt6">
                                    Status SO with WRT
                                </div>
                            </v-col>
                            <v-col cols="12" md="5">
                                <div style="border: 1px solid #EBEBEB;box-sizing: border-box;border-radius: 8px;padding: 8px;">
                                    <v-row class="fs14">
                                        <v-col md="6" class="bold">
                                            Total SO
                                        </v-col>
                                        <v-col md="6" class="flex-align-end">
                                            {{ !loaded ? '...' : formatUnitPrice(soWithWRTData.total_so) }}
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <SOwithWRT class="pt-3" v-if="loaded" :chartData="soWithWRTData"></SOwithWRT>
                                <v-progress-linear
                                    v-if="!loaded"
                                    indeterminate
                                    color="green"
                                ></v-progress-linear>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'sls_dash_rd'">
                        <v-row>
                            <v-col cols="12" md="7" class="fs16 bold">
                                <div class="mt6">
                                    Picking &amp; Checking
                                </div>
                            </v-col>
                            <v-col cols="12" md="5">
                                <div style="border: 1px solid #EBEBEB;box-sizing: border-box;border-radius: 8px;padding: 8px;">
                                    <v-row class="fs14">
                                        <v-col md="6" class="bold">
                                            Total SO
                                        </v-col>
                                        <v-col md="6" class="flex-align-end">
                                            {{ !loadedPC ? '...' : formatUnitPrice(pickingAndChecking.total_so) }}
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <picking-checking class="pt-3" v-if="loadedPC" :chartData="pickingAndChecking"></picking-checking>
                                <v-progress-linear
                                    v-if="!loadedPC"
                                    indeterminate
                                    color="green"
                                ></v-progress-linear>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <div v-if="loadingProduct">
                        <v-progress-linear
                            indeterminate
                            height="10"
                            color="#4ABFB2"
                        ></v-progress-linear>
                    </div>
                    <div class="box-col-header" v-if="!loadingProduct">
                        <v-row>
                            <v-col cols="3">
                                Idle Picking
                            </v-col>
                            <v-col cols="2" class="-ml35">
                                <v-tooltip right>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-icon
                                            v-on="{ ...tooltip }"
                                            right
                                            dark
                                        >
                                            mdi-information-outline
                                        </v-icon>
                                    </template>
                                    <span>Can only filter warehouse</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="box-col-body-table" v-if="!loadingProduct">
                        <v-data-table
                            :headers="table.fields"
                            :items="items"
                            :loading="loadingProduct"
                            :items-per-page="5"
                            :hide-default-footer="true"
                            :page="page"
                        >
                            <template v-slot:item="props">
                                <tr style="height:48px">
                                    <td>{{ props.item.staff }}</td>
                                    <td>{{ props.item.warehouse }}</td>
                                    <td>{{ props.item.duration_idle }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                        <hr class="hr-solid mx-3 -mt10">
                        <v-row class="mt-1">
                            <v-col>
                            <v-card-actions class="pb-1 pr-4">
                                <v-spacer></v-spacer>
                                    <v-btn
                                        class="main-btn white--text"
                                        depressed
                                        color="#50ABA3"
                                        @click="page -= 1"
                                        :disabled="disablePrevious"
                                    >Previous</v-btn>
                                    <v-btn
                                        class="main-btn white--text"
                                        depressed
                                        color="#50ABA3"
                                        @click="page += 1"
                                        :disabled="disableNext"
                                    >Next</v-btn>
                            </v-card-actions>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import SOwithWRT from "../../../components/OpsCharts/SOwithWRT.vue";
import PickingChecking from "../../../components/OpsCharts/PickingChecking.vue";

export default {
  components: {SOwithWRT,PickingChecking},
  name: "Operations",
  data() {
        return {
            rules: {
                required: value => !!value || 'Delivery Date is Required!',
            },
            loaded: false,
            loadedPC: false,
            loadingProduct: false,
            disWrt : true,
            area:"",
            warehouse:null,
            SelectArea: '',
            SelectWrt: '',
            SelectWarehouse:'',
            delivery_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
            delivery_date_model : '',
            delivery_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
            items:[],
            page : 1,
            perpage : 5,
            totalData : 0,
            soWithWRTData: {
                labels: [],
                datasets: [
                {
                    label: "Active",
                    backgroundColor: '#7CE363',
                    data: []
                },
                {
                    label: "Cancelled",
                    backgroundColor: '#FF8D8D',
                    data: []
                },
                {
                    label: "Finished",
                    backgroundColor: '#5C93D3',
                    data: []
                },
                {
                    label: "On Delivery",
                    backgroundColor: '#67DAB8',
                    data: []
                },
                ],
                total_so: '',
            },
            pickingAndChecking: {
                labels: [],
                datasets: [
                {
                    label: "New",
                    backgroundColor: '#C6EB93',
                    data: []
                },
                {
                    label: "On Progress",
                    backgroundColor: '#E8EA93',
                    data: []
                },
                {
                    label: "Need Approval",
                    backgroundColor: '#CBBBE9',
                    data: []
                },
                {
                    label: "Picked",
                    backgroundColor: '#7CEBA8',
                    data: []
                },
                {
                    label: "Checking",
                    backgroundColor: '#FBE8AE',
                    data: []
                },
                {
                    label: "Finished",
                    backgroundColor: '#9DDCEF',
                    data: []
                },
                ],
                total_so: '',
            },
            table: {
                fields: [
                    {
                        text:'Lead Picker Name',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Warehouse',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Last Picking',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                ],
            },
            priv: localStorage.getItem('priv'),
            modeDesktop: null,
            loading: false,
        };
  },
  methods: {
    renderPicking(){
        let warehouse = ''
        if (this.SelectWarehouse) {
            warehouse = this.SelectWarehouse
        }
        this.loadingProduct = true
        this.$http.get("dashboard/operation/idle-picker",{params: {
            warehouse: warehouse,
        }})
        .then(res =>{
            this.loadingProduct = false
            let item = res.data.data
            this.items = []
            if(item === null){
                this.totalData = 0
                this.items = []
            } else {
                this.items = item
                this.totalData = res.data.data.length
            }
        })
    },
    //to render widget so with wrt
    async renderWidgets() {
        if (this.priv.includes('sls_dash_rd')) {
            this.loaded = false
            this.loadedPC = false
            let warehouse = ''
            if (this.SelectWarehouse) {
                warehouse = this.SelectWarehouse
            }
            let area = ''
            if (this.SelectArea) {
                area = this.SelectArea
            }
            let wrt = ''
            if (this.SelectWrt) {
                wrt = this.SelectWrt
            }
            let delivery_date = 'null'
            if (this.delivery_date.length > 0) {
                if (this.delivery_date.length == 1) {
                    delivery_date = this.delivery_date[0]+'|'+this.delivery_date[0]
                } else {
                    let date = this.delivery_date[0]
                    let date2 = this.delivery_date[1]
                    if (date > date2) {
                        delivery_date = date2+'|'+date
                    } else {
                        delivery_date = date+'|'+date2
                    }
                }
            }
            const url = "dashboard/operation/so-wrt"
            await this.$http.get(url, {
            params: {
                area: area,
                warehouse: warehouse,
                delivery_date: delivery_date,
                wrt: wrt,
                type_request: 'sales_order'
            }
            }).then(response => {
                //to clear data before render the response
                this.soWithWRTData.datasets[0].data = []
                this.soWithWRTData.datasets[1].data = []
                this.soWithWRTData.datasets[2].data = []
                this.soWithWRTData.datasets[3].data = []
                //render response to chart
                this.soWithWRTData.datasets[0].data.push(response.data.data.grand_total_active)
                this.soWithWRTData.datasets[1].data.push(response.data.data.grand_total_cancelled)
                this.soWithWRTData.datasets[2].data.push(response.data.data.grand_total_finished)
                this.soWithWRTData.datasets[3].data.push(response.data.data.grand_total_on_delivery)
                this.soWithWRTData.total_so = response.data.data.grand_total_so
                //finished loading
                this.loaded = true
            });
            await this.$http.get(url, {
            params: {
                area: area,
                warehouse: warehouse,
                delivery_date: delivery_date,
                wrt: wrt,
                type_request: 'picking_order'
            }
            }).then(res => {
                //to clear data before render the response
                this.pickingAndChecking.datasets[0].data = []
                this.pickingAndChecking.datasets[1].data = []
                this.pickingAndChecking.datasets[2].data = []
                this.pickingAndChecking.datasets[3].data = []
                this.pickingAndChecking.datasets[4].data = []
                this.pickingAndChecking.datasets[5].data = []
                //render response to chart
                this.pickingAndChecking.datasets[0].data.push(res.data.data.new)
                this.pickingAndChecking.datasets[1].data.push(res.data.data.on_progress)
                this.pickingAndChecking.datasets[2].data.push(res.data.data.need_approval)
                this.pickingAndChecking.datasets[3].data.push(res.data.data.picked)
                this.pickingAndChecking.datasets[4].data.push(res.data.data.checking)
                this.pickingAndChecking.datasets[5].data.push(res.data.data.finished)
                this.pickingAndChecking.total_so = res.data.data.total_so
                //finished loading
                this.loadedPC = true
            });
        }
    },
    //for check maintenance
    checkMaintenance() {
      this.$http.get('/auth/checkmaintenance').then((response) => {
        return response
      })
    },
    //for filter area
    areaSelected(d) {
        this.SelectArea = ""
        this.area = ""
        this.SelectWarehouse = ''
        this.warehouse = null
        this.SelectWrt = ""
        this.disWrt = true
        if (d) {
          this.disWrt = false
          this.SelectArea = d.id
        }
        this.renderWidgets()
    },
    //for filter warehouse
    warehouseSelected(d) {
        this.SelectWarehouse = ''
        this.warehouse = null
        if (d) {
            this.SelectWarehouse = d.id
            this.warehouse = d
        }
        this.renderWidgets()
        this.renderPicking()
    },
    //for filter wrt
    wrtSelected(d) {
        this.SelectWrt = ""
        if (d) {
          this.SelectWrt = d.id
        }
        this.renderWidgets()
    },
  },
  mounted() {
    let that = this
    this.renderWidgets()
    this.renderPicking()
    setInterval(function () { that.renderWidgets(), that.renderPicking() },60000);
    this.checkMaintenance()
    window.onresize = () => {
      this.modeDesktop = window.screen.width > 1024;
    }
  },
  created() {
    this.modeDesktop = window.screen.width > 1024;
  },
  computed: {
    staff() {
      return this.$store.getters.getStaff
    },
    //For watch disable button Previous
    disablePrevious() {
        if (this.page == 1) {
            return true
        } else {
            return false
        }
    },
    //For watch disable button Next
    disableNext() {
        if (this.totalData <= (this.page*this.perpage)) {
            return true
        } else {
            return false
        }
    },
  },
  //watch delivery date range
  watch: {
    'delivery_date_input': {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                        if (valid == true) {
                            this.delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')
                        }
                    } else if (val.length == 24) {
                        let date1 = val.substr(0,10)
                        let date2 = val.substr(14,23)
                        let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                        let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                        if (valid1 == true && valid2 == true) {
                            if (this.delivery_date.length == 2) {
                                let date3 = new Date(this.delivery_date[0])
                                let date4 = new Date(this.delivery_date[1])
                                if (parseInt((date4-date3)/(24*3600*1000)) > 7 || parseInt((date4-date3)/(24*3600*1000)) < -7) {
                                    if (date4 < date3) {
                                        this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.delivery_date.splice(1,1)
                                    }
                                }
                            }
                        }
                    }
                }
            },
            deep: true
        },
        'delivery_date': {
            handler: function (val) {
                if (val) {
                    this.delivery_date_input = this.formatDateRange(val)
                }
            },
            deep: true
        },
    },
};
</script>