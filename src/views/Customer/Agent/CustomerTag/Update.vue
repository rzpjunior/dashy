<template>
    <v-container fill-height class="main-container">
        <div class="box pb-0">
            <v-row>
                <v-col>
                    <SelectCustomerTag
                        name="customer_tag"
                        v-model="customerTag"
                        :norequired="true"
                        :dense="true"
                        :watchCustomerTag="customerTag"
                        @selected="customerTagSelected"
                        :error="error.tag_customer"
                    ></SelectCustomerTag>
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
        name: 'UpdateCustomerTag',
        data () {
            return {
                form : {
                    tag_customer : [],
                },
                customerTag : null,
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
                    title : "Update Customer Tag",
                    text : "Are you sure want to Update this customer tag?",
                    urlApi : "/customer/agent/tag/"+this.$route.params.id,
                    nextPage : "/customer/agent/detail/"+this.$route.params.id,
                    data : this.form
                }
            },
            renderData(){
                let arr = []
                this.$http.get("/customer/agent/"+this.$route.params.id).then(response => {
                    let data = response.data.data[0].merchant;
                    this.customerTag = []
                    if(data.tag_customer.includes(",")) {
                        arr = data.tag_customer.split(',')
                    } else {
                        arr.push(data.tag_customer)
                    }
                    for (let i = 0; i < arr.length; i++) {
                        this.$http.get("/customer/tag/"+arr[i]).then(response => {
                            this.customerTag.push(response.data.data)
                            this.form.tag_customer.push(response.data.data.id)
                        }); 
                    }
                });
            },
            customerTagSelected(d) {
                this.customerTag = null;
                let arr = []
                if (d) {
                    this.customerTag = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                }
                this.form.tag_customer = arr
            },
        },
        created(){
            this.renderData()
        },
    }
</script>
