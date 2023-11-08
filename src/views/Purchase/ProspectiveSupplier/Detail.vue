<template>
 <v-container>
   <div class="mb-16">
     <div>
       <v-row class="px-3">
         <v-col class="fs25" style="color:#333333;">
           {{ items.name }}
         </v-col>
         <v-col class="d-flex justify-end align-end">
            <v-btn
                    v-if="items.reg_status === 1"
                    rounded
                    elevation="0"
                    background="#red"
                    class="no-caps"
                    :color="statusMaster('new')"
                    style="width:104px"
                  >
                    New
                  </v-btn>
                  <v-btn
                    v-if="items.reg_status === 2"
                    rounded
                    elevation="0"
                    class="no-caps"
                    :color="statusMaster('registered')"
                  >
                    Registered
                  </v-btn>
                  <v-btn
                    v-if="items.reg_status === 3"
                    rounded
                    elevation="0"
                    class="no-caps"
                    :text-color="statusMasterText('declined')"
                    :color="statusMaster('declined')"
                  >
                    Declined
                  </v-btn>
            <div class="mx-3"></div>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>settings</v-icon>
                </v-btn>
              </template>
              <v-list style="background: #E8EFF2">
                    <v-list-item v-if="items.reg_status == 1" @click="register(items.id)" v-privilege="'pro_sup_reg'">
                        <v-list-item-content>
                            <v-list-item-title>Register</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div class="px-md-4">
                      <hr/>
                    </div>
                    <v-list-item v-if="items.reg_status == 1" @click="decline(items.id)" v-privilege="'pro_sup_dec'">
                        <v-list-item-content>
                            <v-list-item-title>Decline</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div class="px-md-4">
                      <hr/>
                    </div>
                    <v-list-item @click="seeHistory()" v-privilege="'filter_rdl'">
                        <v-list-item-content>
                            <v-list-item-title>History</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
         </v-col>
       </v-row>
       <v-row class="row mt-6 ml-6 mr-2 second-color">
         <v-col cols="6" class="pr-13">
           <DetailRow :name="'Phone Number'" :value="items.phone_number" />
           <DetailRow :name="'Comodity'" :value="items.commodity" />
           <DetailRow :name="'Subdistrict'" :value="items.sub_district.name" />
           <DetailRow :name="'District'" :value="items.sub_district.district.name" />
           <DetailRow :name="'Province'" :value="items.sub_district.district.city.province.name" />
           <DetailRow :name="'PIC Phone Number'" :value="items.pic_phone_number" />
         </v-col>
         <v-col cols="6" class="pl-13">
           <DetailRow :name="'Alternative Phone Number'" :value="items.alt_phone_number" />
           <DetailRow :name="'Address'" :value="items.street_address" />
           <DetailRow :name="'Postal Code'" :value="items.sub_district.postal_code" />
           <DetailRow :name="'City'" :value="items.sub_district.district.city.name" />
           <DetailRow :name="'PIC Name'" :value="items.pic_name" />
           <DetailRow :name="'Best Time To Call'" :value="items.time_consent === 1 ? 'Morning' : items.time_consent === 2 ?  'Afternoon' : 'Night'" />
         </v-col>
       </v-row>
     </div>
   </div>
        <div style="padding: 20px;" class="row d-flex align-end justify-end">
          <v-btn
            rounded
            elevation="0"
            class="no-caps px-7"
            :to="'/purchase/prospective/supplier'"
            style="background: #E6E9ED; color: #768F9C; height: 45px;"
          >
            Back
          </v-btn>
        </div>
        <ConfirmationDialog :sendData="ConfirmData"/>
        <AuditLog :data="dataAuditLog"/>
    </v-container>
</template>

<script>
    export default {
        name: "ProspectSupplierDetail",
        data() {
            return {
              ConfirmData : {},
              dataAuditLog : {},
                items:{
                  sub_district : {
                    postal_code : "",
                    name : "",
                    district : {
                      name : "",
                      city : {
                        name : "",
                        province : {
                          name : "",
                        }
                      }
                    }
                  }
                },
            }
        },
        methods:{
            renderData(){
                this.$http.get("/purchase/prospect/supplier/"+ this.$route.params.id).then(response => {
                    this.items = response.data.data
                    this.loading= false
                });
            },
            register(id){
                let data = {
                    supplier : id
                }
                this.$store.commit('setProspectSupplier', data);
                this.$router.push('/purchase/supplier/create')

            },
            decline(id){
                this.ConfirmData = {
                    model : true,
                    status : true,
                    title : "Decline",
                    text : "Are you sure to decline this prospective supplier?",
                    urlApi : '/purchase/prospect/supplier/decline/'+id,
                    data : {}
                }
            },
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "prospect_supplier"
                }
            },

        },
        mounted() {
            this.renderData()
             let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData()
                }
            });
        },
    }
</script>

<style scoped>

</style>