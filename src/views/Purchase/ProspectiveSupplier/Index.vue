<template>
    <v-container class="Heiti px-12">
        <v-subheader>
            <v-row class="mt-10">
                <v-col cols="4" offset="8">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                v-model="search"
                                append-icon="search"
                                name="search"
                                label="Search..."
                                single-line
                                hide-details
                                style="margin-top:-10px;"
                                v-on="{ ...tooltip }"
                                rounded
                                outlined
                            ></v-text-field>
                        </template>
                       <span>Search by code and name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-subheader>
        <v-row class="px-3 mt-12">
            <div class="title-page">
                Filter
            </div>
        </v-row>
        <hr class="hr-solid">
        <v-col cols="12" class="pt-5 pt-sm-5 mt-10 mt-sm-16 mt-md-1">
            <v-row>
                <v-col cols="12" md="3">
                    <v-select
                        v-model="statuses"
                        :items="regStatus"
                        item-text="text"
                        item-value="value"
                        label="Status"
                        outlined
                        class="rounded-form"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectProvince  @selected="provinceSelected" :norequired="true"></SelectProvince>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectCity  @selected="citySelected" :norequired="true"></SelectCity>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectDistrict @selected="districtSelected" :norequired="true"></SelectDistrict>
                </v-col>
            </v-row>
        </v-col>
        <div class="title-table">
            <label class="label-title">
                Prospective Supplier
            </label>
        </div>
        <v-data-table
            :mobile-breakpoint="0"
            :headers="table.fields"
            :items="items"
            :items-per-page="10"
            :loading="loading"
        >
            <template v-slot:item="props">
                <tr>
                    <td>{{ props.item.code }}<br>
                       <span class="second-color">{{ props.item.name }}</span>
                    </td>
                    <td>{{ props.item.pic_name }}<br>
                       <span class="second-color">{{ props.item.phone_number }}</span>
                    </td>
                    <td>{{ props.item.sub_district.district.city.province.name }}</td>
                    <td>{{ props.item.sub_district.district.city.name }}</td>
                    <td>{{ props.item.sub_district.district.name }}</td>
                    <td>{{ props.item.sub_district.name  }}</td>
                    <td>
                        <v-chip
                            class="ma-2"
                            :color="statusMaster(props.item.reg_status === 1 ? 'new' : props.item.reg_status === 2 ? 'registered' : 'decline')"
                            :text-color="statusMasterText(props.item.reg_status === 1 ? 'new' : props.item.reg_status === 2 ? 'registered' : 'decline')"
                    >
                        {{ props.item.reg_status == 1 ? 'New' :  props.item.reg_status == 2 ? 'Registered' : 'Decline'}}
                        </v-chip>
                        </td>

                    <td>
                        <v-menu>
                            <template v-slot:activator="{ on: menu }">
                                <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                            </template>
                            <v-list style="background-color: #E8EFF2;">
                                <v-list-item v-privilege="'pro_sup_rdd'">
                                    <v-list-item-title >
                                        <router-link style="color: #333333; text-decoration: none;" class="routerLink" :to="{ name: 'ProspectSupplierDetail', params: { id: props.item.id } }" >Detail</router-link>
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="props.item.reg_status == 1" v-privilege="'pro_sup_reg'"
                                             @click="register(props.item.id)"
                                >
                                    Register
                                    <!-- <router-link style="color: #333333; text-decoration: none;" class="routerLink" :to="{ name: 'SupplierCreate' }" >Register</router-link> -->
                                </v-list-item>
                                <v-list-item v-if="props.item.reg_status == 1" v-privilege="'pro_sup_dec'"
                                             @click="decline(props.item.id)"
                                >
                                    <router-link style="color: #333333; text-decoration: none;" class="routerLink" :to="{ name: '' }" >Decline</router-link>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <ConfirmationDialog :sendData="ConfirmData"/>

    </v-container>
</template>

<script>
    export default {
        name: "ProspectSupplier",
        data() {
            return {
                search: '',
                province: null,
                city: null,
                district: null,
                statuses:1,
                dialog:false,
                regStatus:[
                    {
                        text:'All Status',
                        value:999
                    },
                    {
                        text:'New',
                        value:1
                    },
                    {
                        text:'Registered',
                        value:2
                    },
                    {
                        text:'Decline',
                        value:3
                    },
                ],
                table: {
                    fields: [
                        {
                            text:'Code',
                            sortable: false,
                        },
                        {
                            text:'PIC Name',
                            sortable: false
                        },
                        {
                            text:'Province',
                            sortable: false
                        },
                        {
                            text:'City',
                            sortable: false
                        },
                        {
                            text:'District',
                            sortable: false
                        },
                        {
                            text:'Subdistrict',
                            sortable: false
                        },
                        {
                            text:'Status',
                            sortable: false
                        },
                        {
                            sortable: false
                        },
                    ],
                },
                loading: false,
                items:[],
                ConfirmData : {},
                bucket:{},
                SelectProvince: '',
                SelectCity: '',
                SelectDistrict: '',
                confirmation:{
                    valueName: 'Prospect Supplier',
                    action:'',
                    status: '',
                    urlPath:'',
                    parentPath:'/purchase/prospective/supplier',
                },
                address: '',
                name: '',
                phone_number: '',
                pic_name: '',
                phone_number: '',
                sub_district_id: ''
            }
        },
        mounted() {
            this.renderData('',this.statuses)
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search,self.statuses)
                }
            });
        },
        methods: {
            renderData(search,statuses){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|reg_status:"+statuses
                }
                let province = ''
                if (this.SelectProvince){
                    province = '|sub_district_id.district.city.province.id.e:'+this.SelectProvince
                }
                let city = ''
                if(this.SelectCity){
                    city = '|sub_district_id.district.city.id.e:'+this.SelectCity
                }
                let district = ''
                if(this.SelectDistrict){
                    district = '|sub_district_id.district.id.e:'+this.SelectDistrict
                }
                this.$http.get("/purchase/prospect/supplier",{params:{
                        perpage:10000,
                        embeds: 'sub_district_id,sub_district_id.area,sub_district_id.district,sub_district_id.district.city,sub_district_id.district.city.province',
                        conditions:'Or.code.icontains:'+search+"%2COr.name.icontains:"+search+province+city+district+statuses,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items === null){
                        this.bucket = response.data.data

                        this.items = []
                    }
                });
            },

            provinceSelected(d) {
                this.SelectProvince = ""
                if (d) {
                    this.SelectProvince = d.province_id
                }
                this.renderData(this.search,this.statuses)
            },

            citySelected(d) {
                this.SelectCity = ""
                if (d) {
                    this.SelectCity = d.city_id
                }
                this.renderData(this.search,this.statuses)
            },

            districtSelected(d) {
                this.SelectDistrict = ""
                if (d) {
                    this.SelectDistrict = d.district_id
                }
                this.renderData(this.search,this.statuses)
            },

            register(id){
                let data = {
                    supplier : id
                }
                this.$store.commit('setProspectSupplier', data);
                this.$router.push('/purchase/supplier/create')
            },
            decline(id){
                this.ConfirmData = {
                    model : true,
                    status : true,
                    title : "Decline",
                    text : "Are you sure to decline this prospective supplier?",
                    urlApi : '/purchase/prospect/supplier/decline/'+id,
                    data : {}
                }
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val, that.statuses)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val)
                },
                deep: true
            },
        },
    }
</script>