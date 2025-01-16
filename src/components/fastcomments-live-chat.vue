<script lang="ts">
    import {FastCommentsLiveChatWidgetConfig} from 'fastcomments-typescript';

    async function insertScript(src: string, id: string, parentElement: Element) {
        return new Promise((resolve, reject) => {
            const script = window.document.createElement('script');
            script.async = true;
            script.src = src;
            script.id = id;
            parentElement.appendChild(script);

            script.addEventListener('load', resolve);
            script.addEventListener('error', reject);
        });
    }

    // noinspection TypeScriptExplicitMemberType
    let lastWidgetInstance: { update: (arg0: any) => void; } | null = null;
    function reset(config : FastCommentsLiveChatWidgetConfig) {
        if (lastWidgetInstance) {
            lastWidgetInstance.update(config);
        }
    }

    // let fcInstance = null;
    export default {
        name: 'FastCommentsLiveChat', // vue component name
        props: {
            config: {
                type: Object as () => FastCommentsLiveChatWidgetConfig
            }
        },
        data() {
            return {
                widgetId: `fastcomments-live-chat-widget-${Math.random()}-${Date.now()}`
            }
        },
        async mounted() {
            // @ts-ignore
            if (window && !window.FastCommentsLiveChat) {
                // @ts-ignore
                const src = this.config.region === 'eu' ? 'https://cdn-eu.fastcomments.com/js/embed-live-chat.min.js' : 'https://cdn.fastcomments.com/js/embed-live-chat.min.js';
                await insertScript(src, 'fastcomments-live-chat-widget-script', window.document.body);
            }
            // @ts-ignore
            lastWidgetInstance = window.FastCommentsLiveChat(document.getElementById(this.widgetId), this.config);
        },
        watch: {
            config(newConfig : FastCommentsLiveChatWidgetConfig) {
                reset(newConfig);
            },
        },
    }
</script>

<template>
    <div class="fastcomments-live-chat">
        <div v-bind:id="widgetId"></div>
    </div>
</template>
