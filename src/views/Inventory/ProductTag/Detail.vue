<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <div class="img-product ma-3">
                    <v-img
                        class="rounded-form"
                        height="180"
                        width="250"
                        :src="items.image_url"
                    ></v-img>
                </div>
            </v-row>
            <v-row>
                <v-col class="fs24 bold">
                    {{items.name}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="items.status == 1">
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
                    <div v-if="items.status == 2">
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
                    <v-menu offset-y >
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-privilege="'pta_upd'" :to="`/inventory/product-tag/update/${items.id}`">
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
                            <v-list-item v-privilege="'pta_arc'" v-if="items.status == 1" @click="archived(items.id)">
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-privilege="'pta_urc'" v-if="items.status == 2" @click="unarchived(items.id)">
                                <v-list-item-content>
                                    <v-list-item-title>Unarchive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div>
                                <hr>
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
            <v-row class="-mb36">
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Code'" :value="items.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Area'" :value="items.area"/>
                </v-col>
                <v-col cols="12" class="mb24">
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
        name: "ProductTagDetail",
        data() {
            return {
                items : {},
                ConfirmData : {},
                dataAuditLog : {}
            }
        },
        methods:{
            archived(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Archive this Product Tag",
                    title : "Archive",
                    text : "Are you sure want to Archive this product tag ? This tag will be hidden in Mobile Apps.",
                    urlApi : "/inventory/tag_product/archive/"+id,
                    data : {}
                }
            },
            unarchived(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Unarchive this Product Tag",
                    title : "Unarchive",
                    text : "Are you sure want to Unarchive this product tag ? This tag will be shown in Mobile Apps.",
                    urlApi : "/inventory/tag_product/unarchive/"+id,
                    data : {}
                }
            },
            renderData(){
                this.$http.get("/inventory/tag_product/"+ this.$route.params.id).then(response => {
                    this.items = response.data.data
                });
            },
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "tag_product"
                }
            },
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData()
                }
            });
        },
        created() {
            this.renderData()
        },
    }
</script>