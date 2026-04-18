<script lang="ts">
    import { defineComponent, type PropType } from 'vue';

    export interface FastCommentsTopPagesConfig {
        tenantId: string;
        hasDarkBackground?: boolean;
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

    type WidgetWindow = { FastCommentsTopPagesV2?: (el: HTMLElement, cfg: FastCommentsTopPagesConfig) => void };

    export default defineComponent({
        name: 'FastCommentsTopPages',
        props: {
            config: {
                type: Object as PropType<FastCommentsTopPagesConfig>,
                required: true,
            },
        },
        data() {
            return {
                widgetId: `fastcomments-top-pages-${Math.random()}-${Date.now()}`,
            };
        },
        async mounted() {
            const w = window as unknown as WidgetWindow;
            if (window && !w.FastCommentsTopPagesV2) {
                const src = this.config.region === 'eu'
                    ? 'https://cdn-eu.fastcomments.com/js/widget-top-pages-v2.min.js'
                    : 'https://cdn.fastcomments.com/js/widget-top-pages-v2.min.js';
                await insertScript(src, 'fastcomments-top-pages-v2-script', window.document.body);
            }
            const el = document.getElementById(this.widgetId);
            if (el && w.FastCommentsTopPagesV2) {
                w.FastCommentsTopPagesV2(el, this.config);
            }
        },
        watch: {
            config(newConfig: FastCommentsTopPagesConfig) {
                const w = window as unknown as WidgetWindow;
                const el = document.getElementById(this.widgetId);
                if (el && w.FastCommentsTopPagesV2) {
                    w.FastCommentsTopPagesV2(el, newConfig);
                }
            },
        },
    });
</script>

<template>
    <div class="fastcomments-top-pages">
        <div v-bind:id="widgetId"></div>
    </div>
</template>
