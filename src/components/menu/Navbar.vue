<template>
    <section>
        <v-navigation-drawer enable-resize-watcher :permanent="modeDesktop" v-model="drawer" app color="#2B3739" width="220" height="100%" :dark="true">
            <div class="pt-2"/>
            <v-list class="OpenSans fs13">
                <v-list-item>
                    <img :src="logo_url" width="90%" height="90%" class="pl-md-3">
                </v-list-item>
                <div class="pt-3"/>
                <div v-for="(item, idx) in navbar_menu" :key="idx">
                    <div v-if="!item.child">
                        <v-list-item v-privilege="item.privilege.value" color="#FFFFFF" :to="item.url">
                            <v-list-item-icon class="p-icon-nav" style="margin-right:14px">
                                <v-icon>{{item.icon}}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="fs13">{{item.title}}</v-list-item-title>
                        </v-list-item>
                    </div>
                    <div v-else>
                        <v-list-group :value="activeRoute(item.child)" color="#FFFFFF" v-privilege="item.privilege.value">
                            <template v-slot:activator>
                                <v-list-item-icon class="p-icon-nav" style="margin-right:14px">
                                    <v-icon>{{item.icon}}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title class="fs13">{{item.title}}</v-list-item-title>
                            </template>
                            <div>
                                <div v-for="(child, idx) in item.child" :key="idx">
                                    <v-list-item :to="child.url" v-privilege="child.privilege.value" >
                                        <v-list-item-content class="p-icon-nav" style="margin-right:14px">{{child.title}}</v-list-item-content>
                                    </v-list-item>
                                    <!-- <hr class="mx-4 hr-navbar" v-privilege="child.privilege.value"> -->
                                    <div class="hr-navbar-new" v-privilege="child.privilege.value"/>
                                </div>
                            </div>
                        </v-list-group>
                    </div>
                </div>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="white" flat class="OpenSans fs14" dense>
            <v-btn icon v-if="!modeDesktop" @click.stop="drawer = !drawer">
                <img src="/icon/menu.png">
            </v-btn>
            <v-toolbar-title class="nav-title">{{routeName}}</v-toolbar-title>
            <div class="flex-grow-1 men" ></div>
            <v-btn
                v-if="modeDesktop"
                class="no-caps fs14 mr8"
                text
                name="logout-btn"
                color="#768F9C"
                @click="signoutButtonPressed"
                outlined
            >
                <v-icon left>
                    power_settings_new
                </v-icon>
               <span class="fs13">Logout</span>
                    
            </v-btn>

            <v-card-actions v-else @click.stop="drawerRight = !drawerRight">
                <v-list-item style="margin-right:-28px">
                    <v-menu offset-y >
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <img src="/icon/polygon.png">
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item  @click="signoutButtonPressed">
                            <v-list-item-content>
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </v-list-item>
            </v-card-actions>
        </v-app-bar>
    </section>
</template>
<script>
    export default {
        props: {
            source: String,
        },
        data: () => ({
            selectedItem: 1,
            drawer: null,
            drawerRight: null,
            dark_mode:false,
            me:{},
            items: [
                { text: 'Real-Time', icon: 'mdi-clock' },
                { text: 'Audience', icon: 'mdi-account' },
                { text: 'Conversions', icon: 'mdi-flag' },
            ],
            modeDesktop : null,
            navbar_menu: [],
            logo_url: "",
        }),
        methods: {
            activeRoute(child) {
                let value = false
                child.forEach(e => {
                    if (this.$route.path.includes(e.url)) {
                        value = true
                    }
                });
                return value
            },
            signoutButtonPressed() {
                this.$store.dispatch('logout');
                localStorage.setItem('navbar', '')
                localStorage.setItem("priv", '');
                this.$router.push({ name: "Login" });
            },
            darkMode(){
                let value
                value = localStorage.getItem('dark_mode')

                if(value === 'true'){
                    localStorage.removeItem('dark_mode')
                    localStorage.setItem('dark_mode','false')
                    this.$vuetify.theme.dark = false
                    this.dark_mode=false
                }else if(value === 'false' || value === null){
                    localStorage.removeItem('dark_mode')
                    localStorage.setItem('dark_mode','true')
                    localStorage.setItem('dark_mode','true')
                    this.$vuetify.theme.dark = true
                    this.dark_mode=true
                }
            }
        },
        mounted(){
            this.me = this.$store.state.staff
            window.onresize = () => {
                if (window.screen.width > 1024) {
                    this.modeDesktop = true
                } else {
                    this.modeDesktop = false
                }
            }
        },
        created () {
            let navbar = localStorage.getItem('navbar')
            let me = this.$store.state.staff
            if (navbar != "") {
                this.navbar_menu = JSON.parse(navbar)
            } else {
                if (me.user.id==65536) {
                    this.$http.get("/menu").then(response => {
                        this.navbar_menu = response.data.data
                    });
                } else {
                    this.$http.get("/menu/user/"+me.user.id).then(response => {
                        this.navbar_menu = response.data.data
                    });
                }
            }
            if (window.screen.width > 1024) {
                this.modeDesktop = true
            } else {
                this.modeDesktop = false
            }
            let env = process.env.VUE_APP_LOGO_ENV
            if (env == 'dev') {
                this.logo_url = "/img/eden-logo-dev.png"
            } else if (env == 'staging') {
                this.logo_url = "/img/eden-logo-staging.png"
            } else {
                this.logo_url = "/img/eden-logo.png"
            }
        },
        beforeCreate() {
            if (window.screen.width > 1024) {
                this.modeDesktop = true
            } else {
                this.modeDesktop = false
            }
        },
        computed: {
            routeName() {
                return this.$route.meta.title;
            }
        }
    };
</script>
<style scoped>
/* background v-list active */
.v-list .v-list-item--active {
    color: #FFFFFF;
    background-image: url(/img/bg_navbar_new.png);
    background-position: left;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
}
/* padding icon */
.p-icon-nav {
    /* padding-left:20px; */
    margin-right:14px
}
</style>
