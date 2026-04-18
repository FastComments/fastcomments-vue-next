<script lang="ts">
    import { defineComponent, type PropType } from 'vue';

    export interface FastCommentsUserActivityFeedConfig {
        tenantId: string;
        userId: string;
        hasDarkBackground?: boolean;
        readonly?: boolean;
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

    type WidgetWindow = { FastCommentsUserActivity?: (el: HTMLElement, cfg: FastCommentsUserActivityFeedConfig) => void };

    export default defineComponent({
        name: 'FastCommentsUserActivityFeed',
        props: {
            config: {
                type: Object as PropType<FastCommentsUserActivityFeedConfig>,
                required: true,
            },
        },
        data() {
            return {
                widgetId: `fastcomments-ua-${Math.random()}-${Date.now()}`,
                lastConfigKey: '',
            };
        },
        async mounted() {
            const w = window as unknown as WidgetWindow;
            if (window && !w.FastCommentsUserActivity) {
                const src = this.config.region === 'eu'
                    ? 'https://cdn-eu.fastcomments.com/js/embed-user-activity.min.js'
                    : 'https://cdn.fastcomments.com/js/embed-user-activity.min.js';
                await insertScript(src, 'fastcomments-ua-script', window.document.body);
            }
            this.lastConfigKey = JSON.stringify(this.config);
            const el = document.getElementById(this.widgetId);
            if (el && w.FastCommentsUserActivity) {
                w.FastCommentsUserActivity(el, this.config);
            }
        },
        watch: {
            config(newConfig: FastCommentsUserActivityFeedConfig) {
                const key = JSON.stringify(newConfig);
                if (key === this.lastConfigKey) return;
                this.lastConfigKey = key;
                const w = window as unknown as WidgetWindow;
                const el = document.getElementById(this.widgetId);
                if (el && w.FastCommentsUserActivity) {
                    el.innerHTML = '';
                    w.FastCommentsUserActivity(el, newConfig);
                }
            },
        },
    });
</script>

<template>
    <div class="fastcomments-user-activity-feed">
        <div :id="widgetId"></div>
    </div>
</template>
