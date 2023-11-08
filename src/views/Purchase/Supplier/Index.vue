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
                        outlined
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSupplierType
                        :dense="true"
                        name= "SupplierType"
                        :norequired="true"
                        @selected="supplierTypeSelected">
                    </SelectSupplierType>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSupplierOrganization
                        :dense="true"
                        name= "SupplierOrganization"
                        :norequired="true"
                        @selected="supplierOrganizationSelected">
                    </SelectSupplierOrganization>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'SupplierCreate' }"
                        class="no-caps bold"
                        v-privilege="'sup_crt'"
                    >
                    <span class="text-white">
                        Create Supplier
                    </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :loading="loading"
                :items="items"
                :items-per-page="10"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.code }}<br>
                        <span class="text-black60">{{ props.item.name }}</span></td>
                        <td>{{ props.item.supplier_type ? props.item.supplier_type.name : '-' }}</td>
                        <td>{{ props.item.supplier_organization ? props.item.supplier_organization.name : '-' }}</td>
                        <td>{{ props.item.pic_name }}<br>
                        <span class="text-black60">{{ props.item.phone_number }}</span></td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else>
                                <v-chip
                                    :color="statusMaster('archived')"
                                    :text-color="statusMasterText('archived')"
                                >Archived</v-chip>
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
                                    <v-list-item  :to="`/purchase/supplier/detail/${props.item.id}`" v-privilege="'sup_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-if="props.item.status == 1" :to="`/purchase/supplier/update/${props.item.id}`" v-privilege="'sup_upd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
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
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "Supplier",
        data() {
            return {
                filter: false,
                search: '',
                loading: false,
                supplierTypeId : "",
                supplierOrganizationId: "",
                statuses:1,
                ConfirmData : "",
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Type',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Organization',
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
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[],
            }
        },
        mounted() {
            this.renderData('',this.statuses, this.supplierTypeId, this.supplierOrganizationId)
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search,self.statuses, self.supplierTypeId, self.supplierOrganizationId)
                }
            });
        },
        methods: {
            // Select Organization 
            supplierOrganizationSelected(d){
                this.supplierOrganizationId = ''
                if (d) {
                    this.supplierOrganizationId = d.id
                }
                this.renderData(this.search,this.statuses, this.supplierTypeId, this.supplierOrganizationId)
            },
            supplierTypeSelected(d) {
                this.supplierTypeId = ''
                if (d) {
                    this.supplierTypeId = d.id
                }
                this.renderData(this.search,this.statuses, this.supplierTypeId, this.supplierOrganizationId)
            },
            renderData(search,statuses, supplierType, supplierOrganization){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                if (supplierType != "") {
                    supplierType = "|supplier_type_id.e:"+supplierType
                }
                if (supplierOrganization != "") {
                    supplierOrganization = "|supplier_organization_id.e:"+supplierOrganization
                }
                this.$http.get("/purchase/supplier",{params:{
                        perpage:100,
                        embeds:'suppliertype,supplierorganization',
                        conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'
                        +search+statuses+supplierType+supplierOrganization,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.statuses,that.supplierTypeId,that.supplierOrganizationId)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(that.search,val, that.supplierTypeId, that.supplierOrganizationId)
                },
                deep: true
            },
        },
    }
</script>