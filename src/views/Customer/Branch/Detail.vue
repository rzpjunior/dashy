<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs24 bold">Main Outlet</v-col>
                <v-col cols="12" class="fs16 bold">Basic Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Business Type'" :value="branchDetail.merchant.business_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Main Outlet'" :value="branchDetail.merchant.name" :routePath="'/customer/merchant/detail/'+this.branchDetail.merchant.id"/>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col cols="12" class="fs24 bold">Outlet</v-col>
            </v-row>
            <v-row class="mb2">
                <v-col class="fs16 bold">Basic Info</v-col>
                <v-col class="d-flex justify-end -mt5">
                    <v-btn
                        v-if="branchDetail.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                    >Active</v-btn>
                    <v-btn
                        v-if="branchDetail.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('archived')"
                    >Archived</v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" class="-mt3">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-privilege="'olt_upd'" :to="{ name: 'BranchUpdate', params: { id: branchDetail.id } }">
                                <v-list-item-title>Update</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'olt_cvt_arc'" :to="`/customer/branch/archetype/convert/${branchDetail.id}`" v-if="items.status == 1 && branchDetail.status === 1">
                                <v-list-item-title>Convert Archetype</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'olt_cvt_arc'" :to="`/customer/branch/convert/${branchDetail.id}`" v-if="items.status != 1 && branchDetail.status === 1">
                                <v-list-item-title>Convert Archetype</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <div>
                                <hr>
                            </div>
                            <v-list-item v-privilege="'olt_upd_sps'" @click="showUpdateSalesperson(branchDetail.id)">
                                <v-list-item-title>Update Salesperson</v-list-item-title>
                            </v-list-item>
                            <v-list-item v-privilege="'olt_arc'" @click="archive(branchDetail.id)" v-if="branchDetail.status === 1">
                                <v-list-item-title>Archive</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="unarchive(branchDetail.id)" v-if="branchDetail.status === 2">
                                <v-list-item-title>Unarchive</v-list-item-title>
                            </v-list-item>
                            <v-list-item v-privilege="'filter_rdl'" @click="seeHistory()">
                                <v-list-item-title>See History</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Outlet Code'" :value="branchDetail.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Outlet Name'" :value="branchDetail.name"/>
                </v-col>
            </v-row>
            <v-row class="my2">
                <v-col cols="12" class="fs16 bold">Sales Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Archetype'" :value="branchDetail.archetype.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Salesperson'" :value="branchDetail.salesperson.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Price Set'" :value="branchDetail.price_set.name"/>
                </v-col>
            </v-row>
            <v-row class="my2">
                <v-col cols="12" class="fs16 bold">Shipping Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Name'" :value="branchDetail.pic_name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="branchDetail.phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Alternative Phone Number'" :value="branchDetail.alt_phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Province'" :value="branchDetail.sub_district.district.city.province.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'City'" :value="branchDetail.sub_district.district.city.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'District'" :value="branchDetail.sub_district.district.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Sub District'" :value="branchDetail.sub_district.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Postal Code'" :value="branchDetail.sub_district.postal_code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Default Warehouse'" :value="branchDetail.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="branchDetail.sub_district.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Default Shipping Address'" :value="branchDetail.main_branch === 1 ? 'Yes' : branchDetail.main_branch === 2 ? 'No' : '-'"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Shipping Address'" :value="branchDetail.shipping_address" :align="true"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="branchDetail.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <v-dialog v-model="modalSalesperson" max-width="470px">
            <v-card class="OpenSans pb10">
                <v-card-title>
                    <span class="text-title-modal">Update Salesperson</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Enter the salesperson to update this outlet</span>
                </v-card-text>
                <v-col cols="12" class="px20 ">
                    <selectSalesPerson
                        v-model="salesperson"
                        @selected="salespersonSelected"
                        required
                        :dense="true"
                    ></selectSalesPerson>
                </v-col>
                <v-card-actions class="justify-end -mt15">
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="modalSalesperson = false"
                    ><span class="text-black80">Cancel</span></v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="updateSalesperson()"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <AuditLogNew :data="dataAuditLog"/>
        <LoadingBar :value="loading"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    import ModalDirection from "../../../components/PopupDialog";
    export default {
        name: "BranchDetail",
        components: {
            ModalDirection
        },
        data() {
            return {
                modalOpen: false,
                branchDetail:{
                    id: '',
                    code: '',
                    name: '',
                    pic_name: '',
                    alt_phone_number: '',
                    phone_number: '',
                    shipping_address: '',
                    note: '',
                    main_branch: '',
                    archetype:{
                        name: ''
                    },
                    price_set:{
                        name: ''
                    },
                    salesperson:{
                        name: ''
                    },
                    warehouse:{
                        name: '',
                    },
                    merchant:{
                        id: '',
                        name: '',
                        business_type:{
                            name: ''
                        },
                        status: '',
                    },
                    sub_district:{
                        name: '',
                        district:{
                            name: '',
                            city:{
                                name: '',
                                province:{
                                    name: '',
                                }
                            }
                        },
                        postal_code: '',
                        area:{
                            name: '',
                        }
                    },
                },
                dataAuditLog : {},
                loading:true,

                items:[],
                confirmation:{
                    valueName: 'Outlet',
                    status:'',
                    urlPath:'',
                    parentPath:'/customer/branch',
                },
                ConfirmData : {},
                form: {
                    salesperson_id:'',
                },
                salesperson:null,
                modalSalesperson: false,
                disableSave:true,
            }
        },
        methods:{
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "outlet"
                }
            },
            async renderData(){
                try{
                    await this.$http.get("/customer/branch/"+ this.$route.params.id).then(response => {
                        this.branchDetail = response.data.data
                        this.salespersonSelected(response.data.data.salesperson)
                    });
                    this.loading= false
                } catch(e) {
                    console.log(e);
                }
            },
            updateSalesperson() {
                this.$http.put('/customer/branch/salesperson/' + this.$route.params.id,
                    {
                        salesperson_id: this.form.salesperson_id,
                    }).then(response => {
                        this.modalSalesperson = false
                        Vue.$toast.open({
                            position: 'top-right',
                            message: 'Data has been saved successfully',
                            type: 'success',
                        });
                        this.renderData()
                })
                    .catch(e => {
                        this.error = e.errors
                    });
            },
            archive(id){
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Archive this Outlet",
                    title : "Archive",
                    text : "Are you sure want to Archive this Outlet?",
                    urlApi : "/customer/branch/archive/"+id,
                    data : {}
                }
            },
            unarchive(id){
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Unarchive this Outlet",
                    title : "Archive",
                    text : "Are you sure want to Unarchive this Outlet?",
                    urlApi : "/customer/branch/unarchive/"+id,
                    data : {}
                }
            },
            showUpdateSalesperson(){
                this.modalSalesperson = true
            },
            salespersonSelected(d) {
                this.salesperson = null;
                this.form.salesperson_id = '';
                if (d !== '' && d !== undefined && d !== null) {
                    this.salesperson = d;
                    this.form.salesperson_id = d.id
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
        watch: {
            'form.salesperson_id': {
                handler: function (val) {
                    if(val){
                        this.disableSave = false
                    }else{
                        this.disableSave = true
                    }
                },
                deep: true
            },
        },
    }
</script>
