<template lang="jade">
  #calendar-container
    #calendar-card
</template>

<script>
export default {
  name: 'Calendar',
  data () {
    return {
      title: 'Calendar'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "colours";
#calendar-container {
  display: grid;
  grid-template-areas: "a" "b";
  grid-template-rows:10px auto;
  h1 {
    grid-area:a;
  }
  #calendar-card {
    grid-area: b;
    display:flex;
    justify-content: center;
    align-items:center;
    color:black;
    color:black;
    background: $background;
    border: 1px solid $main-border;
    //border-radius: 3px;
    //box-shadow: 0 0 10px 1px rgba(0,0,0,0.5);
  }
}
</style>
