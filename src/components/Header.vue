<template lang="jade">
  #titlebar
    .title-container
      span UOITPD -  {{ name }}
    .middle-container
    .action-container
      .close-button(v-on:click="closeWindow")
        i.fa.fa-close
      .max-button(v-on:click="maximizeWindow")
        i.fa.fa-window-maximize
      .min-button(v-on:click="minimizeWindow")
        i.fa.fa-window-minimize
</template>

<script>
const remote = window.require('electron').remote
const w = remote.getCurrentWindow()
export default {
  name: 'Header',
  data () {
    return {
      name: 'Ethan'
    }
  },
  methods: {
    closeWindow: (event) => {
      w.close()
    },
    maximizeWindow: (event) => {
      if (w.isMaximized()) {
        w.unmaximize()
      } else {
        w.maximize()
      }
    },
    minimizeWindow: (event) => {
      w.minimize()
    }
  }
}
</script>
<style lang="scss">
  @import "colours";
  #titlebar {
    z-index: 1;
    width:100%;
    height:100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background:$colourMain;
    -webkit-app-region: drag;
    & > * {
      -webkit-app-region: drag;
      height: 100%;
      width: 100%;
      color:white;
    }
    .title-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
      margin-left:75px;
      letter-spacing: 1px;
    }
    .middle-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
    }
    .action-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row-reverse;
      & > * {
        background:$colourMain;
        -webkit-app-region: no-drag;
        padding-left:1em;
        padding-right:1em;
        transition:all 0.3s;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          background:$colourMainDark;
          cursor: pointer;
      }
      }
    }
  }
</style>
