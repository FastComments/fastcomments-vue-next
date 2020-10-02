<script lang="ts">
    import {FastCommentsConfig} from "../../fastcomments-typescript/src";

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
    function reset(config : FastCommentsConfig) {
        if (lastWidgetInstance) {
            lastWidgetInstance.update(config);
        }
    }

    // let fcInstance = null;
    export default{
        name: 'FastcommentsVue', // vue component name
        props: {
            config: {
                type: Object as () => FastCommentsConfig
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
                await insertScript('https://cdn.fastcomments.com/js/embed.min.js', 'fastcomments-widget-script', window.document.body);
            }
            // @ts-ignore
            lastWidgetInstance = window.FastCommentsUI(document.getElementById(this.widgetId), this.config);
        },
        watch: {
            config(newConfig) {
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