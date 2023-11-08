<template>
    <v-container fill-height class="main-container">
        <div class="box-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.area.code }} - {{ props.item.area.name }}</td>
                        <td>{{ props.item.min_order }}</td>
                        <td>{{ props.item.delivery_fee }}</td>
                        <td>{{ props.item.order_time_limit }}</td>
                        <td>{{ props.item.default_price_set.name }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item :to="`/configuration/area_policy/update/${props.item.id}`" v-privilege="'are_plc_upd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
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
        name: "ConfigurationAreaPolicy",
        data() {
            return {
                search: '',
                loading: false,
                statuses:1,
                table: {
                    fields: [
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Minimum Order',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Delivery Fee',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Order Time Limit',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Default Price Set',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                items:[],
            }
        },
        mounted() {
            this.renderData('',this.statuses)
        },
        methods: {
            renderData(search,statuses){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                this.$http.get("/config/area/policy",{params:{
                        embeds:'area_id,default_price_set',
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
        },
    }
</script>