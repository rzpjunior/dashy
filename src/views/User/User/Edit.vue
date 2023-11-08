<template>
  <v-container>
    <v-app class="Heiti">
      <div class="d-flex justify-center mt-md-6">
        <v-badge
            bottom
            overlap
            color="white"
            offset-x="45"
            offset-y="30"
            icon="mdi-pencil"
          >
            <v-avatar size="126">
              <img alt="user" src="/img/avatar.png" />
            </v-avatar>
          </v-badge>
      </div>

      <div class="row mt-md-2 mx-md-14">
        <div class="col"></div>
        <div class="col d-flex justify-center">
         <span style="text-align:center">
            <label style="font-size:25px">{{staff.display_name}}</label> <br>
           <span style="color:green">{{staff.user.email}}</span>
          </span>
        </div>
        <div class="col d-flex justify-end align-end">
            <v-btn
              v-if="staff.status_convert='active'"
              outlined
              rounded
              class="no-caps"
              color="#7CE363"
              style="width:104px"
            >
              Active
            </v-btn>
            <v-btn
              v-else
              outlined
              rounded
              class="no-caps"
              color="#fa9a4a"
              style="width:104px"
            >
              Archive
            </v-btn>
            <v-menu offset-y v-if="staff.status_convert='active'">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>settings</v-icon>
                </v-btn>
              </template>
              <v-list style="background: #E8EFF2">
                    <v-list-item  :to="'/user/user/detail/'" v-privilege="'usr_rdd'">
                        <v-list-item-content>
                            <v-list-item-title>Edit Profile</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div class="px-md-4">
                      <v-divider></v-divider>
                    </div>
                    <v-list-item  :to="'/user/user/detail/'" v-privilege="'usr_arc'">
                        <v-list-item-content>
                            <v-list-item-title>Archive</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div class="px-md-4">
                      <v-divider></v-divider>
                    </div>
                    <v-list-item  :to="'/user/user/detail/'" v-privilege="'usr_upd_pms'">
                        <v-list-item-content>
                            <v-list-item-title>Update Permission</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div class="px-md-4">
                      <v-divider></v-divider>
                    </div>
                    <v-list-item  :to="'/user/user/detail/'" v-privilege="'usr_rst_pass'">
                        <v-list-item-content>
                            <v-list-item-title>Reset Password</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu offset-y v-else>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>settings</v-icon>
                </v-btn>
              </template>
              <v-list style="background: #E8EFF2">
                    <v-list-item  :to="'/user/user/detail/'" v-privilege="'usr_urc'">
                        <v-list-item-content>
                            <v-list-item-title>UnArchive</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div class="px-md-4">
                      <v-divider></v-divider>
                    </div>
                    <v-list-item  :to="'/user/user/detail/'" v-privilege="'usr_upd_pms'">
                        <v-list-item-content>
                            <v-list-item-title>Update Permission</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div class="px-md-4">
                      <v-divider></v-divider>
                    </div>
                    <v-list-item  :to="'/user/user/detail/'" v-privilege="'usr_rst_pass'">
                        <v-list-item-content>
                            <v-list-item-title>Reset Password</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div class="px-md-4">
                      <v-divider></v-divider>
                    </div>
                    <v-list-item  :to="'/user/user/detail/'" v-privilege="'usr_del'">
                        <v-list-item-content>
                            <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
      </div>
      <div class="row mt-md-4 mx-md-14" style="color: #768F9C">
        <div class="col">
          <div class="row">
            <div class="col">
              Code :
            </div>
            <div class="col d-flex justify-end">
              {{staff.code}}
            </div>
          </div>
          <v-divider class="my-md-2"/>
          <div class="row">
            <div class="col">
              Division :
            </div>
            <div class="col d-flex justify-end">
              -
            </div>
          </div>
          <v-divider class="my-md-2"/>
          <div class="row">
            <div class="col">
              Supervisor :
            </div>
            <div class="col d-flex justify-end">
              -
            </div>
          </div>
          <v-divider class="my-md-2"/>
          <div class="row">
            <div class="col">
              Warehouse :
            </div>
            <div class="col d-flex justify-end">
              {{staff.warehouse.name}}
            </div>
          </div>
          <v-divider class="my-md-2"/>
        </div>
        <div style="width:5%"/>
        <div class="col">
          <div class="row">
            <div class="col">
              Employee Code :
            </div>
            <div class="col d-flex justify-end">
              {{staff.employee_code}}
            </div>
          </div>
          <v-divider class="my-md-2"/>
          <div class="row">
            <div class="col">
              Role :
            </div>
            <div class="col d-flex justify-end">
              {{staff.role.name}}
            </div>
          </div>
          <v-divider class="my-md-2"/>
          <div class="row">
            <div class="col">
              Area :
            </div>
            <div class="col d-flex justify-end">
              {{staff.area.name}}
            </div>
          </div>
          <v-divider class="my-md-2"/>
          <div class="row">
            <div class="col">
              Phone Number :
            </div>
            <div class="col d-flex justify-end">
              {{staff.phone_number}}
            </div>
          </div>
          <v-divider class="my-md-2"/>
        </div>
      </div>
      <div class="row mx-md-14" style="color: #768F9C">
        <div class="col">
          Note :
        </div>
        <div class="col d-flex justify-end">

        </div>
      </div>
      <v-divider class="my-md-2 mx-md-16"/>

      <div class="row">
        <div class="col-lg-10 offset-lg-1 pt-16" style="padding: 0px;">
          <div class="title-table">
            <label class="label-title">
              Activites
            </label>
          </div>
          <v-data-table
            :headers="headers"
            :items="desserts"
            :items-per-page="5"
          ></v-data-table>
        </div>
      </div>

      <!-- <div class="row mx-md-14 mt-md-8">
          <div class="title-table">
                <label style="font-size: 25px; color: white;">
                  Top Product
                </label>
              </div>
              <v-data-table
                :headers="headers"
                :items="desserts"
                :items-per-page="5"
              ></v-data-table>
           </div> -->
        <!-- <div class="title-table" style="width:100%">
          <h2 style="padding-left:40px; padding-top:10px; margin-top:10px; color:white;">Activites</h2>
          <table style="margin-bottom: 0;width:100%" class="rwd-table">
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Area</th>
              <th>Gross</th>
            </tr>
            <tr>
              <td data-th="Item Name">Boss Sosis Sapi 40 PCS (1 kg/pack)</td>
              <td data-th="Category">Poultry - Fresh</td>
              <td data-th="Area">Jakarta</td>
              <td data-th="Gross">$460,935,665</td>
            </tr>
            <tr>
              <td data-th="Item Name">Labu Siam Besar Grade A (1 kg/pack)</td>
              <td data-th="Category">Vegetable - Fresh</td>
              <td data-th="Area">Jakarta</td>
              <td data-th="Gross">$16,295,774</td>
            </tr>
            <tr>
              <td data-th="Item Name">Boss Chicken Nugget 14 PCS (0.25 gr/pack)</td>
              <td data-th="Category">Poultry - Fresh</td>
              <td data-th="Area">Jakarta</td>
              <td data-th="Gross">$115,000,000</td>
            </tr>
            <tr>
              <td data-th="Item Name">Jagung Manis Kupas Grade A (1 kg/pack)</td>
              <td data-th="Category">Vegetable - Fresh</td>
              <td data-th="Area">Jakarta</td>
              <td data-th="Gross">$115,000,000</td>
            </tr>
            <tr>
              <td data-th="Item Name">Labu Siam Acar Grade A (0.5 kg/pack)</td>
              <td data-th="Category">Vegetable - Fresh</td>
              <td data-th="Area">Jakarta</td>
              <td data-th="Gross">$115,000,000</td>
            </tr>
          </table>
        </div> -->
      <!-- </div> -->
    </v-app>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
           headers: [
        {
          text: 'Item Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Category', value: 'calories' },
        { text: 'Area', value: 'fat' },
        { text: 'C', value: 'carbs' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
        },
      ],
    };
  },
  computed: {
    staff () {
      return this.$store.getters.getStaff
    }
  },
};
</script>