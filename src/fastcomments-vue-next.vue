<script lang="ts">
    import {FastCommentsCommentWidgetConfig} from '../node_modules/fastcomments-typescript/src';

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
    function reset(config : FastCommentsCommentWidgetConfig) {
        if (lastWidgetInstance) {
            lastWidgetInstance.update(config);
        }
    }

    // let fcInstance = null;
    export default {
        name: 'FastcommentsVueNext', // vue component name
        props: {
            config: {
                type: Object as () => FastCommentsCommentWidgetConfig
            }
        },
        data() {
            return {
                widgetId: `fastcomments-widget-${Math.random()}-${Date.now()}`
            }
        },
        async mounted() {
            // @ts-ignore
            if (window && !window.FastCommentsUI) {
                await insertScript('https://cdn.fastcomments.com/js/embed-v2.min.js', 'fastcomments-widget-script', window.document.body);
            }
            // @ts-ignore
            lastWidgetInstance = window.FastCommentsUI(document.getElementById(this.widgetId), this.config);
        },
        watch: {
            config(newConfig : FastCommentsCommentWidgetConfig) {
                reset(newConfig);
            },
        },
    }
</script>

<template>
    <div class="fastcomments-vue">
        <div v-bind:id="widgetId"></div>
    </div>
</template>
