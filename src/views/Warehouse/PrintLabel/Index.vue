<template>
    <v-container fill-height class="main-container">
        <div class="box-start" style="height: 95%;">
            <v-btn
                v-if="!switch_print"
                depressed
                color="#50ABA3"
                @click="reprint()"
                class="no-caps bold"
            >
            <span class="text-white">
                Reprint Label
            </span>
            </v-btn>
            <v-btn
                v-else
                depressed
                color="#50ABA3"
                @click="print()"
                class="no-caps bold"
            >
            <span class="text-white">
                Print
            </span>
            </v-btn>
            <v-col cols="6" offset="3">
                <v-card-text style="padding-top:20%;">
                    <div style="margin:auto; width:100%; padding-bottom: 20px; text-align:center;">
                        <div>
                            <span class="fs30 bold">Scan QR Code or Rfid<br></span>
                            <span class="fs20">(Picking List, Sales Order or Product Box)</span>
                        </div>
                        <div class="mt30"><span class="fs16 text-black60">Printer Status :</span></div>
                        <div class="mb20">
                            <span v-if="this.websocket_status == ''" style="color:#2A89A7; font-size: 16px;">
                                Waiting for connection...
                            </span>
                            <span v-if="this.websocket_status == 'Connected'" style="color:#2EA919; font-size: 16px;">
                                {{this.websocket_status}}
                            </span>
                            <span v-if="this.websocket_status == 'Disconnected'" style="color:#FF2D2D; font-size: 16px;">
                                {{this.websocket_status}}
                            </span>
                        </div>
                    </div>
                    <div v-if="!switch_print">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }">
                                <v-text-field
                                    ref="searchSO"
                                    v-model="search"
                                    append-icon="mdi-line-scan"
                                    name="search"
                                    single-line
                                    hide-details
                                    class="-mt10"
                                    v-on="{ ...tooltip }"
                                    outlined
                                >
                                    <template v-slot:label>
                                        <div v-if="filter_type.value == 'label_picking' || filter_type == 'label_picking'">
                                            <span>SO Code / PL Code</span>
                                        </div>
                                        <div v-else-if="filter_type.value == 'label_rfid' || filter_type == 'label_rfid'">
                                            <span>Product Box RFID</span>
                                        </div>
                                        <div v-else>
                                            <span>SO Code</span>
                                        </div>
                                    </template>
                                </v-text-field>
                            </template>
                            <span>Scan QR Code</span>
                        </v-tooltip>
                        <div class="text-red ml20 pt5" v-if="errorSO">
                            <span>
                                SO QR Code is invalid, please re-check.
                            </span>
                        </div>
                    </div>
                    <div style="margin-bottom: -45px;" v-else>
                        <v-row>
                            <v-col md="7" cols="7">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-text-field
                                            ref="searchSO"
                                            v-model="search_rpt"
                                            append-icon="mdi-line-scan"
                                            name="search"
                                            label="SO Code Reprint"
                                            single-line
                                            hide-details
                                            class="-mt10"
                                            v-on="{ ...tooltip }"
                                            outlined
                                        >
                                        </v-text-field>
                                    </template>
                                    <span>Scan QR Code</span>
                                </v-tooltip>
                                <div class="text-red ml20 pt5" v-if="errorSORpt">
                                    <span>
                                        SO QR Code is invalid, please re-check.
                                    </span>
                                </div>
                            </v-col>
                            <v-col md="3" cols="3">
                                <v-select
                                    :disabled="koliDs"
                                    v-model="form_prt.increment_prints"
                                    :items="item_koli"
                                    :menu-props="{ maxHeight: '400' }"
                                    label="Koli"
                                    multiple
                                    persistent-hint
                                    outlined
                                    ></v-select>            
                            </v-col>
                            <v-col md="2" cols="2">
                                <v-btn
                                    :disabled="printDs"
                                    color="#50ABA3"
                                    x-large
                                    @click="printRpt()"
                                    class="no-caps bold"
                                >
                                <span class="text-white">
                                    <v-icon dark>
                                        mdi-printer
                                    </v-icon>
                                </span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                    <v-select
                        v-if="!switch_print"
                        style="margin-top:30px;"
                        v-model="filter_type"
                        outlined
                        label="Print Type"
                        :items="item_filter"
                        @change="selectedFilterType(filter_type)"
                    ></v-select>
                    <v-select
                        v-else
                        disabled
                        style="margin-top:30px;"
                        v-model="filter_type_rpt"
                        outlined
                        label="Print Type"
                        :items="item_filter"
                        @change="selectedFilterType(filter_type)"
                    ></v-select>
                </v-card-text>
            </v-col>
        </div>
        <LoadingBar :value="loading"/>
    </v-container>
</template>
<script>
    export default {
        name: "PrintLabel",
        data() {
            return {
                url: '',
                switch_print: false,
                koliDs: true,
                loading: false,
                errorSO: false,
                errorSORpt: false,
                filePdf: '',
                search: '',
                search_rpt: '',
                so_code: '',
                merchant_name: '',
                helper_code: '',
                total_koli: '',
                websocket_status: '',
                websocket: null,
                connected: false,
                form_prt:{
                    sales_order_code: '',
                    increment_prints: [],
                },
                item_koli: [],
                item_filter: [
                    {
                        text: 'Label',
                        value: 'label_picking'
                    },
                    {
                        text: 'Surat Jalan',
                        value: 'sj'
                    },
                    {
                        text: 'RFID Label',
                        value: 'label_rfid'
                    }
                ],
                filter_type:  {
                        text: 'Label',
                        value: 'label_picking'
                    },
                filter_type_rpt:  {
                        text: 'Label',
                        value: 'label_picking'
                    },
            }
        },
        computed:{
            printDs(){
                if(this.form_prt.increment_prints == ""){
                    return true
                }else{
                    return false
                }
            }
        },
        created() {
            //initiate connection to websocket
            this.connection()
        },
        mounted() {
            this.setPrintTypeVal()
            this.$nextTick(() => this.$refs.searchSO.focus())
        },
        methods: {
            reprint(){ // switch print
                this.switch_print = true
            },
            print(){ // print
                this.switch_print = false  
            },
            //connection method to websocket
            connection(){
                this.websocket = new WebSocket("ws://127.0.0.1:12212/printer")
                this.websocket.onopen = this.onConnect
                this.websocket.onclose = this.onDisconnect
            },
            //reconnect websocket if disconnected or idle
            reconnect(){
                this.connection()
            },
            //show status connected if onconnect
            onConnect(){
                this.connected = true
                this.websocket_status = 'Connected'
            },
            //show status disconnected if ondisconnect and try to reconnect to the websocket
            onDisconnect(){
                this.connected = false
                this.websocket_status = 'Disconnected'
                this.reconnect()
            },
            isConnected(){ // check if websocket is connected
                return this.connected
            },
            submitDataToWebSocket(data){ // send data to websocket
                if (Array.isArray(data)) {
                    data.forEach(function (element) {
                        this.websocket.send(JSON.stringify(element));
                    });
                } else {
                    this.websocket.send(JSON.stringify(data));
                }
            },
            selectedFilterType(filter_type){ // set value to filter_type
                localStorage.setItem('filter_type',filter_type)
            },
            setPrintTypeVal(){ // set value of print type from local storage
                this.filter_type = {
                    value: localStorage.getItem('filter_type')
                }
            },
            getIncrementKoli(){ // get increment koli
                this.loading = true
                this.$http.get("delivery/koli/increment?conditions=salesorder.code:"+this.search_rpt)
                .then(res => {
                    this.loading = false
                    let koli = res.data.data
                    for (let i = 0; i < koli.length; i++) {
                        this.item_koli.push({
                            text: (i+1)+'/'+res.data.total,
                            value: i+1
                        })
                    }
                    this.form_prt.sales_order_code = this.search_rpt 
                    this.errorSORpt = false
                    this.koliDs = false
                })
                .catch(e => {
                    this.loading = false
                    this.errorSORpt = true
                    this.search_rpt = ""
                    this.form_prt.sales_order_code = ""
                })
            },
            printRpt(){ // print report
                this.loading = true
                this.$http.post("/delivery/koli/increment/print", this.form_prt)
                .then(res => {
                    if(this.isConnected()){
                        this.submitDataToWebSocket({
                            'type': 'LABEL',
                            'url': res.data.file
                        })
                    }else{
                        alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                        window.open(res.data.file, '_blank');
                    }
                    this.search_rpt = ''
                    this.form_prt.increment_prints = []
                    this.loading = false
                })
                .catch(e => {
                    this.loading = false
                })
            },
            printRfidLabel(){ // Print RFID Fridge Product Label
                this.loading = true
                let valuePrint = {
                    rfid_code: this.search
                }
                this.$http.post("/box/rfidLabel", valuePrint)
                .then(res => {
                    if(this.isConnected()){
                        this.submitDataToWebSocket({
                            'type': 'LABEL',
                            'url': res.data.data.link_print
                        })
                    }else{
                        alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                        window.open(res.data.data.link_print, '_blank');
                    }
                    this.search = ''
                    this.loading = false
                })
                .catch(e => {
                    this.loading = false
                })
            },
            async printLabel(val){ // method print Label
                var valueFilterType = localStorage.getItem('filter_type')
                this.loading = true
                let code = ''
                let typePrint = ''
                if(val.startsWith('PL-') && valueFilterType == 'label_picking') {
                    code = 'pickinglist.code:' + val
                    typePrint = 'picking_list'
                } else {
                    code = 'salesorder.code:' + val,
                    typePrint = valueFilterType
                }
                await this.$http.get("/warehouse/picking_order/assign/print?", {
                    params: {
                        conditions: code,
                        type_print: typePrint
                    }
                })
                .then(response => {
                    let data = response.data.data
                    if(valueFilterType == 'sj'){
                        if(this.isConnected()){
                            this.submitDataToWebSocket({
                                'type': 'INVOICE',
                                'qty': 3,
                                'url': response.data.file
                            })
                        }else{
                            alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Surat Jalan');
                            window.open(response.data.file, '_blank');
                        }
                        this.search = ''
                        this.loading = false
                    }else {
                        if (val.startsWith('PL-')) {
                            if(this.isConnected()){
                                this.submitDataToWebSocket({
                                    'type': 'LABEL',
                                    'url': response.data.file
                                })
                            }else{
                                alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                                window.open(response.data.file, '_blank');
                            }
                            this.search = ''
                            this.loading = false
                        } else {
                            if(this.isConnected()){
                                this.submitDataToWebSocket({
                                    'type': 'LABEL',
                                    'url': data.link_print
                                })
                            }else{
                                alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                                window.open(data.link_print, '_blank');
                            }
                            this.search = ''
                            this.loading = false
                        }
                    } 

                })
                .catch(e => {
                    this.loading = false
                    this.errorSO = true
                    this.search = ""
                    val = ""
                    setTimeout(function(){
                        window.location.reload()
                    }, 2000)
                });
            },
        },
        watch:{
            search: {
                handler: function (val) {
                    if(val !== ""){
                        let that = this
                        var valueFilterType = localStorage.getItem('filter_type')
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            if(valueFilterType == 'label_rfid'){
                                that.printRfidLabel(val)
                            }else {
                                that.printLabel(val)
                            }
                        }, 100);
                    }
                },
                deep: true
            },
            search_rpt: {
                handler: function (val) {
                    if(val !== ""){
                        let that = this
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.getIncrementKoli(val)
                        }, 100);
                    }else{
                        this.koliDs = true
                        this.form_prt.increment_prints = []
                    }
                },
                deep: true
            },
        }
    }
</script>