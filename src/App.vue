<template>
  <div id="app">
    <MyDistillerTester id="mydistiller-tester-container" :style="{ right: (regexTesterVisible) ? '400px' : '24px' }" />
    <RegexTester id="regex-tester-container" :initialVisible="regexTesterVisible" @toggle="v => regexTesterVisible = v" />
  </div>
</template>

<script>
import RegexTester from '@/components/RegexTester'
import MyDistillerTester from '@/components/MyDistillerTester'

export default {
  name: 'app',
  components: {
    RegexTester,
    MyDistillerTester
  },
  data: () => ({
    regexTesterVisible: true
  }),
  mounted () {
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  methods: {
    resize () {
      if (window.innerWidth < 1300) {
        this.regexTesterVisible = false
      }
    }
  }
}
</script>

<style scoped>
#mydistiller-tester-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  transition: right 0.4s;
}
#regex-tester-container {
  position: fixed;
}
</style>

<style>
body {
  background: #252525;
  color: #dedede;
}
#app {
  font-family: 'Roboto', sans-serif;
}
h1 {
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  text-transform: uppercase;
}
</style>
