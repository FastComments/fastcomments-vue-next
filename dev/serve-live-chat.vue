<template>
    <div id="app"></div>
    <fast-comments-live-chat v-bind:config="{tenantId: 'demo'}"/>
</template>

<script lang="ts">
    import FastCommentsLiveChat from '@/fastcomments-live-chat.vue';

    export default {
        name: 'ServeDev',
        components: {
            FastCommentsLiveChat
        }
    };
</script>
