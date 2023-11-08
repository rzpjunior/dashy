<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        maxlength="20"
                        required
                        outlined
                        :dense="true"
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="100"
                        label="Note"
                        outlined
                        :error-messages="error.note"
                        maxlength="100"
                        rows="3"
                    >
                    </v-textarea>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <div class="pl-6">
                        <v-row>
                            <v-col cols="12" class="-ml24">
                                <div>
                                    Allow Decimal<span class="text-red">*</span>
                                </div>  
                            </v-col>
                            <v-col cols="12" md="2" class="-mt24 -ml24">
                                <v-checkbox
                                    v-model="decimal_enabled"
                                    label="Yes"
                                    color="success"
                                    required
                                    value="1"
                                ></v-checkbox>
                            </v-col>
                            <v-col cols="12" md="2" class="-mt24 -ml24">
                                <v-checkbox
                                    v-model="decimal_enabled"
                                    label="No"
                                    color="red"
                                    required
                                    value="2"
                                ></v-checkbox>
                                <div class="fs12 text-red -mt20">
                                    {{error.decimal_enabled}}
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row>
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
        name: "uomCreate",
        data () {
            return {
                decimal_enabled: "2",
                ConfirmData:[],
                permission:[],
                form:{
                    name: '',
                    decimal_enabled: 2,
                    note: '',
                },
                error:{},
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        methods:{
            confirmButton() {
                this.form.decimal_enabled = parseInt(this.decimal_enabled)
                this.ConfirmData = {
                    model : true,
                    title : "Create UOM",
                    text : "Are you sure want to create this UOM?",
                    urlApi : "/inventory/uom",
                    nextPage : "/inventory/uom",
                    post : true,
                    data : this.form
                }
            }
        },
    }
</script>
