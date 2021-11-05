import Theme from 'vitepress/theme'
import FastCommentsCollabChatExample from '../components/FastCommentsCollabChatExample.vue'
import FastCommentsImageChatExample from '../components/FastCommentsImageChatExample.vue'

export default {
  ...Theme,

  enhanceApp({ app }) {
    app.component('FastCommentsCollabChatExample', FastCommentsCollabChatExample)
    app.component('FastCommentsImageChatExample', FastCommentsImageChatExample)
  }
}
