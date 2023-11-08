<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
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
                    <div v-if="item.status == 4">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4 w104"
                            :color="statusMaster('cancelled')"
                        >
                            Deleted
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
                                v-privilege="'psc_upd'" 
                                :to="{name: 'ProductSectionUpdate', 
                                params: { id: item.id }}" 
                                v-if="item.status == 5"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div class="hr-menu" v-if="item.status == 5"/>
                            <v-list-item 
                                v-if="item.status==1 || item.status==5" 
                                @click="archiveData = item.id, modelDialog=true" 
                                v-privilege="'psc_arc'"
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
            <v-row class="-mb61">
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Code'" :value="item.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Type'" :value="item.type == 1? 'Product Section':'Product Recommendation'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Start Time'" :value="item.start_at | moment('DD/MM/YYYY HH:mm')"/>
                </v-col>
                <v-col v-if="item.type == 1" cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Product Section Sequence'" :value="item.sequence"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'End Time'" :value="item.end_at | moment('DD/MM/YYYY HH:mm')"/>
                </v-col>
                <v-col cols="12" class="-mb24">
                    <DetailRowNew :name="'Area'" :value="item.area_name" :align="true"/>
                </v-col>
                <v-col cols="12" class="mb24">
                    <DetailRowNew :name="'Archetype'" :value="item.archetype_name" :align="true"/>
                </v-col>
            </v-row>
            <v-row>
                <div class="ma-3">
                    <div v-if="item.type == 1" class="text-black60 mb8">
                        Background Image :
                    </div>
                    <v-img
                        v-if="item.type == 1" 
                        class="rounded-form"
                        height="347"
                        width="360"
                        :src="item.background_image"
                    ></v-img>
                </div>
            </v-row>
        </div>
        <div class="box-header-table">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="item.product_section_item"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.code }} - {{ props.item.name }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Archive Product Section</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this product section archived?</span>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        maxlength="100"
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
        name: "ProductSectionDetail",
        data() {
            return {
                dataAuditLog: {},
                item: {
                    id: "",
                    code: "",
                    name: "",
                    background_image: "",
                    area: "",
                    area_name: "",
                    area_name_arr: [],
                    archetype: "",
                    archetype_name: "",
                    archetype_name_arr: [],
                    start_at: "",
                    end_at: "",
                    sequence: 1,
                    status: 1,
                    note: "",
                    product_section_item: [],
                    type: 1
                },
                modelDialog: false,
                note:{
                    note: '',
                },
                archiveData: '',
                table: {
                    fields: [
                        {
                            text: 'No.',
                            width: '5%',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text: 'Product',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                    ],
                },
                error: {},
            }
        },
        methods:{
            //For archiving a product-section
            archive() {
                this.$http.put("/campaign/product-section/archive/"+this.archiveData, this.note).then(response => {
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
            //For geting data detail product-section
            renderData(){
                this.$http.get("/campaign/product-section/"+ this.$route.params.id).then(response => {
                    if (response.data.data && response.data.data != null) {
                        this.item = response.data.data
                    } else {
                        this.item = []
                    }
                });
            },
            //For geting history data
            seeHistory() {
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "product_section"
                }
            },
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res){
                if (res && this.$route.params.id != undefined) {
                    self.renderData()
                }
            });
        },
    }
</script>