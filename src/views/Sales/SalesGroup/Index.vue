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
                                filled
                                dense
                                v-privilege="'filter_rdl'"
                            >
                            </v-text-field>
                        </template>
                        <span>Search by name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="showFilter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-if="showFilter"
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
                        @click="showFilter = !showFilter"
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
            <v-row :class="showFilter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea :norequired="true" @selected="areaSelected" name= "filter_area" class="mtn24" :aux_data="2" :dense="true"></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCity :norequired="true" @selected="citySelected" name= "filter_city" class="mtn24" :dense="true"></SelectCity>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectBusinessType
                        v-privilege="'filter_rdl'"
                        :dense="true"
                        :aux_data="2"
                        :norequired="true"
                        @selected="typeSelected"
                    ></SelectBusinessType>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <router-link :to="{ name: 'SalesGroupeCreate' }" class="routerLink" v-privilege="'sgr_crt'">
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="no-caps bold white--text"
                        >Create Sales Group</v-btn>
                    </router-link>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{props.item.name}}</td>
                        <td>{{props.item.business_type.name}}</td>
                        <td>{{props.item.area.name}}</td>
                        <td>{{props.item.city_str}}</td>
                        <td>{{props.item.sls_man.display_name}}</td>
                        <td>{{props.item.salesperson_total}}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                   <v-btn icon v-on="{ ...menu }">
                                        <v-icon dark>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item :to="`/sales/group/detail/${props.item.id}`" v-privilege="'sgr_rdd'">
                                        <v-list-item-title>Detail</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item :to="`/sales/group/update/${props.item.id}`" v-if="props.item.status=='1'" v-privilege="'sgr_upd'">
                                        <v-list-item-title>Update</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <div class="px-md-4" v-if="props.item.status=='1'" v-privilege="'sgr_arc'">
                                        <hr/>
                                    </div>
                                    <v-list-item @click="changeStatus(props.item.id)" v-if="props.item.status=='1'" v-privilege="'sgr_arc'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "SalesPerson",
        data() {
            return {
                search: '',
                showFilter : false,
                loading: false,
                area: "",
                area_id : "",
                salesperson_id: "",
                ConfirmData : {},
                items:[],
                reload:false,
                table: {
                    fields: [
                        {
                            text:'Name',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Business Type',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'City',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Sales Manager',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Salesperson',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'',
                            width:'5%',
                            sortable: false
                        },
                    ]
                },
                city_id: '',
                SelectBusinessID : '',
            }
        },
        created() {
            this.renderData('')
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.reload = true
                    self.renderData(self.search)
                }
            });
        },
        methods: {
            renderData(search){
                this.loading = true;
                this.items = []
                let area = ''
                if(this.area_id){
                    area = "|area.id.e:"+this.area_id
                }
                let city = ''
                if (this.city_id) {
                    city = this.city_id
                }
                let type = ''
                if(this.SelectBusinessID){
                    type ='|business_type_id.e:'+this.SelectBusinessID
                }
                this.$http.get("/sales/group",{params:{
                        perpage:100,
                        embeds:'sls_man_id,business_type_id,area_id',
                        conditions:'name.icontains:'+search+area+type,
                        city: city,
                        orderby:'-id',
                    }}).then(response => {
                        this.loading = false;
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                    }
                });
            },
            changeStatus(id) {
                this.reload = false
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Archive this sales group",
                    title : "Archive Sales Group",
                    text : "Are you sure want to Archive this sales group?",
                    urlApi : "/sales/group/archive/"+id,
                    data : {}
                }
            },
            areaSelected(d) {
                this.area_id = ''
                if (d) {
                    this.area_id = d.id
                }
                this.renderData(this.search)
            },
            // For Filter City
            citySelected(d) {
                this.city_id = ""
                if (d) {
                    this.city_id = d.city_id
                }
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search)
                });
            },
            //For Filter Business
            typeSelected(d){
                this.SelectBusinessID = '';
                if(d){
                    this.SelectBusinessID = d.id;
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
            },
        },
    }
</script>