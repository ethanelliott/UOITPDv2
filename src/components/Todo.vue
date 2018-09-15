<template lang="jade">
  #todo-container
    h1 ToDo
    #todo-wrapper
      #todo-pad
</template>

<script>
export default {
  name: 'ToDo',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/colours";
#todo-wrapper {
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  #todo-pad {
    border: 1px solid #b4a200;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.5);
    background: #e4d979;
    width: 500px;
    height: 600px;
  }
}
</style>