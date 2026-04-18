<script lang="ts">
    import { defineComponent, type PropType } from 'vue';

    export interface FastCommentsReviewsSummaryConfig {
        tenantId: string;
        urlId?: string;
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

    type WidgetWindow = { FastCommentsReviewsSummaryWidget?: (el: HTMLElement, cfg: FastCommentsReviewsSummaryConfig) => void };

    export default defineComponent({
        name: 'FastCommentsReviewsSummary',
        props: {
            config: {
                type: Object as PropType<FastCommentsReviewsSummaryConfig>,
                required: true,
            },
        },
        data() {
            return {
                widgetId: `fastcomments-rs-${Math.random()}-${Date.now()}`,
                lastConfigKey: '',
            };
        },
        async mounted() {
            const w = window as unknown as WidgetWindow;
            if (window && !w.FastCommentsReviewsSummaryWidget) {
                const src = this.config.region === 'eu'
                    ? 'https://cdn-eu.fastcomments.com/js/embed-reviews-summary.min.js'
                    : 'https://cdn.fastcomments.com/js/embed-reviews-summary.min.js';
                await insertScript(src, 'fastcomments-rs-script', window.document.body);
            }
            this.lastConfigKey = JSON.stringify(this.config);
            const el = document.getElementById(this.widgetId);
            if (el && w.FastCommentsReviewsSummaryWidget) {
                w.FastCommentsReviewsSummaryWidget(el, this.config);
            }
        },
        watch: {
            config(newConfig: FastCommentsReviewsSummaryConfig) {
                const key = JSON.stringify(newConfig);
                if (key === this.lastConfigKey) return;
                this.lastConfigKey = key;
                const w = window as unknown as WidgetWindow;
                const el = document.getElementById(this.widgetId);
                if (el && w.FastCommentsReviewsSummaryWidget) {
                    el.innerHTML = '';
                    w.FastCommentsReviewsSummaryWidget(el, newConfig);
                }
            },
        },
    });
</script>

<template>
    <div class="fastcomments-reviews-summary">
        <div :id="widgetId"></div>
    </div>
</template>
