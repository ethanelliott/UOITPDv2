<template lang="jade">
  #course-container
    h1 Course {{ courseid }}
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
