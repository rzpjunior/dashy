<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{items.name}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="this.items.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            depressed
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >Active</v-btn>
                    </div>
                    <div v-if="this.items.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            depressed
                            class="no-caps mb4"
                            :color="statusMaster('archived')"
                        >Archived</v-btn>
                    </div>
                    <v-menu offset-y >
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list class="bg-white">
                        <v-list-item :to="`/purchase/supplier/update/${items.id}`" v-if="items.status == 1" v-privilege="'sup_upd'">
                            <v-list-item-content>
                                <v-list-item-title>Update</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon>
                                <v-icon>mdi-open-in-new</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                        <div v-if="items.status == 1">
                            <hr/>
                        </div>
                        <v-list-item v-if="items.status == 1" @click="archived(items.id)" v-privilege="'sup_arc'">
                            <v-list-item-content>
                                <v-list-item-title>Archive</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <div v-if="items.status == 1">
                            <hr/>
                        </div>
                        <v-list-item v-if="items.status == 2" @click="unarchived(items.id)" v-privilege="'sup_urc'">
                            <v-list-item-content>
                                <v-list-item-title>Unarchive</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <div v-if="items.status == 2">
                            <hr/>
                        </div>
                        <v-list-item @click="seeHistory()" v-privilege="'filter_rdl'">
                            <v-list-item-content>
                                <v-list-item-title>History</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Code'" :value="items.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier Organization'" :value="items.supplier_organization ? items.supplier_organization.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Commodity'" :value="items.supplier_commodity ? items.supplier_commodity.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier Badge'" :value="items.supplier_badge ? items.supplier_badge.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Type'" :value="!items.supplier_type ? '-' : `${items.supplier_type.abbreviation} - ${items.supplier_type.name}`"/>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'PIC Name'" :value="items.pic_name"/>
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Email'" :value="items.email"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="items.phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Alternative Phone Number'" :value="items.alt_phone_number ? items.alt_phone_number : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Term'" :value="items.purchase_term ? items.purchase_term.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Method'" :value="items.payment_method.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Rejectable'" :value="items.rejectable == 1 ? 'Yes' : items.rejectable == 2 ? 'No' : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Returnable'" :value="items.returnable == 1 ? 'Yes' : items.returnable == 2 ? 'No' : '-'"/>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Sub District'" :value="items.sub_district ? items.sub_district.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'District'" :value="items.sub_district ? items.sub_district.district.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'City'" :value="items.sub_district ? items.sub_district.district.city.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Province'" :value="items.sub_district ? items.sub_district.district.city.province.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Block Number'" :value="items.block_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24"></v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Address'" :value="items.address" :align="true"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>

<script>
    export default {
        name: "SupplierDetail",
        data() {
            return {
                ConfirmData : "",
                dataAuditLog : {},
                items:{
                    name: "",
                    payment_method : {
                        name : ""
                    },
                    supplier_type: {
                        name: "",
                        abbreviation: "",
                    },
                    purchase_term: {
                        name: "",
                    },
                    sub_district: {
                        name: "",
                        district: {
                            name: "",
                            city: {
                                name: "",
                                province: {
                                    name: "",
                                },
                            },
                        },
                    },
                },
            }
        },
        methods:{
            archived(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Archive this Supplier",
                    title : "Archive Supplier",
                    text : "Are you sure want to Archive this Supplier ?",
                    urlApi : "/purchase/supplier/archive/"+id,
                    data : {}
                }
            },
            unarchived(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Unarchive this Supplier",
                    title : "Unarchive Supplier",
                    text : "Are you sure want to Unarchive this Supplier ?",
                    urlApi : "/purchase/supplier/unarchive/"+id,
                    data : {}
                }
            },
            renderData(){
                this.$http.get("/purchase/supplier/"+ this.$route.params.id).then(response => {
                    this.items = response.data.data
                });
            },
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "supplier"
                }
            },
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData()
                }
            });
        },
    }
</script>