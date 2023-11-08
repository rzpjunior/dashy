<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                prepend-inner-icon="search"
                            >
                            </v-text-field>
                        </template>
                       <span>Search by name, redeem code</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filterDropdown?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filterDropdown = !filterDropdown"
                        v-if="filterDropdown"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon
                            right
                        >
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="filterDropdown = !filterDropdown"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon
                            right
                        >
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filterDropdown? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        label="Status"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectGlossary
                        outlined
                        :dense="true"
                        :norequired="true"
                        label="Voucher Type"
                        @selected="typeSelected"
                        table="voucher"
                        attribute="type"
                    ></SelectGlossary>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea 
                        :norequired="true"
                        @selected="areaSelected"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArchetype 
                        :norequired="true"
                        @selected="archetypeSelected"
                        :dense="true"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectMembershipLevel
                        outlined
                        :norequired="true"
                        label="Membership Level"
                        @selected="levelSelected"
                    ></SelectMembershipLevel>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectMembershipCheckpoint
                        :disabled="disabledCheckpoint"
                        outlined
                        :norequired="true"
                        label="Membership Lapak"
                        :level="filter.level_id"
                        @selected="checkpointSelected"
                    ></SelectMembershipCheckpoint>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectMerchant
                        :norequired="true"
                        @selected="merchantSelected"
                        :dense="true"
                        :label="'Customer'"
                    ></SelectMerchant>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-row>
                        <v-col>
                            <v-btn
                                depressed
                                color="#50ABA3"
                                :to="{ name: 'VoucherCreate' }"
                                class="no-caps bold"
                                v-privilege="'vou_crt'"
                            >
                                <span class="text-white">
                                    Create Voucher
                                </span>
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-btn
                                depressed
                                color="#50ABA3"
                                @click="modalBulkVoucher = true, clear=false, BulkVoucher=true"
                                class="no-caps bold"
                                v-privilege="'vou_blk_imp'"
                            >
                                <span class="text-white">
                                    Bulk Voucher
                                </span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            {{ props.item.redeem_code }}<br>
                            <span class="second-color">{{ props.item.name }}</span>
                        </td>
                        <td>{{ props.item.type === 1 ? 'Total Discount' : props.item.type === 2 ? 'Grand Total Discount' : props.item.type === 3 ? 'Delivery Discount' : 'Extra EdenPoint'}}</td>
                        <td>{{ props.item.start_timestamp | moment("DD/MM/YYYY HH:mm:ss") }} - {{ props.item.end_timestamp | moment("DD/MM/YYYY HH:mm:ss") }}</td>
                        <td>
                            <div v-if="props.item.membership_level != null">
                                {{ props.item.membership_level.name }}<br>
                                <span
                                    v-if="props.item.membership_checkpoint != null"
                                    class="second-color"
                                >
                                    Lapak {{ props.item.membership_checkpoint.checkpoint }}
                                </span>
                            </div>
                            <div v-else>-</div>
                        </td>
                        <td>
                            <div v-if="props.item.merchant != null">
                                {{ props.item.merchant.code }} - {{ props.item.merchant.name }}
                            </div>
                            <div v-else>-</div>
                        </td>
                        <td class="right">Rp. {{ formatPrice(props.item.disc_amount) }}</td>
                        <td class="center">{{ props.item.overall_quota }}/{{ props.item.rem_overall_quota }}</td>
                        <td>{{ props.item.area.name }}</td>
                        <td>{{ props.item.archetype.name }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('archived')"
                                >Archived</v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item  :to="{name: 'VoucherDetail', params: { id: props.item.id }}" v-privilege="'vou_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status=='1'"><hr/></div>
                                    <v-list-item v-privilege="'vou_arc'" @click="changeStatus(props.item.id)" v-if="props.item.status=='1'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </div>
        <!-- Dialog Bulk Voucher-->
        <v-dialog
            v-model="modalBulkVoucher"
            persistent
            max-width="1200px"
            scrollable
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlay"/>
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="6">
                            Bulk Voucher
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="6">
                            <v-btn
                                icon
                                @click="modalBulkVoucher=false, clear=true, statusBulk = '', errorMessage = ''"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal"/>
                <v-card-text class="mt5">
                    <v-alert
                        color="#2A89A7"
                        dark
                        outlined
                    >
                        <v-icon color="#2A89A7" class="-mt3">mdi-alert-circle-outline</v-icon> 
                        Please follow the step to upload Bulk Voucher
                    </v-alert>
                    <v-row class="mt20 mb10">
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 1. Download Template
                            </div>
                            <div class="text-black60">
                                Download template to create your bulk voucher
                            </div>
                            <div class="mt-3 bg-black10" style="border: 2px dashed #AAAAAA; min-height:220px; text-align: center;">
                                <div>
                                    <img width="60" class="mt50 mb8" src="/icon/download_new.png" alt="">
                                </div>
                                <div class="mt-4">
                                    <v-btn
                                        @click="downloadTempBulkVoucher()"
                                        depressed
                                        color="#50ABA3"
                                        class="only-btn white--text rounded-form mt10"
                                    >Download Template</v-btn>
                                </div>
                            </div>
                        </v-col>
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 2. Update Template
                            </div>
                            <div class="text-black60">
                                Update with spreadsheet application
                            </div>
                            <v-img width="250px" class="mt-2" src="/img/worktime_new.png" alt="" />
                        </v-col>
                        <v-col class="pa-8">
                            <div>
                                Step 3. Upload File<span class="text-red">*</span>
                            </div>
                            <div class="text-black60">
                                Voucher will be create on list after upload
                            </div>
                            <div class="mt10">
                                <UploadExcel
                                    @onSelect="onSelectBulkVoucher"
                                    @onDelete="onDeleteBulkVoucher"
                                    :clear="clear"
                                    :error="errorMessage"
                                ></UploadExcel>
                            </div>
                            <v-card-actions class="mt20">
                                <v-spacer></v-spacer>
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    class="main-btn white--text"
                                    :disabled="BulkVoucher"
                                    @click="cfmBulkVoucher=true, modalBulkVoucher=false"
                                >
                                    Upload
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                    <div v-if="statusBulk == 'fail' && BulkVoucher == false" class="box-modal-table ma10">
                        <v-spacer></v-spacer>
                        <v-data-table
                            :headers="headersBulkError"
                            :items="transformedToList"
                            :items-per-page="5"
                        >
                            <template v-slot:item="props">
                                <tr style="height:30px">
                                    <td>{{ props.item.item }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- Dialog Bulk Voucher - Confirmation-->
        <v-dialog
            v-model="cfmBulkVoucher"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Create Bulk Voucher</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Are you sure to create this bulk voucher?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="cfmBulkVoucher=false, modalBulkVoucher=true"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="uploadBulkVoucher()"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "Voucher",
        data() {
            return {
                modalBulkVoucher: false,
                filterDropdown : false,
                ConfirmData : {},
                modalOpen: false,
                search: '',
                loading: false,
                types:[{
                    text:'All Type',
                    value:999
                },{
                    text:'Total Discount',
                    value:1
                },{
                    text:'Grand Total Discount',
                    value:2
                },{
                    text:'Delivery Discount',
                    value:3
                }],
                overlay: false,
                statuses:1,
                search: '',
                area:null,
                archetype:null,
                filter:{
                    type: '',
                    area_id:'',
                    archetype_id:'',
                    level_id:'',
                    checkpoint_id:'',
                    merchant_id:''
                },
                table: {
                    fields: [
                        {
                            text:'Redeem Code',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Voucher Type',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Start - End',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Level',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Customer Name',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Voucher Amount',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Voucher Quota',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Archetype',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                BulkVoucher : true,
                items:[],
                dataBulkVoucher:[],
                clear : false,
                error: {},
                rowBulkError:[],
                headersBulkError: [{
                    text: 'Error',
                    class: 'error--text'
                }],
                statusBulk:'',
                errorMessage:'',
                cfmBulkVoucher: false,
                disabledCheckpoint: true,
            }
        },
        computed: {
            //Transformed row bulk error to list
            transformedToList() { 
                return this.rowBulkError.map(item => ({ item }));
            }
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
        methods: {
            changeStatus(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Archive this Voucher",
                    title : "Archive Voucher",
                    text : "Are you sure want to Archive this Voucher?",
                    urlApi : '/promotion/voucher/archive/'+id,
                    data : {}
                }
            },
            renderData(){
                this.loading = true;
                this.items = []
                let status = ''
                if(this.statuses === 999){
                    status = ''
                }else{
                    status= "|status:"+this.statuses
                }
                let type = ''
                if(this.filter.type){
                    type= "|type:"+ this.filter.type
                }else{
                    type = ''
                }
                let area_id = ''
                if(this.filter.area_id =='' || this.filter.area_id == 65536){
                    area_id = ''
                }else{
                    area_id = "|area_id.e:"+ this.filter.area_id
                }
                let archetype_id = ''
                if(this.filter.archetype_id =='' || this.filter.archetype_id == 65536){
                    archetype_id = ''
                }else{
                    archetype_id = "|archetype_id.e:"+ this.filter.archetype_id
                }
                let level = ''
                if(this.filter.level_id){
                    level = "|membership_level_id.e:"+ this.filter.level_id
                }else{
                    level = ''
                }
                let checkpoint = ''
                if(this.filter.checkpoint_id){
                    checkpoint = "|membership_checkpoint_id.e:"+ this.filter.checkpoint_id
                }else{
                    checkpoint = ''
                }
                let merchant = ''
                if(this.filter.merchant_id){
                    merchant = "|merchant_id.e:"+ this.filter.merchant_id
                }else{
                    merchant = ''
                }
                this.$http.get("/promotion/voucher",{params:{
                      perpage:100,
                      embeds:'area_id,archetype_id',
                      conditions:'Or.redeem_code.icontains:'+this.search +'%2COr.name.icontains:'+ this.search + status + type + area_id + archetype_id + level + checkpoint + merchant,
                      orderby:'-id',
                  }}).then(response => {
                      this.loading = false;
                      this.items = response.data.data
                      if(this.items === null){
                          this.items = []
                      }
                    });
            },
            typeSelected(d) { // type selected
                this.filter.type = '';
                if (d) {
                    this.filter.type = d.value
                }
                this.renderData()
            },
            areaSelected(d){
                this.filter.area_id = '';
                if(d){
                    this.filter.area_id = d.id;
                }
                this.renderData()
            },
            archetypeSelected(d){
                this.filter.archetype_id = '';
                if(d){
                    this.filter.archetype_id = d.id;
                }
                this.renderData()
            },
            levelSelected(d) { // level selected
                this.filter.level_id = '';
                if (d) {
                    this.filter.level_id = d.id
                    this.disabledCheckpoint = false;
                }
                this.renderData()
            },
            checkpointSelected(d) { // checkpoint selected
                this.filter.checkpoint_id = '';
                if (d) {
                    this.filter.checkpoint_id = d.id
                }
                this.renderData()
            },
            merchantSelected(d) { // For Filter Merchant
                this.filter.merchant_id = '';
                if (d) {
                    this.filter.merchant_id = d.id
                }
                this.renderData()
            },
            // For download excel template bulk voucher
            downloadTempBulkVoucher() {
                window.location.href = process.env.VUE_APP_BULK_VOUCHER
            },
            // For listing bulk voucher
            onSelectBulkVoucher(file){
                this.errorMessage = file.length == 0 ? "No rows found" : ""
                this.dataBulkVoucher = []
                this.statusBulk = ''
                file.forEach((item) => {
                    let value = {};
                    value.area_code = item.area_code;
                    value.archetype_code = item.archetype_code;
                    value.customer_tag_code = item.customer_tag_code;
                    value.merchant_code = item.merchant_code;
                    value.redeem_code = item.redeem_code;
                    value.voucher_name = item.voucher_name;
                    value.voucher_type = parseInt(item.voucher_type);
                    value.start_timestamp = this.$moment(item.start_timestamp).format('YYYY-MM-DD HH:mm:ss');
                    value.end_timestamp = this.$moment(item.end_timestamp).format('YYYY-MM-DD HH:mm:ss');
                    value.overall_quota = parseInt(item.overall_quota);
                    value.user_quota = parseInt(item.user_quota);
                    value.disc_amount = parseInt(item.voucher_amount);
                    value.min_order = parseInt(item.min_order);
                    value.note = item.note;
                    value.membership_level = item.membership_level;
                    value.membership_checkpoint = item.membership_lapak;

                    this.dataBulkVoucher.push(value)
                });
                this.BulkVoucher = file.length == 0? true : false
            },
            // For mengosongkan array listing bulk voucher
            onDeleteBulkVoucher(ev) {
                this.dataBulkVoucher = []
                this.BulkVoucher = true
                this.errorMessage = ""
            },
            uploadBulkVoucher() {
                this.overlay = true
                let data = {
                    data : this.dataBulkVoucher
                }
                this.$http.post("promotion/voucher/bulky", data).then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: 'Data has been updated successfully',
                        type: 'success',
                    });
                    this.overlay = false
                    this.modalBulkVoucher = false
                    this.clear = false
                    this.statusBulk = ''
                }).then(() => {
                    this.cfmBulkVoucher = false
                    this.clear = true
                    this.renderData()
                }).catch(e => {
                    this.overlay = false
                    this.error = e.errors.error_callback
                    this.rowBulkError = this.error != null? this.error.slice(0, -1).split('|') : [];
                    this.statusBulk = e.status
                    this.cfmBulkVoucher=false
                    this.modalBulkVoucher=true
                })
            },
        },
        watch: {
            'search': {
                handler: function (search) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){ 
                        that.search = search
                        that.renderData()
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (status) {
                    let that = this
                    that.statuses = status
                    that.renderData()
                },
                deep: true
            }
        },
    }
</script>