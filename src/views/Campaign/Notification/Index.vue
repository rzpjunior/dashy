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
                        <span>Search by code and name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filter2?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filter2 = !filter2"
                        v-if="filter2"
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
                        @click="filter2 = !filter2"
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
            <v-row :class="filter2? '-mb38':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        :norequired="true"
                        @selected="areaSelected"
                        :aux_data="2"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="schedule_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="filter_order_schedule_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    maxlength="24"
                                    @click:clear="schedule_date = [],schedule_date_input ='',renderData(search)"
                                    v-model="schedule_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Schedule Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="schedule_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="schedule_date_model = false"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="status"
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
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'NotificationCreate' }"
                        class="no-caps bold"
                        v-privilege="'pnt_crt'"
                    >
                        <span class="text-white">
                            Create Push Notification
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
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ $moment(props.item.scheduled_at).format('DD-MM-YYYY HH:mm:ss') }}</td>
                        <td>
                            {{ props.item.campaign_name }}<br>
                            <div class="text-black60">
                                {{ props.item.code }}
                            </div>
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
                            <div v-if="props.item.redirect_to == 4">
                                <a :href="props.item.redirect_value" target="_blank" rel="noopener noreferrer">
                                    {{ props.item.redirect_value_name }}
                                </a>
                            </div>
                            <div v-else>
                                {{ props.item.redirect_value_name }}
                            </div>
                        </td>
                        <td>{{ props.item.success_sent }}</td>
                        <td>{{ props.item.open }}</td>
                        <td>{{ props.item.conversion }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('draft')"
                                    :text-color="statusMasterText('draft')"
                                ><span class="pa-md-2">Draft</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                ><span class="pa-md-2"> Cancelled </span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 4">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <template >
                                        <v-btn
                                            icon
                                            v-on="{ ...menu }"
                                        >  
                                            <v-icon dark>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'pnt_rdd'" :to="'/campaign/push-notification/detail/'+props.item.id">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div class="hr-menu" v-if="props.item.status == 1"/>
                                    <v-list-item v-privilege="'pnt_upd'" :to="'/campaign/push-notification/update/'+props.item.id" v-if="props.item.status == 1">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div class="hr-menu" v-if="props.item.status == 1"/>
                                    <v-list-item @click="cancelData = props.item,modelDialog=true" v-if="props.item.status==1" v-privilege="'pnt_cnl'">
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Cancel Push Notification</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this push notification cancelled?</span>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        :error-messages="error.note"
                        required
                        class="mt-6"
                        rows="3"
                    >
                        <template v-slot:label>
                            Note<span style="color:red">*</span>
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
                        @click="cancelNotif()"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "PushNotificationList",
        data() {
            return {
                search: '',
                loading: false,
                filter2 : false,
                status:'',
                statuses : [
                    {
                        text : 'All Status',
                        value : '',
                    },
                    {
                        text : 'Draft',
                        value : 1,
                    },
                    {
                        text : 'Active',
                        value : 2,
                    },
                    {
                        text : 'Cancelled',
                        value : 3,
                    },
                    {
                        text : 'Finished',
                        value : 4,
                    },
                ],
                schedule_date_model : '',
                schedule_date : [],
                schedule_date_input : '',
                table: {
                    fields: [
                        {
                            text:'Schedule Push',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Campaign Name',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Archetype',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Redirect To',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Success Sent',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Open',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Conversion',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            width: "10%",
                            sortable: false
                        },
                        {
                            text:'',
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                items:[],
                modelDialog : false,
                note : {
                    note : "",
                },
                cancelData : {},
                error : {},
                area : ''
            }
        },
        created() {
            this.getDate()
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search)
                }
            });
        },
        methods: {
            getDate() { // for get default date this month
                var date = new Date();
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
                var end = new Date(date.getFullYear(), date.getMonth()+1, 1);
                this.schedule_date = [firstDay.toISOString().substr(0, 10), end.toISOString().substr(0, 10)]
            },
            renderData(search){ // for get data / list
                this.loading = true;
                this.items = []
                let statuses = ''
                if (this.status) {
                    statuses = "|status:"+ this.status
                }
                let schedule_date = ''
                if (this.schedule_date.length > 0) {
                    if (this.schedule_date.length == 1) {
                        schedule_date = '|scheduled_at.gte:'+this.schedule_date[0]+'T00:00:00+07:00'+'|scheduled_at.lte:'+this.schedule_date[0]+'T23:59:59+07:00'
                    } else {
                        let date = this.schedule_date[0]
                        let date2 = this.schedule_date[1]
                        if (date > date2) {
                            schedule_date = '|scheduled_at.gte:'+date2+'T00:00:00+07:00'+'|scheduled_at.lte:'+date+'T23:59:59+07:00'
                        } else {
                            schedule_date = '|scheduled_at.gte:'+date+'T00:00:00+07:00'+'|scheduled_at.lte:'+date2+'T23:59:59+07:00'
                        }
                    }
                }
                this.$http.get("/campaign/push-notification",{params:{
                    perpage:1000,
                    conditions:'Or.campaign_name.icontains:'+search+'%2COr.code.icontains:'+search+statuses+schedule_date,
                    orderby:'-id',
                    area : this.area
                }}).then(response => {
                    this.loading = false;
                    if (response.data.data && response.data.data != null) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                })
            },
            cancelNotif() { // for cancel item push notification
                this.$http.put("/campaign/push-notification/cancel/"+this.cancelData.id, this.note).then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been cancelled successfully',
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
            areaSelected(d) { // for select area filter
                this.area = ''
                if (d) {
                    this.area = d.id
                }
                this.renderData(this.search)
            }
        },
        watch: {
            'search': {
                handler: function (search) {
                    let self = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        self.renderData(search)
                    }, 1000);
                },
                deep: true
            },
            'schedule_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.schedule_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.schedule_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.schedule_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.schedule_date.length == 2) {
                                    this.renderData(this.search)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'schedule_date': {
                handler: function (val) {
                    if (val) {
                        this.schedule_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>