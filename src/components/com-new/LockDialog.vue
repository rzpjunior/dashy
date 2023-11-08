<template>
    <v-dialog
        v-model="model"
        persistent
        max-width="470px"
    >
        <v-card class="OpenSans">
            <v-card-title>
                <span class="text-title-modal">{{handleLockedTitle()}} is Locked</span>
            </v-card-title>
            <v-card-text>
                <span class="fs16 mt-1">You can't update this {{handleLockedTitle()}} because it is locked by<br>{{locked_by}}</span>
            </v-card-text>
            <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                <v-btn
                    @click="model = false"
                    class="main-btn white--text"
                    depressed
                    color="#50ABA3"
                >Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name : "LockDialog",
    props : ["model", "locked_by", "locked_text"],
    methods: {
        handleLockedTitle() {
            if (this.locked_text != undefined ) {
                return this.locked_text
            } else {
                return 'Sales Order'
            }
        },
    }
}
</script>