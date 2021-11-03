<template>
  <FastComments v-bind:config="{tenantId: 'demo'}" />
</template>
<script>
import { FastComments } from '../../../src/main'
export default {
  name: 'FastCommentsExample',
  components: {
    FastComments
  }
}
</script>
