<template>
    <multiselect
            @remove="removeEl"
            @select="change"
            :value="values"
            :options="data"
            :multiple="true"
            placeholder="Выбрать значения"
   >
        <template slot="selection" slot-scope="{ values, isOpen }">
            <span class="multiselect__single" v-if="values.length && !isOpen">{{ values.length }} options selected</span>
        </template>
    </multiselect>
</template>

<script>
    import Multiselect from 'vue-multiselect';
    import '../../node_modules/vue-multiselect/dist/vue-multiselect.min.css';

    export default {
        name: "Select",
        components: {
            Multiselect,
        },
        props: {
            data: {
                type: Array,
                default: [],
            },
            items: {
                type: Array,
                default: [],
            },
            type: String,
        },
        watch: {
            items(newVal) {
                if (!newVal.length) {
                    this.values = [];
                }
                let curEl = [];
                for (let i = 0; i < newVal.length; i++) {
                    if(typeof newVal[i] === this.type) {
                        curEl.push(newVal[i])
                    }
                }
                if (curEl.length < this.values.length) {
                    this.values.splice(-1, 1);
                }
                if (curEl.length > this.values.length) {
                    this.values.push(newVal[newVal.length - 1])
                }
            },
        },
        methods: {
            change (selectedOption) {
                this.values.push(selectedOption);
                this.$emit('select', this.values[this.values.length - 1]);
            },
            reset() {
                this.values = [];
            },
            removeEl(removedOption) {
                let idEl = this.values.findIndex(item => JSON.stringify(item) === JSON.stringify(removedOption));
                this.values.splice(idEl, 1);
                this.$emit('remove', removedOption);
            },
        },
        data () {
            return {
                values: []
            }
        }
    }
</script>

<style scoped>

</style>