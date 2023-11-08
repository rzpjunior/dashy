<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-col>
                <v-text-field
                    name="name"
                    v-model="form.name"
                    required
                    outlined
                    dense
                    maxlength="20"
                    :error-messages="error.name"
                >
                    <template v-slot:label>
                        Name<span style="color:red">*</span>
                    </template>
                </v-text-field>
                <v-textarea
                    name="note"
                    v-model="form.note"
                    :counter="100"
                    maxlength="100"
                    outlined
                    dense
                    rows="3"
                    label="Note"
                />
            </v-col>
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
                form:{
                    type : 1,
                    name: '',
                    note: '',
                },
                error:{},
                ConfirmData:{},
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
                this.ConfirmData = {
                    model : true,
                    title : "Create Customer Tag",
                    text : "Are you sure want to create this Customer Tag?",
                    urlApi : "/customer/tag",
                    nextPage : "/customer/tag",
                    post : true,
                    data : this.form
                }
            }
        },
    }
</script>
