<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                prepend-inner-icon="search"
                            ></v-text-field>
                        </template>
                        <span>Search by district and subdistrict</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
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
                        name="area"
                        :dense="true"
                        :aux_data="2"
                        @selected="areaSelected"
                    >
                    </SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectProvince
                        :area_id="area_id"
                        @selected="provinceSelected"
                        :norequired="true"
                        :dense="true"
                        :disabled="provinceDisabled"
                    ></SelectProvince>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCity
                        :area_id="area_id"
                        :province_id="province_id"
                        @selected="citySelected"
                        :norequired="true"
                        :dense="true"
                        :disabled="cityDisabled"
                    ></SelectCity>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectDistrict
                        :area_id="area_id"
                        :province_id="province_id"
                        :city_id="city_id"
                        @selected="districtSelected"
                        :norequired="true"
                        :dense="true"
                        :disabled="districtDisabled"
                    ></SelectDistrict>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSubDistrict
                        :province_id="province_id"
                        :city_id="city_id"
                        :district_id="district_id"
                        @selected="subdistrictSelected"
                        :norequired="true"
                        :dense="true"
                        :disabled="subdistrictDisabled"
                    ></SelectSubDistrict>
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
                    <tr style="height: 48px">
                        <td>{{ props.item.area_name }}</td>
                        <td>{{ props.item.province_name }}</td>
                        <td>{{ props.item.city_name }}</td>
                        <td>{{ props.item.district_name }}</td>
                        <td>{{ props.item.sub_district_name }}</td>
                        <td>{{ props.item.postal_code }}</td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <template >
                                        <v-btn
                                            icon
                                            v-on="{ ...menu }"
                                        > <v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                    </template>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item 
                                        :to="`/configuration/warehouse-coverage/detail/${props.item.sub_district_id}`"
                                        v-privilege="'wrh_rdd'"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
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
        name: "WarehouseCoverageList",
        data() {
            return {
                limit_pl: '',
                search: '',
                loading: false,
                area: null,
                area_id:'',
                province_id: '',
                provinceDisabled: true,
                city_id: '',
                cityDisabled: true,
                district_id: '',
                districtDisabled: true,
                subdistrict_id: '',
                subdistrictDisabled: true,
                filter : false,
                table: {
                    fields: [
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Province',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'City',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'District',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Subdistrict',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Postal Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            sortable: false,
                            width:'5px'
                        },
                    ],
                },
                items: [],
            }
        },
        created() {
            this.renderData('')
        },
        computed: {
            validation() {
                if (this.limit_pl) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            renderData(search){
                this.loading = true;
                this.items = []
                let areaID = ''
                if (this.area_id) {
                    areaID = "|area_id.e:"+ this.area_id
                }
                let provinceID = ''
                if (this.province_id) {
                    provinceID = "|province_id.e:"+ this.province_id
                }
                let cityID = ''
                if (this.city_id) {
                    cityID = "|city_id.e:"+ this.city_id
                }
                let districtID = ''
                if (this.district_id) {
                    districtID = "|district_id.e:"+ this.district_id
                }
                let subdistrictID = ''
                if (this.subdistrict_id) {
                    subdistrictID = "|sub_district_id.e:"+ this.subdistrict_id
                }
                this.$http.get("/adm/division", {
                    params: {
                        conditions: 'Or.district_name.icontains:' + search + '%2COr.sub_district_name.icontains:' + search
                        + areaID + provinceID + cityID + districtID + subdistrictID,
                        perpage:100,
                    }
                }).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            areaSelected(d) { // select area
                this.area_id = ''
                this.province_id = ''
                this.city_id = ''
                this.district_id = ''
                this.sub_district_id = ''
                this.provinceDisabled = true
                this.cityDisabled = true
                this.districtDisabled = true
                this.subdistrictDisabled = true
                if (d) {
                    this.provinceDisabled = false
                    this.area_id = d.id
                }
                this.renderData(this.search)
            },
            provinceSelected(d) { // select province
                this.province_id = ''
                this.city_id = ''
                this.district_id = ''
                this.subdistrict_id = ''
                this.cityDisabled = true
                this.districtDisabled = true
                this.subdistrictDisabled = true
                if (d) {
                    this.cityDisabled = false
                    this.province_id = d.province_id
                }
                this.renderData(this.search)
            },
            citySelected(d) { // select city
                this.city_id = ''
                this.district_id = ''
                this.subdistrict_id = ''
                this.districtDisabled = true
                this.subdistrictDisabled = true
                if (d) {
                    this.districtDisabled = false
                    this.city_id = d.city_id
                }
                this.renderData(this.search)
            },
            districtSelected(d) { // select city
                this.district_id = ''
                this.subdistrict_id = ''
                this.subdistrictDisabled = true
                if (d) {
                    this.subdistrictDisabled = false
                    this.district_id = d.district_id
                }
                this.renderData(this.search)
            },
            subdistrictSelected(d) { // select city
                this.subdistrict_id = ''
                if (d) {
                    this.subdistrict_id = d.sub_district_id
                }
                this.renderData(this.search)
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val)
                    }, 1000);
                },
                deep: true
            }
        },
    }
</script>