<script lang="ts">
    import { defineComponent, type PropType } from 'vue';

    export interface FastCommentsRecentCommentsConfig {
        tenantId: string;
        urlId?: string;
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

    type WidgetWindow = { FastCommentsRecentCommentsV2?: (el: HTMLElement, cfg: FastCommentsRecentCommentsConfig) => void };

    export default defineComponent({
        name: 'FastCommentsRecentComments',
        props: {
            config: {
                type: Object as PropType<FastCommentsRecentCommentsConfig>,
                required: true,
            },
        },
        data() {
            return {
                widgetId: `fastcomments-recent-comments-${Math.random()}-${Date.now()}`,
            };
        },
        async mounted() {
            const w = window as unknown as WidgetWindow;
            if (window && !w.FastCommentsRecentCommentsV2) {
                const src = this.config.region === 'eu'
                    ? 'https://cdn-eu.fastcomments.com/js/widget-recent-comments-v2.min.js'
                    : 'https://cdn.fastcomments.com/js/widget-recent-comments-v2.min.js';
                await insertScript(src, 'fastcomments-recent-comments-v2-script', window.document.body);
            }
            const el = document.getElementById(this.widgetId);
            if (el && w.FastCommentsRecentCommentsV2) {
                w.FastCommentsRecentCommentsV2(el, this.config);
            }
        },
        watch: {
            config(newConfig: FastCommentsRecentCommentsConfig) {
                const w = window as unknown as WidgetWindow;
                const el = document.getElementById(this.widgetId);
                if (el && w.FastCommentsRecentCommentsV2) {
                    w.FastCommentsRecentCommentsV2(el, newConfig);
                }
            },
        },
    });
</script>

<template>
    <div class="fastcomments-recent-comments">
        <div v-bind:id="widgetId"></div>
    </div>
</template>
