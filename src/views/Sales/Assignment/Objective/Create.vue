<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" sm="12" md="6">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        maxlength="50"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                    >
                        <template slot="label">Assignment Name<span style="color:red;">*</span></template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6"></v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-textarea
                        name="objective"
                        v-model="form.objective"
                        maxlength="250"
                        outlined
                        rows="3"
                        class="pt-0 mt-0"
                        :counter="250"
                        :error-messages="error.objective"
                    >
                        <template v-slot:label>Objective<span style="color:red">*</span></template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-textarea
                        name="survei_link"
                        v-model="form.survei_link"
                        maxlength="250"
                        outlined
                        rows="3"
                        class="pt-0 mt-0"
                        :counter="250"
                        :error-messages="errorSurveyLink ? errorSurveyLink : error.surveylink"
                    >
                        <template v-slot:label>Survey Link</template>
                    </v-textarea>
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
                ><span class="text-black80">Cancel</span></v-btn>
                <v-btn
                    depressed
                    color="#50ABA3"
                    class="main-btn white--text"
                    @click="confirmButton()"
                    :disabled="disableButton"
                    v-privilege="'sla_obj_crt'"
                >Create</v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    export default {
        data () {
            return {
                business_type:null,
                form:{
                    name: '',
                    objective: '',
                    survei_link: '',
                },
                sendForm: {},
                error:{},
                ConfirmData:[],
                errorSurveyLink: null
            }
        },
        computed : {
            //For watch disable update
            disableButton() {
                if (this.hasWhiteSpace(this.form.survei_link)) {
                    this.errorSurveyLink = 'Please ensure the Survey Link is valid and contains no space between words'
                    return true
                } else {
                    this.errorSurveyLink = null
                    return false
                }
            }
        },
        methods:{
            // For Confirm Action
            confirmButton() {
                if(this.form.survei_link){
                    this.sendForm = {
                        name: this.form.name,
                        objective: this.form.objective,
                        surveylink: this.form.survei_link
                    }
                }else{
                    this.sendForm = {
                        name: this.form.name,
                        objective: this.form.objective,
                    }
                }
                this.ConfirmData = {
                    model : true,
                    title : "Create Assignment Objective",
                    text : "Are you sure want to create this Assignment Objective?",
                    urlApi : "/sales/assignment/objective",// sesuaikan dengan API
                    nextPage : "/sales/assignment/objective",
                    post : true,
                    data : this.sendForm
                }
            },
            hasWhiteSpace(val) { // To check if string has white space
                return val.indexOf(' ') >= 0;
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