<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="code"
                        v-model="form.code"
                        :counter="15"
                        label="Code"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.code"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        :counter="20"
                        maxlength="20"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Name<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectDivision
                        name="division"
                        v-model="division"
                        @selected="divisionSelected"
                        :error="error.division_id"
                        :division="division"
                        disabled
                        required
                        :dense="true"
                    > </SelectDivision>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        outlined
                        rows="3"
                    >
                        <template v-slot:label>
                            <div>
                                Note
                            </div>
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-title fs16 bold">
            Permissions
        </div>
        <div class="box-body">
            <div class="-ma16">
                <PermissionUpdate
                    name="permission"
                    v-model="form.permission_id"
                    @selected="permissionChecked"
                    :idPermission="permission"
                ></PermissionUpdate>
            </div>
        </div>
        <div class="box-end">
            <v-row class="-ma16">
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="$router.go(-1)"
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
                            @click="confirmButton()"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    export default {
        name: "RoleUpdatePermission",
        data () {
            return {
                ConfirmData:{},
                permission:[],
                division:null,
                form:{
                    permission_id:[],
                    code:'',
                    name:'',
                    division_id: '',
                    note: '',
                },
                error:{},
                putData:{},
            }
        },
        methods:{
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Role",
                    text : "Are you sure want to Update this role?",
                    urlApi : '/role/'+ this.form.id,
                    nextPage : '/user/role/detail/'+this.$route.params.id,
                    data : this.form
                }
            },
            divisionSelected(d) {
                this.division = null;
                this.form.division_id = '';
                if (d !== '' && d !== undefined) {
                    this.division = d;
                    this.form.division_id = d.id;
                }
            },
            async renderData(){
                await this.$http.get("/role/" + this.$route.params.id).then(response => {
                    this.form = response.data.data
                    this.divisionSelected(this.form.division);
                    this.permissionData(this.form.id)
                });
            },
            async permissionData(id){
                await this.$http.get("/role/permission",{params:{
                        embeds:'permission_id.parent_id',
                        conditions:'role_id.e:'+this.$route.params.id,
                    }}).then(response => {
                    response.data.data.forEach((value, index) => {
                        this.permission.push(value.permission.id)
                    });
                    this.loading= false
                });
            },
            permissionChecked(d) {
                if (d.length >0 ) {
                    this.form.permission_id = d
                }
            }
        },
        created(){
            this.renderData()
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        watch: {
            'division': {
                handler: function (val) {
                    let that = this
                    that.form.division = val;
                },
                deep: true
            },
        },
    }
</script>