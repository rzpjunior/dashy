<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" md="6">
                    <img
                        width="44px"
                        height="44px"
                        src="/img/user-profile.png"
                        class="img-left"
                    />
                    <div class="flex-align-start pl16">
                        <div>
                            <span class="bold">{{ form.name }}</span> ({{ form.display_name }})
                        </div>
                        <div class="text-secondary underline">
                            {{ form.user.email }}
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="flex-align-end">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                            <v-list class="bg-white">
                                <v-list-item v-privilege="'usr_prf_upd'" :to="'/configuration/usr_profile/update' ">
                                    <v-list-item-content>
                                        <v-list-item-title>Update</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-icon>
                                        <v-icon>mdi-open-in-new</v-icon>
                                    </v-list-item-icon>
                                </v-list-item>
                                <v-list-item v-privilege="'usr_prf_upd_pas'" :to="'/configuration/usr_profile/password' ">
                                    <v-list-item-content>
                                        <v-list-item-title>Update Password</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-icon>
                                        <v-icon>mdi-open-in-new</v-icon>
                                    </v-list-item-icon>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Division'" :value="form.role.division.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Role'" :value="form.role.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="form.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supervisor'" v-if="form.supevisor != null" :value="form.parent.name"/>
                    <DetailRowNew :name="'Supervisor'" v-else :value="'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="form.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="form.phone_number"/>
                </v-col>
            </v-row>
        </div>
  </v-container>
</template>
<style scoped>
.img-left {
    float: left
}
</style>
<script>
export default {
    name : "UserProfileDetail",
    data() {
        return {
            form: {}
        };
    },
    methods:{
        renderData(){
            this.$http.get("/config/user/profile/detail").then(response => {
                this.form = response.data.data
                this.form.supevisor = response.data.data.parent.name
            });
        },
    },
    created(){
        this.renderData()
    }
};
</script>