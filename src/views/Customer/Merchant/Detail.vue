<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="3">
                    <img
                        v-if="merchantDetail.ktp_photos_url !== null"
                        class="rounded-form preview-image"
                        :src="merchantDetail.ktp_photos_url[0]"
                    />
                    <div v-else :class="'rounded-form text-black60'+imageSizeHandler(merchantDetail)"><p>No image</p></div>   
                    <br v-if="merchantDetail.ktp_photos_url !== null">
                    <span class="ml10">KTP</span>             
                </v-col>
                <v-col cols="12" md="9">
                    <div v-if="merchantDetail.merchant_photos_url !== null" class="d-flex">
                        <div v-for="image in merchantDetail.merchant_photos_url" :key="image" class="mr2">
                            <img
                                class="rounded-form preview-image"
                                :src="image"
                            />
                        </div>
                    </div>
                    <div v-else :class="'rounded-form text-black60'+imageSizeHandler(merchantDetail)"><p>No image</p></div>
                    <span class="ml10">Outlet</span>
                </v-col>
            </v-row>
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{merchantDetail.name}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        v-if="merchantDetail.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                        >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="merchantDetail.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('archived')"
                        >
                        Archived
                    </v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-privilege="'main_olt_upd'" v-if="merchantDetail.status === 1" :to="{ name: 'MerchantUpdate', params: { id: merchantDetail.id } }">
                                <v-list-item-title>Update</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'main_olt_upd_cust_tag'" v-if="merchantDetail.status === 1" :to="{ name: 'MerchantUpdateTag', params: { id: merchantDetail.id } }">
                                <v-list-item-title>Update Tag</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'main_olt_upd_pho_num'" v-if="merchantDetail.status === 1" :to="{ name: 'MerchantUpdatePhone', params: { id: merchantDetail.id } }">
                                <v-list-item-title>Update Phone</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <div>
                                <hr>
                            </div>
                            <v-list-item @click="changeStatus(merchantDetail.code)" v-privilege="'main_olt_sus'">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <span v-if="merchantDetail.suspended === 1">Unsuspend</span>
                                        <span v-else>Suspend</span>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-privilege="'main_olt_urc'" v-if="merchantDetail.status === 2" @click="unarchive(merchantDetail.id)">
                                <v-list-item-content>
                                    <v-list-item-title>Unarchive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-privilege="'main_olt_arc'" v-if="merchantDetail.status === 1" @click="archive(merchantDetail.id)">
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
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
                    <DetailRowNew :name="'Business Type'" :value="merchantDetail.business_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Code'" :value="merchantDetail.code"/>
                </v-col><v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Name'" :value="merchantDetail.pic_name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="merchantDetail.phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Alternative Phone Number'" :value="merchantDetail.alt_phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Email'" :value="merchantDetail.email"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Reference Info'" :value="reference_info"/>
                </v-col>
                 <v-col cols="12" md="6" class="-mt24">
                     <DetailRowNew :name="'Customer Tag'" :value="merchantDetail.tag_customer_name" :align="true"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div v-if="this.merchantDetail.referrer">
                        <DetailRowNew v-if="this.merchantDetail.customer_group == 1" :name="'Referrer Name'" :value="merchantDetail.referrer.name" :routePath="'/customer/merchant/detail/'+merchantDetail.referrer.id"/>
                        <DetailRowNew v-if="this.merchantDetail.customer_group == 2" :name="'Referrer Name'" :value="merchantDetail.referrer.name" :routePath="'/customer/agent/detail/'+merchantDetail.referrer.id"/>
                    </div>
                    <div v-else>
                        <DetailRowNew :name="'Referrer Name'" :value="'-'"/>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Suspend'" :value="merchantDetail.suspended === 1 ? 'Yes' : 'No'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Referral Code'" :value="merchantDetail.referral_code"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="merchantDetail.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs16 bold">Finance Info</v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Finance Area'" :value="merchantDetail.finance_area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Default Payment Term'" :value="merchantDetail.payment_term.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Default Invoice Term'" :value="merchantDetail.invoice_term.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Credit Limit'" :value="merchantDetail.credit_limit_amount > 0 ? formatPrice(merchantDetail.credit_limit_amount) : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Business Type Credit Limit'" :value="merchantDetail.business_type_credit_limit === 1 ? 'Badan Usaha' : 'Personal'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Remaining Credit Limit'" :value="handleRemainingCreditLimitAmount() ? formatPrice(merchantDetail.remaining_credit_limit_amount) : '-'"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Billing Address'" :value="merchantDetail.billing_address" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table -mt4">
            Payment Info
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.payment_channel.name }}</td>
                        <td>{{ props.item.account_name }}</td>
                        <td>{{ props.item.account_number }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div style="padding: 20px;" class="row d-flex align-end justify-end">
            <v-btn
                rounded
                elevation="0"
                class="no-caps px-7"
                :to="'/customer/prospect-customer'"
                style="background: #E6E9ED; color: #768F9C; height: 45px;"
            >
                Back
            </v-btn>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <LoadingBar :value="overlay"/>
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    import ModalDirection from "../../../components/PopupDialog";
    export default {
        name: "MerchantDetail",
        components: {
            ModalDirection,
        },
        data() {
            return {
                table: {
                    fields: [
                        {
                            text:'No',
                            sortable: false,
                            width:"5"
                        },
                        {
                            text:'Payment Channel',
                            sortable: false,
                        },
                        {
                            text:'Account Name',
                            sortable: false,
                        },
                        {
                            text:'Account Number',
                            sortable: false
                        },
                    ],
                },

                modalOpen: false,
                merchantDetail: {
                    business_type: {
                        name: '',
                    },
                    referrer: {
                        id: '',
                        name: '',
                    },
                    finance_area: {
                        name: '',
                    },
                    invoice_term: {
                        name: '',
                    },
                    payment_term: {
                        name: '',
                    },
                    credit_limit_amount: 0,
                    business_type_credit_limit: '',
                    remaining_credit_limit_amount: 0,
                },
                reference_info : '',
                loading:true,
                dataAuditLog : {},
                items:[],
                ConfirmData : {},
                overlay: false,
            }
        },
        methods:{
            async renderData(){
                this.overlay = true
                try{
                    await this.$http.get("/customer/merchant/"+ this.$route.params.id).then(response => {
                        this.merchantDetail = response.data.data
                        this.loading= false
                        this.items = response.data.data.merchant_acc_num
                        if(this.items === null){
                            this.items = []
                        }
                        if (this.merchantDetail.reference_info) {
                            this.$http.get("/config/glossary?conditions=attribute.icontains:reference_info").then(response => {
                                let array = response.data.data
                                array.forEach(e => {
                                    if (e.value_int == 3) {
                                        this.reference_info = e.value_name
                                    }
                                });
                                this.overlay = false
                            });
                        } else {
                            this.reference_info = '-'
                            this.overlay = false
                        }
                    });
                } catch(e) {
                    console.log(e);
                }
            },
            archive(id){
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Archive this Merchant",
                    title : "Archive",
                    text : "Are you sure want to Archive this Merchant?",
                    urlApi : "/customer/merchant/archive/"+id,
                    data : {}
                }
            },
            unarchive(id){
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Unarchive this Merchant",
                    title : "Archive",
                    text : "Are you sure want to Unarchive this Merchant?",
                    urlApi : "/customer/merchant/unarchive/"+id,
                    data : {}
                }
            },
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "merchant"
                }
            },
            // For Switch Merchant Suspension
            changeStatus(d){
                this.$http.post("/customer/merchant/suspension",{
                        merchant_code:d
                    }).then(response => {
                        this.renderData()
                        let msg = "Customer has been " + response.data.data + " successfully"
                        this.notifToast(msg, "success")
                }).catch(e => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Something Wrong',
                        type: 'error',
                    });
                    this.notifToast("Something went wrong, please try again", "error")
                });
            },
            notifToast(a, b) {
                Vue.$toast.open({
                    position: 'top-right',
                    message: a,
                    type: b,
                });
            },
            handleRemainingCreditLimitAmount() { // hide show remaining credit limit
                if (this.merchantDetail.remaining_credit_limit_amount === 0) {
                    if (this.merchantDetail.credit_limit_amount === 0) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            },
            imageSizeHandler(item){ //handling image size by class
                return item.ktp_photos_url === null && item.merchant_photos_url === null ? ' image-box' : ' image-box-big'
            },
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res) {
                if (res) {
                    self.renderData()
                }
            });
        },
    }
</script>

<style scoped>
    .preview-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }
    
    .image-box {
        width:250px;
        height:50px;
        background: #EBEBEB;
        border-style:dashed;
        border-color:gray;
        border-width:1px;
        text-align: center;
        padding-top: 10px;
        margin: 10px;
    }
    
    .image-box-big {
        width:250px;
        height:250px;
        background: #EBEBEB;
        border-style:dashed;
        border-color:gray;
        border-width:1px;
        text-align: center;
        padding-top: 110px;
        margin: 0px 0px 10px 10px;
    }

</style>