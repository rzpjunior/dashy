<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{items.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="this.items.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >Active
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >Finished
                        </v-btn>
                    </div>
                    <div v-else-if="this.items.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >Cancelled
                        </v-btn>
                    </div>
                    <v-menu offset-y >
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                        <v-list class="bg-white">
                            <v-list-item @click="seeHistory()">
                                <v-list-item-content>
                                    <v-list-item-title>History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="items.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Delivery Date'" :value="formatDate(items.delivery_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            <v-row>
                <v-col>
                    Products
                </v-col>
                <v-col class="flex-align-end">
                    <v-btn
                        @click="downloadPacking()"
                        depressed
                        outlined
                        v-privilege="'pc_exp'"
                        color="#EBEBEB"
                        class="no-caps bold bg-white-btn"
                        dark
                    >
                        <v-icon
                            dark
                            left
                            class="black-ic"
                        >
                            mdi-printer
                        </v-icon><span class="text-black">Export</span> 
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items.packing_recommendation"
                :hide-default-footer="true"
                :items-per-page="-1"
                class="mx-6 mt-6"
            >
            <template v-slot:item="props">
                <tr style="height:48px">
                    <td>{{ props.item.product.name }}</td>
                    <td>{{ props.item.product.uom.name }}</td>
                    <td>{{ props.item.total_progress_pct }}%</td>
                    <td>
                        <div v-for="(item, idx) in props.item.product_pack" :key="idx">
                            <div v-if="item.pack_type == 0.25">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    :disabled="item.actual_total_pack === item.expected_total_pack ? !disabledBtn : disabledBtn"
                                    @click="weighScale(props.item.product.id,item.pack_type)"
                                    class="no-caps bold"
                                >
                                    <span class="text-white">
                                       {{item.actual_total_pack}}/{{item.expected_total_pack}}
                                       <v-icon
                                        dark
                                        right
                                        >
                                            mdi-weight
                                        </v-icon>
                                    </span>
                                </v-btn>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div v-for="(item, idx) in props.item.product_pack" :key="idx">
                            <div v-if="item.pack_type == 0.5">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    :disabled="item.actual_total_pack === item.expected_total_pack ? !disabledBtn : disabledBtn"
                                    @click="weighScale(props.item.product.id,item.pack_type)"
                                    class="no-caps bold"
                                >
                                    <span class="text-white">
                                       {{item.actual_total_pack}}/{{item.expected_total_pack}}
                                       <v-icon
                                        dark
                                        right
                                        >
                                            mdi-weight
                                        </v-icon>
                                    </span>
                                </v-btn>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div v-for="(item, idx) in props.item.product_pack" :key="idx">
                            <div v-if="item.pack_type == 1">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    :disabled="item.actual_total_pack === item.expected_total_pack ? !disabledBtn : disabledBtn"
                                    @click="weighScale(props.item.product.id,item.pack_type)"
                                    class="no-caps bold"
                                >
                                    <span class="text-white">
                                       {{item.actual_total_pack}}/{{item.expected_total_pack}}
                                       <v-icon
                                        dark
                                        right
                                        >
                                            mdi-weight
                                        </v-icon>
                                    </span>
                                </v-btn>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div v-for="(item, idx) in props.item.product_pack" :key="idx">
                            <div v-if="item.pack_type == 2">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    :disabled="item.actual_total_pack === item.expected_total_pack ? !disabledBtn : disabledBtn"
                                    @click="weighScale(props.item.product.id,item.pack_type)"
                                    class="no-caps bold"
                                >
                                    <span class="text-white">
                                       {{item.actual_total_pack}}/{{item.expected_total_pack}}
                                       <v-icon
                                        dark
                                        right
                                        >
                                            mdi-weight
                                        </v-icon>
                                    </span>
                                </v-btn>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div v-for="(item, idx) in props.item.product_pack" :key="idx">
                            <div v-if="item.pack_type == 5">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    :disabled="item.actual_total_pack === item.expected_total_pack ? !disabledBtn : disabledBtn"
                                    @click="weighScale(props.item.product.id,item.pack_type)"
                                    class="no-caps bold"
                                >
                                    <span class="text-white">
                                       {{item.actual_total_pack}}/{{item.expected_total_pack}}
                                       <v-icon
                                        dark
                                        right
                                        >
                                            mdi-weight
                                        </v-icon>
                                    </span>
                                </v-btn>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div v-for="(item, idx) in props.item.product_pack" :key="idx">
                            <div v-if="item.pack_type == 10">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    :disabled="item.actual_total_pack === item.expected_total_pack ? !disabledBtn : disabledBtn"
                                    @click="weighScale(props.item.product.id,item.pack_type)"
                                    class="no-caps bold"
                                >
                                    <span class="text-white">
                                       {{item.actual_total_pack}}/{{item.expected_total_pack}}
                                       <v-icon
                                        dark
                                        right
                                        >
                                            mdi-weight
                                        </v-icon>
                                    </span>
                                </v-btn>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div v-for="(item, idx) in props.item.product_pack" :key="idx">
                            <div v-if="item.pack_type == 20">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    :disabled="item.actual_total_pack === item.expected_total_pack ? !disabledBtn : disabledBtn"
                                    @click="weighScale(props.item.product.id,item.pack_type)"
                                    class="no-caps bold"
                                >
                                    <span class="text-white">
                                       {{item.actual_total_pack}}/{{item.expected_total_pack}}
                                       <v-icon
                                        dark
                                        right
                                        >
                                            mdi-weight
                                        </v-icon>
                                    </span>
                                </v-btn>
                            </div>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
        </div>
        <AuditLogNew :data="dataAuditLog"/>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<style scoped>
.black-ic{
    color: black !important;
}
.bg-white-btn{
    background-color: white !important;
}
</style>
<script>
export default {
    data() {
        return {
            overlay: false,
            items : {
                area: {
                    name : "",
                },
                warehouse : {
                    name : "",
                },
                waste_disposal_item : [],
                packing_recommendation: [{
                    product: {
                        name: "",
                        uom: {
                            name: ""
                        }
                    },
                }]

            },
            dataAuditLog : {},
            ConfirmData : {},
            clear : false,
            error : {},
            disabledBtn: false,
            table: {
                fields: [
                    {
                        text:'Product',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'UOM',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Progress(%)',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Pack(0.25 KG)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Pack(0.5 KG)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Pack(1 KG)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Pack(2 KG)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Pack(5 KG)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Pack(10 KG)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Pack(20 KG)',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                ],
            },
        }
    },
    created() {
        this.renderData()
    },
    mounted() {
        let self = this
        this.$root.$on('event_success', function(res){
            if (res) {
                self.renderData()
            }
        });
    },
    methods : {
        //to see audit log packing order
        seeHistory() {
            this.dataAuditLog = {
                model : true,
                id: this.$route.params.id,
                type: "packing_order"
            }
        },
        //download packing recommendation excel 
        downloadPacking() {
            this.overlay = true
            this.$http.get("/warehouse/packing_order/recommendation/export/"+this.$route.params.id)
            .then(response => {
                this.overlay = false
                window.location.href = response.data.file
            })
        },
        //to store data and route to the weigh scale
        weighScale(product_id,pack_type){
            let data = {
                product_id: product_id,
                pack_type: pack_type,
                packing_id: this.items.id
            };
            this.$store.commit("setWeighScale", data);
            window.location.replace("/warehouse/weigh-scale");
        },
        //render data to table
        renderData(){
            this.$http.get("/warehouse/packing_order/recommendation/"+this.$route.params.id).then(response => {
                this.items = response.data.data
            });
        },
    }
}
</script>
