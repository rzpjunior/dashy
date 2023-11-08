<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb2">
                <v-col class="fs24 bold">
                    {{ item.name }}
                </v-col>
                <v-col class="d-flex justify-end mt8">
                    <v-btn
                        v-if="item.reg_status === 1"
                        rounded
                        elevation="0"
                        background="#red"
                        class="no-caps"
                        :color="statusMaster('new')"
                        small
                    >New</v-btn>
                    <v-btn
                        v-if="item.reg_status === 2"
                        rounded
                        elevation="0"
                        class="no-caps"
                        :color="statusMaster('registered')"
                        small
                    >Registered</v-btn>
                    <v-btn
                        v-if="item.reg_status === 3"
                        rounded
                        elevation="0"
                        class="no-caps"
                        :color="statusMaster('declined')"
                        small
                    >Declined</v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" class="-mt3">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white" v-if="item.reg_status === 1">
                            <v-list-item
                                v-privilege="'pro_cst_reg'"
                                @click="regis(item.id)"
                                v-if="item.reg_status === 1 && !item.merchant.upgrade_status"
                            >
                                <v-list-item-title>Register</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item
                                v-privilege="'pro_cst_dec'"
                                v-if="item.reg_status === 1"
                                @click="declineDialog = true, clearDeclineType = false, decline_note = ''"
                            >
                                <v-list-item-title>Decline</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <v-list-item
                                v-privilege="'pro_cst_upg'"
                                v-if="item.reg_status === 1 && item.merchant.upgrade_status"
                                @click="upgrade(item.id)"
                            >
                                <v-list-item-title>Upgrade</v-list-item-title>
                                <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                            </v-list-item>
                            <div>
                                <hr>
                            </div>
                            <v-list-item @click="seeHistory()" v-privilege="'filter_rdl'">
                                <v-list-item-title>History</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Archetype'" :value="item.archetype.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Name'" :value="item.pic_name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div class="row break-words">
                        <div class="col-5 text-black60">Phone Number :</div>
                        <div class="col d-flex justify-end text-black">
                            <a 
                                :href="'https://api.whatsapp.com/send?phone=62'+item.phone_number" 
                                class="linkReload" 
                                target="_blank"
                            >
                                <span class="flex-display">
                                    {{item.phone_number}}
                                    <v-img 
                                        class="mt1 ml5"
                                        src="/img/whatsapp-icon.svg" 
                                        max-height="21"
                                        max-width="25"
                                    />
                                </span>
                            </a>
                        </div>
                    </div>
                    <v-divider class="my-3"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Best Time To Call'" :value="
                            item.time_consent === 1
                            ? 'Morning'
                            : item.time_consent === 2
                            ? 'Afternoon'
                            : 'Night'
                        "
                    />
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Address'" :value="item.street_address" :align="true"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Subdistrict'" :value="item.sub_district.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'District'" :value="item.sub_district.district.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'City'" :value="item.sub_district.district.city.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Province'" :value="item.sub_district.district.city.province.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="item.sub_district.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Postal Code'" :value="item.sub_district.postal_code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Reference Info'" :value="reference_info ? reference_info : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Referrer Code'" :value="item.referrer_code ? item.referrer_code : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Salesperson'" :value="item.salesperson ? item.salesperson : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div class="row">
                        <div class="col mt-1 text-black60">Previous Merchant :</div>
                        <div
                            class="col mt-1 d-flex justify-end"
                            v-if="item.merchant.customer_group == 2"
                        >
                            <router-link
                                :to="`/customer/agent/detail/${item.merchant.id}`"
                                style="text-decoration: none;"
                            >{{ item.merchant.code }} - {{ item.merchant.name }}</router-link>
                        </div>
                        <div
                            class="col mt-1 d-flex justify-end"
                            v-else-if="item.merchant.customer_group == 1"
                        >
                            <router-link
                                :to="`/customer/merchant/detail/${item.merchant.id}`"
                                style="text-decoration: none;"
                            >{{ item.merchant.code }} - {{ item.merchant.name }}</router-link>
                        </div>
                        <div class="col mt-1 d-flex justify-end" v-else>-</div>
                    </div>
                    <v-divider class="my-2"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Registration Channel'" :value="item.reg_channel_name ? item.reg_channel_name : '-'"/>
                </v-col>
                <v-col cols="12" class="-mt24" v-if="item.outlet_photo_list != null && item.outlet_photo_list.length > 0">
                    <span class="text-black60">Photo Outlet :</span>
                    <div class="flex-display py8">
                        <div v-for="(item, idx) in item.outlet_photo_list" :key="idx" class="mr8">
                            <DisplayPhotoOverlay :title="'Photo Outlet'" :src="item"/>
                        </div>
                    </div>
                </v-col>
                <v-col cols="6" class="pr-13" v-if="item.decline_type">
                    <DetailRowNew :name="'Decline Type'" :value="item.decline_type"/>
                </v-col>
                <v-col cols="6" class="pl-13" v-if="item.decline_note">
                    <DetailRowNew :name="'Decline Note'" :value="item.decline_note"/>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="my2">
                <v-col cols="12" class="fs16 bold">Business Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="px-5 mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Business Name'" :value="item.pic_business_name.length > 0 ? item.pic_business_name : '-' "/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Business Contact'" :value="item.pic_business_contact.length > 0 ? item.pic_business_contact : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Business ID Number'" :value="item.id_card_number.length > 0 ? item.id_card_number : '-' "/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Tax Number'" :value="item.taxpayer_number.length > 0 ? item.taxpayer_number : '-' "/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="item.id_card_image || item.selfie_image || item.taxpayer_image">
                    <span class="text-black60">Photo Identity :</span>
                    <div class="flex-display py8">
                        <div class="mr8">
                            <DisplayPhotoOverlay :title="'Photo Identity'" :src="item.id_card_image"/>
                        </div>
                        <div class="mr8">
                            <DisplayPhotoOverlay :title="'Photo Identity'" :src="item.selfie_image"/>
                        </div>
                        <div class="mr8">
                            <DisplayPhotoOverlay :title="'Photo Identity'" :src="item.taxpayer_image"/>
                        </div>
                    </div>
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
                    <DetailRowNew :name="'PIC Finance Name'" :value="item.pic_finance_name.length > 0 ? item.pic_finance_name : '-' "/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'PIC Finance Contact'" :value="item.pic_finance_contact ? item.pic_finance_contact : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Term'" :value="item.payment_term !== undefined ? item.payment_term.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Invoice Term'" :value="item.invoice_term !== undefined ? item.invoice_term.name : '-' "/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Billing Address'" :value="item.billing_address !== undefined ? item.billing_address : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="item.note != undefined ? item.note : '-'"/>
                </v-col>
            </v-row>
        </div>
        <v-dialog v-model="register" persistent max-width="402px">
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Register Prospective Customer</span>
                </v-card-title>
                <v-card-text>
                    <div class="flex-align-center">
                        <v-img
                            width="235"
                            src="/img/register-customer.png"
                        />
                    </div>
                    <SelectArchetype
                        name="archetype_name"
                        @selected="archetypeSelected2" :nameaux_data="2"
                        :dense="true"
                        class="pt-6"
                    ></SelectArchetype>
                </v-card-text>
                <v-card-actions class="d-flex justify-end pb-4">
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="register = false"
                    ><span class="text-black80">Cancel</span></v-btn>
                    <v-btn
                        @click="nextMethod()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        :disabled="this.archetype ? false : true"
                    >Next</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="declineDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Decline</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this prospective customer declined?</span>
                    <SelectDeclineType
                        @selected="selectedDeclineType" :nameclear="clearDeclineType" :nameerror="error.decline_type_id"
                        class="mt-6" :dense="true"
                    />
                    <v-textarea
                        name="note"
                        v-model="decline_note"  :namecounter="250"
                        maxlength="250"
                        outlined
                        :error-messages="error.decline_note"
                        required
                        dense
                        rows="3"
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="declineDialog = false,clearDeclineType = true"
                    ><span class="text-black80">Cancel</span></v-btn>
                    <v-btn
                        @click="decline(item.id)"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "ProspectCustomerDetail",
        data() {
            return {
                ConfirmData: {},
                dataAuditLog: {},
                register: false,
                loading: true,
                archetype: null,
                next: "",
                customerID: "",
                archetype_id: "",
                reference_info: "",
                item: {
                    archetype: {
                        name: "",
                    },
                    name: "",
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
                        area: {
                            name: "",
                        },
                    },
                    merchant: {
                        customer_group: "",
                    },
                    pic_business_name: "",
                    id_card_number: "",
                    pic_business_contact: "",
                    taxpayer_number: "",
                    pic_finance_name: "",
                },
                outlet_pictures: [],
                declineDialog: false,
                decline_type: "",
                decline_note: "",
                clearDeclineType:false,
                error: {},
            };
        },
        mounted() {
            let self = this;
            this.$root.$on("event_success", function (res) {
                if (res) {
                    self.renderData();
                }
            });
        },
        methods: {
            renderData() {
                this.$http
                    .get("/customer/prospect_customer/" + this.$route.params.id)
                    .then((response) => {
                        this.item = response.data.data;
                        if (!this.item.merchant) {
                            this.item.merchant = {
                                code: "",
                                name: "",
                                customer_group: "",
                            };
                        }
                        if (this.item.reference_info) {
                            this.$http
                                .get(
                                    "/config/glossary?conditions=attribute.icontains:reference_info"
                                )
                                .then((responseRef) => {
                                    let array = responseRef.data.data;
                                    array.forEach((e) => {
                                        if (e.value_int == this.item.reference_info) {
                                            this.reference_info = e.value_name;
                                        }
                                    });
                                });
                        }
                    });
            },
            decline(id) {
                this.$http.put("/customer/prospect_customer/decline/"+id,{
                    decline_type_id: this.decline_type,
                    decline_note: this.decline_note,
                }).then(responseDec => {
                    this.declineDialog = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been declined successfully',
                        type: 'success',
                    });
                    this.clearDeclineType = true
                    this.renderData()
                }).catch(e => {
                    this.error = e.errors
                });
            },
            selectedDeclineType(d) {
                this.decline_type = ""
                if (d) {
                    this.decline_type = d.value_int
                }
            },
            archetypeSelected2(d) {
                this.archetype = "";
                this.next = "";
                if (d) {
                    this.archetype = d;
                    if (d.customer_group == 1) {
                        this.next = "outlet";
                    } else if (d.customer_group == 2) {
                        this.next = "agent";
                    }
                }
            },
            regis(val) {
                this.customerID = val;
                this.register = true;
            },
            nextMethod() {
                let data = {
                    customer: this.customerID,
                    archetype: this.archetype,
                };
                this.$store.commit("setProspectCustomer", data);
                if (this.next == "agent"){
                    this.$router.push("/customer/agent/create");
                } else if (this.next == "outlet") {
                    this.$router.push("/customer/branch/create");
                }
            },
            seeHistory() {
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "prospect_customer",
                };
            },
            upgrade(val) {
                let data = {
                    customer: val,
                    archetype: "",
                };
                this.$store.commit("setProspectCustomer", data);
                this.$router.push("/customer/branch/create");
            },
        },
        created() {
            this.renderData();
        },
    };
</script>
