<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{items.name}}
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Salesperson'" :value="items.salesperson.display_name ? items.salesperson.display_name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Sales Group'" :value="items.sales_group.name ? items.sales_group.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="items.phone_number ? items.phone_number : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Submit Date'" :value="items.submit_date ? items.submit_date : '-' | moment('YYYY-MM-DD HH:mm:ss')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Address'" :value="items.address_name ? items.address_name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew v-if="items.latitude && items.longitude" :name="'Latlong'" :value="items.latitude+', '+items.longitude" :crossURL="'https://www.google.com/maps/search/?api=1&query='+items.latitude+','+items.longitude"/>
                    <DetailRowNew v-else :name="'Latlong'" :value="'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Leads from Food App'" :value="items.food_app ? (items.food_app == 1 ? 'No' : 'Yes') : '-'"/>
                </v-col>
                 <v-col cols="12" md="6" class="-mt24">
                     <DetailRowNew :name="'Potential Revenue'" :value="items.potential_revenue ? 'Rp. '+formatPrice(items.potential_revenue) : 'Rp. 0,00'"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Top Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items.customer_acquisition_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code +' - '+ props.item.product.name }}</td>
                        <td>{{ props.item.is_top === 1 ? 'Yes' : '-' }}</td>
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
        name: "CustomerAcquisitionDetail",
        data() {
            return {
                table: {
                    fields: [
                        {
                            text:'No',
                            width:"5%",
                            sortable: false,
                        },
                        {
                            text:'Product',
                            width:"70%",
                            sortable: false,
                        },
                        {
                            text:'Top Product',
                            width:"25%",
                            sortable: false,
                        }
                    ],
                },
                items: {
                    salesperson: {
                        display_name: '',
                    },
                    sales_group: {
                        name: '',
                    },
                    phone_number: '',
                    business_type_credit_limit: '',
                    remaining_credit_limit_amount: 0,
                },
                loading:true,
                overlay: false,
            }
        },
        methods:{
            // Render Data From API
            async renderData(){
                this.overlay = true
                await this.$http.get("/customer/acquisition/"+ this.$route.params.id).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.loading= false
                    this.overlay = false
                });
            }
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res) {
                if (res) {
                    self.renderData()
                }
            });
        },
    }
</script>