<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col style="text">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        maxlength="20"
                        dense
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Name<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        name="days_value"
                        v-model.number="days_value"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        required
                        outlined
                        dense
                        :error-messages="error.days_value"
                    >
                        <template v-slot:label>
                            Days Value<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row style="margin-top:-20px">
                <v-col>
                    <div>
                        <v-textarea
                            name="note"
                            v-model="form.note"
                            :counter="100"
                            maxlength="100"
                            outlined
                            label="Note"
                            dense
                            rows="3"
                        />
                    </div>
                </v-col>
            </v-row>
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
                form:{
                    name: '',
                    days_value: '',
                    note: '',
                },
                days_value : '',
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
                if (this.days_value) {
                    this.form.days_value = parseInt(this.days_value)
                } else {
                    this.form.days_value = 0
                }
                this.ConfirmData = {
                    model : true,
                    title : "Create Sales Term",
                    text : "Are you sure want to create this Sales Term?",
                    urlApi : "/finance/sales/term",
                    nextPage : "/finance/spt/term",
                    post : true,
                    data : this.form
                }
            }
        },
    }
</script>
