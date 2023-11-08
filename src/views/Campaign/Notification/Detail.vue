<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{item.campaign_name}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="item.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('draft')"
                        >Draft</v-btn>
                    </div>
                    <div v-else-if="item.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >Active</v-btn>
                    </div>
                    <div v-else-if="item.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >Cancelled</v-btn>
                    </div>
                    <div v-else-if="item.status == 4">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >Finished</v-btn>
                    </div>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-privilege="'pnt_upd'" :to="'/campaign/push-notification/update/'+item.id" v-if="item.status == 1">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div class="hr-menu" v-if="item.status == 1"/>
                            <v-list-item @click="modelDialog= true" v-if="item.status == 1" v-privilege="'pnt_cnl'">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div class="hr-menu" v-if="item.status == 1"/>
                            <v-list-item @click="seeHistory(item.id)">
                                <v-list-item-content>
                                    <v-list-item-title>See History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Code'" :value="item.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Redirect To'" :value="item.redirect_to_name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="item.redirect_to != 3 && item.redirect_to != 5 && item.redirect_to != 6">
                    <DetailRowNew :name="item.redirect_to_name" v-if="item.redirect_to == 4" :value="item.redirect_value" :crossURL="item.redirect_value"/>
                    <DetailRowNew :name="item.redirect_to_name" v-else :value="item.redirect_value_name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Schedule Push Notification'" :value="$moment(item.scheduled_at).format('DD-MM-YYYY HH:mm:ss')"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="item.area_name" :align="true"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Archetype'" :value="item.archetype_name" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-title fs16 bold">
            Push Notification Info
        </div>
        <div class="box-body">
            <v-row>
                <v-col cols="12" md="12">
                    <DetailRowNew :name="'Notification Title'" :value="item.title" :align="true"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Message'" :value="item.message" :align="true"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Success Sent'" :value="item.success_sent"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Open'" :value="item.open"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Conversion'" :value="item.conversion"/>
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
        <AuditLogNew :data="dataAuditLog"/>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "PushNotificationDetail",
        data () {
            return {
                item:{},
                overlay : false,
                dataAuditLog : {},
                modelDialog : false,
                note : {
                    note : "",
                },
                error : {},
            }
        },
        methods: {
            renderData(){ // get data
                this.overlay = true
                this.$http.get("/campaign/push-notification/" + this.$route.params.id).then(response => {
                    this.overlay = false;
                    if (response.data.data && response.data.data != null) {
                        this.item = response.data.data
                    } else {
                        this.item = []
                    }
                });
            },
            seeHistory(id) { // for see the history
                this.dataAuditLog = {
                    model : true,
                    id: id,
                    type: "notification_campaign"
                }
            },
            cancelNotif() { // for cancel push notitification
                this.$http.put("/campaign/push-notification/cancel/"+this.$route.params.id, this.note).then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been cancelled successfully',
                        type: 'success',
                    });
                    this.renderData()
                    this.modelDialog = false
                }).catch(e => {
                    this.error = e.errors
                });
            },
        },
        mounted() {
            this.renderData();
        },
    }
</script>
