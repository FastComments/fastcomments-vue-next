# FastComments Image Chat Widget

This widget gives users the ability to have a conversation about pieces of an image.

| Prop     | Description                                                             | Accepted Values | Default           |
|----------|-------------------------------------------------------------------------|-----------------|-------------------|
| tenantId | The identifier for your account.                                        | Any string.     | `undefined`       |
| urlId    | The URL, or for example article ID, that the comment thread is tied to. | Any string.     | `window.location` |

For a full list of configuration options, see [fastcomments-typescript](https://github.com/FastComments/fastcomments-typescript) and [our documentation](https://docs.fastcomments.com/guide-customizations-and-configuration.html).

```vue
export default {
  name: 'ServeDev',
  components: {
    FastCommentsImageChat
  },
  data() {
    return {
      fastCommentsImageChatTarget: {}
    }
  },
  mounted() {
    this.fastCommentsImageChatTarget = this.$refs.fastCommentsImageChatTarget;
  }
}

<!-- The outer div is required. -->
<div>
  <img ref="fastCommentsImageChatTarget" src="https://fastcomments.com/images/image-chat-demo-1.jpg" alt="Demo Image"/>
</div>
<FastCommentsImageChat v-bind:config="{tenantId: 'demo'}" :target-ref="fastCommentsImageChatTarget" />
```

Click the image below to start a conversation at that spot. On commenting, that chat "window" will appear for other users,
as well, live!

<FastCommentsImageChatExample />
