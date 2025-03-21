# FastComments Live Comment Widget

| Prop     | Description                                                             | Accepted Values | Default           |
|----------|-------------------------------------------------------------------------|-----------------|-------------------|
| tenantId | The identifier for your account.                                        | Any string.     | `undefined`       |
| urlId    | The URL, or for example article ID, that the comment thread is tied to. | Any string.     | `window.location` |

For a full list of configuration options, see [fastcomments-typescript](https://github.com/FastComments/fastcomments-typescript) and [our documentation](https://docs.fastcomments.com/guide-customizations-and-configuration.html).

```vue
<FastComments v-bind:config="{tenantId: 'demo'}" />
```

<FastComments v-bind:config="{tenantId: 'demo'}" />

<script setup>
import { FastComments } from '../../../src/main'
</script>

## In Production

You probably don't want to define the config inline if you're passing callbacks etc. Instead, you'll want to define
the config using `computed()`, otherwise each time your callback etc is invoked the entire widget will re-render.
