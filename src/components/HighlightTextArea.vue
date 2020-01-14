<template>
  <div ref="container" style="height: 100%;" class="highlight-textarea-container" @mouseenter="showScrollbar" @mouseleave="hideScrollbar">
    <codemirror ref="textarea" :class="{ 'single-line': singleLine }" :value="value" @input="v => valueCache = v" :options="cmOptions" @beforeChange="(cm, changeObj) => { if (singleLine) preventMultiline(cm, changeObj) }"></codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import ResizeObserver from 'resize-observer-polyfill'

export default {
  name: 'highlight-text-area',
  components: {
    codemirror
  },
  props: [
    'value',
    'highlightData',
    'singleLine',
    'lineNumbers',
    'breakAll'
  ],
  data: () => ({
    cmOptions: {
      theme: 'default',
      lineWrapping: true,
      flattenSpans: true,
      scrollbarStyle: 'simple',
      mode: 'default',
      lineNumbers: false
    },
    valueCache: null,
    resizeObserver: null
  }),
  computed: {
    codemirror () {
      return this.$refs.textarea.codemirror
    },
    codemirrorDocument () {
      return this.codemirror.getDoc()
    }
  },
  mounted () {
    if (this.lineNumbers) {
      this.cmOptions.lineNumbers = true
    }
    this.updateMarks()
    this.resizeObserver = new ResizeObserver(() => {
      this.codemirror.refresh()
    })
    this.resizeObserver.observe(this.$refs.container)
    this.$nextTick(() => {
      if (this.breakAll &&
        this.$refs.textarea.$el.querySelector('.CodeMirror-wrap pre.CodeMirror-line') &&
        this.$refs.textarea.$el.querySelector('.CodeMirror-wrap pre.CodeMirror-line-like') &&
        this.$refs.textarea.$el.querySelector('.CodeMirror-wrap pre')) {
        this.$refs.textarea.$el.querySelector('.CodeMirror-wrap pre').style.wordBreak = 'break-all'
        this.$refs.textarea.$el.querySelector('.CodeMirror-wrap pre.CodeMirror-line').style.wordBreak = 'break-all'
        this.$refs.textarea.$el.querySelector('.CodeMirror-wrap pre.CodeMirror-line-like').style.wordBreak = 'break-all'
      }
    })
  },
  beforeDestroy () {
    this.resizeObserver.unobserve(this.$refs.container)
  },
  watch: {
    value (val) {
      this.updateMarks()
    },
    highlightData (val) {
      this.updateMarks()
    },
    valueCache () {
      this.propagateInput()
    }
  },
  methods: {
    propagateInput () {
      clearTimeout(this.propagationTimeout)
      this.propagationTimeout = setTimeout(() => {
        this.$emit('input', this.valueCache)
        this.propagationTimeout = null
      }, 500)
    },
    preventMultiline (cm, changeObj) {
      var typedNewLine = changeObj.origin === '+input' && typeof changeObj.text === 'object' && changeObj.text.join('') === ''
      if (typedNewLine) {
        return changeObj.cancel()
      }
      var pastedNewLine = changeObj.origin === 'paste' && typeof changeObj.text === 'object' && changeObj.text.length > 1
      if (pastedNewLine) {
        var newText = changeObj.text.join(' ')
        return changeObj.update(null, null, [newText])
      }
      return null
    },
    updateMarks () {
      this.codemirrorDocument.getAllMarks().forEach(el => el.clear())
      this.$nextTick(() => {
        if (!this.highlightData) return
        for (let match of this.highlightData) {
          let line = (this.singleLine) ? 0 : match.line
          try {
            this.codemirrorDocument.markText({ line: line, ch: match.startIndex }, { line: line, ch: match.endIndex }, { className: `${match.class}` })
          } catch (err) {}
        }
        let container = this.$refs.textarea.$el.querySelector('.CodeMirror-code .CodeMirror-line [role=presentation]')
        for (let char of container.children) {
          if (char.classList[char.classList.length - 1]) {
            char.classList.add(char.classList[char.classList.length - 1].split('-')[0] + '-master')
          }
        }
      })
    },
    showScrollbar () {
      this.$refs.container.querySelector('.CodeMirror-simplescroll-vertical').classList.add('active')
    },
    hideScrollbar () {
      this.$refs.container.querySelector('.CodeMirror-simplescroll-vertical').classList.remove('active')
    }
  }
}
</script>

<style>
.vue-codemirror {
  height: 100%;
  cursor: text;
}
.highlight-textarea-container {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  border-radius: 4px;
  background: #3c3c3c;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.highlight-textarea-container:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
.CodeMirror {
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  color: #dedede;
  height: 100%;
  background: inherit;
}
.CodeMirror .CodeMirror-selected {
  background: #416b95;
}
.CodeMirror .CodeMirror-cursor {
  border-color: white;
}
.CodeMirror-simplescroll-vertical {
  opacity: 0;
  width: 6px;
  transition: opacity 0.2s ease-in-out;
}
.CodeMirror-simplescroll-vertical.active {
  opacity: 1;
}
.CodeMirror-scrollbar-filler {
  display: none !important;
}
.CodeMirror-simplescroll-horizontal {
  height: 6px;
}
.CodeMirror-simplescroll-horizontal, .CodeMirror-simplescroll-vertical {
  background: none;
}
.CodeMirror-simplescroll-horizontal div, .CodeMirror-simplescroll-vertical div {
  background: rgba(255, 255, 255, 0.4);
  border: none;
  border-radius: 50px;
}
.CodeMirror-simplescroll-horizontal, .CodeMirror-simplescroll-vertical {
  cursor: default;
}
.CodeMirror-wrap pre.CodeMirror-line, .CodeMirror-wrap pre.CodeMirror-line-like {
  word-break: break-word;
}
.CodeMirror-lines {
  padding: 15px;
}
.CodeMirror-gutter-wrapper {
  left: -40px !important;
}
.CodeMirror-gutters {
  background: transparent !important;
  border-right: none !important;
}
.breakpoints {
  width: .8em;
}
.CodeMirror-linenumber {
  min-width: 18px !important;
  width: 19px !important;
}
.single-line .CodeMirror {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
}
.CodeMirror-wrap pre {
    word-break: break-word;
}
.CodeMirror .match:nth-child(even) {
  background-color: #cf5d5d;
}
.CodeMirror .match:nth-child(odd) {
  background-color: #b83a3a;
}
.CodeMirror .Alternative-master {
  background-color: transparent;
}
.CodeMirror .meta-master {
  background-color: #ab5500;
}
.CodeMirror .CharacterClass-master {
  background-color: rgb(151, 136, 1);
}
.CodeMirror .ClassRange-master {
  background-color: rgb(92, 83, 0);
}
.CodeMirror .Repetition-master {
  background-color: #0e0088;
}
.CodeMirror .simple-master {
  background-color: transparent;
}
.CodeMirror .Group-master {
  background-color: #00885b;
}
.CodeMirror .$-master {
  background-color: black;
}
.CodeMirror .distiller-lang.string,
.CodeMirror .cm-string {
  color: #ce9178 !important;
}
.CodeMirror .distiller-lang.variable,
.CodeMirror .cm-variable {
  color: #9cdcfe !important;
}
.CodeMirror .distiller-lang.variable.invisible {
  color: grey !important;
}
.CodeMirror .cm-number {
  color: #b5cea8 !important;
}
.CodeMirror .cm-entry {
  color: #569cd6 !important;
}
.CodeMirror .cm-group {
  color: #c586c0 !important;
}
.CodeMirror .distiller-lang.regex {
  color: #d16969 !important;
}
.CodeMirror .distiller-lang.dot,
.CodeMirror .distiller-lang.semicolon,
.CodeMirror .distiller-lang.comma {
  color: #0dbc79;
}
.CodeMirror .distiller-lang.comment {
  color: #6a9955;
}
.CodeMirror .distiller-lang.label {
  color: #c586c0;
}
.CodeMirror .error {
  border-bottom: 2px dashed #d04c39;
}
.CodeMirror .CodeMirror-linenumber.line-error:after {
  content: "•";
  color: #d04c39;
  position: absolute;
  margin-left: 2px;
  height: 22px;
}
</style>
