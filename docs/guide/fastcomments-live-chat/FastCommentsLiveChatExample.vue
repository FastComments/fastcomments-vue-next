<template>
  <FastCommentsLiveChat v-bind:config="{tenantId: 'demo'}" />
</template>
<script>
import { FastCommentsLiveChat } from '../../../src/main'
export default {
  name: 'FastCommentsLiveChatExample',
  components: {
    FastCommentsLiveChat,
  },
}
</script>
