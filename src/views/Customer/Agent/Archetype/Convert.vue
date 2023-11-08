<template>
    <v-container fill-height class="main-container">
        <div class="box pb-0">
            <v-row>
                <v-col>
                    <v-text-field
                        name="business_type"
                        v-model="business_type_str"
                        required 
                        disabled
                        outlined
                        dense
                        label="Business Type *"
                        :error="error.business_type_id"
                    ></v-text-field>
                    <v-text-field
                        name="customer_group"
                        v-model="customer_group_str"
                        required 
                        disabled
                        dense
                        outlined
                        label="Customer Group *"
                        :error="error.customer_group_id"
                    ></v-text-field>
                </v-col>
                <v-col>
                    <SelectArchetype
                        name="archetype_name"
                        v-model="archetype"
                        @selected="archetypeSelected"
                        required
                        :dense="true"
                        :customer_group="2"
                        :aux_data="2"
                        :statusArch="1"
                        :archetype="archetype"
                        :error="error.archetype_id"
                    ></SelectArchetype>
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
        name: 'ConvertArchetype',
        data () {
            return {
                form : {
                    prev_archetype : '',
                    archetype_id : ''
                },
                archetype : null,
                error : {},
                ConfirmData : {},
                business_type_str : '',
                customer_group_str : '',
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
                    title : "Convert Archetype",
                    text : "Are you sure want to Convert this archetype?",
                    urlApi : "/customer/agent/archetype/"+this.$route.params.id,
                    nextPage : "/customer/agent/detail/"+this.$route.params.id,
                    data : this.form
                }
            },
            renderData(){
                this.$http.get("/customer/agent/"+this.$route.params.id).then(response => {
                    this.archetypeSelected(response.data.data[0].archetype)
                    this.form.prev_archetype = response.data.data[0].archetype.name
                });
            },
            archetypeSelected(d) {
                this.customer_group_str = ''
                this.business_type_str = ''
                this.archetype = null;
                this.form.archetype_id = '';
                if (d) {
                    this.archetype = d;
                    this.form.archetype_id = d.id
                    this.customer_group_str = 'Agent'
                    this.form.customer_group = 2
                    this.form.business_type = d.business_type.id
                    this.business_type_str = d.business_type.name
                }
            },
        },
        created(){
            this.renderData()
        },
    }
</script>
