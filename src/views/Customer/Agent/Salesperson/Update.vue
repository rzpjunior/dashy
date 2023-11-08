<template>
    <v-container fill-height class="main-container">
        <div class="box pb-0">
            <v-row>
                <v-col cols="12" md="6">
                    <SelectSalesPerson
                        name="salesperson"
                        v-model="salesperson"
                        @selected="salespersonSelected"
                        required
                        :dense="true"
                        :sales_person="salesperson"
                        :error="error.salesperson_id"
                    ></SelectSalesPerson>
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
        name: 'UpdateSalesperson',
        data () {
            return {
                form : {
                    salesperson_id : [],
                    prev_salesperson : ""
                },
                salesperson : null,
                error : {},
                ConfirmData : {}
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
                    title : "Update Salesperson",
                    text : "Are you sure want to Update this salesperson?",
                    urlApi : "/customer/agent/salesperson/"+this.$route.params.id,
                    nextPage : "/customer/agent/detail/"+this.$route.params.id,
                    data : this.form
                }
            },
            renderData(){
                this.$http.get("/customer/agent/"+this.$route.params.id).then(response => {
                    this.salespersonSelected(response.data.data[0].salesperson)
                    this.form.prev_salesperson = response.data.data[0].salesperson.display_name
                });
            },
            salespersonSelected(d) {
                this.salesperson = null;
                this.form.salesperson_id = '';
                if (d !== '' && d !== undefined) {
                    this.salesperson = d;
                    this.form.salesperson_id = d.id
                }
            },
        },
        created(){
            this.renderData()
        },
    }
</script>
