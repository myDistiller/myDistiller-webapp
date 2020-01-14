<template>
  <div style="height: 100%; max-height: 30%;">
    <HighlightTextArea :lineNumbers="true" :breakAll="true" :value="value" :highlightData="highlightData" @input="v => $emit('input', v)" style="height: 100%;"/>
  </div>
</template>

<script>
import HighlightTextArea from '@/components/HighlightTextArea'

export default {
  name: 'mydistiller-input',
  props: ['value', 'highlightData'],
  components: {
    HighlightTextArea
  },
  data: () => ({
    //
  }),
  computed: {
  }
}
</script>

<style scoped>
</style>
