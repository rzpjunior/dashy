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
            <v-row :class="filterDropdown? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea 
                        @selected="areaSelected"
                        :dense="true"
                        :norequired="true"
                        :aux_data="2"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArchetype
                        @selected="archetypeSelected"
                        :norequired="true"
                        :aux_data="2"
                        :dense="true"
                    ></SelectArchetype>
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
                                :to="{ name: 'BannerCreate' }"
                                class="no-caps bold"
                                v-privilege="'bnr_crt'" 
                            >
                                <span class="text-white">
                                    Create Banner
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
                                height="65"
                                width="125"
                                :src="props.item.image_url"
                            ></v-img>
                        </td>
                        <td>
                            {{ props.item.name }}<br>
                            <span class="second-color">{{ props.item.code }}</span>
                        </td>
                        <td>
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
                        </td>
                        <td>
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
                        </td>
                        <td>
                            <div v-if="props.item.navigate_type == 1">
                                <a v-if="props.item.navigate_url" :href="props.item.navigate_url" target="_blank" rel="noopener noreferrer">URL</a>
                                <span v-else>-</span>
                            </div>
                            <div v-else-if="props.item.navigate_type == 2">
                                {{ props.item.tag_product.name }}
                            </div>
                            <div v-else-if="props.item.navigate_type == 3">
                                {{ props.item.product.code }} - {{ props.item.product.name }}
                            </div>
                            <div v-else-if="props.item.navigate_type == 6">
                                {{ props.item.product_section.code }} - {{ props.item.product_section.name }}
                            </div>
                            <div v-else>
                                {{ props.item.navigate_type_name }}
                            </div>
                        </td>
                        <td>{{ props.item.start_date | moment("DD/MM/YYYY HH:mm") }}</td>
                        <td>{{ props.item.end_date | moment("DD/MM/YYYY HH:mm") }}</td>
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
                            <div v-if="props.item.status == 4">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                ><span class="pa-md-2">Deleted</span></v-chip>
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
                                    <v-list-item  :to="{name: 'BannerDetail', params: { id: props.item.id }}" v-privilege="'bnr_rdd'">
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
                                        v-privilege="'bnr_arc'"
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
                    <span class="text-title-modal">Archive Banner</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this banner archived?</span>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        maxlength="100"
                        outlined
                        class="mt-6"
                        rows="3"
                    >
                        <template v-slot:label>
                            Note
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
        name: "BannerList",
        data() {
            return {
                filterDropdown : false,
                modalOpen: false,
                search: '',
                loading: false,
                overlay: false,
                filter:{
                    area_id:'',
                    archetype:'',
                    status:''
                },
                status: '',
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
                table: {
                    fields: [
                        {
                            text:'Image',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Banner Name',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Archetype',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Redirect To',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Start Date',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'End Date',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "5%",
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
                modelDialog: false,
                note:{
                    note: '',
                },
                archiveData: {}
            }
        },
        mounted() {
            this.renderData(this.search)
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search)
                }
            });
        },
        methods: {
            //For get list data of Banner and the filter
            renderData(search){
                this.loading = true;
                this.items = []
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
                let area_id = ''
                if(this.filter.area_id){
                    area_id = this.filter.area_id
                }
                let archetype = ''
                if(this.filter.archetype){
                    archetype = this.filter.archetype
                }
                this.$http.get("/campaign/banner",{params:{
                    perpage:100,
                    conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'+search+status,
                    embeds : "productsection",
                    orderby:'-id',
                    area: area_id,
                    archetype: archetype
                }}).then(response => {
                    this.loading = false;
                    if (response.data.data && response.data.data != null) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                });
            },
            //For Filter by Area
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
            //For Filter by Status
            redirectToSelected(d) {
                this.filter.status = '';
                if (d) {
                    this.filter.status = d.value_int;
                }
                this.renderData(this.search)
            },
            //To archiving a banner
            archive() {
                this.$http.put("/campaign/banner/archive/"+this.archiveData.id, this.note).then(response => {
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
                });
            },
        },
        watch: {
            'search': { // to filter by search box
                handler: function (search) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){ 
                        that.renderData(search)
                    }, 1000);
                },
                deep: true
            },
        },
    }
</script>