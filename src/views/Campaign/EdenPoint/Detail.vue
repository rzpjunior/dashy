<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <div class="img-ep ma-3">
                    <v-img
                        class="rounded-form"
                        height="328"
                        width="328"
                        :src="item.image_url"
                    ></v-img>
                </div>
            </v-row>
            <v-row>
                <v-col class="fs24 bold">
                    {{item.name}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="item.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >
                            Active
                        </v-btn>
                    </div>
                    <div v-if="item.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4 w104"
                            :color="statusMaster('finished')"
                        >
                            Finished
                        </v-btn>
                    </div>
                    <div v-if="item.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4 w104"
                            :color="statusMaster('archived')"
                        >
                            Archived
                        </v-btn>
                    </div>
                    <div v-if="item.status == 5">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4 w104"
                            :color="statusMaster('draft')"
                        >
                            Draft
                        </v-btn>
                    </div>
                    <v-menu offset-y >
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item 
                                v-if="item.status==1 || item.status==5" 
                                @click="archiveData = item.id, modelDialog=true" 
                                v-privilege="'ep_arc'"
                            >
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
            <v-row class="-mb36">
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Code'" :value="item.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Multiple of Point (x)'" :value="item.multiple"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Start Timestamp'" :value="item.start_date | moment('DD/MM/YYYY HH:mm')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'End Timestamp'" :value="item.end_date | moment('DD/MM/YYYY HH:mm')"/>
                </v-col>
                <v-col v-if="item.campaign_filter_type == 1" cols="12" class="-mb24">
                    <DetailRowNew :name="'Area'" :value="item.area_name" :align="true"/>
                </v-col>
                <v-col v-if="item.campaign_filter_type == 1" cols="12" class="mb24">
                    <DetailRowNew :name="'Archetype'" :value="item.archetype_name" :align="true"/>
                </v-col>
                <v-col v-if="item.campaign_filter_type == 2" cols="12" class="mb24">
                    <DetailRowNew :name="'Customer Tag'" :value="item.tag_customer_name" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Archive EdenPoint Campaign</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this  edenpoint campaign archived?</span>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        class="mt-6"
                        rows="3"
                        :error-messages="error.note"
                    >
                        <template v-slot:label>
                            Note<span class="text-red">*</span>
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
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "EdenPointCampaignDetail",
        data() {
            return {
                item: {
                    name: '',
                    areas: [],
                    archetypes: [],
                    start_date: '',
                    end_date: '',
                    image_url: '',
                    navigation_type: 0,
                    navigation_url: '',
                    tag_product_id: '',
                    product_id: '',
                    queue: 0
                },
                error: {},
                archiveData: '',
                note:{
                    note: '',
                },
                modelDialog: false,
                dataAuditLog: {},
            }
        },
        methods:{
            //For geting data detail banner
            renderData(){
                this.$http.get("/campaign/eden-point/"+ this.$route.params.id).then(response => {
                    if (response.data.data && response.data.data != null) {
                        this.item = response.data.data
                    } else {
                        this.item = {}
                    }
                });
            },
            //To archiving a EdenPoint Campaign
            archive() {
                this.$http.put("/campaign/eden-point/archive/"+this.archiveData, this.note).then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been archived successfully',
                        type: 'success',
                    });
                    this.note = {
                        note : "",
                    }
                    this.renderData()
                    this.modelDialog = false
                }).catch(e => {
                    this.error = e.errors
                });
            },
            //For getting history data
            seeHistory() {
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "eden_point_campaign"
                }
            },
        },
        mounted() {
            this.renderData()
        },
    }
</script>