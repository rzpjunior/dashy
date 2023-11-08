<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-form ref="form" lazy-validation v-model="valid">
                <v-row class="mt24">
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="name"
                            required
                            outlined
                            maxlength="50"
                            dense
                            v-model="form.name"
                            :error-messages="error.name"
                            :rules="rules.name"
                        >
                            <template v-slot:label>
                                Name<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="abbreviation"
                            required
                            outlined
                            maxlength="3"
                            dense
                            v-model="form.abbreviation"
                            :error-messages="error.abbreviation"
                            :rules="rules.abbreviation"
                        >
                            <template v-slot:label>
                                Abbreviation<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-select
                            v-model="statuses"
                            :items="status"
                            item-text="text"
                            item-value="value"
                            outlined
                            :dense="true"
                            :rules="rules.select"
                            required
                            clearable
                            disabled
                        >
                            <template v-slot:label>
                                Status<span class="text-red">*</span>
                            </template></v-select
                        >
                    </v-col>
                    <v-col cols="12" md="12" class="-mt24">
                        <v-textarea
                            name="note"
                            v-model="form.note"
                            :counter="100"
                            maxlength="100"
                            outlined
                            label="Note"
                            rows="3"
                        />
                    </v-col>
                </v-row>
            </v-form>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            @click="$router.go(-1)"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="
                                validate();
                                confirmButton();
                            "
                            v-privilege="'sut_upd'"
                            >Save</v-btn
                        >
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
        <LoadingBar :value="isLoading" />
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            ConfirmData: "",
            form: {
                name: "",
                note: "",
                abbreviation: "",
            },
            statuses: 1,
            valid: false,
            error: {
                commodity: "",
                badge: "",
            },
            status: [
                {
                    text: "Active",
                    value: 1,
                },
                {
                    text: "Archived",
                    value: 2,
                },
            ],
            rules: {
                name: [(v) => !!v || "Please enter name."],
                select: [(v) => !!v || "Please select type."],
                abbreviation: [
                    (v) => !!v || "Please select abbreviation.",
                    (v) => (v && v.length <= 3) || "Max 3 characters",
                ],
            },
            isLoading: true,
        };
    },
    mounted() {
        this.renderData();
        let self = this;
        this.$root.$on("event_error", function (err) {
            self.error = err;
        });
    },
    methods: {
        // validasi apakah semua field yg required sudah diisi
        validate() {
            this.$refs.form.validate();
        },
        // put supplier type
        confirmButton() {
            if (this.form.name && this.statuses && this.form.abbreviation) {
                this.ConfirmData = {
                    model: true,
                    title: "Update Supplier Type",
                    text: "Are you sure want to update this Supplier Type?",
                    urlApi: "/purchase/supplier_type/" + this.$route.params.id,
                    nextPage: "/purchase/supplier_type/",
                    data: {
                        name: this.form.name,
                        note: this.form.note,
                        status: this.statuses,
                        abbreviation: this.form.abbreviation,
                    },
                };
            }
        },
        // get detail supplier type
        renderData() {
            this.$http
                .get("/purchase/supplier_type/" + this.$route.params.id)
                .then((response) => {
                    if (response.data.data) {
                        (this.form = {
                            name: response.data.data.name,
                            note: response.data.data.note,
                            abbreviation: response.data.data.abbreviation,
                        }),
                            (this.statuses = response.data.data.status);
                    }
                })
                .finally(() => (this.isLoading = false));
        },
    },
};
</script>