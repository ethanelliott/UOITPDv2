<template lang="jade">
  #course-container
    h1 {{ courseid }} {{ course_data.name }} - {{ course_data.title }}
    .long-boi
</template>

<script>
const {remote, ipcRenderer} = window.require('electron')
const BrowserWindow = remote.BrowserWindow

export default {
  name: 'Course',
  data () {
    return {
      course_data: {
        name: 'Name',
        title: 'Title'
      }
    }
  },
  computed: {

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
