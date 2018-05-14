<template lang="jade">
  #course-container
    h1 Course {{ courseid }}
    .long-boi
</template>

<script>
export default {
  name: 'Course',
  data () {
    return {
    }
  },
  props: ['courseid']
}
</script>

<style lang="scss" scoped>
.long-boi {
  height: 2000px;
}
</style>
