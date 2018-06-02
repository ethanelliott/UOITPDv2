<template>
  <div id="app">
    <router-view class="header" name="header"/>
    <router-view class="sidebar" name="sidebar"/>
    <div id="main-content-wrapper">
      <router-view class="main" name="main"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "components/colours";
@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
    -webkit-user-select: none;
    user-select: none;
    cursor: default;
}

::-webkit-scrollbar {
    width: 10px;
}
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}
::-webkit-scrollbar-thumb {
    background: $colourMain;
}
::-webkit-scrollbar-thumb:hover {
    background: $colourMainDark;
}

* {
  padding:0;
  margin:0;
}
a {
  text-decoration: none;
}
body {
  background: $main-background;
  animation: fadein 0.5s;
}
#app {
  width:100vw;
  height:100vh;
  display:grid;
  grid-template-areas: "header header" "gap main";
  grid-template-rows: 30px auto;
  grid-template-columns: 50px auto;
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
  left:-300px;
  width:350px;
}

#main-content-wrapper {
  grid-area: main;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  padding:25px;
  padding-top:10px;
  overflow-y: auto;
  .main {
    width:100%;
  }
}
</style>
