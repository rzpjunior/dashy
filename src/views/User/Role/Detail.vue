<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{item.name}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div>
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster(item.status_convert)"
                        >
                            {{capitalizeFirstLetter(item.status_convert)}}
                        </v-btn>
                    </div>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item  :to="{ name: 'RoleUpdate', params: { id: item.id } }"  v-privilege="'rol_upd'">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div>
                                <hr/>
                            </div>
                            <v-list-item @click="changeStatus(item.status,item.id)" v-if="item.status === 1" v-privilege="'rol_arc'">
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="changeStatus(item.status,item.id)" v-else v-privilege="'rol_urc'">
                                <v-list-item-content>
                                    <v-list-item-title>Unarchive</v-list-item-title>
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
                    <DetailRowNew :name="'Division'" :value="item.division.name"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Notes'" :value="item.note" :left="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-title fs16 bold">
            Permissions
        </div>
        <div class="box-body">
            <div class="-ma16">
                <v-simple-table>
                    <template>
                        <ul v-for="item in permission" :key="item.id">
                            <li>{{item.name}}</li>
                            <ul v-for="c in item.child" :key="c.id">
                                <li>{{ c.name }}</li>
                                <ul v-for="gc in c.grandChild" :key="gc.id">
                                    <li>{{ gc.name }}</li>
                                </ul>
                            </ul>
                        </ul>
                    </template>
                </v-simple-table>
            </div>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "RoleDetail",
        data () {
            return {
                item:{
                    division: {},
                    status_convert : '',
                },
                permission:[],
                ConfirmData:{},
            }
        },
        methods: {
            async permissionData(){
                await this.$http.get("/role/permission",{params:{
                        embeds:'permission_id.parent_id',
                        conditions:'role_id.e:'+this.$route.params.id,
                    }}).then(response => {
                        if(response.data.data){
                            let c = [];
                            let gc = [];
                            response.data.data.forEach((value, index) =>{
                                if(!value.permission.parent){ // check apakah dia memiliki parent, jika undifined maka itu adalah parent
                                    // get parent
                                    let a= {
                                        id:value.id,
                                        name:value.permission.name,
                                        value:value.permission.value,
                                        child:[]
                                    };
                                    this.permission.push(a)
                                }else if(value.permission.parent && value.permission.parent.parent){ // check apakah memiliki parent dan grand parent, jika punya makan dia akan menjadi grand child
                                    // get grand child
                                    let d ={
                                        id:value.id,
                                        name:value.permission.name,
                                        parent:value.permission.parent.value,
                                    };
                                    gc.push(d)
                                }else {
                                    // get child
                                    if(value.permission.parent){ // check apakah memiliki grand parent, jika tidak maka dia akan menjadi child
                                        let b = {
                                            id:value.id,
                                            name:value.permission.name,
                                            parent:value.permission.parent.value,
                                            child:value.permission.value, // untuk perbandingan value == parent dari grand child
                                            grandChild:[]
                                        };
                                        c.push(b)
                                    }
                                }
                            });
                            gc.forEach((g, inds) =>{  // looping grand child
                                c.forEach((v, ind) =>{ // looping child
                                    if(v.child === g.parent)v.grandChild.push(g)
                                })

                            });
                            this.permission.forEach((values, i) =>{ //looping parent
                                c.forEach((v, ind) =>{ // looping child
                                    if(values.value === v.parent)this.permission[i].child.push(v);// check value parent dengan  value child
                                })
                            });
                        }
                    });
            },
            async renderData(){
                await this.$http.get("/role/" + this.$route.params.id).then(response => {
                    this.item = response.data.data
                    this.item.convert_status = this.item.status_convert.toUpperCase()
                    this.permission=[]
                    this.permissionData()
                });
            },
            changeStatus(val,id) {
                if (val=='1') {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Archive",
                        text : "Are you sure want to Archive this Role?",
                        urlApi : '/role/archive/'+id,
                        statusMsg : "Success to Archive this Role",
                        data : {}
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Unarchive",
                        text : "Are you sure want to Unarchive this Role?",
                        urlApi : '/role/unarchive/'+id,
                        statusMsg : "Success to Unarchive this Role",
                        data : {}
                    }
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
