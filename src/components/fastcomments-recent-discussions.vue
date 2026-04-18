<script lang="ts">
    import { defineComponent, type PropType } from 'vue';

    export interface FastCommentsRecentDiscussionsConfig {
        tenantId: string;
        count?: number;
        hasDarkBackground?: boolean;
        translations?: Record<string, string>;
        region?: 'eu' | string;
        apiHost?: string;
    }

    async function insertScript(src: string, id: string, parentElement: Element) {
        return new Promise((resolve, reject) => {
            if (document.getElementById(id)) {
                resolve(null);
                return;
            }
            const script = window.document.createElement('script');
            script.async = true;
            script.src = src;
            script.id = id;
            parentElement.appendChild(script);

            script.addEventListener('load', resolve);
            script.addEventListener('error', reject);
        });
    }

    type WidgetWindow = { FastCommentsRecentDiscussionsV2?: (el: HTMLElement, cfg: FastCommentsRecentDiscussionsConfig) => void };

    export default defineComponent({
        name: 'FastCommentsRecentDiscussions',
        props: {
            config: {
                type: Object as PropType<FastCommentsRecentDiscussionsConfig>,
                required: true,
            },
        },
        data() {
            return {
                widgetId: `fastcomments-recent-discussions-${Math.random()}-${Date.now()}`,
            };
        },
        async mounted() {
            const w = window as unknown as WidgetWindow;
            if (window && !w.FastCommentsRecentDiscussionsV2) {
                const src = this.config.region === 'eu'
                    ? 'https://cdn-eu.fastcomments.com/js/widget-recent-discussions-v2.min.js'
                    : 'https://cdn.fastcomments.com/js/widget-recent-discussions-v2.min.js';
                await insertScript(src, 'fastcomments-recent-discussions-v2-script', window.document.body);
            }
            const el = document.getElementById(this.widgetId);
            if (el && w.FastCommentsRecentDiscussionsV2) {
                w.FastCommentsRecentDiscussionsV2(el, this.config);
            }
        },
        watch: {
            config(newConfig: FastCommentsRecentDiscussionsConfig) {
                const w = window as unknown as WidgetWindow;
                const el = document.getElementById(this.widgetId);
                if (el && w.FastCommentsRecentDiscussionsV2) {
                    w.FastCommentsRecentDiscussionsV2(el, newConfig);
                }
            },
        },
    });
</script>

<template>
    <div class="fastcomments-recent-discussions">
        <div v-bind:id="widgetId"></div>
    </div>
</template>
