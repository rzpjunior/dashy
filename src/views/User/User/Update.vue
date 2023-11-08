<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="employee_code"
                                    v-model="form.employee_code"
                                    required
                                    outlined
                                    disabled
                                    dense
                                    :error-messages="error.employee_code"
                                >
                                <template v-slot:label>
                                    Employee Code<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                            </div>
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
                        :disabled="disabled_role"
                        :error="error.role_id"
                        :clear="clearRole"
                        :role="role"
                        required
                    > </SelectRole>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="form.role_id == 524288">
                    <SelectSalesGroup
                        v-if="form.role_id == 524288"
                        @selected="salesGroupSelected"
                        :salesgroup_id="form.sales_group_id"
                        :norequired="true"
                        :dense="true"
                        :error="error.sales_group_id"
                    ></SelectSalesGroup>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectUser
                        name="user"
                        v-model="supervisor"
                        :user="supervisor"
                        :clear="clearUser"
                        :norequired="true"
                        :dense="true"
                        @selected="supervisorSelected"
                    ></SelectUser>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        required
                        :error="error.area_id"
                        v-model="area"
                        :clear="clearArea"
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
                        <template v-slot:label>
                            Note
                        </template>
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
                            v-privilege="'usr_upd'"
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
        name: "UserUpdate",
        data () {
            return {
                ConfirmData:[],
                division:null,
                disabled_role:true,
                supervisor:null,
                role:null,
                area:null,
                warehouse:null,
                clearWarehouse:false,
                clearRole:false,
                clearSalesGroup:false,
                clearArea:false,
                clearUser:false,
                form:{
                    idUser:'',
                    name: '',
                    email:'',
                    display_name: '',
                    employee_code: '',
                    division_id: '',
                    supervisor_id: '',
                    role_id: '',
                    sales_group_id: '',
                    area_id: '',
                    warehouse_id: '',
                    phone_number: '',
                    note: '',
                },
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => (v && v.length >= 8) || 'Password at least 8 characters',
                ],
                confirmPasswordRules: [
                    (value) => !!value || 'Confirm password is required',
                    (value) =>
                        value === this.form.password || 'The password confirmation does not match.',
                ],
                putData:{},
                error:{}
            }
        },
        methods:{
            confirmButton() {
                this.putData.name = this.form.name
                this.putData.display_name = this.form.display_name
                this.putData.division_id = this.form.division_id
                this.putData.supervisor_id = this.form.supervisor_id
                this.putData.role_id = this.form.role_id
                if(this.form.sales_group_id){
                    this.putData.sales_group_id = this.form.sales_group_id
                }
                if(this.form.supervisor_id){
                    this.putData.supervisor_id = this.form.supervisor_id
                }
                this.putData.area_id = this.form.area_id
                this.putData.note = this.form.note
                this.putData.warehouse_id = this.form.warehouse_id
                this.putData.phone_number = this.form.phone_number

                this.ConfirmData = {
                    model : true,
                    title : "Update User",
                    text : "Are you sure want to Update this user?",
                    urlApi : '/user/'+ this.form.idUser,
                    nextPage : '/user/user',
                    data : this.putData
                }
            },
            divisionSelected(d) {
                this.division = null;
                this.form.division_id = '';
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
                this.area = null;
                this.form.role_id = '';
                this.form.sales_group_id = '';
                this.form.area_id = '';
                this.form.warehouse_id = '';
                this.clearUser = true
                this.clearArea = true
                this.clearWarehouse = true
                this.supervisor = null;
                this.form.supervisor_id = '';
                if (d !== ''  && d !== undefined) {
                    this.clearUser = false
                    this.clearArea = false
                    this.clearWarehouse = false
                    this.role = d;
                    this.form.role_id = d.id
                }
            },
            salesGroupSelected(d, setval) {
                this.form.sales_group_id = '';
                this.form.area_id = '';
                this.form.warehouse_id = '';
                this.clearUser = true
                this.clearArea = true
                this.area = null;
                this.supervisor = null;
                this.form.supervisor_id = '';
                if(d){
                    this.clearUser = false
                    this.clearArea = false
                    this.form.sales_group_id = d.id
                    if(setval == 1){
                        setval == 2
                    }else{
                        Vue.nextTick(() => {
                            this.supervisorSelected(d.sls_man)
                            this.areaSelected(d.area)
                        });
                    }
                    
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
                if (d) {
                    this.area = d;
                    this.form.area_id = d.id
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
            renderData(){
                this.$http.get("/user/staff/"+ this.$route.params.id).then(response => {
                    this.form = response.data.data
                    if(this.form.sales_group_id == 0){
                        var sales_group_id = {id: ''}
                    }else{
                        var sales_group_id = {id: this.form.sales_group_id}
                    }
                    this.form.email = response.data.data.user.email
                    this.form.idUser = response.data.data.user.id
                    this.form.note = response.data.data.user.note
                    this.divisionSelected(response.data.data.role.division)
                    this.roleSelected(response.data.data.role)
                    this.salesGroupSelected(sales_group_id,1)
                    this.supervisorSelected(response.data.data.parent)
                    this.areaSelected(response.data.data.area)
                    this.warehouseSelected(response.data.data.warehouse)
                });
            },
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
        computed: {
            disabled_warehouse() {
                if (this.area) return false
                else return true
            },
        },
        watch: {
            'form.phone_number':{
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
                        this.clearWarehouse = true
                    }else{
                        this.clearUser = false
                        this.clearArea = false
                        this.clearWarehouse = false
                    }
                },
                deep: true
            },
        },
    }
</script>
