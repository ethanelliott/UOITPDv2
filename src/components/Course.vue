<template lang="jade">
  #course-container
    h1 {{ course_data.name }} - {{ course_data.title }}
    .long-boi
</template>

<script>
const {remote, ipcRenderer} = window.require('electron')
const BrowserWindow = remote.BrowserWindow

export default {
  name: 'Course',
  data () {
    let da
    ipcRenderer.send('get-course-data', this.courseid)
    ipcRenderer.on('give-course-data', (event, arg) => {
      da = arg[0]
    })
    return {
      course_data: da
    }
  },
  mounted() {
  },
  props: ['courseid']
}
</script>

<style lang="scss" scoped>
@import "../sass/colours";
.long-boi {
  height: 2000px;
}
</style>
