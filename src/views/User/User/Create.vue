<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                name="name"
                                v-model="form.name"
                                required
                                outlined
                                style=""
                                dense
                                maxlength="30"
                                :error-messages="error.name"
                                v-on="on"
                            >
                            <template v-slot:label>
                                Full Name (KTP)<span style="color:red">*</span>
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
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                name="employee_code"
                                v-model="form.employee_code"
                                required
                                outlined
                                dense
                                :error-messages="error.employee_code"
                                v-on="on"
                            >
                            <template v-slot:label>
                                Employee Code<span style="color:red">*</span>
                            </template>
                            </v-text-field>
                        </template>
                        <span>Employee ID in HR System</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectDivision
                        name="division"
                        v-model="division"
                        @selected="divisionSelected"
                        :error="error.division_id"
                        required
                        :dense="true"
                    > </SelectDivision>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectRole
                        name="role"
                        v-model="role"
                        @selected="roleSelected"
                        :division_id="form.division_id"
                        :disabled="disabled_role"
                        :error="error.role_id"
                        :clear="clearRole"
                        :dense="true"
                        required
                    > </SelectRole>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="form.role_id == 524288">
                    <SelectSalesGroup
                        v-if="form.role_id == 524288"
                        :norequired="true"
                        :clear="clearSalesGroup"
                        @selected="salesGroupSelected"
                        :dense="true"
                        :error="error.sales_group_id"
                    ></SelectSalesGroup>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectUser
                        name="user"
                        v-model="supervisor"
                        :dense="true"
                        :user="supervisor"
                        :clear="clearUser"
                        :norequired="true"
                        @selected="supervisorSelected"
                    > </SelectUser>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        :error="error.area_id"
                        :clear="clearArea"
                        :dense="true"
                        @selected="areaSelected"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        required
                        :error="error.warehouse_id"
                        v-model="warehouse"
                        :area_id="form.area_id"
                        :disabled="disabled_warehouse"
                        @selected="warehouseSelected"
                        :clear="clearWarehouse"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="100"
                        maxlength="100"
                        outlined
                        rows="3"
                    >
                        <template v-slot:label>Note</template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="phone_number"
                        v-model="form.phone_number"
                        required
                        outlined
                        dense
                        :error-messages="error.phone_number"
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        maxlength="15"
                    ><template v-slot:label>
                        Phone Number<span style="color:red">*</span>
                    </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                name="email"
                                v-model="form.email"
                                required
                                outlined
                                dense
                                :rules="emailRules"
                                :error-messages="error.email"
                                v-on="on"
                            >
                                <template v-slot:label>
                                    Email<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                        <span>Email Company</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_password ? 'text' : 'password'"
                        @click:append="show_password = !show_password"
                        name="password"
                        v-model="form.password"
                        outlined
                        dense
                        :error-messages="error.password"
                        :rules="passwordRules"
                        maxlength="32"
                    >
                        <template v-slot:label>
                            Password<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        :append-icon="show_confirm ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_confirm ? 'text' : 'password'"
                        @click:append="show_confirm = !show_confirm"
                        name="confirm_password"
                        v-model="form.confirm_password"
                        outlined
                        dense
                        :error-messages="error.confirm_password"
                        :rules="confirmPasswordRules"
                        maxlength="32"
                    >
                        <template v-slot:label>
                            Confirm Password<span style="color:red">*</span>
                        </template>
                    </v-text-field>
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
    import Vue from 'vue'
    export default {
        name: "UserCreate",
        data () {
            return {
                ConfirmData:{},
                show_password:false,
                show_confirm:false,
                permission:[],
                division:{},
                disabled_role:true,
                disabled_warehouse:true,
                supervisor:'',
                role:'',
                sales_group:'',
                area:{},
                warehouse:{},
                clearArea:false,
                clearWarehouse:false,
                clearRole:false,
                clearSalesGroup:false,
                clearUser:false,
                form:{
                    name: '',
                    display_name: '',
                    employee_code: '',
                    password:'',
                    confirm_password:'',
                    division_id: '',
                    supervisor_id: '',
                    role_id: '',
                    sales_group_id: '',
                    area_id: '',
                    warehouse_id: '',
                    phone_number: '',
                    email: '',
                    note: '',
                    permission_id:[],
                },
                emailRules: [
                    v => !!v || 'Please Enter email',
                    v => /.+@.+/.test(v) || 'E-mail must be valid',
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => (v && v.length >= 8) || 'Password at least 8 characters',
                ],
                confirmPasswordRules: [
                    (value) => !!value || 'Confirm password is required',
                    (value) =>
                        value === this.form.password || 'The password confirmation does not match.',
                ],
                error:{}
            }
        },
        methods:{
            confirmButton() {
                this.form.permission_id.push("65536")
                let data = {
                    name :this.form.name,
                    display_name :this.form.display_name,
                    employee_code :this.form.employee_code,
                    password: this.form.password,
                    confirm_password: this.form.confirm_password,
                    division_id: this.form.division_id,
                    supervisor_id: this.form.supervisor_id,
                    role_id: this.form.role_id,
                    sales_group_id: this.form.sales_group_id,
                    area_id: this.form.area_id,
                    note: this.form.note,
                    email: this.form.email,
                    warehouse_id:this.form.warehouse_id,
                    phone_number: this.form.phone_number,
                    permission_id: this.form.permission_id,
                }
                this.ConfirmData = {
                    model : true,
                    title : "Create User",
                    text : "Are you sure want to create this user?",
                    urlApi : '/user',
                    nextPage : '/user/user',
                    post : true,
                    data : data
                }
            },
            // submit () {
            //     this.form.permission_id.push("65536")
            //     this.$http.post('/user',
            //     {
            //         name :this.form.name,
            //         display_name :this.form.display_name,
            //         employee_code :this.form.employee_code,
            //         password: this.form.password,
            //         confirm_password: this.form.confirm_password,
            //         division_id: this.form.division_id,
            //         supervisor_id: this.form.supervisor_id,
            //         role_id: this.form.role_id,
            //         sales_group_id: this.form.sales_group_id,
            //         area_id: this.form.area_id,
            //         note: this.form.note,
            //         email: this.form.email,
            //         warehouse_id:this.form.warehouse_id,
            //         phone_number: this.form.phone_number,
            //         permission_id: this.form.permission_id,
            //     }).then(response => {
            //         this.$router.push('/user/user');
            //     })
            //     .catch(e => {
            //         this.error = e.errors
            //     });
            // },
            divisionSelected(d) {
                this.division = null;
                this.form.division_id = '';
                this.form.permission_id = [];
                this.permission = [];
                this.form.role_id = '';
                this.form.sales_group_id = '';
                this.form.supervisor_id = '';
                this.form.area_id = '';
                this.role = null;
                this.disabled_role = true
                this.clearRole = true;
                this.clearUser = true
                this.clearArea = true
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
                this.form.sales_group_id = '';
                this.form.supervisor_id = '';
                this.form.area_id = '';
                if (d !== ''  && d !== undefined) {
                    this.role = d;
                    this.form.role_id = d.id
                    this.$http.get("/role/permission",{params:{
                            conditions:'role_id.e:'+d.id,
                            orderby:'-id',
                        }}).then(response => {
                        response.data.data.forEach((value, index) =>{
                            this.permission.push(value.permission.id)
                        })
                    });
                }
            },
            salesGroupSelected(d) {
                this.form.sales_group_id = '';
                this.form.supervisor_id = '';
                this.form.area_id = '';
                this.clearUser = true
                this.clearArea = true
                if(d){
                    this.clearUser = false
                    this.clearArea = false
                    this.form.sales_group_id = d.id
                    Vue.nextTick(() => {
                        this.supervisorSelected(d.sls_man)
                        this.areaSelected(d.area)
                    });
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
            permissionChecked(d) {
                if (d.length >0 ) {
                    this.form.permission_id = d
                }
            },
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        watch: {
            'form.phone_number': {
                handler: function (val) {
                    let that = this
                    that.form.phone_number = val.replace(/^0+/, '')
                },
                deep: true
            },
            'form.sales_group_id':{
                handler: function (val) {
                    if(val == ''){
                        this.clearUser = true
                        this.clearArea = true
                    }else{
                        this.clearUser = false
                        this.clearArea = false
                    }
                },
                deep: true
            }
        },
    }
</script>
