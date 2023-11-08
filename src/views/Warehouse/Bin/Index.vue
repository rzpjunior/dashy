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
                        <span>Search by Code, Name, Product Name</span>
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
                    <SelectWarehouse
                        :norequired="true"
                        :dense="true"
                        :aux_data="2"
                        @selected="warehouseSelected"
                        :label="'Warehouse'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
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
                    <router-link :to="{ name: 'CreateBin' }" class="routerLink">
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="no-caps bold white--text"
                            v-privilege="'bin_crt'"
                        >Create Bin</v-btn>
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
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>
                            <router-link :to="{ path: `/warehouse/bin/detail/${props.item.id}`}"
                                class="routerLink" v-privilege="'bin_rdd'"
                            >
                                {{props.item.code}} <br>
                            </router-link>
                            {{props.item.name}}
                        </td>
                        <td>{{props.item.warehouse.name}}</td>
                        <td>{{props.item.product_name}}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('archived')"
                                    :text-color="statusMasterText('archived')"
                                ><span class="pa-md-2">Archived</span></v-chip>
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
                                    <v-list-item :to="{name: 'DetailBin', params: { id: props.item.id }}" v-privilege="'bin_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status == '1'"><hr/></div>
                                    <v-list-item :to="{ name: 'UpdateBin', params: { id: props.item.id } }" v-if="props.item.status == '1'" v-privilege="'bin_upd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status == '1'"><hr/></div>
                                    <v-list-item @click="archived(props.item.id)" v-if="props.item.status =='1'" v-privilege="'bin_arc'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "BinList",
        data() {
            return {
                filter: false,
                search: '',
                loading: false,
                statuses: 1,
                table: {
                    fields: [
                        {
                            text: 'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            width: "5%",
                            sortable: false,
                        }
                    ]
                },
                items: [
                    {
                        warehouse: {
                            name: ''
                        },
                    }
                ],
                SelectWarehouse: '',
                ConfirmData : {}
            }
        },
        mounted() {
            this.renderData('', '')
            let self = this
            this.$root.$on('event_success', function(res) {
                if (res) {
                    self.renderData('', '')
                }
            });
        },
        methods: {
            archived(id) { // change status to archive
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Archive this BIN",
                    title: "Archive BIN",
                    text: "Are you sure want to Archive this BIN?",
                    urlApi: "/warehouse/bin/archive/" + id,
                    data: {},
                }
            },
            renderData(search) {
                this.loading = true
                this.items = []
                let statuses = []
                if (this.statuses === 999) {
                    statuses = ''
                } else {
                    statuses= "|status:"+this.statuses
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|warehouse_id.e:' + this.SelectWarehouse
                }
                let product_search = ''
                if (this.search) {
                    product_search = '%2COr.product.name.icontains:' + this.search
                }
                this.$http.get("/warehouse/bin", { // get data from API
                    params: {
                        perpage: 100,
                        conditions: 'Or.code.icontains:' + search + '%2COr.name.icontains:' + search + product_search + statuses + warehouse,
                        embeds: 'warehouse',
                        orderby: '-id'
                    }
                }).then(res => {
                    this.loading = false
                    this.items = res.data.data
                    if(this.items === null){
                        this.items = []
                    }
                }).catch(err => {
                    this.loading = false
                })
            },
            warehouseSelected(d) { // select warehouse
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search)
            },
        },
        watch: {
            'search': { // watch perubahan ketika search
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val)
                    }, 1000);
                },
                deep: true
            },
            'statuses': { // watch perubahan ketika ganti status
                handler: function (val) {
                    let that = this
                    that.renderData(this.search)
                },
                deep: true
            },
        },
    }
</script>