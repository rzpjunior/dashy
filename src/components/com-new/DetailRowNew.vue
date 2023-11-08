<template>
<div class="second-color">
    <div v-if="align== true">
        <div class="row">
            <div class="col text-black60">{{name}} :</div>
        </div>
        <div class="row break-words" style="margin:-12px">
            <div class="col text-black">{{value}}</div>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="routePath">
        <div class="row">
            <div class="col"><span class="text-black60">{{name}}</span> :</div>
            <a :href="$router.resolve({path: routePath}).href" class="routerLink linkReload">{{value}}</a>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="crossURL">
        <div class="row">
            <div class="col"><span class="text-black60">{{name}}</span> :</div>
            <a :href="crossURL" class="routerLink linkReload pr24" target="_blank">{{value}}</a>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="crossURL2">
        <div class="row">
            <div class="col">
                <span class="text-black60">{{name}}</span> :
                <div class="linkReload">
                    <a :href="crossURL2" class="routerLink" target="_blank">{{value}}</a>
                </div>
            </div>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="left==true">
        <div class="row">
            <div class="col"><span class="text-black60">{{name}}</span> : <span class="ml-3 text-black">{{value}}</span></div>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="progress">
        <div class="row">
            <div class="col-5 text-black60">{{name}} :</div>
            <div class="col justify-end ">
                <v-progress-linear
                    color="#2EA919"
                    height="25"
                    :value="value"
                >
                    <template v-slot:default="{ value }">
                        <strong>{{ value.toFixed(2) }}%</strong>
                    </template>
                </v-progress-linear>
            </div>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else>
        <div class="row break-words">
            <div class="col-5 text-black60">{{name}} :</div>
            <div class="col d-flex justify-end text-black">{{value}}</div>
        </div>
        <v-divider class="my-3"/>
    </div>
</div>
</template>
<script>
export default {
    name : "DetailRowNew",
    props : {
        name : "",
        value : "",
        align : true,
        routePath : "",
        crossURL : "",
        crossURL2 : "",
        left : true,
        progress: false
    }
}
</script>
<style scoped>
    .linkReload{
        margin-top:15px;
        margin-right:15px;
        word-wrap: break-word;
    }
</style>