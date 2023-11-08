<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb28">
                <v-col cols="12" md="6">
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
                <v-col cols="12" md="6">
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
        name: "UserProfileUpdate",
        data () {
            return {
                ConfirmData:{},
                supervisor:null,
                area:null,
                form:{
                    idUser:'',
                    name: '',
                    role: '',
                    user_code: '',
                    display_name: '',
                    employee_code: '',
                    division: '',
                    supervisor_id: '',
                    area_id: '',
                    warehouse: '',
                    phone_number: '',
                },
                error:{}
            }
        },
        methods:{
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update User Profile",
                    text : "Are you sure want to update this User Profile?",
                    urlApi : '/config/user/profile/detail',
                    nextPage : "/configuration/usr_profile",
                    data : {
                        display_name :this.form.display_name,
                        phone_number: this.form.phone_number,
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
                this.disabled_warehouse = true
                if (d !== ''  && d !== undefined) {
                    this.area = d;
                    this.form.area_id = d.id
                    this.disabled_warehouse = false
                    this.clearWarehouse = false
                }
            },
            renderData(){
                this.$http.get("/config/user/profile/detail").then(response => {
                    this.form.employee_code= response.data.data.employee_code
                    this.form.name= response.data.data.name
                    this.form.display_name = response.data.data.display_name
                    this.form.phone_number = response.data.data.phone_number
                    this.form.division= response.data.data.role.division.name
                    this.form.idUser = response.data.data.user.id
                    this.form.user_code = response.data.data.user.code
                    this.form.role = response.data.data.role.name
                    this.form.warehouse= response.data.data.warehouse.name
                    this.supervisorSelected(response.data.data.parent)
                    this.areaSelected(response.data.data.area)
                });
            },
        },
        created(){
            this.renderData()
        },
        mounted() {
            this.renderData()
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
        },
    }
</script>
