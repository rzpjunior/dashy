<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPacker
                        name="packer"
                        @selected="packerSelected"
                        :dense="true"
                    ></SelectPacker>
                </v-col>
            </v-row>
        </div>

        <div class="box-header-table">
            Product
        </div>
        <div class="box-body-table">
            <v-data-table
            :headers="table.fields"
            :items="form.save_commit_items"
            :loading="loading"
            :items-per-page="10"
        >
            <template v-slot:item="props">
                <tr style="height:48px">
                    <td>{{ props.item.product_name }}</td>
                    <td>{{ props.item.product_uom }}</td>
                    <td>{{ props.item.so_qty }}</td>
                    <td>{{ props.item.avail_qty }}</td>
                    <td>
                        <div v-if="props.item.status == 2">{{ props.item.committed_qty }}</div>
                        <vue-numeric
                            v-else
                            name="commited_qty"
                            class="vueNumeric"
                            placeholder="0,00"
                            separator="."
                            :precision="2"
                            v-model="props.item.committed_qty"
                        ></vue-numeric>
                    </td>
                    <td>
                        <div v-if="props.item.status == 2">
                            <span v-if="props.item.packaging == 1">250 Gram</span>
                            <span v-if="props.item.packaging == 2">500 Gram</span>
                            <span v-if="props.item.packaging == 3">1000 Gram</span>
                        </div>
                        <v-select
                            v-else
                            class="mt17"
                            v-model="props.item.packaging"
                            :items="pack_size"
                            item-text="text"
                            item-value="value"
                            outlined
                            dense
                        >
                            <template v-slot:label>
                                Pack Size
                            </template>
                        </v-select>
                    </td>
                    <td>
                        <div v-if="props.item.status == 2">{{ props.item.total_pack }}</div>
                        <vue-numeric
                            v-else
                            name="total_pack"
                            class="vueNumeric"
                            placeholder="0,00"
                            separator="."
                            :precision="2"
                            v-model="props.item.total_pack"
                        ></vue-numeric>
                    </td>
                    <td>
                        <div v-if="props.item.status == 2">{{ props.item.waste_qty }}</div>
                        <vue-numeric
                            v-else
                            name="waste_qty"
                            class="vueNumeric"
                            placeholder="0,00"
                            separator="."
                            :precision="2"
                            v-model="props.item.waste_qty"
                        ></vue-numeric>
                    </td>
                    <td>
                        <div v-if="props.item.status == 2">{{ props.item.total_weight }}</div>
                        <vue-numeric
                            v-else
                            name="packing_weight"
                            class="vueNumeric"
                            placeholder="0,00"
                            separator="."
                            :precision="2"
                            v-model="props.item.total_weight"
                        ></vue-numeric>
                    </td>
                    <td>
                        {{ disperency = props.item.committed_qty - props.item.total_weight}}
                    </td>
                    <td>
                        <div v-if="props.item.status == 2">
                            <v-chip
                                :color="statusMaster('finished')"
                                :text-color="statusMasterText('finished')"
                            ><span class="pa-md-2">Finished</span></v-chip>
                        </div>
                        <v-btn
                            v-else
                            class="ma-2"
                            style="background: #768f9c; color:white;"
                            @click="submitPacking(props.item)"
                        >
                        Submit
                        <template v-slot:loader>
                            <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                            </span>
                        </template>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            v-privilege="'pc_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'pco_crt'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialog :sendData="ConfirmData"/>
    </v-container>
</template>
<style scoped>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
<script>
    import Vue from 'vue'
    export default {
        name: 'PackingOrderCommit',
        data () {
            return {
                table: {
                    fields: [
                        {
                            text:'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Sales Order Qty (KG)',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Available Qty (KG)',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Commited Qty (KG)',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Packaging',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Total Pack',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Waste Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Packing Weight (KG)',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Disperency Qty (KG)',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width:'5%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                pack_size:[
                    {
                        text: '250 Gram',
                        value: 1
                    },
                    {
                        text: '500 Gram',
                        value: 2
                    },
                    {
                        text: '1000 Gram',
                        value: 3
                    }
                ],
                loading: false,
                SelectPacker: '',
                disperency: '',
                ConfirmData : {},
                form: {
                    packer_id: '',
                    save_commit_items:[]
                }
            }
        },
        methods:{
            //submti packing on table per row
            submitPacking(item){
                this.$http.put("/warehouse/packing_order/submit/"+this.$route.params.id,{
                    "packing_order_item_id":item.id,
                    "packer_id":this.SelectPacker,
                    "packaging":item.packaging,
                    "committed_qty":item.committed_qty,
                    "total_pack":item.total_pack,
                    "waste_qty":item.waste_qty,
                    "total_weight":item.total_weight,
                    "disperency_qty": this.disperency
                }).then(res => {
                    this.form.save_commit_items = []
                    this.renderData()
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Submit Packing Success',
                        type: 'success',
                    });
                }).catch(e => {
                    console.log(e)
                })
            },
            //confirm save packing
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Save Packing Order",
                    text : "Are you sure want to save this packing order?",
                    urlApi : "/warehouse/packing_order/save_commit/"+this.$route.params.id,
                    nextPage : "/warehouse/packing-order",
                    data : this.form,
                }
            },
            //render data packing to table
            renderData(){
                this.loading = true
                this.$http.get("/warehouse/packing_order/item_assign?conditions=staff.id.e:"+this.SelectPacker+"|packingorderitem.packingorder.id.e:"+this.$route.params.id)
                .then(response => {
                    this.loading = false
                    let data = response.data.data
                    if(data !== null){
                        for (let i = 0; i < data.length; i++) {
                            let poi = data[i].packing_order_item
                            this.form.save_commit_items = []
                            this.form.save_commit_items.push({
                                id: poi.id,
                                packing_order_item_id: poi.id,
                                product_name: poi.product.name,
                                product_uom: poi.product.uom.name,
                                so_qty: poi.total_order,
                                avail_qty: poi.available_qty,
                                packaging: poi.convert_uom,
                                committed_qty: poi.commit_qty,
                                total_pack: poi.total_pack,
                                waste_qty: poi.waste_qty,
                                total_weight: poi.total_weight,
                                status:data[i].status
                            })
                        }
                    }else{
                        this.form.save_commit_items = []
                    }
                });
            },
            //select packer by id
            packerSelected(d) {
                this.SelectPacker = ""
                if (d) {
                    this.SelectPacker = d.id
                    this.form.packer_id = d.id
                    this.renderData()
                }
            },
            
        },
    }
</script>
