<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        name="name"
                        onkeypress="return event.charCode >= 97 && event.charCode <= 122 || event.charCode >= 65 && event.charCode <= 90 || event.charCode >= 48 && event.charCode <= 57  ||  event.charCode == 32 ||  event.charCode == 95 ||  event.charCode == 45"
                        v-model="form.name"
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
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="100"
                        maxlength="100"
                        outlined
                        dense
                        rows="3"
                    >
                        <template v-slot:label>Note</template>
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
                ConfirmData: [],
                permission:[],
                form:{
                    name: '',
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
            confirmButton(){
                this.ConfirmData = {
                    model : true,
                    title : "Create Price Set",
                    text : "Are you sure want to create this Price Set?",
                    urlApi : "/price/set",
                    nextPage : "/price/set",
                    post : true,
                    data : this.form
                }
            },
            permissionChecked(d) {
                if (d !== '') {
                    this.form.permission = d
                }
            },
        },
    }
</script>
