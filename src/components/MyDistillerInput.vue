<template>
  <div>
    <HighlightTextArea :lineNumbers="true" :breakAll="true" :value="value" :highlightData="highlightData" @input="v => $emit('input', v)" style="height: 400px;"/>
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
