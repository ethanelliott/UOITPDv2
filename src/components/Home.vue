<template lang="jade">
  #home-container
    #info-container
      h1 Info
    #schedule-container
      h1 Schedule
    #todo-container
      h1 To-Do
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
  #home-container {
    display: grid;
    grid-template-areas: "a a a a" "b b c c" "d d e e";
    grid-template-columns: 25% 25% 25% 25%;
    grid-template-rows: 10% 45% 45%;
    & > * {
      display:flex;
      justify-content: center;
      align-items:center;
      color:white;
    }
    #info-container {
      grid-area: a;
      background: black;
    }
    #schedule-container {
      grid-area: c;
      background: blue;
    }
    #todo-container {
      grid-area: b;
      background: red;
    }
  }
</style>
