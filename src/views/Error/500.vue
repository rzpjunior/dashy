<template>
    <div>
        <v-row>
            <v-col>
                <div style="padding-top: 9%; text-align:center">
                <img src="/img/500.svg" alt="image">
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <div class="text-center">
                <h1 style="font-size:35px">Internal Server Error</h1>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <div class="text-center">
                <span style="font-size:20px; color: grey;">Sorry, this was unexpected</span> <br>
                <span style="font-size:20px; color: grey;">Please check back again or refresh page</span>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <div class="text-center">
                <v-btn
                @click="refresh"
                height="50"
                style="color: white; border-radius: 25px; background-color: #768F9C;"
                >Refresh
                </v-btn>
            </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      refresh(){
          this.$router.go(-1)
      }
    },
  }
</script>