<template>
  <div>
    <div class="input-output-container">
      <div class="distiller-container" :style="{ right: (outputVisible) ? '40%' : '24px' }">
        <img class="logo" src="/mydistiller_logo_dark.svg">
        <div style="margin: 0.6em 0 0.6em 0; line-height: 24px; display: flex;">
          <h1 style="float: left; margin: 0;">entities</h1>
          <div style="flex-grow: 1; margin-left: 50px; line-height: 24px;">
            <span v-if="error" style="float: right; height: 22px; box-sizing: border-box; line-height: 22px; font-size: 14px; background: #d04c39; border-radius: 4px; padding: 1px 4px; color: white; max-width: 100%; word-break: break-all; display: inline-table; text-overflow: ellipsis;">{{ error.message }}</span>
          </div>
        </div>
        <MyDistillerInput v-model="distillerPatterns" :highlightData="highlightedDistillerElements" style="margin-bottom: 10px;" />
        <!-- <div class="testarea-container"> -->
          <div style="margin: 0.6em 0 0.6em 0; line-height: 24px;">
            <h1 style="float: left; margin: 0;">Input text</h1>
            <input type="file" ref="fileInput" style="display: none;" @change="open">
            <span style="float: right; cursor: pointer; height: 24px;" @click="$refs.fileInput.click()">
              <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path fill="#DEDEDE" d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" />
              </svg>
            </span>
          </div>
          <HighlightTextArea id="testArea" :value="sampleData" @input="v => sampleData = v"/>
        <!-- </div> -->
      </div>
      <div class="output-container" :style="{ right: (outputVisible) ? '0' : 'calc(-40% + 24px)' }">
        <div id="toggle" @click="outputVisible = !outputVisible">
          <span style="min-height: 90px; display: inline-block; text-align: right;">OUTPUT</span>
          <svg v-if="outputVisible" style="width:20px;height:20px; transform: rotate(90deg); margin-top: 5px;" viewBox="0 0 24 24">
            <path fill="#dedede" d="M7,10L12,15L17,10H7Z" />
          </svg>
          <svg v-else style="width:20px;height:20px; transform: rotate(-90deg); margin-top: 5px;" viewBox="0 0 24 24">
            <path fill="#dedede" d="M7,10L12,15L17,10H7Z" />
          </svg>
        </div>
        <div class="content" ref="container" @mouseenter="showScrollbar" @mouseleave="hideScrollbar">
          <div style="margin: 0.6em 0 0.6em 0; line-height: 24px;">
            <h1 style="float: left; margin: 0;">Output</h1>
            <span v-if="xmlOutput" style="float: right; cursor: pointer; height: 24px;" @click="download">
              <svg style="width:24px; height:24px" viewBox="0 0 24 24">
                <path fill="#DEDEDE" d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
              </svg>
            </span>
          </div>
          <!-- <VuePerfectScrollbar class="scroll-area"> -->
            <!-- <pre>{{ xmlOutput }}</pre> -->
            <codemirror v-if="xmlOutput" :value="xmlOutput" :options="cmOptions"></codemirror>
            <div v-else style="text-align: center;">- empty -</div>
            <!-- <JSONView id="output" :data="output || { data: [] }" :maxDepth="Infinity" :styles="outputStyles" /> -->
          <!-- </VuePerfectScrollbar> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyDistillerInput from '@/components/MyDistillerInput'
import HighlightTextArea from '@/components/HighlightTextArea'
// import { JSONView } from 'vue-json-component'
// import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/mode/simple.js'
import CodeMirror from 'codemirror'
const { highlight, apply, compileAll } = require('mydistiller-parser')
var convert = require('xml-js')

CodeMirror.defineSimpleMode('simplemode', {
  start: [
    { regex: /<\/?root>/, token: 'root' },
    { regex: / {4}<\/?.+?>/, token: 'group', sol: true },
    { regex: /(<entry>)(\d+)(<\/entry>)/, token: ['entry', 'number', 'entry'] },
    { regex: /(<.+?>)(\d+)(<\/.+?>)/, token: ['variable', 'number', 'variable'] },
    { regex: /(<entry>)(.+)(<\/entry>)/, token: ['entry', 'string', 'entry'] },
    { regex: /(<.+?>)(.+)(<\/.+?>)/, token: ['variable', 'string', 'variable'] },
    { regex: /(<entry>)(true|false)(<\/entry>)/, token: ['entry', 'boolean', 'entry'] },
    { regex: /(<.+?>)(true|false)(<\/.+?>)/, token: ['variable', 'boolean', 'variable'] },
    { regex: /<\/?entry>/, token: 'entry' },
    { regex: /<\/?.+?>/, token: 'variable' }
  ]
})

export default {
  name: 'mydistiller-tester',
  components: {
    MyDistillerInput,
    HighlightTextArea,
    codemirror
  },
  data: () => ({
    sampleData: '',
    distillerPatterns: '',
    error: null,
    outputStyles: {
      key: '#569cd6',
      valueKey: '#9cdcfe',
      string: '#ce9178',
      number: '#b5cea8',
      boolean: '#c586c0',
      null: '#6c71c4',
      arrowSize: '6px'
    },
    outputVisible: true,
    cmOptions: {
      theme: 'default',
      lineWrapping: false,
      flattenSpans: true,
      scrollbarStyle: 'simple',
      readOnly: true,
      mode: 'simplemode'
    }
  }),
  mounted () {
    if (localStorage.getItem('distiller_patterns')) {
      this.distillerPatterns = localStorage.getItem('distiller_patterns')
    }
    if (localStorage.getItem('distiller_text')) {
      this.sampleData = localStorage.getItem('distiller_text')
    }
  },
  watch: {
    error (val) {
      if (val && val.line && document.querySelectorAll(`.CodeMirror-gutter-wrapper .CodeMirror-linenumber`) && document.querySelectorAll(`.CodeMirror-gutter-wrapper .CodeMirror-linenumber`)[val.line - 1]) {
        document.querySelectorAll(`.CodeMirror-gutter-wrapper .CodeMirror-linenumber`)[val.line - 1].classList.add('line-error')
      } else {
        document.querySelectorAll('.CodeMirror-linenumber').forEach(el => {
          el.classList.remove('line-error')
        })
      }
    },
    distillerPatterns (val) {
      localStorage.setItem('distiller_patterns', val)
    },
    sampleData (val) {
      localStorage.setItem('distiller_text', val)
    }
  },
  computed: {
    distillerRegex () {
      if (!this.distillerPatterns) return null
      this.setError(null)
      try {
        return compileAll(this.distillerPatterns)
      } catch (err) {
        this.setError(err)
      }
      return null
    },
    highlightDataDistiller () {
      if (!this.distillerPatterns) return null
      let result = []
      for (let entry of highlight(this.distillerPatterns)) {
        result.push({
          startIndex: entry.start - 1,
          endIndex: entry.end,
          line: entry.line - 1,
          type: entry.type,
          class: `distiller-lang ${entry.type} ${(entry.type === 'variable' && !entry.visible) ? 'invisible' : ''}`
        })
      }
      return result
    },
    jsonOutput () {
      if (!this.distillerRegex || !this.sampleData) return null
      try {
        return apply(this.distillerRegex, this.sampleData)
      } catch (err) {
        console.log(err)
      }
      return null
    },
    xmlOutput () {
      if (!this.jsonOutput) return null
      let tmp = { root: {} }
      Object.keys(this.jsonOutput).forEach(key => {
        tmp.root[key] = { [key]: [] }
        tmp.root[key].entry = this.jsonOutput[key]
      })
      return convert.js2xml(tmp, { compact: true, spaces: 4, trim: true })
    },
    highlightedDistillerElements () {
      if (!this.error) return this.highlightDataDistiller
      return [...this.highlightDataDistiller, {
        line: this.error.line - 1,
        startIndex: this.error.col - 2,
        endIndex: this.error.col - 1,
        class: 'error'
      }]
    }
  },
  methods: {
    setError (error) {
      this.error = error
    },
    showScrollbar () {
      if (!this.$refs.container.querySelector('.CodeMirror-simplescroll-vertical')) return
      this.$refs.container.querySelector('.CodeMirror-simplescroll-vertical').classList.add('active')
    },
    hideScrollbar () {
      if (!this.$refs.container.querySelector('.CodeMirror-simplescroll-vertical')) return
      this.$refs.container.querySelector('.CodeMirror-simplescroll-vertical').classList.remove('active')
    },
    download () {
      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(this.xmlOutput))
      element.setAttribute('download', 'myDistiller_output.xml')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    open (event) {
      let file = event.target.files[0]
      if (!file) return
      let reader = new FileReader()
      reader.onload = (e) => {
        this.sampleData = e.target.result
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style scoped>
.output-container .content {
  position: absolute;
  top: 0;
  left: 24px;
  right: 0;
  bottom: 0;
  padding: 15px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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
.distiller-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  right: 40%;
  height: 100%;
  padding: 15px 20px;
  box-sizing: border-box;
  transition: right 0.4s;
}
.output-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  transition: right 0.4s;
}
.input-output-container {
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.testarea-container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 42%;
  right: calc(40% + 20px);
  display: flex;
  flex-direction: column;
}
#testArea, #output {
  height: 100%;
}
.scroll-area {
  position: relative;
  margin: auto;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.logo {
    display: block;
    margin: auto;
    width: 100%;
    max-width: 230px;
}
</style>

<style>
.ps__rail-y {
  width: 0px;
}
.ps__thumb-y {
  right: 0 !important;
}
.ps__rail-y:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}
.ps__rail-y.ps--clicking .ps__thumb-y, .ps__rail-y:focus>.ps__thumb-y, .ps__rail-y:hover>.ps__thumb-y {
  width: 6px;
}
.json-view-item .value-key span:last-child {
  font-weight: 400 !important;
}
</style>
