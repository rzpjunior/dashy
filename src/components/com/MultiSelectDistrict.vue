<template>
    <v-autocomplete
        v-model="districts"
        :items="items"
        :loading="isLoading"
        item-text="name"
        name="district"
        :counter="maxSelected"
        :menu-props="menuProps"
        :placeholder="placeholder"
        :search-input.sync="search"
        @input="adjustOptions"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        chips
        multiple
        deletable-chips
        :class="dense?'':'rounded-form'"
        :dense="dense"
        :error-messages="error"
    >
        <template v-slot:label>
            <span v-if="!norequired">District<span style="color:red">*</span></span>
            <span v-else>District</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'MultiSelectDistrict',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                districts:[],
                maxSelected: 99,
                menuProps: {
                    disabled: false
                },
                search:'',
            };
        },
        props: ['district','disabled','clear','label','error', 'norequired', 'attribute', 'dense','wr_id', 'area_id', 'city_id'],
        methods: {
            remoteSearch(search) {
                let wr_id = ''
                if (this.wr_id) {
                    wr_id = '|warehouse.id.e:'+this.wr_id
                }
                let area_id = ''
                if (this.area_id) {
                    area_id = '|warehouse.area.id.e:' + this.area_id
                }
                let city_id = ''
                if (this.city_id) {
                    city_id = '|subdistrict.district.city.id.e:' + this.city_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.items = []
                this.$http.get("/config/warehouse/coverage/filter",{params:{
                    conditions:'subdistrict.district.name.icontains:'+search+wr_id+area_id+city_id,
                    embeds:'subdistrict.district,warehouse.area,subdistrict.district.city'
                }}).then(response => {
                    let arr = []
                    if (response.data.data != null) {
                        arr = response.data.data
                    }
                    for (let i = 0; i < arr.length; i++) {
                        this.items.push({
                            id : arr[i].sub_district.district.id,
                            name : arr[i].sub_district.district.name
                        })
                    }
                    this.isLoading = false
                    let label = 'District'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
                if(this.items.length >= this.maxSelected){
                    this.menuProps.disabled = true
                }
            },
            autoSelectByID(val) {
                if(val){
                    this.districts= []
                    for (let i = 0; i < val.length; i++) {
                        this.districts.push(val[i])
                    }
                    if(this.districts.length >= this.maxSelected){
                        this.menuProps.disabled = true
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            adjustOptions() {
                if (this.computedCounterValue >= this.maxSelected) {
                    this.menuProps.disabled = true
                } else {
                    this.menuProps.disabled = false
                }
            },
        },
        computed: {
            computedCounterValue () {
                let totalCount = 0
                if (this.districts && this.districts.length > 0) {
                    const selectedItems = this.districts.map((name) => {
                        return this.items.find((element) => element.name == name.name)
                    })
                    totalCount = selectedItems.reduce(function(prev, cur) {
                        return prev + ((cur.count)? cur.count: 1);
                    }, 0);
                }
                return totalCount
            },
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        if(this.computedCounterValue < this.maxSelected){
                            this.remoteSearch(val)
                        }
                    } else if(!this.district){
                        this.remoteSearch('',this.aux_data)
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.districts = []
                    this.remoteSearch('','')
                },
                deep: true
            },
            district: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            area_id: { // untuk props area
                handler: function(val) {
                    if (val !== null && val !== '') { // ini untuk auto select
                        this.remoteSearch('')
                    } else {
                        this.districts = []
                    }
                },
                deep: true
            },
            city_id: { // untuk props city
                handler: function(val) {
                    if (val !== null && val !== '') { // ini untuk auto select
                        this.remoteSearch('')
                    }  else {
                        this.districts = []
                    }
                },
                deep: true
            },
            aux_data: {
                handler: function (val) {
                    if(val !== null){
                        this.remoteSearch(this.search,val)
                    }
                },
                deep: true
            },
            wr_id: { // ini fungsi untuk request by area_id
                handler: function (val) {
                    this.districts = []
                    if(val !== null && val !== ''){ // ini untuk auto select
                    this.remoteSearch('')
                    }
                },
                deep: true
            },
            districts: {
                handler: function (val) {
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>