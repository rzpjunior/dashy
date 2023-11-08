<template>
    <v-autocomplete
        v-model="order_channel"
        :items="items"
        :loading="isLoading"
        item-text="note"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :placeholder="placeholder"
        :dense="dense"
        class="multi"
        required
        :error-messages="error"
        multiple
        clearable
        deletable-chips
        chips
    >
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Order Channel<span class="text-red">*</span></span>
                <span v-else>Order Channel</span>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.note }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectOrderChannel',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                order_channel:''
            };
        },
        props: ['orderchannel','disabled','clear','error','dense','norequired', 'label'],
        methods: {
            remoteSearch() {
                this.items = []
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/config/glossary",{params:{
                    perpage:10,
                    conditions:'attribute:order_channel',
                }}).then(response => {
                    let array = response.data.data
                    if (array != null) {
                        array.forEach(element => {
                            this.items.push({
                                value:element.value_int,
                                note:this.capitalizeFirstLetter(element.note)
                            })
                        });
                    }
                    this.isLoading = false
                    let label = 'Glossary'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.order_channel= []
                    for (let i = 0; i < val.length; i++) {
                        this.order_channel.push(val[i])
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch();
        },
        watch:{
            orderchannel: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            order_channel: {
                handler: function () { // watch perubahan untuk auto select
                    this.search = ''
                },
                deep: true
            },
        }
    };
</script>
