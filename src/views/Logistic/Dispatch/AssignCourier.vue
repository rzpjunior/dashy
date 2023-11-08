<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectVendor
                        name="vendor"
                        @selected="vendorSelected"
                        :dense="true"
                    ></SelectVendor>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                                    dense
                                    readonly
                                    @click:clear="delivery_date = '',renderData(search)"
                                    v-model="delivery_date"

                                >
                                    <template v-slot:label>
                                        Delivery Date <span style="color:red;">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            persistent-hint
                            v-model="delivery_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="delivery_date_model = false,renderData(search)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCourier
                        name="courier"
                        @selected="courierSelected"
                        :vendor_id="SelectVendor"
                        :disabled="disableCourier"
                        :dense="true"
                    ></SelectCourier>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="koliweight"
                        v-model="koliWeightTotal"
                        required
                        outlined
                        disabled
                        dense
                    >
                        <template v-slot:label>
                            Koli &amp; Weight Total
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
        </div>
        <hr>
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
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
                       <span>Search by SO Code, Customer, Checker, Planning name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>          
        <div class="box-header-table">
            Assign Courier
        </div>
        <div class="box-body-table">
            <v-data-table
            :headers="table.fields"
            :items="items"
            :loading="loading"
            :items-per-page="10"
        >
            <template v-slot:item="props">
                <tr>
                    <td>{{ props.item.sales_order.code }}</td>
                    <td>{{ props.item.sales_order.branch.merchant.name }} <br>
                        <span class="second-color">{{ props.item.sales_order.shipping_address }}</span>
                    </td>
                    <td>{{ props.item.helper.name }}</td>
                    <td v-if=" props.item.planning_vendor !== ''">
                        {{ props.item.planning_vendor }}
                    </td>
                    <td v-else> - </td>
                    <td v-if="props.item.checked_by.name !== ''">{{ props.item.checked_by.name }}</td>
                    <td v-else> - </td>
                    <td>{{ props.item.total_koli }} / {{ props.item.sales_order.total_weight }} KG</td>
                    <td>
                        <div v-if="assigned = true && props.item.courier.name !== ''">
                            <v-row>
                                <div style="margin-top:7px;">{{props.item.courier.name}}</div>
                                <v-btn  
                                    icon
                                    @click="removeCourier(props.item.sales_order.id,props.item.id)"
                                >
                                    <v-img src="/icon/close-2.png" max-height="20px" max-width="20px"></v-img>
                                </v-btn>
                            </v-row>
                             
                        </div>
                        <v-btn
                            v-else
                            class="ma-2"
                            style="background: #768f9c; color:white;"
                            :loading="loadingAddCourier"
                            :disabled="disableAddCourier"
                            @click="addCourier(props.item.sales_order.id,props.item.id)"
                        >
                        <v-icon dark>
                            mdi-plus
                        </v-icon>
                        <template v-slot:loader>
                            <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                            </span>
                        </template>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        </div>
    </v-container>
</template>
<style scoped>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
<script>
    import Vue from 'vue'
    export default {
        name: 'AssignCourier',
        data () {
            return {
                loadingAddCourier: false,
                delivery_date_model: "",
                delivery_date: "",
                assigned: false,
                disableAddCourier: true,
                disableCourier: true,
                table: {
                    fields: [
                        {
                            text:'Sales Order Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Customer',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Picker',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Planning',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Checker',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Koli/Weight',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Courier',
                            class: 'grey--text text--darken-4',
                            width:'15%',
                            sortable: false
                        },
                    ],
                },
                items:[],
                area : '',
                warehouse : '',
                loading: false,
                SelectCourier: '',
                SelectVendor: '',
                vendor_id: '',
                search: '',
                courier_name: '',
                koliWeightTotal: '',
                koli: '',
                warehouse_id: '',
            }
        },
        computed: {
            //to count koli and weight
            countKoliWeight() {
                if(this.items !== null){
                    var countKoli = this.items.reduce((acc, item) => acc + item.total_koli, 0);
                    var countWeight = this.items.reduce((acc, item) => acc + item.sales_order.total_weight, 0);
                    this.koliWeightTotal = countKoli + ' / ' + countWeight + ' KG'
                }else{
                    this.koliWeightTotal = 'No Data'
                }
                return this.koliWeightTotal
            },
            //to get staff id
            staff() {
                return this.$store.getters.getStaff
            },
        },
        methods:{
            //remove selected courier
            removeCourier(so_id,po_id){
                this.$http.put('/logistic/dispatch/'+po_id,
                {
                    sales_order_id : so_id,
                    courier_id : "",
                }
                ).then(response => {
                    this.courier_name = ""
                    this.assigned = false
                })
            },
            //add selected courier
            addCourier(so_id,po_id){
                this.loadingAddCourier = true
                this.disableAddCourier = true
                this.$http.put('/logistic/dispatch/'+po_id,
                {
                    sales_order_id : so_id,
                    courier_id : this.SelectCourier,
                }
                ).then(response => {
                    this.renderData(this.search)
                    this.loadingAddCourier = false
                    this.disableAddCourier = false
                    this.assigned = true
                })
                
            },
            //to get warehouse id
            renderData(search){
                this.loaded = false
                this.$http.get("/user/staff/"+this.staff.id)
                .then(response => {
                    let dataWr = response.data.data
                    this.warehouse_id = dataWr.warehouse.id
                    this.loading = true
                    let delivery_date = ''
                    if (this.delivery_date) {
                        delivery_date = '|pickingorder.recognitiondate:'+this.delivery_date
                    }
                    let vendor = ''
                    if(this.SelectVendor){
                        vendor = '|couriervendor.id.e:'+this.SelectVendor
                    }
                    this.$http.get("/logistic/dispatch",{params:{
                            conditions:'Or.salesorder.code.icontains:'+search+'%2COr.salesorder.branch.merchant.name.icontains:'+search+'%2COr.checkedby.name.icontains:'+search+'%2COr.planningvendor.icontains:'+search+delivery_date+'|status:2'+vendor+'|pickingorder.warehouse.id.e:'+this.warehouse_id+'|dispatch_status:1',
                            orderby:'-id',
                        }}).then(response => {
                        this.loading = false
                        this.items = response.data.data
                        this.countKoliWeight
                        if(this.items !== null){
                            for (let i = 0; i < this.items.length; i++) {
                                if(response.data.data[i].courier.name !== ""){
                                    this.courier_name = response.data.data[i].courier.name
                                }
                            }
                        }else{
                            this.items = []
                        }
                    });
                });

            },
            //select courier by id
            courierSelected(d) {
                this.SelectCourier = ""
                this.disableAddCourier = true
                if (d) {
                    this.SelectCourier = d.id
                    this.disableAddCourier = false
                }
            },
            //select vendor by id
            vendorSelected(d) {
                this.disableAddCourier = true
                this.disableCourier = true
                this.SelectVendor = ""
                this.SelectCourier = ""
                if (d) {
                    this.SelectVendor = d.id
                    this.disableCourier = false
                    this.renderData(this.search)
                }else{
                    this.items = []
                    this.koliWeightTotal = 'No Data'
                }
            },
            
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    if(val !== ""){
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.renderData(val)
                        }, 1000);
                    }else{
                        that.items = []
                    }
                },
                deep: true
            },
            //watch courier name for changes when assign
            'courier_name':{
                handler: function(val){
                    if(!val){
                        this.renderData(this.search)
                    }
                }
            }
        },
    }
</script>
