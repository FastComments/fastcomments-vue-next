<script lang="ts">
    import { defineComponent, type PropType } from 'vue';
    import type { FastCommentsCommentCountConfig } from 'fastcomments-typescript';

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

    type WidgetWindow = { FastCommentsCommentCount?: (el: HTMLElement, cfg: FastCommentsCommentCountConfig) => void };

    export default defineComponent({
        name: 'FastCommentsCommentCount',
        props: {
            config: {
                type: Object as PropType<FastCommentsCommentCountConfig>,
                required: true,
            },
        },
        data() {
            return {
                widgetId: `fastcomments-count-${Math.random()}-${Date.now()}`,
                lastConfigKey: '',
            };
        },
        async mounted() {
            const w = window as unknown as WidgetWindow;
            if (window && !w.FastCommentsCommentCount) {
                const src = this.config.region === 'eu'
                    ? 'https://cdn-eu.fastcomments.com/js/widget-comment-count.min.js'
                    : 'https://cdn.fastcomments.com/js/widget-comment-count.min.js';
                await insertScript(src, 'fastcomments-count-script', window.document.body);
            }
            this.lastConfigKey = JSON.stringify(this.config);
            const el = document.getElementById(this.widgetId);
            if (el && w.FastCommentsCommentCount) {
                w.FastCommentsCommentCount(el, this.config);
            }
        },
        watch: {
            config(newConfig: FastCommentsCommentCountConfig) {
                const key = JSON.stringify(newConfig);
                if (key === this.lastConfigKey) return;
                this.lastConfigKey = key;
                const w = window as unknown as WidgetWindow;
                const el = document.getElementById(this.widgetId);
                if (el && w.FastCommentsCommentCount) {
                    el.innerHTML = '';
                    w.FastCommentsCommentCount(el, newConfig);
                }
            },
        },
    });
</script>

<template>
    <span class="fastcomments-comment-count">
        <span :id="widgetId"></span>
    </span>
</template>
