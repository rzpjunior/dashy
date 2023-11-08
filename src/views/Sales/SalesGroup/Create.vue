<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col  cols="12" sm="12" md="6">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        maxlength="50"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                    >
                        <template slot="label">Name<span style="color:red;">*</span></template>
                    </v-text-field>
                    <SelectUser
                        name="user"
                        v-model="supervisor"
                        :dense="true"
                        :label="'Sales Manager'"
                        :role_id="'393216'"
                        @selected="supervisorSelected"
                        :error="error.sls_man_id"
                    ></SelectUser>
                </v-col>
                <v-col  cols="12" sm="12" md="6">
                   <SelectBusinessType
                        name="business_type"
                        required
                        :dense="true"
                        :aux_data="2"
                        @selected="BusinessTypeSelected"
                        :error="error.business_type_id"
                    ></SelectBusinessType>
                    <SelectArea
                        name="area"
                        v-model="area"
                        :dense="true"
                        :aux_data="2"
                        @selected="areaSelected"
                        required
                        :error="error.area_id"
                    ></SelectArea>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Sub District
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="form.sub_district"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:no-data>
                    <v-btn
                        name="addSubDistrict"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold white--text"
                        :disabled="disabledBtnAdd"
                        @click="addSubDistrict()"
                    >Add Sub District
                    </v-btn>
                </template>
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            <SelectSubDistrictTable
                                :name="`sub_district_${props.index}`"
                                @click.native="setDataIdx(props.index)"
                                @selected="citySelected"
                                :dense="true"
                                :sub_district_id="props.item.sub_district_id"
                                :area_id="form.area_id"
                                :refs="`${props.index+1}-${refs},${form.sub_district.length}`"
                                :error="errCity(props.index)"
                            ></SelectSubDistrictTable>
                        </td>
                        <td>{{ props.item.city_name }}</td>
                        <td>
                            <div class="d-flex justify-end">
                                <div>
                                    <v-btn
                                        v-if="props.index == form.sub_district.length-1"
                                        icon
                                        name="addproduct"
                                        @click="addSubDistrict()"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div>
                                    <v-btn
                                        icon
                                        :name="`removeSubCity_${props.index}`"
                                        @click="removeSubDistrict(props.index)"
                                    >
                                        <v-img src="/icon/close-new.png" max-height="20px" max-width="20px"></v-img>
                                    </v-btn>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box">
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
                    :disabled="disabledBtnProcess"
                >Save</v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    export default {
        data () {
            return {
                permission:[],
                business_type:null,
                area:'',
                supervisor:{},
                form:{
                    name: '',
                    business_type_id: '',
                    supervisor_id: '',
                    area_id: '',
                    sub_district: [],
                },
                table: {
                    fields: [
                        {
                            text: 'No.',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "3%"
                        },
                        {
                            text: 'Sub District',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "40%"
                        },
                        {
                            text: 'City',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "40%"
                        },
                        {
                            text: '',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            width: "5%"
                        }
                    ],
                },
                error:{},
                cityIdx: '',
                refs: '',
                ConfirmData:[],
                disabledBtnProcess: true,
                disabledBtnAdd: true,
            }
        },
        methods:{
            confirmButton() {
                let sendForm = {
                    name: this.form.name,
                    business_type_id: this.form.business_type_id,
                    sls_man_id: this.form.supervisor_id,
                    area_id: this.form.area_id,
                    sub_district_id: [],
                }
                for (let i = 0; i < this.form.sub_district.length; i++) {
                    sendForm.sub_district_id.push(this.form.sub_district[i].sub_district_id)
                }
                this.ConfirmData = {
                    model : true,
                    title : "Create Sales Group",
                    text : "Are you sure want to create this Sales Group?",
                    urlApi : "/sales/group/create",
                    nextPage : "/sales/group",
                    post : true,
                    data : sendForm
                }
            },
            // For add sub district
            addSubDistrict() {
                this.form.sub_district.push(
                    {
                        sub_district_id: "",
                        sub_district_name: "",
                        district_name: "",
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setDataIdx(this.form.sub_district.length - 1)
                });
            },
            // For set index data row in table
            setDataIdx(idx) {
                this.cityIdx = idx
            },
            // For Select sub district
            citySelected(d) {
                this.form.sub_district[this.cityIdx].sub_district_id = ''
                this.form.sub_district[this.cityIdx].sub_district_name = ''
                this.form.sub_district[this.cityIdx].district_name = ''
                this.form.sub_district[this.cityIdx].city_name = ''
                if (d) {
                    this.form.sub_district[this.cityIdx].sub_district_id = d.sub_district_id
                    this.form.sub_district[this.cityIdx].sub_district_name = d.sub_district_name
                    this.form.sub_district[this.cityIdx].district_name = d.district_name
                    this.form.sub_district[this.cityIdx].city_name = d.city_name
                }
            },
            // For remove sub district
            removeSubDistrict(idx) {
                this.form.sub_district.splice(idx, 1)
            },
             //For check duplicate sub district
            errCity(idx) {
                let holdValue = this.form.sub_district[idx].sub_district_id
                if (this.form.sub_district[idx].sub_district_id) {
                    for (let j = 0; j < this.form.sub_district.length; j++) {
                        if (holdValue == this.form.sub_district[j].sub_district_id && idx != j) {
                            this.disabledBtnProcess = true
                            return 'Duplicate Sub District ' + this.form.sub_district[j].sub_district_name
                        }
                    }
                }
            },
            // For select Business Type
            BusinessTypeSelected(d) {
                this.business_type = null;
                this.form.business_type_id = ''
                if(d !== ''  && d !== undefined) {
                    this.business_type = d
                    this.form.business_type_id = d.id
                }
            },
            // For select Sales Manager
            supervisorSelected(d) {
                this.supervisor = null;
                this.form.supervisor_id = '';
                if (d !== ''  && d !== undefined) {
                    this.supervisor = d;
                    this.form.supervisor_id = d.id
                }
            },
            // For select Area
            areaSelected(d) {
                this.area = null;
                this.form.area_id = '';
                this.disabledBtnAdd = true
                this.form.sub_district = []
                if (d !== ''  && d !== undefined) {
                    this.area = d;
                    this.form.area_id = d.id
                    this.disabledBtnAdd = false
                }
            },
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        computed: {
            // For count total sub district
            totalcity() {
                let total = 0
                for (let i = 0; i < this.form.sub_district.length; i++) {
                    if (this.form.sub_district[i].sub_district_id) {
                        total += 1;
                    }
                }
                return total
            }
        },
        watch: {
            'form': {
                handler: function (val) {
                    // For disable button save sales group
                    if (this.totalcity == this.form.sub_district.length) {
                        if (this.form.sub_district.length > 0) {
                            this.disabledBtnProcess = false
                        } else {
                            this.disabledBtnProcess = true
                        }
                    } else {
                        this.disabledBtnProcess = true
                    }
                },
                deep: true
            }
        }
    }
</script>