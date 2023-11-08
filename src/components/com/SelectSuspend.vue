<template>
    <v-select
        v-model="suspend"
        :items="suspend_option"
        item-text="text"
        label="Suspended"
        @change="selected"
        return-object
        outlined
        :class="dense?'':'rounded-form'"
        :dense="dense"
    >
        <template slot="suspend_option" slot-scope="suspend_option">
            {{ suspend_option.text }}
        </template>
    </v-select>
</template>
<script>
    export default {
        name: 'SelectSuspend',
        data() {
            return {
                suspend:999,
                suspend_option:[
                    {
                        text:'Show All',
                        value:999
                    },{
                        text:'Yes',
                        value:1
                    },{
                        text:'No',
                        value:2
                    }
                ],
            };
        },
        props:['default', 'dense'],
        methods: {
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            if (this.default) {
                this.suspend = this.default
            }
        }
    };
</script>