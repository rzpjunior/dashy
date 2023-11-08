<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" class="-mt24">
                    <v-select
                        v-model="parentgp"
                        :items="item_parentgp"
                        label="Type"
                        persistent-hint
                        outlined
                        :dense="true"
                    ></v-select> 
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCategoryParentGP
                        v-if="parentgp == '2'"
                        v-model="form.parent_id"
                        @selected="categoryParentSelected"
                        name="parent"
                        required
                        :error="error.category_id"
                        :dense="true"
                        :embed="2"
                    >
                        <template v-slot:label>Select Parent</template>
                    </SelectCategoryParentGP>
                    <SelectCategoryParentGP
                        v-if="parentgp == '1'"
                        v-model="form.grand_parent_id"
                        @selected="categoryGParentSelected"
                        name="gparent"
                        required
                        :error="error.category_id"
                        :dense="true"
                        :embed="1"
                    >
                        <template v-slot:label>Select Grand Parent</template>
                    </SelectCategoryParentGP>
                    <v-text-field
                        v-if="parentgp == '0'"
                        name="category"
                        disabled
                        outlined
                        :dense="true"
                    >
                        <template v-slot:label>
                            Category
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        v-if="parentgp == '2'"
                        name="name"
                        v-model="code"
                        :counter="2"
                        maxlength="2"
                        required
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        outlined
                        :dense="true"
                        :error-messages="error.code"
                        :disabled="disProductCode"
                        :prefix="prefixCategoryParent"
                        :suffix="'00'"
                    >
                        <template v-slot:label>
                            Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    <v-text-field
                        v-if="parentgp == '1'"
                        name="name"
                        v-model="code"
                        :counter="2"
                        maxlength="2"
                        required
                        outlined
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        :dense="true"
                        :error-messages="error.code"
                        :disabled="disProductCode"
                        :prefix="prefixCategoryGParent"
                        :suffix="'0000'"
                    >
                        <template v-slot:label>
                            Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    <v-text-field
                        v-if="parentgp == '0'"
                        name="name"
                        v-model="code"
                        :counter="2"
                        maxlength="2"
                        required
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        outlined
                        :dense="true"
                        :error-messages="error.code"
                        :suffix="'000000'"
                    >
                        <template v-slot:label>
                            Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        :counter="20"
                        maxlength="20"
                        required
                        outlined
                        :dense="true"
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="100"
                        label="Note"
                        outlined
                        rows="3"
                        maxlength="100"
                    ></v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row class="-ma16">
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
                            Save
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
        name: "CreateCategory",
        data () {
            return {
                disProductCode: true,
                ConfirmData:[],
                gp_id: '',
                p_id: '',
                code: '',
                form:{
                    name: '',
                    code: '',
                    grand_parent_id: '',
                    parent_id: '',
                    classification: null,
                    note: '',
                },
                item_parentgp: [
                    {
                        text: 'C0',
                        value: '0'
                    },
                    {
                        text: 'C1',
                        value: '1'
                    },
                    {
                        text: 'C2',
                        value: '2'
                    }
                ],
                error:{},
                parentgp: '2'
            }
        },
        methods:{
            categoryParentSelected(d) {
                this.disProductCode = true
                this.prefixCategoryParent = "";
                this.form.parent_id = "";
                this.form.grand_parent_id = "";
                if (d !== "" && d !== undefined) {
                    this.form.parent_id = d.id;
                    this.form.grand_parent_id = d.grand_parent_id
                    let code = d.code
                    this.prefixCategoryParent = code.slice(0, -4);
                    this.disProductCode = false;
                }
            },
            categoryGParentSelected(d) {
                this.disProductCode = true
                this.prefixCategoryGParent = "";
                this.form.grand_parent_id = "";
                if (d !== "" && d !== undefined) {
                    this.form.grand_parent_id = d.id
                    let code = d.code
                    this.prefixCategoryGParent = code.slice(0, -6);
                    this.disProductCode = false;
                }
            },
            confirmButton() {
                let parent = ''
                if(this.parentgp == '2'){
                    this.form.classification = 3
                    parent = this.prefixCategoryParent + this.code + '00'
                    this.form.code = parent
                }
                let grand_parent = ''
                if(this.parentgp == '1'){
                    this.form.classification = 2
                    grand_parent = this.prefixCategoryGParent + this.code + '0000'
                    this.form.code = grand_parent
                }
                if(this.parentgp == '0'){
                    this.prefixCategoryParent = ''
                    this.prefixCategoryGParent = ''
                    this.form.parent_id = ''
                    this.form.grand_parent_id = ''
                    this.form.classification = 1
                    this.form.code = this.code + '000000'
                }
                this.ConfirmData = {
                    model : true,
                    title : "Create Category",
                    text : "Are you sure want to create this Category?",
                    urlApi : "/inventory/category",
                    nextPage : "/inventory/category",
                    post : true,
                    data : this.form
                }
            },
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
    }
</script>
