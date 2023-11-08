<template>
    <div v-if="warehouse">
        <l-map
            :options="options"
            :center="[
                center.lat || userLocation.lat || defaultLocation.lat,
                center.lng || userLocation.lng || defaultLocation.lng,
            ]"
            style="height: 500px; width: 100%;"
        >
            <l-tile-layer
                :options="options"
                url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            />
            <l-tile-layer
                :opacity="0.7"
                :options="options"
                :url="bound_url"
            />
            <l-marker
                :draggable="true"
                :visible="true"
                :lat-lng.sync="position"
                :size="10"
            >
                <l-tooltip
                    :options="{ permanent: true, interactive: true }"
                >
                    {{tooltip ? tooltip : ''}}
                </l-tooltip>
            </l-marker>
        </l-map>
    </div>
    <div v-else-if="update">
        <l-map
            :options="options"
            :center="[
                center.lat || userLocation.lat || defaultLocation.lat,
                center.lng || userLocation.lng || defaultLocation.lng,
            ]"
            style="height: 500px; width: 100%;"
        >
            <l-tile-layer
                :options="options"
                url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            />
            <l-tile-layer
                :opacity="0.7"
                :options="options"
                :url="bound_url"
            />
            <l-marker
                :draggable="true"
                :visible="true"
                :lat-lng.sync="position"
                :size="10"
                :icon="icon"
            />
            <l-marker
                :draggable="true"
                :visible="true"
                :lat-lng.sync="pickerPosition"
                :size="10"
            />
            <l-polygon
                :lat-lngs="polygon.latlngs"
                :color="polygon.color"
            />
        </l-map>
    </div>
    <div v-else-if="createWarehouse">
        <l-map
            :options="optionsWarehouse"
            :center="[
                center.lat || userLocation.lat || defaultLocation.lat,
                center.lng || userLocation.lng || defaultLocation.lng,
            ]"
            style="height: 500px; width: 100%;"
        >
            <l-tile-layer
                :options="optionsWarehouse"
                url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            />
            <l-marker
                :draggable="true"
                :visible="true"
                :lat-lng.sync="warehousePosition"
                :size="10"
                :icon="icon"
            />
            <l-marker
                :draggable="true"
                :visible="true"
                :lat-lng.sync="pickerPosition"
                :size="10"
            />
            <l-polygon
                :lat-lngs="polygon.latlngs"
                :color="polygon.color"
            />
        </l-map>
    </div>
</template>

<script>
import { icon } from "leaflet";

export default {
    name: "Maps",
    props: ['warehouse', 'update', 'createWarehouse', 'updateWarehouse'],
    data() {
        return {
            position: {
                lat: 0,
                lng: 0,
            },
            pickerPosition: {
                lat: 0,
                lng: 0,
            },
            warehousePosition: {
                lat: 0,
                lng: 0,
            },
            center: {
                lat: 0,
                lng: 0,
            },
            options: {
                zoom: 20,
                maxZoom: 30,
                minZoom: 15 ,
                maxNativeZoom: 30
            },
            optionsWarehouse: {
                zoom: 15,
                maxZoom: 20,
                minZoom: 1,
                maxNativeZoom: 20
            },
            userLocation: {
                lat: 0,
                lng: 0,
            },
            defaultLocation: {
                lat: -1.2123177,
                lng: 118.4831365,
            },
            bound_url: '',
            icon: icon({
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
            }),
            polygon: {
                latlngs: [],
                color: 'green',
            },
            tooltip: ''
        }
    },
    mounted() {
        this.getUserPosition()
        this.$root.$on('dataBIN', data => { // mounted data dari komponen untuk disimpan pada form
            this.tooltip = data.name
        })
    },
    methods: {
        async getUserPosition() { // get user default location
            if (navigator.geolocation) {
                // get GPS position
                navigator.geolocation.getCurrentPosition(pos => {
                    // set the user location
                    this.userLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };
                });
            }
        },
    },
    watch: {
        position: { // watch perubahan untuk pin poin
            handler: function (val) {
                this.$root.$emit('position', this.position)
            }
        },
        pickerPosition: { // watch perubahan untuk pin poin
            handler: function (val) {
                this.$root.$emit('pickerPosition', this.pickerPosition)
            }
        },
        warehousePosition: { // watch perubahan untuk pin poin
            handler: function (val) {
                this.$root.$emit('warehousePosition', this.warehousePosition)
            }
        },
        warehouse: { // perubahan ketika warehouse selected
            handler: function (val) {
                if (val) {
                    this.center = {
                        lat: val.bin_info.latitude,
                        lng: val.bin_info.longitude,
                    }
                    this.position = {
                        lat: val.bin_info.latitude,
                        lng: val.bin_info.longitude,
                    }
                    this.bound_url = val.bin_info.image_url
                } else {
                    this.center = {
                        lat: this.userLocation.lat,
                        lng: this.userLocation.lng,
                    },
                    this.position = {
                        lat: 0,
                        lng: 0,
                    },
                    this.bound_url = ''
                }
            }
        },
        update: { // perubahan untuk data ketika update
            handler: function (val) {
                if (val && val.latitude != 0 && val.longitude != 0) {
                    let self = this
                    this.$root.$on('updateWarehouse', function (data) { // get data from Update Warehouse
                        self.polygon.latlngs = data.polygon
                    })
                    this.center = {
                        lat: val.latitude,
                        lng: val.longitude,
                    }
                    this.position = {
                        lat: val.latitude,
                        lng: val.longitude,
                    }
                    if (val.bin_info == null) {
                        this.pickerPosition = {
                            lat: val.latitude,
                            lng: val.longitude,
                        }
                    } else {
                        this.pickerPosition = {
                            lat: val.bin_info.latitude,
                            lng: val.bin_info.longitude,
                        }
                    }
                    this.url = this.bound_url
                } else if (val && val.latitude == 0 && val.longitude == 0 && val.bin_info === null) { // handle if latlong 0 in update
                    let self = this
                    this.$root.$on('updateWarehouse', function (data) { // get data from Update Warehouse
                        self.center = {
                            lat: data.centroid.latitude,
                            lng: data.centroid.longitude,
                        }
                        self.position = {
                            lat: data.centroid.latitude,
                            lng: data.centroid.longitude,
                        }
                        self.pickerPosition = {
                            lat: data.centroid.latitude,
                            lng: data.centroid.longitude,
                        }
                        self.polygon.latlngs = data.polygon
                    })
                } else {
                    this.center = {
                        lat: this.userLocation.lat,
                        lng: this.userLocation.lng,
                    },
                    this.position = {
                        lat: 0,
                        lng: 0,
                    }
                }
            }
        },
        createWarehouse: { // perubahan pada create warehouse (Select from sub district)
            handler: function (val) {
                if (val) {
                    this.center = {
                        lat: val.centroid.latitude,
                        lng: val.centroid.longitude,
                    }
                    this.warehousePosition = {
                        lat: val.centroid.latitude,
                        lng: val.centroid.longitude,
                    }
                    this.pickerPosition = {
                        lat: val.centroid.latitude,
                        lng: val.centroid.longitude,
                    }
                    this.polygon.latlngs = val.polygon
                } else {
                    this.center = {
                        lat: this.userLocation.lat,
                        lng: this.userLocation.lng,
                    }
                    this.warehousePosition = {
                        lat: 0,
                        lng: 0,
                    }
                    this.pickerPosition = {
                        lat: 0,
                        lng: 0,
                    }
                }
            },
            deep: true,
        },
    }
}
</script>