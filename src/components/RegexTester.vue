<template>
  <div class="inner-container" :style="{ right: (visible) ? '0' : '-376px' }">
    <div id="toggle" @click="visible = !visible">
      <span style="min-height: 90px; display: inline-block; text-align: right;">REGEX TESTER</span>
      <svg v-if="visible" style="width:20px;height:20px; transform: rotate(90deg); margin-top: 5px;" viewBox="0 0 24 24">
        <path fill="#dedede" d="M7,10L12,15L17,10H7Z" />
      </svg>
      <svg v-else style="width:20px;height:20px; transform: rotate(-90deg); margin-top: 5px;" viewBox="0 0 24 24">
        <path fill="#dedede" d="M7,10L12,15L17,10H7Z" />
      </svg>
    </div>
    <div id="regex-tester">
      <h1>Regular expression</h1>
      <RegexInput v-model="regex" style="margin-bottom: 10px;" />
      <h1>Test string</h1>
      <HighlightTextArea id="testArea" :value="sampleData" :highlightData="highlightData" @input="v => sampleData = v"/>
    </div>
  </div>
</template>

<script>
import RegexInput from '@/components/RegexInput'
import HighlightTextArea from '@/components/HighlightTextArea'

export default {
  name: 'regex-tester',
  components: {
    RegexInput,
    HighlightTextArea
  },
  props: ['initialVisible'],
  data: () => ({
    regex: '',
    sampleData: '',
    visible: true,
    error: null
  }),
  watch: {
    initialVisible (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('toggle', val)
    }
  },
  computed: {
    highlightData () {
      if (!this.regex || !this.sampleData) return
      let result = []
      try {
        let regex = new RegExp(this.regex, 'g')
        let lines = this.sampleData.split('\n')
        lines.forEach((line, index) => {
          let match
          while ((match = regex.exec(line)) !== null) {
            if (!match[0]) break
            result.push({
              startIndex: match.index,
              endIndex: match.index + match[0].length,
              match: match,
              class: 'match',
              line: index
            })
          }
        })
      } catch (err) {
        // console.log(err)
      }
      return result
    }
  }
}
</script>

<style scoped>
.inner-container {
  position: relative;
  top: 0;
  bottom: 0;
  width: 400px;
  right: 0;
  transition: right 0.4s;
}
#toggle {
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  bottom: 0;
  background-color: #474747;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
#toggle:hover {
  background-color: #555555;
}
#regex-tester {
  position: absolute;
  top: 0;
  left: 24px;
  right: 0;
  bottom: 0;
  padding: 15px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #252525;
}
#testArea {
  height: 100%;
}
</style>
