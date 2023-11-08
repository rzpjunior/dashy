<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                name="name"
                                v-model="form.name"
                                required
                                outlined
                                :dense="true"
                                :error-messages="error.name"
                                v-on="{ ...tooltip}"
                            >
                                <template v-slot:label>
                                    Name<span class="text-red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                        <span>Name will be shown as category name in mobile application</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip}">
                                <MultiSelectArea 
                                    v-model="areas" 
                                    @selected="areaSelected"
                                    :error="error.area"
                                    :dense="true"
                                ></MultiSelectArea>
                            </div>
                        </template>
                        <span>Tag will be shown in selected area</span>
                    </v-tooltip>
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
                <v-col cols="12" class="-mt30">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip}">
                                <UploadImage 
                                    :minWidth="250"
                                    :minHeight="250"
                                    :maxSize="300"
                                    :forImgName="form.name"
                                    :errorMsg="error.image"
                                    :type="'product-tag'"
                                    :extention="'jpeg'"
                                    :accept="'image/jpeg,image/jpg'"
                                >
                                </UploadImage>
                                <!--<SelectSingleImage :forImgName="form.name" :errorMsg="error.image"></SelectSingleImage>-->
                            </div>
                        </template>
                        <span>Image will be shown as category icon in our mobile application</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    @click="$router.go(-1)"
                    depressed
                    outlined
                    color="#EBEBEB"
                    class="main-btn"
                >
                    <span class="text-black80">Cancel</span>
                </v-btn>
                <v-btn
                    depressed
                    color="#50ABA3"
                    class="main-btn white--text"
                    @click="confirmButton()"
                >
                    Create
                </v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "ProductTagCreate",
        data() {
            return {
                ConfirmData: [],
                imageError: '',
                dialog: false,
                // disable: true,
                areas: [],
                form: {
                    name: '',
                    area: [],
                    note: '',
                    image: '',
                },
                error: {},
            }
        },
        methods: {
            areaSelected(d) {
                this.areas = null;
                let arr = []
                if (d !== '') {
                    this.areas = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].value);
                    }
                }
                this.form.area = arr
            },
            confirmButton() {
                this.ConfirmData = {
                    model: true,
                    title: "Create Product Tag",
                    text: "Are you sure want to create this product Tag?",
                    urlApi: "/inventory/tag_product",
                    nextPage: "/inventory/product-tag",
                    post: true,
                    data: this.form
                }
            }
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
                self.imageError = err.image;
            });
            this.$root.$on('event_uploadImage', function (image) {
                self.form.image = image
            });
        },
        watch: {
            'form.name': {
                handler: function (val) {
                    let that = this
                    that.imageError = "";
                },
                deep: true
            },
            // 'form.image': {
            //     handler: function (val) {
            //         let that = this
            //         if(val == '' || val == null){
            //             that.disable = true;
            //         }else{
            //             that.disable = false;
            //         }
            //     },
            //     deep: true
            // },
        },
    }
</script>
