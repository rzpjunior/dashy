<template>
    <div>
        <v-col style="margin-top:-20px">Main Image<span style="color:red">*</span></v-col>
        <v-row>
            <div class="ma-3" v-for="(item, idx) in arrImg" :key="idx">
                <v-file-input :id="`fileUpload${idx}`" type="file" accept="image/jpeg" v-model="item.image"
                              style="display:none;" @change="verifyFileUpload(idx)"/>
                <v-tooltip top v-if="idx==0">
                    <template v-slot:activator="{ on: tooltip }">
                        <div v-on="{ ...tooltip}">
                            <!-- Upload File png-->
                            <div
                                    class="rounded-form image-box-error"
                                    v-if="item.image == null && item.imageError !== ''"
                                    @click="chooseFiles(idx)"
                                    style="color:#768F9C;"
                            >
                                <v-flex class="hello-text mt-5" style="text-transform: capitalize;">
                                    <span><b>Min resolution: 360 x 180 pixels</b></span>
                                    <v-icon style="font-size:80px;">mdi-camera</v-icon>
                                    <span><b>Upload Image</b></span>
                                    <span style="font-size:80%;">Max : 2 Mb</span>
                                </v-flex>
                            </div>
                            <div
                                    class="rounded-form image-box"
                                    v-if="item.image == null && item.imageError == ''"
                                    @click="chooseFiles(idx)"
                                    style="color:#768F9C;"
                            >
                                <v-flex class="hello-text mt-5" style="text-transform: capitalize;">
                                    <span><b>Min resolution: 360 x 180 pixels</b></span>
                                    <v-icon style="font-size:80px;">mdi-camera</v-icon>
                                    <span><b>Upload Image</b></span>
                                    <span style="font-size:80%;">Max : 2 Mb</span>
                                </v-flex>
                            </div>
                            <div v-if="item.image !== null" class="rounded-form image-box" style="position:relative;">
                                <v-btn
                                        style="position:absolute;"
                                        class="btn-remove"
                                        fab
                                        v-if="idx== arrImg.length-1 || idx > 0"
                                        x-small
                                        plain
                                        @click="onRemove(idx)"
                                >
                                    <v-icon dark>
                                        mdi-close
                                    </v-icon>
                                </v-btn>
                                <v-img
                                        :src="item.imgUrl"
                                        class="rounded-form"
                                        height="178"
                                        width="250"
                                />
                            </div>
                            <div class="mt-1 ml-3 fs12" style="color:red;width:250px">{{item.imageError}}</div>
                        </div>
                    </template>
                    <span>Default image shown in catalog</span>
                </v-tooltip>
                <div v-else>
                    <div
                            class="rounded-form image-box-error"
                            v-if="item.image == null && item.imageError !== ''"
                            @click="chooseFiles(idx)"
                            style="color:#768F9C;"
                    >
                        <v-flex class="hello-text mt-5" style="text-transform: capitalize;">
                            <span><b>Min resolution: 360 x 180 pixels</b></span>
                            <v-icon style="font-size:80px;">mdi-camera</v-icon>
                            <span><b>Upload Image</b></span>
                            <span style="font-size:80%;">Max : 2 Mb</span>
                        </v-flex>
                    </div>
                    <div
                            class="rounded-form image-box"
                            v-if="item.image == null && item.imageError == ''"
                            @click="chooseFiles(idx)"
                            style="color:#768F9C;"
                    >
                        <v-flex class="hello-text mt-5" style="text-transform: capitalize;">
                            <span><b>Min resolution: 360 x 180 pixels</b></span>
                            <v-icon style="font-size:80px;">mdi-camera</v-icon>
                            <span><b>Upload Image</b></span>
                            <span style="font-size:80%;">Max : 2 Mb</span>
                        </v-flex>
                    </div>
                    <div v-if="item.image !== null" class="rounded-form image-box" style="position:relative;">
                        <v-btn
                                style="position:absolute;"
                                class="btn-remove"
                                fab
                                v-if="idx== arrImg.length-1 || idx > 0"
                                x-small
                                plain
                                @click="onRemove(idx)"
                        >
                            <v-icon dark>
                                mdi-close
                            </v-icon>
                        </v-btn>
                        <v-img
                                :src="item.imgUrl"
                                class="rounded-form"
                                height="178"
                                width="250"
                        />
                    </div>
                    <div class="mt-1 ml-3 fs12" style="color:red;width:250px">{{item.imageError}}</div>
                </div>
            </div>
            <div class="ma-3" v-if="maxImg">
                <img v-if="imgAddEnable" class="img-add" @click="addImg()" src="/img/AddImageEnable.png" alt="">
                <img v-else class="img-add" src="/img/AddImage.png" alt="">
            </div>
        </v-row>
    </div>
</template>
<script>
    export default {
        name: 'MultipleImagesDigitalOcean',
        data() {
            return {
                arrImg: [
                    {
                        image: null,
                        imgUrl: null,
                        nameFile: "",
                        imageError: ""
                    }
                ],
                imgRemove: [],
                currentTime: this.$moment(new Date()).format('YYYY-MM-DD_HH-mm-ss')
            }
        },
        props: {
            name: "",
            error: "",
            data: ""
        },
        watch: {
            error: {
                handler: function (val) {
                    this.arrImg[0].imageError = val
                },
                deep: true
            },
            data: {
                handler: function (val) {
                    this.arrImg = val
                },
                deep: true
            },
        },
        mounted() {
            let self = this
            this.$root.$on('event_img', function (err) {
                if (err == true) {
                    self.realRemove()
                }
            });
            setInterval(() => {
                this.currentTime = this.$moment(new Date()).format('YYYY-MM-DD_HH-mm-ss')
            }, 1000);
        },
        computed: {
            imgAddEnable() {
                if (this.arrImg[this.arrImg.length - 1].image !== null) {
                    return true
                } else {
                    return false
                }
            },
            maxImg() {
                if (this.arrImg.length < 3) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            pushModel() {
                let array = []
                for (let i = 0; i < this.arrImg.length; i++) {
                    if (this.arrImg[i].imgUrl != null) {
                        array.push(this.arrImg[i].imgUrl)
                    }
                }
                this.$root.$emit('event_multipleImage', array)
            },
            addImg() {
                if (this.arrImg[this.arrImg.length - 1].image !== null) {
                    this.arrImg.push(
                        {
                            image: null,
                            imageError: "",
                            imgUrl: null,
                            nameFile: ""
                        }
                    )
                }
            },
            chooseFiles(id) {
                if (this.name) {
                    document.getElementById("fileUpload" + id).click()
                } else {
                    this.arrImg[id].imageError = ""
                    this.arrImg[id].imageError = "Please input name before upload image"
                }
            },
            verifyFileUpload(id) {
                let that = this
                var file = document.getElementById("fileUpload" + id);
                if (file && file.files.length > 0) {
                    var img = new Image();
                    var resp = file.files[0]
                    img.src = window.URL.createObjectURL(file.files[0]);
                    img.onload = function () {
                        var width = this.naturalWidth,
                            height = this.naturalHeight;
                        if (width < 360 || height < 180) {
                            that.arrImg[id].imageError = "Min resolution: 360 x 180 pixels";
                            that.arrImg[id].image = null;
                        } else {
                            that.arrImg[id].imageError = "";
                            const isLt2M = resp.size / 1024 / 1024 < 2;
                            if (!isLt2M) {
                                that.arrImg[id].image = null;
                                that.arrImg[id].imageError = "Max file size: 2 Mb";
                            } else {
                                that.arrImg[id].imageError = "";
                                that.arrImg[id].nameFile = (that.name + "-" + that.currentTime).replace(/\//g, "");
                                let datas = new FormData();
                                var blob = resp.slice(0, resp.size, resp.type);
                                let newFile = new File([blob], that.arrImg[id].nameFile + '.jpeg', {type: resp.type});
                                datas.append('file', newFile);
                                datas.append('type', "product");
                                that.$http.post('/upload/img', datas, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then(response => {
                                    that.arrImg[id].imgUrl = response.data.data;
                                    that.pushModel()
                                });
                            }
                        }
                    };
                }
            },
            realRemove() {
                let that = this
                if (this.imgRemove.length > 0) {
                    for (let id = 0; id < this.imgRemove.length; id++) {
                        bucket.deleteObject({
                            Key: 'ktp/' + that.imgRemove[id].nameFile + '.png'
                        }, function (err, data) {
                            if (err) {
                                results.innerHTML = 'ERROR: ' + err;
                            } else {
                                that.imgRemove.splice(id, 1)
                            }
                        })
                    }
                }
            },
            onRemove(id) {
                if (this.arrImg.length > 1) {
                    this.imgRemove.push(this.arrImg[id])
                    this.arrImg.splice(id, 1)
                } else {
                    this.arrImg = [
                        {
                            image: null,
                            imageError: "",
                            imgUrl: null,
                            nameFile: ""
                        }
                    ]
                }
                this.pushModel()
            },
        }
    }
</script>

<style scoped>
    .hello-text {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .image-box {
        width: 250px;
        height: 180px;
        border-style: solid;
        border-color: gray;
        border-width: 1px;
    }

    .image-box-error {
        width: 250px;
        height: 180px;
        border-style: solid;
        border-color: red;
        border-width: 2px;
    }

    .btn-remove {
        z-index: 1;
        background: #FC7079;
        color: white;
        right: 10px;
        top: 10px
    }

    .img-add {
        margin-top: 60px;
    }
</style>