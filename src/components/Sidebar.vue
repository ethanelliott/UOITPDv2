<template lang="jade">
  #sidebar(v-bind:class="{ active: isToggle }")
    .toggle-button-container
      span {{ title }}
      .toggle-button(v-on:click="isToggle = !isToggle")
        i.fa.fa-bars
    .defaults-container
      router-link.settings-button(v-on:click="isToggle = false", v-bind:to="'/'")
          span Home
          i.fa.fa-home
    .courses-container
    .defaults-container
      router-link.settings-button(v-on:click="isToggle = false", v-bind:to="'/settings'")
        span Settings
        i.fa.fa-cog
</template>

<script>
export default {
  name: 'Sidebar',
  data () {
    return {
      title: 'UOITPD',
      isToggle: false
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  left:0;
}
#sidebar {
  background: rgb(100, 100, 100);
  box-shadow: 0 0 15px 1px rgba(0,0,0,0.5);
  z-index: 500;
  display:grid;
  grid-template-rows: 50px 50px auto 100px;
  height:100%;
  -webkit-app-region: no-drag;
  transition:left 0.3s;
  & > .toggle-button-container  {
    width:100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color:white;
    font-size:1.5em;
    & > span {
      margin-left:0.5em;
    }
    & > *:not(span) {
      width:50px;
      height:50px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
      &:hover {
        background:#0077ca;
        cursor: pointer;
      }
    }
  }
  & > .defaults-container, & > .courses-container  {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    & > * {
      width:100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color:white;
      font-size:1.5em;
      transition: background 0.3s;
      &:hover {
        background: #0077ca;
        cursor: pointer;
      }
      & > span {
      margin-left:0.5em;
      }
      & > *:not(span) {
        width:50px;
        height:50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
