<template lang="jade">
  #calendar-container
    h1 Calendar
    #calendar-card
</template>

<script>
export default {
  name: 'Calendar',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>

#calendar-container {
  display: grid;
  grid-template-areas: "a" "b";
  grid-template-rows: 50px auto;
  h1 {
    grid-area:a;
  }
  #calendar-card {
    grid-area: b;
    display:flex;
    justify-content: center;
    align-items:center;
    color:black;
    background:rgb(245, 245, 245);
    border-radius: 3px;
    box-shadow: 0 0 10px 1px rgba(0,0,0,0.5);
  }
}
</style>
