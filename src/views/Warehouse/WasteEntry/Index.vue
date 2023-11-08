<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
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
                       <span>Search by Waste Entry Code</span>
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
                        name="filter_area"
                        @selected="areaSelected"
                        v-privilege="'filter_rdl'"
                        :norequired="true"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        name="filter_warehouse"
                        :aux_data="2"
                        :area_id="SelectArea"
                        :warehouse="warehouse"
                        @selected="warehouseSelected"
                        :norequired="true"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="waste_entry_date_model"
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
                                    clearable
                                    maxlength="24"
                                    @click:clear="waste_entry_date = [],waste_entry_date_input ='',renderData(search,statuses)"
                                    v-model="waste_entry_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Waste Entry Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="waste_entry_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="waste_entry_date_model = false,renderData(search,statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'WasteEntryCreate' }"
                        class="no-caps bold"
                        v-privilege="'we_crt'"
                    >
                    <span class="text-white">
                        Create Waste Entry
                    </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.code }}</td>
                        <td>{{ props.item.warehouse.code }} - {{ props.item.warehouse.name }}</td>
                        <td>{{ formatDate(props.item.recognition_date) }}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                ><span class="pa-md-2"> Cancelled </span></v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item  :to="`/warehouse/waste-entry/${props.item.id}`" v-privilege="'we_rdd'">
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
        name: "WasteEntryList",
        data() {
            return {
                search: '',
                filter : false,
                waste_entry_date_input:  new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                waste_entry_date_model : '',
                waste_entry_date :  [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                loading: false,
                statuses:999,
                status2:[
                    {
                        text:'All Status',
                        value:999
                    },
                    {
                        text:'Active',
                        value:1
                    },
                    {
                        text:'Finished',
                        value:2
                    },
                    {
                        text:'Cancelled',
                        value:3
                    },
                ],
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: true
                        },
                        {
                            text:'Waste Entry Date',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            sortable: true
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            sortable: true
                        },
                        {
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[{
                    category: {
                        code: '',
                        name: '',
                    },
                    warehouse : {
                        code: '',
                        name : ''
                    },
                }],
                SelectArea : '',
                area: '',
                SelectWarehouse : '',
                warehouse: '',
            }
        },
        mounted() {
            this.renderData('',this.statuses)
        },
        methods: {
            renderData(search,statuses){
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|warehouse.id.e:'+this.SelectWarehouse
                }
                let waste_entry_date = ''
                if (this.waste_entry_date.length > 0) {
                    if (this.waste_entry_date.length == 1) {
                        waste_entry_date = '|recognition_date:'+this.waste_entry_date[0]
                    } else {
                        let date = this.waste_entry_date[0]
                        let date2 = this.waste_entry_date[1]
                        if (date > date2) {
                            waste_entry_date = '|recognition_date.gte:'+date2+'|recognition_date.lte:'+date
                        } else {
                            waste_entry_date = '|recognition_date.gte:'+date+'|recognition_date.lte:'+date2
                        }
                    }
                }
                this.loading = true;
                this.items = []
                this.$http.get("/warehouse/waste/entry",{params:{
                        perpage:1000,
                        embeds:'warehouse_id',
                        conditions:'code.icontains:'+search+warehouse+waste_entry_date+statuses,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            areaSelected(d) {
                this.SelectArea = ""
                this.area = ""
                this.SelectWarehouse = ''
                this.warehouse = ""
                if (d) {
                    this.SelectArea = d.id
                }
            },
            warehouseSelected(d) {
                this.SelectWarehouse = ''
                this.warehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                    this.warehouse = d
                }
                this.renderData(this.search,this.statuses)
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.statuses)
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
            'waste_entry_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.waste_entry_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.waste_entry_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.waste_entry_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.waste_entry_date.length == 2) {
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'waste_entry_date': {
                handler: function (val) {
                    if (val) {
                        this.waste_entry_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
