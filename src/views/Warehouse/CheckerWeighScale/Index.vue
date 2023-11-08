<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" class="-mb12">
                    <v-alert
                        v-if="alert"
                        icon="check"
                        prominent
                        text
                        color="#03b319"
                        border="left"
                        >
                        <v-row align="center">
                            <v-col class="grow">
                                <b>Success</b><br/>
                                Item has been weighed successfully
                            </v-col>
                        </v-row>
                    </v-alert>
                    <v-alert
                        v-else
                        icon="info"
                        prominent
                        text
                        color="#08728b"
                        border="left"
                        >
                        <v-row align="center">
                            <v-col class="grow">
                                Scan product to start weigh scale
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row :class="filter ? 'mb20' : ''">
                <v-col>
                    Setting
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon right>
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon right>
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter ? '-mb30' : 'hidden'">
                <v-col cols="12" md="4" class="-mt24">
                    <v-select
                        v-model="modelWeigh"
                        outlined
                        label="Select Weigh Scale"
                        :items="selectWeigh"
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="4" class="-mt24 mb24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                v-model="portIp"
                                name="search"
                                label="IP Address"
                                single-line
                                hide-details
                                class="-mt10"
                                v-on="{ ...tooltip }"
                                outlined
                                onkeypress='return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)'
                                dense
                                :error="message == 'error1'"
                            ></v-text-field>
                        </template>
                        <span>Please insert the IP Address from your master device (the device is connected with weighscale and print)</span>
                    </v-tooltip>
                    <div v-if="message == 'error1'" class="mt-1 ml-3 fs12 text-red -mb2">
                        <span>Please Input IP Address</span>
                    </div>
                    <div v-if="message == 'error2'" class="mt-1 ml-3 fs12 text-green -mb2">
                        <a 
                           v-bind:href="'https://'+ portIp + ':12212/'"
                           target="_blank"
                        >
                            <span>Click here to allow certificate</span>
                        </a>
                    </div>
                </v-col>
                <v-col cols="12" md="4" class="-mt24 mb20">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="no-caps bold mt2"
                        @click="setSetting(modelWeigh, portIp)"
                    >
                        <span class="text-white">
                            SET
                        </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="ma12 wp100">
            <v-row>
                <v-col cols="12" md="8" class="-mt14">
                    <div class="box-col24">
                        <div class="counter-bg">
                            <div class="flex-align-center">
                                <h1 v-if="scanned" class="fs200" :style="style">
                                    <div class="d-flex align-center">
                                        {{search}}
                                        <v-icon
                                            x-large
                                            dark
                                            class="fs200"
                                            :style="style"
                                        >
                                            {{icon}}
                                        </v-icon>
                                    </div>
                                </h1>
                                <h1 v-else class="fs200 text-white">
                                    
                                </h1>
                                <v-alert
                                    v-if="caution"
                                    icon="warning"
                                    dark
                                    text
                                    color="#b9ab00"
                                    border="left"
                                    >
                                    <b>PLEASE REMOVE ITEM ON THE WEIGH SCALE</b>
                                </v-alert>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="4" class="-mt14">
                    <div class="box-col24">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }">
                                <v-text-field
                                    v-model="search_prd"
                                    append-icon="mdi-line-scan"
                                    name="search"
                                    label="Scan Product"
                                    single-line
                                    hide-details
                                    class="-mt10"
                                    v-on="{ ...tooltip }"
                                    outlined
                                >
                                </v-text-field>
                            </template>
                            <span>Scan Product</span>
                        </v-tooltip>
                        <div class="mt25" v-if="scanned">
                            <div class="flex-align-center">
                                <div v-for="(item, idx) in product.product.product_image" :key="idx">
                                    <v-img
                                        class="rounded-form"
                                        height="180"
                                        width="250"
                                        :src="item.image_url"
                                    ></v-img>
                                </div>
                                <h2 class="mt20">{{ product.product.name }}</h2>
                            </div>
                            <div class="mt20">
                                <DetailRowNew :name="`Product Code`" :value="`${product.product.code}`"/>
                                <DetailRowNew :name="`Order Qty`" :value="`${product.order_qty} KG`"/>
                            </div>
                            <div class="flex-align-center mt30">
                            <h1>
                                <div v-if="finished" class="align">
                                    <span class="text-green">FINISHED</span>
                                </div>
                            </h1>
                        </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <LoadingBar :value="loading"/>
    </v-container>
</template>
<style scoped>
.fs200{
    font-size: 12vw !important;
}
.counter-bg{
    background-color:#2B3739 !important; 
    padding:20px;
}
.text-yellow{
    color: yellow;
}
.text-red{
    color: red;
}
.text-green{
    color: green;
}
.text-white{
    color:white;
}
.black-ic{
    color: black !important;
}
.align{
    text-align: center;
}
.bg-white-btn{
    background-color: white !important;
}
</style>
<script>
    import Vue from 'vue'
    export default {
        name: "WeighScale",
        data() {
            return {
                url: '',
                loading: false,
                filter: true,
                loadingDispose: false,
                errorSO: false,
                fulfill: false,
                finished: false,
                filePdf: '',
                search: 0,
                so_code: '',
                websocket_status: '',
                buffer: '',
                websocket: null,
                websocketPrint: null,
                connected: false,
                connectedPrint: false,
                style: 'color: white;',
                icon: '',
                product: {
                    product: {
                        name: '',
                        product_image:[]
                    }
                },
                packing: [],
                packing_code: '',
                callPrint: false,
                printed: false,
                dispose: false,
                caution: false,
                alert: false,
                scanned: false,
                ticker: 0,
                data: 0,
                data2: 0,
                dataStore: [],
                belowWeight:true,
                get_tolerance:[],
                tolerance:0,
                actualData: 0,
                expectedData: 0,
                aboveTolerance: 0,
                belowTolerance: 0,
                tolerance1: 0,
                tolerance2: 0,
                checkBrowser: true,
                stable_weighing_time_second: 0,
                modelWeigh: '',
                portIp: '127.0.0.1',
                search_prd: '',
                product_id: '',
                message: '',
                selectWeigh:[
                    {
                        text:'WEIGH1',
                        value: 'WEIGH1'
                    },
                    {
                        text:'WEIGH2',
                        value: 'WEIGH2'
                    },
                    {
                        text:'WEIGH3',
                        value: 'WEIGH3'
                    },
                    {
                        text:'WEIGH4',
                        value: 'WEIGH4'
                    },
                    {
                        text:'WEIGH5',
                        value: 'WEIGH5'
                    },
                    {
                        text:'WEIGH6',
                        value: 'WEIGH6'
                    },
                    {
                        text:'WEIGH7',
                        value: 'WEIGH7'
                    },
                    {
                        text:'WEIGH8',
                        value: 'WEIGH8'
                    }
                ],
            }
        },
        created() {
            //initiate connection, browser tab, and stable time
            this.weighConnection()
            this.checkBrowserTab()
            this.checkStableTime()
        },
        mounted() {
            let self = this
            let weigh = localStorage.getItem('weigh_port')
            let ip = localStorage.getItem('ip_port')
            if (ip || weigh) {
                self.portIp = ip
                self.modelWeigh = weigh
            }
            //to increment ticker and check ticker condition if its more than 5 back to zero every 1 second
            setInterval(function(){
                self.ticker += 1
                if (self.ticker > self.stable_weighing_time_second) {
                    self.ticker = 0
                }
            }, 1000)
            // paralel check condition again if its more than 5 back to zero to ensure every 1 second
            setInterval(function(){
                if (self.ticker > self.stable_weighing_time_second) {
                    self.ticker = 0
                }
            }, 1000)
            // paralel override data2 as data from weigh scale to check the equality ever 0.1 second
            setInterval(function() {
                self.data2 = self.data
            }, 100)
            // paralel check if data not the same as data2 it will go back to zero so it will not proceed anything yet every 0.15 second
            setInterval(function() {
                if (self.data !== self.data2) {
                    self.ticker = 0
                }
            }, 110);
            // paralel if its 5 second and data are the same it will proceed to do the automatic print through websocket every 1 second
            setInterval(function(){
                if (self.ticker == self.stable_weighing_time_second && (self.data2 === self.data) && parseFloat(self.data) > 0 && self.belowWeight == false && self.checkBrowser == true && self.scanned == true) {
                    self.ticker = 0
                    if(!self.callPrint){
                        self.callPrint = true
                        self.weighScale()
                    }
                }
            }, 1000)
        },
        methods: {
            checkStableTime(){
                this.$http.get("/config/app", {
                params: {
                    orderby: '-id',
                }
                }).then(res => {
                    let data = res.data.data
                    for (let i = 0; i < data.length; i++) {
                        if(data[i].attribute === "stable_weighing_time_second"){
                            let temp_stable = data[i].value
                            this.stable_weighing_time_second = temp_stable
                        }
                    }
                });
            },
            //check browser tab if active or not
            checkBrowserTab(){
                let self = this
                document.addEventListener("visibilitychange", function() {
                    if (document.hidden) {
                        self.checkBrowser = false
                    }else{
                        self.checkBrowser = true
                    }
                });
            },
            //to select Settings (Weigh, IP)
            setSetting(weigh, ip) {
                if (ip) {
                    localStorage.setItem('weigh_port',weigh)
                    localStorage.setItem('ip_port', ip)
                    window.location.reload()
                } else {
                    this.message = 'error1'
                }
            },
            //connection method to websocket for weigh scale
            weighConnection(){
                let val = localStorage.getItem('weigh_port')
                let ip = localStorage.getItem('ip_port')
                this.websocket = new WebSocket(`wss://${ip}:12212/serial/`+val)
                this.websocket.onopen = this.onConnect
                this.websocket.onclose = this.onDisconnect
                this.websocket.onmessage = this.onMessage
            },
            //reconnect websocket if disconnected or idle for weigh scale
            reconnect(){
                this.weighConnection()
            },
            // to translate value from weigh scale to dom
            onMessage(evt){
                var chr = evt.data;
                var weightRegex = new RegExp('([0-9]{1,4}\\.[0-9]{1,4})kg');
                if (chr == "\n") {
                    var weightOutput = weightRegex.exec(this.buffer);
                    if (weightOutput != null) {
                        this.onUpdate(weightOutput[1]);
                    }
                    this.buffer = '';
                } else {
                    this.buffer = this.buffer + chr;
                }
            },
            //after the weigh data stable it will go to this function to update the increment and automatically print packing label
            weighScale(){
                this.loading = true
                this.$http.put("/warehouse/picking_order/checker/scan_update/"+this.product_id,{
                    check_qty: parseFloat(this.search),
                })
                .then(response => {
                    this.alert = true
                    this.finished = true
                    this.caution = true
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
            //to show and modified the translated value on input
            onUpdate(weight) {
                let that = this
                that.data = JSON.parse(JSON.stringify(weight))
                this.search = weight.slice(2)
                if (this.search >= this.product.order_qty && this.search <= this.tolerance1){
                    this.style = 'color: green;'
                    this.icon = 'mdi-check-bold'
                    this.belowWeight = false
                }
                else if (this.search >= this.tolerance1 && this.search <= this.tolerance2){
                    this.style = 'color: yellow;'
                    this.icon = 'mdi-arrow-down-bold'
                    this.belowWeight = false
                }
                else if (this.search > this.tolerance2){
                    this.style = 'color: red;'
                    this.icon = 'mdi-arrow-down-bold'
                    this.belowWeight = true
                }
                else if (this.search > 0){
                    this.style = 'color: red;'
                    this.icon = 'mdi-arrow-up-bold'
                    this.belowWeight = true
                }
                else{
                    this.style = 'color: white;'
                    this.icon = ''
                    this.callPrint = false
                    this.caution = false
                    this.belowWeight = true
                    this.alert = false
                    this.finished = false
                }
            },
            //show status connected if onconnect for weigh scale
            onConnect(){
                this.connected = true
                let weigh = localStorage.getItem('weigh_port')
                let ip = localStorage.getItem('ip_port')
                this.portIp = ip
                this.modelWeigh = weigh
            },
            //show status disconnected if ondisconnect and try to reconnect to the websocket for weigh scale
            onDisconnect(){
                this.connected = false
                this.message = 'error2'
                this.reconnect()
            },
            //is websocket connected weigh scale
            isConnected(){
                return this.connected
            },
            //render product from scanner
            renderProduct(){
                this.loading = true
                let sliced_id = this.search_prd.slice(4)
                this.$http.get('/warehouse/picking_order/checker/item/'+sliced_id)
                .then(res => {
                    this.search_prd = ''
                    this.product = res.data.data
                    this.product_id = res.data.data.id
                    this.$http.get("/config/app", {
                        params: {
                            orderby: '-id',
                    }
                    }).then(res => {
                        this.loading = false;
                        this.scanned = true
                        this.get_tolerance = res.data.data
                        for (let i = 0; i < this.get_tolerance.length; i++) {
                            let temp = this.get_tolerance[i]
                            if(temp.attribute === "percentage_kg_picking_tolerance"){
                                let temp_tolerance = temp.value
                                let moq = this.product.product.order_min_qty
                                let pct1 = (temp_tolerance / 100) * moq // (percent / 100) * value = value percentage
                                let pct2 = (temp_tolerance / 100) * this.product.order_qty
                                this.tolerance1 = this.product.order_qty + pct1 // value + percentage1 result
                                this.tolerance2 = this.product.order_qty + pct2 // value + percentage2 result
                            }
                        }
                    });
                })
                .catch(e => {
                    this.loading = false
                    this.search_prd = ''
                })
            },
        },
        watch:{
            search_prd: {
                handler: function (val) {
                    if(val !== ""){
                        let that = this
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.renderProduct()
                        }, 100);
                    }
                },
                deep: true
            },
        }
    }
</script>
