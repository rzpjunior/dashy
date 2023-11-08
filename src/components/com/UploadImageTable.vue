<template>
    <div>
        <v-file-input :id="`fileUpload${idx}`" type="file" v-model="image" :accept="accept" style="display:none;" @change="verifyFileUpload()"/>
        <div
            class="rounded-form fs12 text-black60"
            :class="[notUseLabel? '':'mt-2', bigSize ? 'image-box-error-big-size pt36' : 'image-box-error', ]"
            v-if="image == null && imageError !== ''"
            @click="chooseFiles()"
        >
            <div class="center fs12" v-if="bigSize">
                Min. resolution {{minWidth}} x {{minHeight}}
            </div>
            <v-flex class="hello-text mt-2">
                <v-icon v-if="bigSize" x-large>mdi-camera</v-icon>
                <v-icon v-else small class="mt2">mdi-camera</v-icon>
                <div v-if="bigSize">
                    <span>Upload Image</span>
                    <span v-if="maxSize">
                        <span v-if="maxSize <1000">Max : {{maxSize}} Kb</span>
                        <span v-else>Max : {{maxSize/1000}} Mb</span>
                    </span>
                    <span v-else>Max : 300 Kb</span>
                </div>
            </v-flex>
        </div>
        <div
            :class="bigSize ? 'image-box-big-size pt36' : 'image-box'"
            class="rounded-form fs12 text-black60"
            v-if="image == null && imageError == '' && !imageFromUpdate"
            @click="chooseFiles()"
        >
            <div class="center" v-if="bigSize">
                Min. resolution {{minWidth}} x {{minHeight}}
            </div>
            <v-flex class="hello-text mt-2">
                <v-icon v-if="bigSize" x-large>mdi-camera</v-icon>
                <v-icon v-else small class="mt2">mdi-camera</v-icon>
                <div v-if="bigSize">
                    <span>Upload Image</span>
                    <span v-if="maxSize">
                        <span v-if="maxSize <1000">Max : {{maxSize}} Kb</span>
                        <span v-else>Max : {{maxSize/1000}} Mb</span>
                    </span>
                    <span v-else>Max : 300 Kb</span>
                </div>
            </v-flex>
        </div>
        <div 
            v-if="image !== null" 
            class="rounded-form" 
            :class="bigSize ? 'image-box-big-size' : 'image-box'"
            style="position:relative;" 
        >
            <v-btn
                style="position:absolute;"
                :class="bigSize ? 'btn-remove-big-size' : 'btn-remove'"
                fab
                x-small
                plain
                @click="onRemove()"
            >
                <v-icon dark>
                    mdi-close
                </v-icon>
            </v-btn>
            <v-img
                v-if="imageFromUpdate"
                :src="imageFromUpdate"
                class="rounded-form"
                :class="bigSize ? 'image-big-size' : 'image'"
                @click="click"
            />
            <v-img
                v-else
                :src="url"
                class="rounded-form"
                :class="bigSize ? 'image-big-size' : 'image'"
                @click="click"
            />
        </div>
        <div 
            v-else-if="imageFromUpdate" 
            class="rounded-form"
            :class="bigSize ? 'image-box-big-size' : 'image-box'"
            style="position:relative;" 
        >
            <v-btn
                style="position:absolute;"
                :class="bigSize ? 'btn-remove-big-size' : 'btn-remove'"
                fab
                x-small
                plain
                @click="onRemove()"
            >
                <v-icon dark>
                    mdi-close
                </v-icon>
            </v-btn>
            <v-img
                :src="imageFromUpdate"
                class="rounded-form"
                :class="bigSize ? 'image-big-size' : 'image'"
                @click="click()"
            />
        </div>
        <div class="text-red fs12">{{imageError}}</div>
        <v-overlay style="z-index: 6 !important;" :value="overlay">
            <v-progress-circular
                indeterminate
                size="84"
                color="green"
                width=15
            ></v-progress-circular>
            <div class="-ml20 mt10">Uploading Image</div>
        </v-overlay>
    </div>
</template>

<script>
    export default {
        name: 'UploadImageTable',
        props: ['forImgName', 'errorMsg', 'imageFromUpdate', 'maxSize', 'extention', 'minWidth', 'minHeight', 'type', 'accept', 'notUseLabel', 'idx', 'isProceed', 'bigSize'],
        data() {
            return {
                image: null,
                imageError: '',
                disable: true,
                currentTime: this.$moment().valueOf(),
                nameFile: '',
                imgUrl: null,
                overlay: false,
            }
        },
        methods: {
            chooseFiles() {
                if (this.forImgName) {
                    this.imageError = ""
                    let id = "fileUpload" + this.idx
                    document.getElementById(id).click()
                } else {
                    this.imageError = "Please input name before upload image"
                }
            },
            verifyFileUpload() {
                let that = this;
                let id = "fileUpload" + that.idx
                let file = document.getElementById(id);
                if (!that.accept) {
                    that.accept = "image/png, image/jpeg, image/bmp";
                }
                if (!that.maxSize) {
                    that.maxSize = 0.3
                }
                if (!that.extention) {
                    that.extention = 'png'
                }
                if (file && file.files.length > 0) {
                    let img = new Image();
                    let resp = file.files[0]

                    img.src = window.URL.createObjectURL(file.files[0]);
                    img.onload = function () {
                        if (this.naturalWidth < that.minWidth && this.naturalHeight < that.minHeight) {
                            that.imageError = "Min resolution: " + that.minWidth + " x " + that.minHeight + " pixels";
                            that.image = null;
                        } else {
                            that.imageError = "";
                            const isLt2M = resp.size / 1000 < that.maxSize;
                            if (!isLt2M) {
                                that.image = null;
                                if (resp.size / 1000 < 1000) {
                                    that.imageError = "Max file size: " + that.maxSize + "kb";
                                } else {
                                    that.imageError = "Max file size: " + that.maxSize / 1000 + "Mb";
                                }
                            } else {
                                that.imageError = "";
                                that.nameFile = (that.forImgName + "-" + that.currentTime).replace(/ /g, "");

                                let datas = new FormData();
                                let blob = resp.slice(0, resp.size, resp.type);
                                let newFile = new File([blob], that.nameFile + '.' + that.extention, {type: resp.type});
                                datas.append('file', newFile); // file = data from File client or upload
                                datas.append('type', that.type); // name of directory (voucher,courier dll)
                                that.overlay = true;
                                that.$http.post('/upload/img', datas, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then(response => {
                                    that.overlay = false
                                    that.imgUrl = response.data.data;
                                    that.sendUrl(that.imgUrl)
                                }).catch(function (error) {
                                    that.overlay = false;
                                    that.image = null;
                                });
                            }
                        }
                    };
                }
            },
            sendUrl(url) {
                var json = {
                    url: url,
                    index: this.idx
                }
                this.$root.$emit('event_uploadImage', json)
            },
            onRemove() {
                let that = this
                that.image = null;
                that.imgUrl = null;
                that.sendUrl("")
            },
            click(event) {
                this.$emit("click", event);
            }
        },
        computed: {
            url() {
                if (!this.image) return;
                return URL.createObjectURL(this.image);
            }
        },
        mounted (){
            setInterval(() => {
                this.currentTime = this.$moment().valueOf()
            }, 1000);
        },
        watch: {
            'errorMsg': {
                handler: function (val) {
                    this.imageError = val;
                },
                deep: true
            },
            'imageFromUpdate': {
                handler: function (val) {
                    if (val) {
                        this.sendUrl(val)
                        this.image = val;
                    }
                },
                deep: true
            },
            'isProceed': {
                handler: function () {
                    this.onRemove()
                }
            },
        },
    }
</script>
<style scoped>
    .hello-text {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .image {
        width:40px;
        height:40px
    }
    .image-big-size {
        width:250px;
        height:180px;
    }
    .image-box {
        width:40px;
        height:40px;
        background: #EBEBEB;
        border-style:dashed;
        border-color:gray;
        border-width:1px;
    }
    .image-box-big-size {
        width:250px;
        height:180px;
        max-width:100%;
        background: #EBEBEB;
        border-style:dashed;
        border-color:gray;
        border-width:1px;
    }
    .image-box-error {
        width:40px;
        height:40px;
        border-style:dashed;
        background: #EBEBEB;
        border-color:red;
        border-width:2px;
        padding-top: 0px !important;
    }
    .image-box-error-big-size {
        width:250px;
        height:180px;
        max-width:100%;
        border-style:dashed;
        background: #EBEBEB;
        border-color:red;
        border-width:2px;
    }
    .btn-remove {
        z-index:1;
        background:#FC7079;
        color:white;
        right:5px;
        top:5px;
        width:30%;
        height:30%
    }
    .btn-remove-big-size {
        z-index:1;
        background:#FC7079;
        color:white;
        right:10px;
        top:10px;
        width:40px;
        height:40px
    }
</style>
