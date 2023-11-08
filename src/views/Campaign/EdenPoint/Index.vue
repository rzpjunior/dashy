<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                prepend-inner-icon="search"
                            >
                            </v-text-field>
                        </template>
                       <span>Search by code and name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filterDropdown?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filterDropdown = !filterDropdown"
                        v-if="filterDropdown"
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
                        @click="filterDropdown = !filterDropdown"
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
            <v-row :class="filterDropdown? '-mb38':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea 
                        @selected="areaSelected"
                        :norequired="true"
                        :dense="true"
                        :aux_data="2"
                        :disabled="disabled.archetypes"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArchetype
                        @selected="archetypeSelected"
                        :norequired="true"
                        :aux_data="2"
                        :dense="true"
                        :disabled="disabled.archetypes"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCustomerTagFilter
                        @selected="customerTagSelected"
                        :norequired="true"
                        :dense="true"
                        :aux_data="2"
                        :disabled="disabled.customer_tag"
                    ></SelectCustomerTagFilter>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="period_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="filter_period_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    maxlength="24"
                                    @click:clear="period_date = [],period_date_input =''"
                                    v-model="period_date_input"
                                    dense
                                >
                                    <template v-slot:label>Period Date</template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="period_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="period_date_model = false"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="filter.status"
                        :items="statuses"
                        @change="renderData(search)"
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
                    <v-row>
                        <v-col>
                            <v-btn
                                depressed
                                color="#50ABA3"
                                :to="{ name: 'EdenPointCampaignCreate' }"
                                class="no-caps bold"
                                v-privilege="'ep_crt'"
                            >
                                <span class="text-white">
                                    Create EdenPoint Campaign
                                </span>
                            </v-btn>
                        </v-col>
                    </v-row>
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
                    <tr style="height:86px">
                        <td>
                            <v-img
                                class="rounded-form-sm"
                                height="70"
                                width="70"
                                :src="props.item.image_url"
                            ></v-img>
                        </td>
                        <td>
                            {{ props.item.name }}<br>
                            <span class="second-color">{{ props.item.code }}</span>
                        </td>
                        <td>
                            <div v-if="props.item.campaign_filter_type == 1">
                                <div v-if="props.item.area_name_arr.length > 1">
                                    <v-tooltip color="black" top>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <span v-on="{ ...tooltip }"> {{ props.item.area_name_arr[0] }}... </span>
                                        </template>
                                        <span> 
                                            {{ props.item.area_name }} 
                                        </span>
                                    </v-tooltip>
                                </div>
                                <div v-else>
                                    {{ props.item.area_name }}
                                </div>
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.campaign_filter_type == 1">
                                <div v-if="props.item.archetype_name_arr.length > 1">
                                    <v-tooltip color="black" top>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <span v-on="{ ...tooltip }"> {{ props.item.archetype_name_arr[0] }}... </span>
                                        </template>
                                        <span> 
                                            {{ props.item.archetype_name }} 
                                        </span>
                                    </v-tooltip>
                                </div>
                                <div v-else>
                                    {{ props.item.archetype_name }}
                                </div>
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.campaign_filter_type == 2">
                                <div v-if="props.item.tag_customer_name_arr.length > 1">
                                    <v-tooltip color="black" top>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <span v-on="{ ...tooltip }"> {{ props.item.tag_customer_name_arr[0] }}... </span>
                                        </template>
                                        <span> 
                                            {{ props.item.tag_customer_name }} 
                                        </span>
                                    </v-tooltip>
                                </div>
                                <div v-else>
                                    {{ props.item.tag_customer_name }}
                                </div>
                            </div>
                        </td>
                        <td>
                            {{ props.item.start_date | moment("DD/MM/YYYY HH:mm") }}<br>
                            {{ props.item.end_date | moment("DD/MM/YYYY HH:mm") }}
                        </td>
                        <td class="right">{{ props.item.multiple }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('archived')"
                                ><span class="pa-md-2">Archived</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 5">
                                <v-chip
                                    :color="statusMaster('draft')"
                                ><span class="pa-md-2">Draft</span></v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item  :to="{name: 'EdenPointCampaignDetail', params: { id: props.item.id }}" v-privilege="'ep_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status==1 || props.item.status==5">
                                        <hr/>
                                    </div>
                                    <v-list-item 
                                        v-if="props.item.status==1 || props.item.status==5" 
                                        @click="archiveData = props.item, modelDialog=true" 
                                        v-privilege="'ep_arc'"
                                    >
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
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Archive EdenPoint Campaign</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this  edenpoint campaign archived?</span>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        class="mt-6"
                        rows="3"
                        :error-messages="error.note"
                    >
                        <template v-slot:label>
                            Note<span class="text-red">*</span>
                        </template>
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4 -mt6">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="modelDialog = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                        @click="archive()"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "EdenPointCampaignList",
        data() {
            return {
                filterDropdown : false,
                period_date_model : '',
                period_date : [],
                period_date_input : '',
                ConfirmData : {},
                modalOpen: false,
                search: '',
                loading: false,
                overlay: false,
                statuses : [
                    {
                        text : 'All Status',
                        value : '',
                    },
                    {
                        text : 'Active',
                        value : 1,
                    },
                    {
                        text : 'Finished',
                        value : 2,
                    },
                    {
                        text : 'Archived',
                        value : 3,
                    },
                    {
                        text : 'Draft',
                        value : 5,
                    },
                ],
                filter:{
                    area_id:'',
                    archetype:'',
                    customerTag:'',
                    status: ''
                },
                table: {
                    fields: [
                        {
                            text:'Image',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'EdenPoint Campaign',
                            width: "30%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Archetype',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Customer Tag',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Start - End Date',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Multiple of Point (x)',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[],
                error: {},
                archiveData: {},
                note:{
                    note: '',
                },
                modelDialog: false,
                disabled: {
                    customer_tag: false,
                    archetypes: false,
                }
            }
        },
        mounted() {
            Vue.nextTick(() => {
                this.items = []
                this.renderData(this.search)
            });
        },
        methods: {
            //For geting data EdenPoint Campaign
            renderData(search){
                this.loading = true;
                this.items = []
                let area_id = ''
                if(this.filter.area_id){
                    area_id = this.filter.area_id
                }
                let archetype_id = ''
                if(this.filter.archetype){
                    archetype_id = this.filter.archetype
                }
                let customer_tag_id = ''
                if(this.filter.customerTag){
                    customer_tag_id = this.filter.customerTag
                }
                let period_date = ''
                if (this.period_date.length > 0) {
                    if (this.period_date.length == 1) {
                        period_date = this.period_date[0] + '+00:00:00|' + this.period_date[0] + '+23:59:59'
                    } else {
                        let date = this.period_date[0]
                        let date2 = this.period_date[1]
                        if (date > date2) {
                            period_date = date2 + '+00:00:00|' + date + '+23:59:59'
                        } else {
                            period_date = date + '+00:00:00|' + date2 + '+23:59:59'
                        }
                    }
                }
                let status = ''
                let current_date = this.$moment(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss')
                if(this.filter.status == 1){
                    status = "|status:1 |startdate.lte:" + current_date + '|enddate.gte:' + current_date 
                }
                else if(this.filter.status == 2){
                    status = "|status:1 |enddate.lt:" + current_date 
                }
                else if(this.filter.status == 3){
                    status = "|status:" + this.filter.status
                }
                else if(this.filter.status == 5){
                    status = "|status:1 |startdate.gt:" + current_date 
                }
                this.$http.get("/campaign/eden-point",{params:{
                    area_id: area_id,
                    archetype_id: archetype_id,
                    customer_tag_id: customer_tag_id,
                    period: period_date,
                    conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'+search+status,
                    perpage:100,
                    orderby:'-id',
                }}).then(response => {
                    this.loading = false;
                    if (response.data.data && response.data.data != null) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                });
            },
            //For Filter Area
            areaSelected(d){
                this.filter.area_id = '';
                if(d){
                    this.filter.area_id = d.id;
                }
                this.renderData(this.search)

            },
            //For Filter by Archetype
            archetypeSelected(d) {
                this.filter.archetype = '';
                if (d) {
                    this.filter.archetype = d.id
                }
                this.renderData(this.search)
            },
            //For Filter by Customer Tag
            customerTagSelected(d) {
                this.filter.customerTag = '';
                if (d) {
                    this.filter.customerTag = d.id;
                }
                this.renderData(this.search)
            },
            //To archiving a EdenPoint Campaign
            archive() {
                this.$http.put("/campaign/eden-point/archive/"+this.archiveData.id, this.note).then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been archived successfully',
                        type: 'success',
                    });
                    this.note = {
                        note : "",
                    }
                    this.renderData(this.search)
                    this.modelDialog = false
                }).catch(e => {
                    this.error = e.errors
                });
            },
        },
        watch: {
            //For Filter by Search Box usign name or code
            'search': {
                handler: function (search) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){ 
                        that.renderData(search)
                    }, 1000);
                },
                deep: true
            },
            //For Filter by Period EdenPoint Campaign
            'period_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.period_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                Vue.nextTick(() => {
                                    this.items = []
                                    this.renderData(this.search)
                                });
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.period_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.period_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.period_date.length == 2) {
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData(this.search)
                                    });
                                }
                            }
                        }
                    } else if (val == "") {
                        this.period_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData(this.search)
                        });
                    }
                },
                deep: true
            },
            //For Filter by Period EdenPoint Campaign
            'period_date': {
                handler: function (val) {
                    if (val) {
                        this.period_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            //If filter area or archetype selected, filter customer tag disabled
            'filter.area_id': {
                handler: function (val) {
                    if (val) {
                        this.disabled.customer_tag = true
                        this.disabled.archetypes = false
                    }
                    else if(this.filter.archetype){
                        this.disabled.customer_tag = true
                        this.disabled.archetypes = false
                    }
                    else{
                        this.disabled.customer_tag = false
                        this.disabled.archetypes = false
                    }
                },
                deep: true
            },
            //If filter area or archetype selected, filter customer tag disabled
            'filter.archetype': {
                handler: function (val) {
                    if (val) {
                        this.disabled.customer_tag = true
                        this.disabled.archetypes = false
                    }
                    else if(this.filter.area_id){
                        this.disabled.customer_tag = true
                        this.disabled.archetypes = false
                    }
                    else{
                        this.disabled.customer_tag = false
                        this.disabled.archetypes = false
                    }
                },
                deep: true
            },
            //If filter customer tag selected, filter area and archetype disabled
            'filter.customerTag': {
                handler: function (val) {
                    if (val) {
                        this.disabled.customer_tag = false
                        this.disabled.archetypes = true
                    }
                    else{
                        this.disabled.customer_tag = false
                        this.disabled.archetypes = false
                    }
                },
                deep: true
            },
        },
    }
</script>