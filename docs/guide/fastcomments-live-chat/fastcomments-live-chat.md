# FastComments Live Chat Widget

This widget looks more like how you'd expect a live chat to look, with limited nesting, chat input at the bottom, and a live connection indicator.

| Prop     | Description                                                             | Accepted Values | Default           |
|----------|-------------------------------------------------------------------------|-----------------|-------------------|
| tenantId | The identifier for your account.                                        | Any string.     | `undefined`       |
| urlId    | The URL, or for example article ID, that the comment thread is tied to. | Any string.     | `window.location` |

For a full list of configuration options, see [fastcomments-typescript](https://github.com/FastComments/fastcomments-typescript) and [our documentation](https://docs.fastcomments.com/guide-customizations-and-configuration.html).

```vue
<FastCommentsLiveChat v-bind:config="{tenantId: 'demo'}" />
```

<FastCommentsLiveChat v-bind:config="{tenantId: 'demo'}" />

<script setup>
import { FastCommentsLiveChat } from '../../../src/main'
</script>
