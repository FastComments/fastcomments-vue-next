<script lang="ts">
    import {defineComponent, PropType} from 'vue';
    import {FastCommentsImageChatWidgetConfig} from 'fastcomments-typescript';

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
    function reset(config : FastCommentsImageChatWidgetConfig) {
        if (lastWidgetInstance) {
            lastWidgetInstance.update(config);
        }
    }

    export default defineComponent({
        name: 'FastCommentsImageChat', // vue component name
        props: {
            config: {
                type: Object as () => FastCommentsImageChatWidgetConfig
            },
            targetRef: {
                type: Object as PropType<HTMLElement | null>,
                default: null
            }
        },
        data() {
            return {
                widgetId: `fastcomments-image-chat-widget-${Math.random()}-${Date.now()}`
            }
        },
        async mounted() {
            // @ts-ignore
            if (window && !window.FastCommentsImageChat) {
                // @ts-ignore
                const src = this.config.region === 'eu' ? 'https://cdn-eu.fastcomments.com/js/embed-image-chat.min.js' : 'https://cdn.fastcomments.com/js/embed-image-chat.min.js';
                await insertScript(src, 'fastcomments-image-chat-widget-script', window.document.body);
            }
            const target = this.targetRef || document.getElementById(this.widgetId);
            if (!target) return;
            // @ts-ignore
            lastWidgetInstance = window.FastCommentsImageChat(target, this.config);
        },
        watch: {
            config(newConfig : FastCommentsImageChatWidgetConfig) {
                reset(newConfig);
            },
        },
    })
</script>

<template>
    <div class="fastcomments-image-chat">
        <div v-bind:id="widgetId"><slot /></div>
    </div>
</template>
