<template>
    <v-container fill-height class="main-container">
        <div class="box-title fs16 bold">
            Staff
        </div>
        <div class="box-body">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                <v-tooltip right>
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            name="employee_code"
                            v-model="form.employee_code"
                            label="Employee Code*"
                            required
                            outlined
                            dense
                            :error-messages="error.employee_code"
                            v-on="on"
                            disabled
                        ></v-text-field>
                    </template>
                   <span>Employee ID in HR System (Talenta)</span>
                </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                name="name"
                                v-model="form.name"
                                required
                                outlined
                                disabled
                                dense
                                maxlength="30"
                                :error-messages="error.name"
                                v-on="on"
                            >
                                <template v-slot:label>
                                    Name <span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                       <span>Name according to Resident Identity Card (KTP)</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                name="display_name"
                                v-model="form.display_name"
                                required
                                outlined
                                disabled
                                dense
                                :error-messages="error.display_name"
                                v-on="on"
                            >
                                <template v-slot:label>
                                    Display Name<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                       <span>Name displayed on system</span>
                    </v-tooltip>
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
                    ></SelectDivision>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectRole
                        name="role"
                        :dense="true"
                        v-model="role"
                        @selected="roleSelected"
                        :division_id="form.division_id"
                        :disabled="true"
                        :error="error.role_id"
                        :role="role"
                        required
                    > </SelectRole>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectUser
                        name="user"
                        :user="supervisor"
                        :norequired="true"
                        disabled
                        @selected="supervisorSelected"
                        :dense="true"
                    ></SelectUser>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        required
                        :error="error.area_id"
                        v-model="area"
                        :disabled="true"
                        :area="area"
                        @selected="areaSelected"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        required
                        :error="error.warehouse_id"
                        v-model="warehouse"
                        :warehouse="warehouse"
                        :area_id="form.area_id"
                        :disabled="true"
                        @selected="warehouseSelected"
                        :clear="clearWarehouse"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="phone_number"
                        v-model="form.phone_number"
                        required
                        outlined
                        dense
                        disabled
                        :error-messages="error.phone_number"
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        maxlength="15"
                    >
                        <template v-slot:label>
                            Phone Number<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                               <v-text-field
                                    name="email"
                                    v-model="form.email"
                                    label="Email*"
                                    required
                                    outlined
                                    dense
                                    :error-messages="error.email"
                                    v-on="on"
                                    disabled
                                ></v-text-field>
                            </div>
                        </template>
                        <span>Email Company</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <div class="box-title-end fs16 bold">
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
                            @click="modelDialog = true"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Update Permission</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Are you sure want to Update this permission?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="modelDialog = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="actions()"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    export default {
        name: "UserUpdatePermission",
        data () {
            return {
                permission:[],
                modelDialog : false,
                overlay : false,
                division:null,
                disabled_role:true,
                disabled_warehouse:true,
                supervisor:null,
                role:null,
                area:null,
                warehouse:null,
                clearWarehouse:false,
                ConfirmData:{},
                clearRole:false,
                emailRules: [
                    v => !!v || 'Please Enter email',
                    v => /.+@.+/.test(v) || 'E-mail must be valid',
                ],
                form:{
                    permission_id:[],
                    idUser:'',
                    idStaff:'',
                    name: '',
                    display_name: '',
                    employee_code: '',
                    division_id: '',
                    supervisor_id: '',
                    role_id: '',
                    area_id: '',
                    warehouse_id: '',
                    phone_number: '',
                    note: '',
                },
                error:{},
                event: ''
            }
        },
        methods:{
            actions () {
                this.form.permission_id.push("65536")
                this.overlay = true
                this.$http.put("/user/update/permission/" + this.form.idUser,{
                    permission_id:this.form.permission_id
                }).then(response => {
                    this.overlay = false
                    this.$router.push('/user/user/detail/'+this.form.idStaff);
                }).catch(e => {
                    this.overlay = false
                    this.error = e.errors
                });
            },
            divisionSelected(d) {
                this.division = null;
                this.disabled_role = true
                this.form.division_id = '';
                this.form.permission_id = [];
                this.permission = [];
                this.role = null;
                this.form.role_id = '';
                this.clearRole = true;
                if (d !== '' && d !== undefined) {
                    this.division = d;
                    this.form.division_id = d.id;
                    this.disabled_role = false
                    this.clearRole = false;
                }
            },
            roleSelected(d) {
                this.role = null;
                this.form.role_id = '';
                this.form.permission_id = [];
                this.permission = [];
                if (d !== ''  && d !== undefined) {
                    this.role = d;
                    this.form.role_id = d.id
                }
            },
            supervisorSelected(d) {
                this.supervisor = null;
                this.form.supervisor_id = '';
                if (d !== ''  && d !== undefined) {
                    this.supervisor = d;
                    this.form.supervisor_id = d.id
                }
            },
            areaSelected(d) {
                this.area = null;
                this.form.area_id = '';
                this.warehouse = null;
                this.form.warehouse_id = '';
                this.clearWarehouse = true
                this.disabled_warehouse = true
                if (d !== ''  && d !== undefined) {
                    this.area = d;
                    this.form.area_id = d.id
                    this.disabled_warehouse = false
                    this.clearWarehouse = false
                }
            },
            warehouseSelected(d) {
                this.warehouse = null;
                this.form.warehouse_id = '';
                if (d !== ''  && d !== undefined) {
                    this.warehouse = d;
                    this.form.warehouse_id = d.id
                }
            },
            async renderData(){
                await this.$http.get("/user/staff/"+ this.$route.params.id).then(response => {
                    this.form = response.data.data;
                    this.form.email = response.data.data.user.email;
                    this.form.idUser = response.data.data.user.id;
                    this.form.idStaff = response.data.data.id;
                    this.form.note = response.data.data.user.note;
                    this.divisionSelected(response.data.data.role.division);
                    this.roleSelected(response.data.data.role);
                    this.supervisorSelected(response.data.data.parent);
                    this.areaSelected(response.data.data.area);
                    this.warehouseSelected(response.data.data.warehouse);
                    this.permissionData(response.data.data.user.id);
                });
            },
            async permissionData(code){
                await this.$http.get("/permission/user",{params:{
                        embeds:'permission_id.parent_id',
                        conditions:'user_id.e:'+code,
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
            },
        },
        created(){
            this.renderData()
        }
    }
</script>
