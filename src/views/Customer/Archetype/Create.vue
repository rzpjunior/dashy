<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col  cols="12" sm="12" md="6">
                    <SelectBusinessType
                        name="business_type"
                        required
                        :aux_data="2"
                        :dense="true"
                        @selected="BusinessTypeSelected"
                        :error="error.business_type_id"
                    ></SelectBusinessType>
                    <v-text-field
                            name="name"
                            v-model="form.name"
                            maxlength="20"
                            required
                            outlined
                            dense
                            :error-messages="error.name"
                    >
                        <template slot="label">
                            Name<span style="color:red;">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col  cols="12" sm="12" md="6">
                    <SelectCustomerGroup
                        name="customer_group"
                        :dense="true"
                        v-model="customer_group"
                        @selected="CustomerGroupSelected"
                        :error="error.customer_group"
                    ></SelectCustomerGroup>
                </v-col>
                <v-col  cols="12" style="margin-top:-20px;">
                    <v-textarea
                            name="note"
                            v-model="form.note"
                            maxlength="100"
                            outlined
                            dense
                            rows="3"
                            :counter="100"
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
        data () {
            return {
                permission:[],
                business_type:null,
                form:{
                    business_type_id:'',
                    name: '',
                    note: '',
                    customer_group: '',
                },
                error:{},
                ConfirmData:[],
                customer_group:null,
            }
        },
        methods:{
            submit () {
                this.$http.post('/customer/archetype',
                {
                    name : this.form.name,
                    business_type_id : this.form.business_type_id,
                    note: this.form.note,
                    customer_group:parseInt(this.form.customer_group)
                }).then(response => {
                    this.$router.push('/customer/archetype');
                })
                .catch(e => {
                    this.error = e.errors
                });
            },
            cancel(){
                this.$router.push('/customer/archetype');
            },
            permissionChecked(d) {
                if (d !== '') {
                    this.form.permission = d
                }
            },
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Create Archetype",
                    text : "Are you sure want to create this Archetype?",
                    urlApi : "/customer/archetype",
                    nextPage : "/customer/archetype",
                    post : true,
                    data : this.form
                }
            },
            BusinessTypeSelected(d) {
                this.business_type = null;
                this.form.business_type_id = ''
                if (d !== '') {
                    this.business_type = d
                    this.form.business_type_id = d.id
                }
            },
            CustomerGroupSelected(d) {
                this.customer_group = null;
                this.form.customer_group = ''
                if (d !== '') {
                    this.customer_group = d
                    this.form.customer_group = String(d.value)
                }
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
    }
</script>
