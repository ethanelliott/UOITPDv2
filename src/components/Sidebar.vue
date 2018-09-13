<template lang="jade">
  #sidebar( v-bind:class="[isToggle ? active : '']")
    .toggle-button-container
      span {{ title }}
      .toggle-button(@click="isToggle = !isToggle")
        i.fa.fa-bars
    .defaults-container
      router-link.button(v-on:click.native="isToggle = false", v-bind:to="'/'")
          span Home
          i.fa.fa-home
      router-link.button(v-on:click.native="isToggle = false", v-bind:to="'/calendar'")
          span Calendar
          i.fa.fa-calendar
      router-link.button(v-on:click.native="isToggle = false", v-bind:to="'/todo'")
          span To-Do
          i.fa.fa-list
      router-link.button(v-on:click.native="isToggle = false", v-bind:to="'/projects'")
          span Projects
          i.fa.fa-tasks
      router-link.button(v-on:click.native="isToggle = false", v-bind:to="'/notes'")
          span Notes
          i.fa.fa-file
      router-link.button(v-on:click.native="isToggle = false", v-bind:to="'/weather'")
          span Weather
          i.fa.fa-cloud
    .courses-container
      .course(v-for="menuItem in menu", :style="{'background': '#' + menuItem.color + 'ff'}")
        router-link.course-button(v-on:click.native="isToggle = false", v-bind:to="'/course/' + menuItem.name.toUpperCase()")
          span(:style="{'color': ((parseInt(menuItem.color.substring(0, 2), 16) * 0.299 + parseInt(menuItem.color.substring(2, 4), 16) * 0.587 + parseInt(menuItem.color.substring(4, 6), 16) * 0.114) > 186 ? '#000000' : '#FFFFFF')}") {{ menuItem.name.toUpperCase() }}
          i.fa(:class="'fa-' + menuItem.icon", :style="{'color': ((parseInt(menuItem.color.substring(0, 2), 16) * 0.299 + parseInt(menuItem.color.substring(2, 4), 16) * 0.587 + parseInt(menuItem.color.substring(4, 6), 16) * 0.114) > 186 ? '#000000' : '#FFFFFF')}")
    .defaults-container
      router-link.settings-button(v-on:click.native="isToggle = false", v-bind:to="'/settings'")
        span Settings
        i.fa.fa-cog
</template>

<script>
const {remote, ipcRenderer} = window.require('electron')
const BrowserWindow = remote.BrowserWindow

export default {
  name: 'Sidebar',
  data () {
    return {
      title: 'UOITPD',
      isToggle: false,
      active: 'active',
      menu: []
    }
  },
  mounted() {
    setInterval(() => {
      ipcRenderer.send('get-courses')
    }, 500)
    ipcRenderer.on('give-courses', (event, arg) => {
      this.menu = arg
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  @import "../sass/colours";
  .active {
    left:0;
  }
  #sidebar {
    font-size: 14px;
    background: rgb(110, 110, 110);
    box-shadow: 0 0 15px 1px rgba(0,0,0,0.5);
    z-index: 50000;
    display:grid;
    grid-template-rows: 50px 300px auto 50px;
    height:100%;
    -webkit-app-region: no-drag;
    transition:left 0.3s;
    .router-link-exact-active {
      background:#0077ca;
    }
    & > .toggle-button-container  {
      border-bottom:3px solid rgb(80,80,80);
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
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;
        &:hover {
          background:#0077ca;
          cursor: pointer !important;
        }
      }
    }
    & > .defaults-container {
      justify-content: flex-end;
    }
    & > .courses-container {
      justify-content: flex-start;
      border-top:3px solid rgb(80,80,80);
    }
    & > .defaults-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      & > * {
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
        font-size:1.5em;
        transition: background 0.3s;
        &:hover {
          background: #0077ca;
          cursor: pointer !important;
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
    & > .courses-container  {
      display: flex;
      align-items: center;
      flex-direction: column;
      & > * {
        width:100%;
        color: white;
        & > * {
          width:100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          font-size:1.5em;
          transition: background 0.3s;
          &:hover {
          background: #0077ca;
          cursor: pointer !important;
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
  }
</style>
