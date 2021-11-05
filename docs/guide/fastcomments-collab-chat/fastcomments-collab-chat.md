# FastComments Collab Chat Widget

This widget gives users the ability to highlight and discuss pieces of text in a document.

| Prop     | Description                                                             | Accepted Values | Default           |
|----------|-------------------------------------------------------------------------|-----------------|-------------------|
| tenantId | The identifier for your account.                                        | Any string.     | `undefined`       |
| urlId    | The URL, or for example article ID, that the comment thread is tied to. | Any string.     | `window.location` |

For a full list of configuration options, see [fastcomments-typescript](https://github.com/FastComments/fastcomments-typescript) and [our documentation](https://docs.fastcomments.com/guide-customizations-and-configuration.html).

```vue
export default {
  name: 'ServeDev',
  components: {
    FastCommentsCollabChat
  },
  data() {
    return {
      fastCommentsCollabChatTarget: {}
    }
  },
  mounted() {
    this.fastCommentsCollabChatTarget = this.$refs.fastCommentsCollabChatTarget;
  }
}
<div ref="fastCommentsCollabChatTarget">This is some text that will have collab chat enabled.</div>
<FastCommentsCollabChat v-bind:config="{tenantId: 'demo'}" :target-ref="fastCommentsCollabChatTarget" />
```

<FastCommentsCollabChatExample />
