<template>
    <v-app>
        <div v-if="getStatusLogin && !isLoading">
            <NavBar v-if="!isLoading && ['Maintenance','Unauthorized','Forbidden','PageNotFound','InternalServerError'].indexOf($route.name) === -1"  v-show="getStatusLogin"/>
        </div>
        <v-main v-if="!isLoading" >
            <!-- <FirebaseNotif/> -->
            <BreadcrumbsNew v-if="$route.meta.breadcrumbs"/>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
    import NavBar from "./components/menu/Navbar";
    import * as Sentry from "@sentry/vue";

    export default {
        name: "App",
        components: {
            NavBar
        },
        data() {
            return { isLoading: true };
        },
        computed: {
            getStatusLogin: function () {
                if(this.$store.getters.isLoggedIn !== ''){
                    const staff = this.$store.state.staff

                    // Register User in Google Analytics
                    this.$gtag.set({
                      user_properties: {
                        user_code: staff.user.code,
                        user_role: staff.role.name
                      }
                    })

                    // Register User in Sentry
                    Sentry.setUser({
                      email: staff.user.email,
                      id: staff.user.id,
                      username: staff.user.code,
                    });
                    return true
                }else{
                    return false
                }
            }
        },
        mounted() {
            setTimeout(() => {
                this.isLoading = false;
            }, 50);
        },
        created() {
            document.title = 'Dashboard - '+this.$route.meta.title;
        },
        watch: {
            '$route' (to, from) {
                document.title = to.meta.title ? 'Dashboard - '+ to.meta.title : 'EdenFarm'|| 'EdenFarm'
            }
        },
    };
</script>