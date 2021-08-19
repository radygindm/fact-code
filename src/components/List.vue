<template>
    <ul v-if="items && items.length > 0" class="list">
        <li v-for="(item, index) in items" :key="index">{{ item }}</li>
    </ul>
</template>

<script>
    export default {
        name: "List",
        props: {
            items: Array,
        }
    }
</script>

<style scoped>

</style>