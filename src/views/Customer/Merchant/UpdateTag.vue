<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <SelectCustomerTag
                name="customer_tag"
                v-model="customerTag"
                :watchCustomerTag="customerTag"
                @selected="customerTagSelected"
                :dense="true"
                :error="error.customer_tag"
            ></SelectCustomerTag>
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
                ConfirmData:[],
                customerTag:[],
                form:{
                    customer_tag:''
                },
                error:{},
            }
        },
        methods:{
            confirmButton() {
                let id = [];
                if(this.customerTag){
                    this.customerTag.forEach((value) =>{
                        id.push(value.id)
                    });
                }
                let data = {
                    customer_tag : id

                }
                this.ConfirmData = {
                    model : true,
                    title : "Update Customer Tag",
                    text : "Are you sure want to Update this Customer Tag?",
                    urlApi : "/customer/merchant/tag/" + this.$route.params.id,
                    nextPage : "/customer/merchant/detail/" + this.$route.params.id,
                    data : data
                }
            },
            customerTagSelected(d) {
                this.customerTag = null;
                if (d !== ''  && d !== undefined) {
                    this.customerTag = d;
                }
            },
            renderData(){
                let arr = []
                let customertagArr = []
                this.$http.get("/customer/merchant/"+ this.$route.params.id)
                    .then(response => {
                        this.items = response.data.data
                        if(this.items.tag_customer){   
                            if(this.items.tag_customer.includes(",")) {
                                arr = this.items.tag_customer.split(',')
                            } else {
                                arr.push(this.items.tag_customer)
                            }
                            this.form.customer_tag = arr
                            for (let i = 0; i < arr.length; i++) {
                                this.$http.get("/customer/tag/filter?conditions=id.e:"+arr[i]).then(res => {
                                    customertagArr.push(res.data.data[0])   
                                })
                            }
                            this.customerTagSelected(customertagArr)
                        }else{
                            this.customerTag = null;
                        }
                    });
            },
        },
        created() {
            this.renderData()
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
    }
</script>
