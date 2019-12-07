<template>
  <div>
    <HighlightTextArea id="regexInput" :singleLine="true" :breakAll="true" :value="value" :highlightData="highlightData" @input="v => $emit('input', v)"/>
    <span v-if="error" style="float: right; height: 24px; box-sizing: border-box; line-height: 24px; font-size: 14px; background: #d04c39; border-radius: 4px; padding: 1px 4px; color: white; margin-top: 0.6em;">{{ error }}</span>
  </div>
</template>

<script>
import HighlightTextArea from '@/components/HighlightTextArea'
const regexpTree = require('regexp-tree')

export default {
  name: 'regex-input',
  props: ['value'],
  components: {
    HighlightTextArea
  },
  data: () => ({
    //
  }),
  computed: {
    error () {
      try {
        (new RegExp(this.value, 'gu')).exec('')
      } catch (err) {
        let error = err.message.split(': ')
        error.shift()
        error.shift()
        return error.join('')
      }
      return null
    },
    highlightData () {
      if (!this.value) return
      let result = []
      try {
        let tree = regexpTree.parser.setOptions({ captureLocations: true }).parse(new RegExp(this.value, 'gu'))

        let deep = (child) => {
          if (child.loc) {
            result.push({
              startIndex: child.loc.start.column - 1,
              endIndex: child.loc.end.column - 1,
              line: 0,
              type: child.type,
              kind: child.kind,
              class: `${child.type} ${child.kind || ''}`
            })
          }
          if (child.expressions) {
            for (let expression of child.expressions) {
              deep(expression)
            }
          }
          if (child.expression) {
            deep(child.expression)
          }
          if (child.left) {
            deep(child.left)
          }
          if (child.right) {
            deep(child.right)
          }
        }

        deep(tree.body)
      } catch (err) {
        // console.log(err)
      }
      result = result
        .map((e, i) => {
          e.class = e.class.split(' ')
            .map((el, j) => {
              if (el) {
                return `${el}-${i}-${j}`
              }
            }
            ).join(' ')
          return e
        })
      return result
    }
  }
}
</script>

<style scoped>
</style>
