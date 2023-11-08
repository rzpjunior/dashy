<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24">
                    <span class="bold">{{item.name}}</span> ({{item.display_name}})
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div>
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster(item.user.status_convert)"
                        >
                            {{capitalizeFirstLetter(item.user.status_convert)}}
                        </v-btn>
                    </div>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-if="item.user.status==1" :to="{ name: 'UserUpdate'}" v-privilege="'usr_upd'">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item  :to="{ name: 'UserUpdatePermission'}" v-privilege="'usr_upd_pms'">
                                <v-list-item-content>
                                    <v-list-item-title>Update Permission</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                             <v-list-item @click="openAccessWarehouse()" v-privilege="'usr_upd_wrh_acc'">
                                <v-list-item-content>
                                    <v-list-item-title>Update Access Warehouse</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item  :to="{ name: 'UserResetPassword', params: { id_user: item.user.id }}" v-privilege="'usr_rst_pass'">
                                <v-list-item-content>
                                    <v-list-item-title>Reset Password</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                             <div>
                                <hr/>
                            </div>
                            <v-list-item v-if="item.user.status==1" @click="archive(item.user.id)" v-privilege="'usr_arc'">
                                <v-list-item-content>
                                    <v-list-item-title>Archive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="item.user.status==2" @click="unarchive(item.user.id)" v-privilege="'usr_urc'">
                                <v-list-item-content>
                                    <v-list-item-title>Unarchive</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="item.user.status==2" @click="deleteUser(item.user.id)" v-privilege="'usr_del'">
                                <v-list-item-content>
                                    <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="seeHistory()" v-privilege="'filter_rdl'">
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
                    <DetailRowNew :name="'Code'" :value="item.code" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Employee Code'" :value="item.employee_code" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Division'" :value="item.role.division.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Role'" :value="item.role.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="item.sales_group_name">
                    <DetailRowNew :name="'Sales Group'" v-if="item.sales_group_name" :value="item.sales_group_name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supervisor'" :value="item.parent ? item.parent.name :'-'" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="item.area.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="item.warehouse.name" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="item.phone_number" />
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="item.note" />
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Warehouse Access'" :value="item.warehouse_access_str" />
                </v-col>
            </v-row>
        </div>
        <div class="box-title fs16 bold">
            Contact
        </div>
        <div class="box-body">
            <v-row>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Phone Number'" :value="item.phone_number" />
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Email'" :value="item.user.email" />
                </v-col>
            </v-row>
        </div>
        <div class="box-title-end fs16 bold">
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
        <AuditLogTimeline :data="dataAuditLog"/>
        <v-dialog
            v-model="updateAccess"
            max-width="702px"
        >
        <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="6">
                            Update Access Warehouse
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="6">
                            <v-btn
                                icon
                                @click="updateAccess = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <MultiSelectWarehouse
                        :dense="true"
                        @selected="warehouseSelected"
                        :warehouse="whAccessUpdate"
                        :aux_data="2"
                        :label="'Multiselect Warehouse'"
                        :checkbox="true"
                    ></MultiSelectWarehouse>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="saveAccessWarehouse(item.user.id)"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import Vue from 'vue'
    export default {
        name: "UserDetail",
        data() {
            return {
                dataAuditLog : {},
                show_password:false,
                show_confirm:false,
                updateAccess: false,
                post: null,
                warehouse_access: [],
                whAccessUpdate: null,
                item:{
                    user : {},
                    role : {
                        division : {
                            name : ''
                        },
                        name : '',
                    },
                    warehouse : {
                        name : '',
                    },
                    parent : {
                        name : '',
                    },
                    area : {
                        name : '',
                    },
                },
                loading:true,
                permission:[],
                overlay: false,
                error:{},
                ConfirmData : {},
                modalOpen: true,
                form: {
                    warehouse_checked: []
                }
            }
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    window.location.reload();
                }
                if (res && !self.ConfirmData.noDisable) {
                    self.renderData()
                }
            });
        },
        methods:{
            //open modal update access warehouse
            openAccessWarehouse(){
                this.updateAccess = true
                this.renderData()
            },
            warehouseSelected(d) { // select komponen warehouse
                this.form.warehouse_checked = []
                if(d) {
                    let arr = []
                    if (d !== '') {
                        for (let i = 0; i < d.length; i++) {
                            arr.push(d[i].id);
                        }
                        this.form.warehouse_checked = arr
                    }
                }
            },
            capitalizeFirstLetter(d) { // handle untuk data tampungan Capitalize First Letter
                return d ? d[0].toUpperCase() + d.slice(1) : "";
            },
            async permissionData(userId){
                  await this.$http.get("/permission/user",{params:{
                      embeds:'permission_id.parent_id',
                      conditions:'user_id.e:'+userId,
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
                  this.loading= false
              });
            },
            async renderData(){
                let wh_access = []
                await this.$http.get("/user/staff/" + this.$route.params.id,{params:{conditions:'-id'}}).then(response => {
                    this.item = response.data.data
                    this.item.user.status = response.data.data.user.status
                    this.warehouse_access = response.data.data.warehouse_access
                    for (let i = 0; i < response.data.data.warehouse_access.length; i++) {
                        let temp = response.data.data.warehouse_access[i]
                        wh_access.push(temp)
                    }
                    this.whAccessUpdate = wh_access
                    this.permissionData(response.data.data.user.id)
                });
            },
            saveAccessWarehouse(id) {
                this.overlay = false
                this.$http.put("/user/staff/warehouse-access/"+id, this.form)
                .then(res => {
                    this.overlay = false
                    this.updateAccess = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Success update user warehouse',
                        type: 'success',
                    });
                    this.renderData()
                })
                .catch(e => {
                    this.overlay = false
                    this.updateAccess = false
                });
            },
            archive(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Archive this User",
                    title : "Archive User",
                    text : "Are you sure want to Archive this User?",
                    urlApi : "/user/archive/"+id,
                    nextPage : "/user/user/detail/"+this.$route.params.id,
                    data : {}
                }
            },
            unarchive(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Unarchive this User",
                    title : "Unarchive User",
                    text : "Are you sure want to Unarchive this User?",
                    urlApi : "/user/unarchive/"+id,
                    nextPage : "/user/user/detail/"+this.$route.params.id,
                    data : {}
                }
            },
            deleteUser(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Delete this User",
                    title : "Delete User",
                    text : "Are you sure want to delete this User?",
                    urlApi : "/user/delete/"+id,
                    nextPage : "/user/user",
                    cancelNote : "Note",
                    noDisable : true,
                    data : {}
                }
            },
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.item.user.id,
                    type: "user"
                }
            },
        },
    }
</script>
