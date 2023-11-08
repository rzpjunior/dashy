<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb2">
                <v-col class="fs24 bold">
                    {{items.name}}
                </v-col>
                <v-col class="d-flex justify-end mt8">
                    <v-btn
                        v-if="items.status == 1"
                        elevation="0"
                        rounded
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                        small
                    >Active</v-btn>
                    <v-btn
                        v-if="items.status == 2"
                        elevation="0"
                        rounded
                        class="no-caps mb4"
                        :color="statusMaster('archived')"
                        small
                    >Archived</v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" class="-mt3">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-privilege="'agt_upd'" :to="`/customer/agent/update/${items.id}`" v-if="items.status == 1">
                                <v-list-item-title>Update</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'agt_upd_cust_tag'" :to="`/customer/agent/customer-tag/update/${items.id}`" v-if="items.status == 1">
                                <v-list-item-title>Update Tag</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'agt_upd_sps'" :to="`/customer/agent/salesperson/update/${items.id}`" v-if="items.status == 1">
                                <v-list-item-title>Update Salesperson</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'agt_upd_pho_num'" :to="`/customer/agent/phone-number/update/${items.id}`" v-if="items.status == 1">
                                <v-list-item-title>Update Phone Number</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'agt_cvt_arc'" :to="`/customer/agent/archetype/convert/${items.id}`" v-if="items.status == 1">
                                <v-list-item-title>Convert Archetype</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'agt_crt_shp_adr'" :to="`/customer/agent/shipping-address/create/${items.id}`" v-if="items.status == 1">
                                <v-list-item-title>Create Shipping Address</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <div>
                                <hr>
                            </div>
                            <v-list-item v-privilege="'main_olt_sus'" @click="changeStatus(items.code)">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <span v-if="items.suspended === 1">Unsuspend</span>
                                        <span v-else>Suspend</span>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-privilege="'agt_arc'" v-if="items.status == 1" @click="archived(items.id)">
                                <v-list-item-title>Archive</v-list-item-title>
                            </v-list-item>
                            <v-list-item v-privilege="'agt_urc'" v-if="items.status == 2" @click="unarchived(items.id)">
                                <v-list-item-title>Unarchive</v-list-item-title>
                            </v-list-item>
                            <v-list-item v-privilege="'filter_rdl'" @click="seeHistory()">
                                <v-list-item-title>See History</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Code'" :value="items.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Name'" :value="items.pic_name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Archetype'" :value="data[0].archetype.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Business Type'" :value="items.business_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="items.phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Alternative Phone Number'" :value="items.alt_phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Email'" :value="items.email"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div v-if="items.gender">
                        <DetailRowNew :name="'Gender'" :value="'Laki-Laki'" v-if="items.gender == 1"/> 
                        <DetailRowNew :name="'Gender'" :value="'Perempuan'" v-else/>
                    </div>
                    <DetailRowNew :name="'Gender'" :value="'-'" v-else/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Birthdate'" :value="formatDate(items.birth_date)" v-if="items.birth_date"/>
                    <DetailRowNew :name="'Birthdate'" :value="'-'" v-else/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Reference Info'" :value="reference_info" v-if="items.reference_info"/>
                    <DetailRowNew :name="'Reference Info'" :value="'-'" v-else/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Referral Code'" :value="items.referral_code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div class="row second-color">
                        <div class="col mt-1">Referrer Name :</div>
                        <div class="col mt-1 d-flex justify-end" v-if="items.referrer.customer_group == 2">
                            <router-link :to="`/customer/agent/detail/${items.referrer.id}`" style="text-decoration: none;">
                                {{items.referrer.name}}
                            </router-link>
                        </div>
                        <div class="col mt-1 d-flex justify-end" v-else-if="items.referrer.customer_group == 1">
                            <router-link :to="`/customer/merchant/detail/${items.referrer.id}`" style="text-decoration: none;">
                                {{items.referrer.name}}
                            </router-link>
                        </div>
                        <div class="col mt-1 d-flex justify-end" v-else>-</div>
                    </div>
                    <v-divider class="my-2"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer Tag'" :value="items.tag_customer_name" :align="true"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Suspend'" :value="items.suspended === 1 ? 'Yes' : 'No'" :align="true"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="my2">
                <v-col cols="12" class="fs16 bold">Finance Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Finance Area'" :value="items.finance_area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Default Payment Term'" :value="items.payment_term.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Default Invoice Term'" :value="items.invoice_term.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Group'" :value="items.payment_group.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Business Type Credit Limit'" :value="items.business_type_credit_limit === 1 ? 'Badan Usaha' : 'Personal'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Credit Limit'" :value="items.credit_limit_amount > 0 ? formatPrice(items.credit_limit_amount) : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Remaining Credit Limit'" :value="handleRemainingCreditLimitAmount() ? formatPrice(items.remaining_credit_limit_amount) : '-'"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Billing Address'" :value="items.billing_address" :align="true"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">

                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="my2">
                <v-col cols="12" class="fs16 bold">Sales Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Salesperson'" v-if="data[0].salesperson" :value="data[0].salesperson.name"/>
                    <DetailRowNew :name="'Salesperson'" v-else :value="'-'"/>
                </v-col>
            </v-row>
            <div>
                <v-col cols="12" class="fs16 bold">Price Set per Area</v-col>
            </div>
            <v-row class="mx-6" >
                <v-col>
                    <div v-for="(item, idx) in items.price_set_area" :key="idx">
                        <DetailRowNew v-if="idx % 2==0" :name="item.area.name" :value="item.price_set.name"/>
                    </div>
                </v-col>
                <div style="width:5%"/>
                <v-col>
                    <div v-for="(item, idx) in items.price_set_area" :key="idx">
                        <DetailRowNew v-if="idx % 2!==0" :name="item.area.name" :value="item.price_set.name"/>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Shipping Info
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="data"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.address_name }}</td>
                        <td>{{ props.item.pic_name }}</td>
                        <td>{{ props.item.phone_number }}</td>
                        <td>{{ props.item.shipping_address }}</td>
                        <td>{{ props.item.sub_district.concat_address }} {{ props.item.sub_district.postal_code }}</td>
                        <td>{{ props.item.area.name }}</td>
                        <td>
                            <v-checkbox
                                v-if="props.item.main_branch==1"
                                v-model="checkbox"
                                :readonly="true"
                                color="#50AE55"
                            ></v-checkbox>
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
                                    <v-list-item  :to="`/customer/agent/shipping-address/detail/${props.item.id}`" >
                                        <v-list-item-title>Detail</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-if="props.item.status == 1" :to="`/customer/agent/shipping-address/update/${props.item.id}`" >
                                        <v-list-item-title>Update</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-header-table">
            Payment Info
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields2"
                :items="items.merchant_acc_num"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.item.payment_channel.name }}</td>
                        <td>{{ props.item.account_name }}</td>
                        <td>{{ props.item.account_number }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "Tag",
        data() {
            return {
                modalOpen: false,
                search: '',
                loading: false,
                checkbox: true,
                table: {
                    fields: [
                        {
                            text:'No',
                            width: "5%",
                            sortable: false,
                        },
                        {
                            text:'Address Name',
                            sortable: false
                        },
                        {
                            text:'Recipient Name',
                            sortable: false
                        },
                        {
                            text:'Phone Number',
                            sortable: false
                        },
                        {
                            text:'Address',
                            sortable: false
                        },
                        {
                            text:'Sub District - Province',
                            sortable: false
                        },
                        {
                            text:'Area',
                            sortable: false
                        },
                        {
                            text:'Default',
                            sortable: false
                        },
                        {
                            text:'Action',
                            width: "5%",
                            sortable: false
                        },
                    ],
                    fields2: [
                        {
                            text:'Payment Channnel',
                            sortable: false,
                        },
                        {
                            text:'Account Name',
                            sortable: false
                        },
                        {
                            text:'Account Number',
                            sortable: false
                        }
                    ],
                },
                items : {
                    business_type : {
                        name :''
                    },
                    finance_area : {
                        name :''
                    },
                    payment_term : {
                        name :''
                    },
                    invoice_term : {
                        name :''
                    },
                    payment_method : {
                        name :''
                    },
                    payment_group : {
                        name :''
                    },
                    referrer : {
                        id :'',
                        name :'',
                    },
                    credit_limit: null,
                    credit_limit_amount: 0
                },
                data : [{
                    archetype : {
                        name :''
                    },
                    price_set : {
                        name :''
                    },
                    salesperson : {
                        name :''
                    },
                    area : {
                        name :''
                    },
                    sub_district : {
                        concat_address : "",
                        postal_code : ""
                    }

                }],
                ConfirmData : {},
                reference_info : '',
                dataAuditLog : {}
            }
        },
        created() {
            this.renderData()
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData()
                }
            });
        },
        methods: {
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "agent"
                }
            },
            archived(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Archive this Agent",
                    title : "Archive",
                    text : "Are you sure want to Archive this Agent ?",
                    urlApi : "/customer/agent/archive/"+id,
                    data : {}
                }
            },
            unarchived(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Unarchive this Agent",
                    title : "Unarchive",
                    text : "Are you sure want to Unarchive this Agent ?",
                    urlApi : "/customer/agent/unarchive/"+id,
                    data : {}
                }
            },
            async renderData(){
                this.loading = true;
                await this.$http.get("/customer/agent/"+this.$route.params.id).then(response => {
                    this.loading = false;
                    this.data = response.data.data;
                    this.items = response.data.data[0].merchant;
                    if(!this.items.referrer){
                        this.items.referrer = {
                            id : "-",
                            name : '-',
                        }
                    }
                    if (this.items.reference_info) {
                        this.$http.get("/config/glossary?conditions=attribute.icontains:reference_info").then(response => {
                            let array = response.data.data
                            array.forEach(e => {
                                if (e.value_int == this.items.reference_info) {
                                    this.reference_info =e.value_name
                                }
                            });
                        });
                    }
                });
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
                if (this.items.remaining_credit_limit_amount === 0) {
                    if (this.items.credit_limit_amount === 0) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            }
        },
    }
</script>