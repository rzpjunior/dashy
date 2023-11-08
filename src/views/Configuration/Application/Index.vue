<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="3">
                    <SelectGlossary
                        :dense="true"
                        @selected="AppsSelected"
                        v-privilege="'filter_rdl'"
                        label="Application"
                        table="all"
                        attribute="application"
                        :norequired="true"
                    ></SelectGlossary>
                </v-col>
            </v-row>
        </div>
        <div class="box-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            <div v-if="props.item.application == 1">{{ 'Dino' }}</div>
                            <div v-else-if="props.item.application == 2">{{ 'Orca' }}</div>
                            <div v-else-if="props.item.application == 3">{{ 'Mantis' }}</div>
                            <div v-else-if="props.item.application == 4">{{ 'Beaver' }}</div>
                            <div v-else-if="props.item.application == 0">{{ 'All' }}</div>
                            <div v-else>{{ 'All' }}</div>
                        </td>
                        <td>{{ props.item.field }}</td>
                        <td>{{ props.item.attribute }}</td>
                        <td>{{ props.item.value }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item :to="`/configuration/application/update/${props.item.id}`" v-privilege="'app_upd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "ConfigurationApplication",
        data() {
            return {
                ConfirmData: {},
                loading: false,
                glossary: '',
                table: {
                    fields: [
                        {
                            text: 'Application',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Field',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Attribute',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Value',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                items: [],
            }
        },
        mounted() {
            this.renderData(this.glossary)
        },
        methods: {
            renderData(glossary) {
                this.loading = true;
                this.items = []
                if (glossary === '') {
                    glossary = ''
                } else {
                    glossary = "application:" + glossary
                }
                this.$http.get("/config/app", {
                    params: {
                        perpage: 100,
                        conditions: glossary,
                        orderby: '-id',
                    }
                }).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if (this.items === null) {
                        this.items = []
                    }
                });
            },
            AppsSelected(d) {
                this.glossary = '';
                if (d !== '' && d !== undefined) {
                    this.glossary = d.value;
                }
            },
        },
        watch: {
            'glossary': {
                handler: function(val) {
                    let that = this
                    that.renderData(val)
                },
                deep: true
            },
        },
    }
</script>