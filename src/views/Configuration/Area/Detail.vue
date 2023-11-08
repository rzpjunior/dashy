<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        v-if="configurationareaDetail.status == 1"
                        rounded
                        elevation="0"
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                        >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="configurationareaDetail.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('archived')"
                        >
                        Archived
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Code'" :value="configurationareaDetail.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Name'" :value="configurationareaDetail.name"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Area Sub District
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.postal_code }}</td>
                        <td>{{ props.item.district.name }}</td>
                        <td>{{ props.item.district.city.name }}</td>
                        <td>{{ props.item.district.city.province.name }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
    export default {
        name: "ConfigurationAreaDetail",
        data() {
            return {
                area_id:'',
                area_id_decrypt:'', //decrypt sementara area_id
                post: null,
                configurationareaDetail:{},
                loading:true,

                // untuk sub area
                table: {
                    fields: [
                        {
                            text:'No',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Sub District',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Postal Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'District',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'City',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Province',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[],
            }
        },
        methods:{
            renderData(){
                this.$http.get("/config/area/"+ this.$route.params.id).then(response => {
                    this.configurationareaDetail = response.data.data
                    this.area_id = response.data.data.id

                    this.$http.get("/sub_district",{params:{
                            embeds:'area,district,district.city.province,district.city.province.country',
                            conditions:'area_id.e:' + this.area_id,
                        }}).then(response => {
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                        }
                    });
                });
                this.loading= false
            },
        },
        mounted() {
            this.renderData()
        },
    }
</script>