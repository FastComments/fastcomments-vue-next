<template>
  <div>
    <img ref="fastCommentsImageChatTarget" src="https://fastcomments.com/images/image-chat-demo-1.jpg" alt="Demo Image"/>
  </div>
  <FastCommentsImageChat v-bind:config="{tenantId: 'demo'}" :target-ref="fastCommentsImageChatTarget" />
</template>

<script>
import { FastCommentsImageChat } from '../../../src/main';

export default {
  name: 'FastCommentsImageChatExample',
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
};
</script>
