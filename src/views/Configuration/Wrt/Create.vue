<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
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
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea 
                        :error="error.area_id" 
                        name="area" 
                        :dense="true"
                        @selected="areaSelected"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        maxlength="100"
                        :counter="100"
                        outlined
                        rows="3"
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
                ConfirmData:[],
                permission:[],
                form:{
                    name: '',
                    area_id:'',
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
            permissionChecked(d) {
                if (d) {
                    this.form.permission = d
                }
            },
            areaSelected(d){
                this.area = null;
                this.form.area_id = '';
                if(d){
                    this.area = d;
                    this.form.area_id = (d.id);
                }
            },
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Create WRT",
                    text : "Are you sure want to create this WRT?",
                    urlApi : "/config/wrt",
                    nextPage : "/configuration/wrt",
                    post : true,
                    data : this.form
                }
            }
        },
    }
</script>
