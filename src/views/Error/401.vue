<template>
    <div>
        <v-row>
          <v-col>
             <div style="padding-top: 5%; text-align:center">
            <img src="/img/401.svg" alt="image">
            </div>
          </v-col>
        </v-row>

        <v-row>
            <v-col>
              <div class="text-center">
              <h1 style="font-size:35px">Unauthorized Access</h1>
              </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
              <div class="text-center">
              <span style="font-size:20px; color: grey;">Your account does not have access to this page</span>
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
              >Back to Dashboard
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
          this.$router.push("/Home")
      }
    },
  }
</script>