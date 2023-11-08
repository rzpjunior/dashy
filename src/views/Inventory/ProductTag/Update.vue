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
                                dense
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
                                    v-model="areas" :area="areaUpdate" 
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
                                    :type="'product_tag'"
                                    :extention="'jpeg'"
                                    :accept="'image/jpeg,image/jpg'"
                                    :imageFromUpdate="form.image"
                                ></UploadImage>
                                <!--<SelectSingleImage :forImgName="form.name" :imageFromUpdate="form.image" :errorMsg="error.image"></SelectSingleImage>-->
                            </div>
                        </template>
                        <span>Image will be shown as category icon in our mobile application</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
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
                            Update
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "ProductTagUpdate",
        data() {
            return {
                ConfirmData: [],
                dialog: false,
                // disable: true,
                areas: [],
                areaUpdate: null,
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
            renderData() {
                let arr = []
                let existArea = []
                let areasValue = []
                this.$http.get("/inventory/tag_product/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                    this.form.name = response.data.data.name
                    this.form.note = response.data.data.note
                    this.image = response.data.data.image_url
                    this.form.image = response.data.data.image_url
                    this.areas = response.data.data.area
                    this.update = true

                    if (this.items.area.includes(", ")) {
                        arr = this.items.area.split(', ')
                    } else {
                        arr.push(this.items.area)
                    }
                    for (let i = 0; i < arr.length; i++) {
                        this.$http.get("/config/area/filter?conditions=name:" + arr[i]).then(res => {
                            areasValue.push(res.data.data[0])
                            existArea.push(res.data.data[0].value)
                        })
                    }
                    this.form.area = existArea
                    this.areaUpdate = areasValue
                });
            },
            confirmButton() {
                this.ConfirmData = {
                    model: true,
                    title: "Update Product Tag",
                    text: "Are you sure want to Update this product Tag?",
                    urlApi: "/inventory/tag_product/" + this.$route.params.id,
                    nextPage: "/inventory/product-tag",
                    data: this.form
                }
            },
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
        },
        created() {
            this.renderData()
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
            this.$root.$on('event_uploadImage', function (image) {
                self.form.image = image
            });
        },
        computed: {
            url() {
                if (!this.image) return;
                return URL.createObjectURL(this.image);
            }
        },
    }
</script>
