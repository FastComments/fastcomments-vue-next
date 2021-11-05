<template>
  <div ref="fastCommentsCollabChatTarget">This is some text that will have collab chat enabled.</div>
  <FastCommentsCollabChat v-bind:config="{tenantId: 'demo'}" :target-ref="fastCommentsCollabChatTarget" />
</template>

<script>
import { FastCommentsCollabChat } from '../../../src/main';

export default {
  name: 'FastCommentsCollabChatExample',
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
};
</script>
