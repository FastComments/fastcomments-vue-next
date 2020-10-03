<template>
    <div id="app"></div>
    <fast-comments-vue-next v-bind:config="{tenantId: 'demo'}"/>
</template>

<script lang="ts">
    import FastCommentsVueNext from '@/fastcomments-vue-next.vue';

    export default {
        name: 'ServeDev',
        components: {
            FastCommentsVueNext
        }
    };
</script>
