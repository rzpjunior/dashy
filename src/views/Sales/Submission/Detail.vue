<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold"></v-col>
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
                    <div v-else-if="this.items.status == 14">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('failed')"
                        >Failed
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Assignment Start Date'" :value="handlerDateByOutOfRoute(items.out_of_route, items.start_date) | moment('YYYY-MM-DD')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Submitted Date'" :value="items.submit_date == '0001-01-01T00:00:00Z' ? '-' : items.submit_date | moment('YYYY-MM-DD HH:mm:ss')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Assignment End Date'" :value="handlerDateByOutOfRoute(items.out_of_route, items.end_date) | moment('YYYY-MM-DD')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Finished Date'" :value="items.finish_date == '0001-01-01T00:00:00Z' ? '-' : items.finish_date | moment('YYYY-MM-DD HH:mm:ss')"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Salesperson'" :value="items.salesperson ? items.salesperson.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer'" :value="customerNameFormat(items)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew v-if="showActualFSLocation(items)" :name="'Actual FS Location'" :value="items.latitude+', '+items.longitude" :crossURL="'https://www.google.com/maps/search/?api=1&query='+items.latitude+','+items.longitude"/>
                    <DetailRowNew v-else :name="'Actual FS Location'" :value="'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer Type'" :value="items.customer_type ? (items.customer_type == 1 ? 'Existing Customer' : 'Customer Acquisition') : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Result'" :value="items.result ? items.result : items.sales_failed_visit ? items.sales_failed_visit.description_failed : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Out Of Route'" :value="items.out_of_route === 1 ? 'Yes' : 'No'"/>
                </v-col>
            </v-row>
            <v-row v-if="items.task_photo_list" class="my24">
                <v-col cols="12" class="-mt24">
                    <span class="grey--text">Photo:</span>
                    <v-row class="mt5">
                        <div class="img-product ma-2" v-for="(item, idx) in items.task_photo_list" :key="idx">
                            <DisplayPhotoOverlay :src="item" :large_img="true"/>
                        </div>
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "SubmissionDetail",
        data() {
            return {
                overlay: false,
                items: {
                    start_date:'',
                    finish_date:'',
                    end_date:'',
                    task_photo_list:[],
                    salesperson:{
                        name: '',
                    },
                    branch:{
                        code:'',
                        name:''
                    },
                    customer_type:'',
                    latitude:'',
                    longitude:'',
                },
                error: {},
            }
        },
        created() {
            this.renderData()
        },
        methods: {
            renderData() {
                this.$http.get("/sales/assignment/submission/" + this.$route.params.id, {
                    params: {
                        task: this.$route.params.task,
                    }
                }).then(response => {
                    this.items = response.data.data
                    this.items.start_date = response.data.data.start_date
                    if(!this.items.task_photo_list){
                        this.items.task_photo_list = this.items.sales_failed_visit.failed_image_list
                    }
                    if (this.items == null) {
                        this.items = ""
                    }
                });
            },
            customerNameFormat(val) { //customer name selection
                if (val.branch) {
                    return val.branch.code ? (val.branch.name ? val.branch.code+' - '+val.branch.name : val.branch.name) : '-'
                }else if(val.customer_acquisition){
                    return val.customer_acquisition.name
                }else {
                    return '-'
                }
            },
            handlerDateByOutOfRoute(oor, dateVal) { //show hide date by out of route value
                if (oor === 1) {
                    return '-'
                } else {
                    return dateVal ? dateVal : '-'
                }
            },
            showActualFSLocation(val) { // TO SHOW ACTUAL FS LOCATION BY LONGLAT
                if (val.longitude !== null && val.latitude !== null) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
</script>
