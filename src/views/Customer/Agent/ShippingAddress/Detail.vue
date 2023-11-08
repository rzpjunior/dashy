<template>
    <v-container fill-height class="main-container">
        <v-breadcrumbs :items="breadcrumbs" class="box-breadcrumbs">
            <v-breadcrumbs-item
                slot="item"
                slot-scope="{ item }"
                exact
                v-if="item.to"
                :to="item.to">
                {{ item.text }}
            </v-breadcrumbs-item>
            <v-breadcrumbs-item
                style="color:#9C9C9C"
                v-else>
                {{ item.text }}
            </v-breadcrumbs-item>
        </v-breadcrumbs>
        <div class="box">
            <v-row class="px-3">
                <v-col class="fs25">
                    {{datas.address_name}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        @click="seeHistory()"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="no-caps"
                    >
                        <span class="text-black80 bold"> See History </span>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="px-5 mt-10">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Recipient Name'" :value="datas.pic_name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="datas.phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Alternative Phone Number'" :value="datas.alt_phone_number"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Postal Code'" :value="datas.sub_district.postal_code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Sub District'" :value="datas.sub_district.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'District'" :value="datas.sub_district.district.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'City'" :value="datas.sub_district.district.city.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Province'" :value="datas.sub_district.district.city.province.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="datas.sub_district.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Default Warehouse'" :value="datas.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Default Shipping address'" v-if="datas.main_branch === 1" :value="'Yes'"/>
                    <DetailRowNew :name="'Default Shipping address'" v-else :value="'No'"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Shipping Address'" :value="datas.shipping_address" :align="true"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="datas.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>

</template>

<script>
    export default {
        name: "Tag",
        data() {
            return {
                breadcrumbs : [
                    {
                        text: 'Agent List',
                        to : '/customer/agent'
                    },
                    {
                        text: 'Agent Detail',
                        to : ''
                    },
                    {
                        text: 'Shipping Address',
                    },
                ],
                dataAuditLog : '',
                datas:{
                    warehouse : {
                        name : ""
                    },
                    sub_district:{
                        name : "",
                        area:{
                            name : ""
                        },
                        postal_code : "",
                        district : {
                            name : "",
                            city: {
                                name : "",
                                province : {
                                    name : ""
                                }
                            }
                        }
                    },
                },
            }
        },
        created() {
            this.renderData()
        },
        methods: {
            seeHistory() {
                this.dataAuditLog = {
                    model : true,
                    id: this.$route.params.id,
                    type: "shipping_address"
                }
            },
            async renderData(){
                this.loading = true;
                await this.$http.get("/customer/agent/shipping/address/"+this.$route.params.id).then(response => {
                    this.datas = response.data.data;
                    this.breadcrumbs[1].to = '/customer/agent/detail/'+this.datas.merchant.id
                });
            }
        },
    }
</script>