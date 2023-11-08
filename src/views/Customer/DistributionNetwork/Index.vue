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
                            >
                            </v-text-field>
                        </template>
                        <span>Search by code, name, phone number</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div><div class="box-title">
            <v-row >
                <v-col class="flex-align-end"></v-col>
                <v-col class="d-flex justify-end h70">
                     <v-btn
                        depressed
                        color="#50ABA3"
                        class="no-caps bold mr20"
                        v-privilege="'dis_net_crt'"
                        to="/customer/distribution-network/create"
                    >
                        <span class="text-white">Create Outlet</span>
                    </v-btn>
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
                        <td>
                            {{ props.item.code }}<br>
                        <span class="second-color">{{ props.item.name ?  props.item.name : '-' }}</span>
                        </td>
                        <td>{{ props.item.phone_number ?  props.item.phone_number : '-'}}</td>
                        <td>{{ props.item.finance_area.name ? props.item.finance_area.name : '-'}}</td>
                        <td>{{ props.item.payment_term.name ? props.item.payment_term.name : '-'}}</td>
                        <td>{{ props.item.remaining_outstanding !== null || props.item.remaining_outstanding !== undefined ? 'Rp '+formatPrice(props.item.remaining_outstanding) : '-'}}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'dis_net_rdd'" :to="{ name: 'DistributionNetworkDetail', params: { id: props.item.id } }">
                                        <v-list-item-title>Detail</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item  v-privilege="'dis_net_upd'" v-if="props.item.status === 1" :to="{ name: 'DistributionNetworkUpdate', params: { id: props.item.id } }">
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
    import Vue from 'vue'

    export default {
        name: "EDN",
        data() {
            return {
                loading: false,
                search: '',
                table: {
                    fields: [
                        {
                            text:'Mitra',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Phone Number',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Finance Area',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Payment Term',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width:'10%',
                            text:'Remaining Outstanding',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width:'2%',
                            sortable: false
                        },
                    ],
                },
                items:[
                    {
                        user_merchant:{
                            status: ''
                        },
                        business_type:{
                            name: ''
                        },
                        invoice_term:{
                            name: ''
                        },
                        payment_term:{
                            name: ''
                        },
                        finance_area:{
                            name: ''
                        },
                        payment_group:{
                            name: ''
                        }
                    },
                ],
                overlay: false,
            }
        },
        mounted() {
            this.renderData('','','')
        },
        methods: {
            // For get data from API
            renderData(){
                this.loading = true;
                this.items = []
                this.$http.get("/customer/distribution_network",{params:{
                        perpage:1000,
                        embeds:'user_merchant_id,term_payment_sls_id,business_type_id,payment_method_id,term_invoice_sls_id,finance_area_id,business_type_id,paymentgroup',
                        conditions:'Or.code.icontains:'+this.search+'%2COr.name.icontains:'+this.search+'%2COr.phone_number.icontains:'+this.search+"|customer_group:1|business_type_id:15",
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false;
                    if(response.data.data){
                        this.items = response.data.data
                    }
                    this.loading = false;
                });
            },
            notifToast(a, b) {
                Vue.$toast.open({
                    position: 'top-right',
                    message: a,
                    type: b,
                });
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData()
                    }, 1000);
                },
                deep: true
            },
        },
    }
</script>
