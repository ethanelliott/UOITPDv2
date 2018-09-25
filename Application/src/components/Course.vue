<template lang="jade">
  #course-container
    h1
      i.fa(:class="'fa-' + coursedata.icon")
      span &nbsp; {{ coursedata.code + " - " + coursedata.name }}
    input(type="color", :value="'#' + coursedata.color", @change="colorChange")
    p {{ coursedata }}
    .long-boi
</template>

<script>
const {ipcRenderer} = window.require('electron')

export default {
  name: 'Course',
  data () {
    return {
      eventLoop: null,
      coursedata: {}
    }
  },
  methods: {
    colorChange (data) {
      let colour = data.target.value.replace('#', '')
      ipcRenderer.send('colour-change', {colour, coursedata: this.coursedata})
    }
  },
  props: ['courseid'],
  mounted () {
    let context = this
    // start data call
    ipcRenderer.send('get-course-data', context.courseid)
    // Start data update event loop
    this.eventLoop = setInterval(() => {
      // ipcRenderer.send('get-course-data', context.courseid)
    }, 500)
    // Handle event responses
    ipcRenderer.on('give-course-data', (event, arg) => {
      context.coursedata = arg[0]
    })
    ipcRenderer.on('refresh-course', (event, arg) => {
      event.sender.send('get-course-data', context.courseid)
    })
  },
  beforeDestroy () {
    clearInterval(this.eventLoop)
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/colours";
.long-boi {
  height: 2000px;
}
</style>
