<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row :class="filter?'mb24':''">
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
                        <v-icon
                            right
                        >
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon
                            right
                        >
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        :norequired="true"
                        @selected="areaSelected"
                        :aux_data="2"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectBusinessType
                        :dense="true"
                        :norequired="true"
                        name="businesstype"
                        :aux_data="2"
                        @selected="SelectBusinessTypeFilter"
                    ></SelectBusinessType>
                </v-col>
            </v-row>
        </div>
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
                        <td>{{ props.item.business.name }}</td>
                        <td>{{ props.item.min_order }}</td>
                        <td>{{ props.item.delivery_fee }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item :to="`/configuration/area-business-policy/update/${props.item.id}`" v-privilege="'are_plc_upd'">
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
        name: "ConfigurationBusinessAreaPolicy",
        data() {
            return {
                loading: false,
                table: {
                    fields: [
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Business Type',
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
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                items:[],
                filter : false,
                SelectArea: '',
                business_type_id: '',
            }
        },
        mounted() {
            this.renderData()
        },
        methods: {
            // For get data
            renderData(){
                this.loading = true;
                this.items = []
                let search =''
                let businesstype = ''
                if (this.business_type_id) {
                    businesstype = '|businesstype.id.e:' + this.business_type_id
                }
                let area = ''
                if (this.SelectArea) {
                    area = '|area__id.e:' + this.SelectArea
                }
                this.$http.get("/config/area/business_policy", { params:{
                        embeds:'area_id,business_type_id',
                        conditions: 'id.icontains:'+search+businesstype+area,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            // For Filter Area
            areaSelected(d) {
                this.SelectArea = ""
                if (d) {
                    this.SelectArea = d.id
                }
                this.renderData()
            },
            // For Filter Business Type
            SelectBusinessTypeFilter(d) {
                this.business_type_id = ""
                if (d) {
                    this.business_type_id = d.id
                }
                this.renderData()
            },
        },
    }
</script>