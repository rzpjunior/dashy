<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        :dense="true"
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Name <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :label="'Warehouse'"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        :dense="true"
                        :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="100"
                        maxlength="100"
                        outlined
                        label="Note"
                        dense
                        rows="3"
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-privilege="'ven_rdl'"
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            v-privilege="'ven_crt'"
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                        >
                            Create
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>

<script>
    export default {
        name: 'VendorCreate',
        data() {
            return {
                warehouse: '',
                ConfirmData: {},
                form: {
                    name: '',
                    note: '',
                    warehouse_id: ''
                },
                error: {}
            }
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function(err) {
                self.error = err
            });
        },
        methods: {
            warehouseSelected(d) { // select warehouse  
                this.warehouse = ""
                this.form.warehouse_id = ""
                if (d) {
                    this.warehouse = d
                    this.form.warehouse_id = d.id
                }
            },
            confirmButton() { // confirm button send to API
                this.ConfirmData = {
                    model: true,
                    title: "Create Vendor",
                    text: "Are you sure want to create this Vendor?",
                    urlApi: "/logistic/vendor",
                    nextPage: "/logistic/vendor",
                    post: true,
                    data: this.form,
                    label: 'URL_2'
                }
            }
        }
    }
</script>