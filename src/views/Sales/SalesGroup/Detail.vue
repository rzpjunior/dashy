<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Name'" :value="items.name"/>
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Business Type'" :value="items.business_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Sales Manager'" :value="items.sls_man.display_name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="items.area.name"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Coverage
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="sub_district"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.sub_district_name }}</td>
                        <td>{{ props.item.district_name }}</td>
                        <td>{{ props.item.city_name }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialog :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    export default {
        data () {
            return {
                sub_district: [],
                items:[{
                    name: '',
                    sls_man:{
                        display_name: '',
                    },
                    business_type:{
                        name:'',
                    },
                    area:{
                        name:'',
                    },
                }],
                table: {
                    fields: [
                        {
                            text: 'No.',
                            sortable: false,
                            width: "5%"
                        },
                        {
                            text: 'Sub District',
                            sortable: false,
                            width: "30%"
                        },
                        {
                            text: 'District',
                            sortable: false,
                            width: "30%"
                        },
                        {
                            text: 'City',
                            sortable: false,
                            width: "30%"
                        },
                    ],
                },
            }
        },
        mounted () {
            this.renderData()
        },
        methods:{
            renderData(){
                let arr = []
                let sub_district_arr = []
                this.loading = true;
                this.items = []
                this.$http.get("/sales/group/"+this.$route.params.id)
                .then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }else{
                        arr = this.items.sales_group_item
                        for (let i = 0; i < arr.length; i++) {
                            sub_district_arr.push(
                                {
                                    sub_district_id: arr[i].sub_district.id,
                                    sub_district_name: arr[i].sub_district.name,
                                    district_name: arr[i].sub_district.district.name,
                                    city_name: arr[i].sub_district.district.city.name,
                                }
                            )
                        }
                        this.sub_district = sub_district_arr
                    }
                });
            },
        },
    }
</script>