<template>
    <v-dialog
        v-model="data.model"
        persistent
        max-width="900px"
    > 
        <LoadingBar :value="overlay"/>
        <v-card class="OpenSans">
            <v-card-title>
                <v-row>
                    <v-col class="text-title-modal" cols="12" md="6">
                        History
                    </v-col>
                    <v-col class="flex-align-end" cols="12" md="6">
                        <v-btn
                            icon
                            @click="data.model = false; readMore = false"
                        >
                            <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <div class="hr-title-modal mt8 mb24"/>
            <v-card-text>
                <div>
                    <v-timeline
                        dense
                        class="ml20 pt0"
                        align-top
                    >
                        <v-timeline-item
                            v-for="(item, idx) in datas"
                            :key="idx"
                            color="white"
                        >
                            <div slot="opposite" class="right">
                                <p class="black--text">{{ item.timestamp | moment("DD/MM/YYYY") }}</p>
                                <p class="black--text">{{ item.timestamp | moment("HH:mm:ss") }}</p>
                            </div>
                            <div>
                                <p class="bold black--text" v-if="item.staff">
                                    {{ item.staff.display_name}} ({{ item.staff.user.email}})
                                </p>
                                <p v-else>-</p>
                                <p v-if="item.staff">
                                    {{ item.staff.role.name}} ({{ item.staff.role.division.name}})
                                </p>
                                <p v-else>-</p>
                                <div class="card-action">
                                    <p class="grey--text">Action</p>
                                    <p v-if="item.function" class="black--text">{{ item.function }}</p>
                                    <p v-else>-</p>
                                    <div class="card-changes">
                                        <div class="data-before-section wp50">
                                            Data before
                                            <div v-if="item.changes_log.previous_data && item.changes_log.previous_data.length > 3">
                                                <div v-if="index === idx && readMore">
                                                    <div v-for="(log, index) in item.changes_log.previous_data" :key="index">
                                                        <p class="black--text">{{ log.field_name }} : {{ log.value }}</p>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <div v-for="(log, index) in item.changes_log.previous_data.slice(0, 3)" :key="index">
                                                        <p class="black--text">{{ log.field_name }} : {{ log.value }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else>
                                                 <div v-for="(log, index) in item.changes_log.previous_data" :key="index">
                                                    <p class="black--text">{{ log.field_name }} : {{ log.value }}</p>
                                                </div>
                                            </div>
                                            <p class="black--text" v-if="!item.changes_log.previous_data">-</p>
                                        </div>
                                        <div class="wp50">
                                            Data after
                                            <div v-if="item.changes_log.after_data && item.changes_log.after_data.length > 3">
                                                <div v-if="index === idx && readMore">
                                                    <div v-for="(log, index) in item.changes_log.after_data" :key="index">
                                                        <p class="black--text">{{ log.field_name }} : {{ log.value }}</p>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <div v-for="(log, index) in item.changes_log.after_data.slice(0, 3)" :key="index">
                                                        <p class="black--text">{{ log.field_name }} : {{ log.value }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div v-for="(log, index) in item.changes_log.after_data" :key="index">
                                                    <p class="black--text">{{ log.field_name }} : {{ log.value }}</p>
                                                </div>
                                            </div>
                                            <p class="black--text" v-if="!item.changes_log.after_data">-</p>
                                            <div class="right">
                                                <v-btn text v-if="item.changes_log.after_data && item.changes_log.after_data.length > 3" @click="readMoreFunction(idx)" class="btn-text" color="#50ABA3">{{ readMore && index === idx ? 'Hide list' : 'Read more...' }}</v-btn>
                                            </div>
                                        </div> 
                                    </div>
                                    <p class="grey--text">Note</p>
                                    <p v-if="item.note" class="black--text">{{ item.note }}</p>
                                    <p v-else class="black--text">-</p>
                                </div>
                            </div>
                        </v-timeline-item>
                        <div v-if="datas.length" v-observe-visibility="handleScrolledToBottom"></div>
                    </v-timeline>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.h-row {
    height: 48px;
}
.v-application p {
    margin-bottom: 0px !important;
}
.v-timeline {
    padding-top: 0px !important;
}
</style>
<script>
    export default {
        name: 'AuditLogTimeline',
        data() {
            return {
                overlay : false,
                readMore: false,
                index: null,
                datas:[],
                page: 1,
                totalData: null,
            }
        },
        props: {
            data : {
                model : "",
                id: "",
                type: "",
                label: ""
            }
        },
        methods:{
            // For get data audit log
            render(id,type){
                this.overlay = true
                if (this.data.label == 'URL_2') {
                    this.$http2.get("/audit_log",{params:{
                        perpage: 2,
                        page: this.page,
                        embeds:'staff_id__role_id,staff_id__role_id__division_id,merchant_id,staff_id__user_id',
                        conditions:'ref_id.e:'+id +'|type:'+ type,
                        orderby:'-id',
                    }}).then(response => {
                        if(this.datas.length < response.data.total){
                            this.overlay = false;
                            this.datas.push(...response.data.data)
                            this.totalData = response.data.total
                            if(this.datas === null){
                                this.datas = []
                            }
                        }
                        this.overlay = false
                    }).catch(e => {
                        this.datas = []
                        this.overlay = false
                    });
                } else {
                    this.$http.get("/audit_log",{params:{
                        perpage: 2,
                        page: this.page,
                        embeds:'staff_id__role_id,staff_id__role_id__division_id,merchant_id,staff_id__user_id',
                        conditions:'ref_id.e:'+id +'|type:'+ type,
                        orderby:'-id',
                    }}).then(response => {
                        if(this.datas.length < response.data.total){
                            this.overlay = false;
                            this.datas.push(...response.data.data)
                            this.totalData = response.data.total
                            this.overlay = false
                            if(this.datas === null){
                                this.datas = []
                                this.overlay = false
                            }
                        }
                        this.overlay = false
                    }).catch(e => {
                        this.datas = []
                        this.overlay = false
                    });  
                }   
            },
            // For read more/hide list function
            readMoreFunction(idx){
                this.readMore = !this.readMore
                this.index = idx
            },
            // For infinite scroll
            handleScrolledToBottom(isVisible) {
                if(!isVisible) {return}
                if(this.datas && this.datas.length >= this.totalData) {
                    return
                }
                this.page++
                this.render(this.data.id, this.data.type)
            }
        },
        watch: {
            data: {
                handler: function (val) {
                    if (this.datas &&this.datas.length <= this.totalData) {
                        this.render(val.id, val.type)
                    }
                },
                deep: true
            },
        }
    };
</script>