<template>
    <v-dialog
        v-model="data.model"
        persistent
        max-width="900px"
    > 
        <LoadingBar :value="overlay"/>
        <v-card class="OpenSans">
            <v-card-title>
                <v-row>
                    <v-col class="text-title-modal" cols="12" md="6">
                        History
                    </v-col>
                    <v-col class="flex-align-end" cols="12" md="6">
                        <v-btn
                            icon
                            @click="data.model = false"
                        >
                            <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="fields"
                    :items="datas"
                    :items-per-page="10"
                    :mobile-breakpoint="0"
                >
                    <template v-slot:item="item">
                        <tr class="h-row">
                            <td>{{ item.item.function }}</td>
                            <td>{{ item.item.timestamp | moment("DD/MM/YYYY HH:mm:ss") }}</td>
                            <td>
                                <div v-if="item.item.staff">
                                    {{ item.item.staff.display_name}} ({{ item.item.staff.user.email}})
                                </div>
                                <div v-else>
                                    -
                                </div>
                            </td>
                            <td>
                                <div v-if="item.item.staff">
                                    {{ item.item.staff.role.name}} ({{ item.item.staff.role.division.name}})
                                </div>
                                <div v-else>
                                    -
                                </div>
                            </td>
                            <td>{{ item.item.note }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.h-row {
    height: 48px;
}
</style>
<script>
    export default {
        name: 'AuditLogNew',
        data() {
            return {
                overlay : false,
                fields: [
                    {
                        text:'Action',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },

                    {
                        text:'Timestamp',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'User',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Role (Division)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Note',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                ],
                datas:[{
                    staff : {
                        display_name : "",
                        user : {
                            email : "",
                        },
                        role: {
                            name: "",
                            division: {
                                name: "",
                            }
                        }
                    }
                    
                }]
            }
        },
        props: {
            data : {
                model : "",
                id: "",
                type: "",
                label: ""
            }
        },
        methods:{
            render(id,type){
                this.overlay = true
                if (this.data.label == 'URL_2') {
                    this.$http2.get("/audit_log",{params:{
                            perpage:10000,
                            embeds:'staff_id__role_id,staff_id__role_id__division_id,merchant_id,staff_id__user_id',
                            conditions:'ref_id.e:'+id +'|type:'+ type,
                            orderby:'-id',
                        }}).then(response => {
                    this.overlay = false;
                    this.datas = response.data.data
                        if(this.datas === null){
                            this.datas = []
                        }
                }).catch(e => {
                    this.datas = []
                    this.overlay = false
                });
                } else {
                    this.$http.get("/audit_log",{params:{
                            perpage:10000,
                            embeds:'staff_id__role_id,staff_id__role_id__division_id,merchant_id,staff_id__user_id',
                            conditions:'ref_id.e:'+id +'|type:'+ type,
                            orderby:'-id',
                        }}).then(response => {
                    this.overlay = false;
                    this.datas = response.data.data
                        if(this.datas === null){
                            this.datas = []
                        }
                }).catch(e => {
                    this.datas = []
                    this.overlay = false
                });
                }
            },
        },
        watch: {
            data: {
                handler: function (val) {
                    this.render(val.id, val.type)
                },
                deep: true
            },
        }
    };
</script>
