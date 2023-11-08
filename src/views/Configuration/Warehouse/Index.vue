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
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        label="Status"
                        dense
                        outlined
                    ></v-select>
                </v-col>
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
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="right">
                    <v-btn
                        v-privilege="'wrh_crt'"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold mr-4"
                        :to="{ name: 'WarehouseCreate' }"
                    >
                        <span class="text-white"> Create Warehouse </span>
                    </v-btn>
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
                    <tr style="height:48px">
                        <td>
                            {{ props.item.code }}<br>
                        <span class="text-black60">{{ props.item.name }}</span>
                        </td>
                        <td>{{ props.item.area.name }}</td>
                        <td>{{ props.item.pic_name }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                > <span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else>
                                <v-chip
                                    :color="statusMaster('archived')"
                                >Archived</v-chip>
                            </div>
                        </td>
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
                                    <v-list-item v-privilege="'wrh_rdd'" :to="{ name: 'WarehouseDetail', params: { id: props.item.id } }">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-privilege="'wrh_upd'" :to="{ name: 'WarehouseUpdate', params: { id: props.item.id } }" v-if="props.item.status == 1">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div>
                                        <hr>
                                    </div>
                                    <v-list-item @click="openModalParameter(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>Picking Parameter</v-list-item-title>
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
            v-model="modalPicking"
            persistent
            max-width="850px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlayPicking"/>
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="6">
                            Picking Parameter
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="6">
                            <v-btn
                                icon
                                @click="modalPicking = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <div>
                        <v-row>
                            <v-col cols="12" md="6" class="mt24">
                                <v-select
                                    v-model="limit_pl"
                                    :items="pl_limit"
                                    item-text="text"
                                    item-value="value"
                                    label="Picking List Limit"
                                    dense
                                    outlined
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="6" class="mt24">
                                <DetailRowNew :name="'Weight Limit (Kg)'" :value="'80'"/>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="setPickingLimit()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        :disabled="validation"
                    >
                        <span>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import Vue from 'vue'
    export default {
        name: "Warehouse",
        data() {
            return {
                limit_pl: '',
                modalPicking: false,
                search: '',
                loading: false,
                area:null,
                area_id:'',
                statuses:1,
                filter : false,
                overlayPicking: false,
                pl_limit: [
                    {
                        text: '2',
                        value: 2
                    },
                    {
                        text: '3',
                        value: 3
                    },
                    {
                        text: '4',
                        value: 4
                    }
                ],
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'PIC Name',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            sortable: false,
                            width:'5px'
                        },
                    ],
                },
                items:[],
                id_warehouse: ''
            }
        },
        created() {
            this.renderData('',this.statuses)
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
            openModalParameter(id){
                this.id_warehouse = id
                this.modalPicking = true
            },
            setPickingLimit(){
                this.overlayPicking = true
                this.$http.put('/config/warehouse/update/param/'+this.id_warehouse, {
                    limit_sales_order: this.limit_pl,
                    limit_weight: 80
                }).then(res => {
                    this.overlayPicking = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Success set picking parameter',
                        type: 'success',
                    });
                    this.modalPicking = false
                })
            },
            renderData(search){
                this.loading = true;
                this.items = []
                let statuses = ''
                if(this.statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+this.statuses
                }
                let areaID = ''
                if(this.area_id) {
                    areaID = "|area_id.e:"+ this.area_id
                }
                this.$http.get("/config/warehouse",{params:{
                        perpage:100,
                        conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'
                        +search+statuses+areaID,
                        embeds: 'area_id',
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            areaSelected(d){
                this.area_id = '';
                if(d){
                    this.area_id = d.id;
                }
                this.renderData(this.search, this.statuses)
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
            }
        },
    }
</script>