<template>
  <div id="app">
    <router-view class="header" name="header"/>
    <router-view class="sidebar" name="sidebar"/>
    <router-view class="main" name="main"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
$colourMain: #0077ca;
$background: #d2d2d2;
* {
  padding:0;
  margin:0;
}
a {
  text-decoration: none;
}
body {
  background: $background;
}
#app {
  width:100vw;
  height:100vh;
  display:grid;
  grid-template-areas: "header header" "gap main";
  grid-template-rows: 30px auto;
  grid-template-columns: 60px auto;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header {
  grid-area: header;
}

.sidebar {
  position: fixed;
  top:0;
  left:-200px;
  width:250px;
}

.main {
  grid-area: main;
}
</style>
