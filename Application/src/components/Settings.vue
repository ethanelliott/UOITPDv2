<template lang="jade">
  #settings-container
    h1 Settings
    #card
      h2 Export Calendar
      br
      p Export calendar with ToDos, Projects, and classes (.ics format)
      br
      input.button(type="button", value="Export Calendar", v-on:click="exportCalendar")
    #card
      h2 Remote Backup
      br
      p You can backup your data to our servers! This will allow a sync between devices, and a bit of security incase something happens.
      p Data is not stored on UOIT servers, but it is E2E encrypted with AES.
      p Remote backup is entirely up to you.
      p Backup runs on regular intervals to ensure that all of your information is up to date on all devices!
      p In order to ensure security, you must login to MyCampus again (All login details are based on mycampus):
      br
      form(v-on:submit.prevent="onSubmit")
        input.input(type="text", name="username", placeholder="student number")
        input.input(type="password", name="password", placeholder="password")
        input.button(type="submit", value="Login and Start Backup")
</template>

<script>
const {ipcRenderer, remote} = window.require('electron')
const { dialog } = remote
export default {
  name: 'Settings',
  data () {
    return {
    }
  },
  methods: {
    exportCalendar(event) {
      dialog.showSaveDialog({
        title: 'Export Calendar',
        buttonLabel: "Export",
        filters: [{
          name: "Calendar",
          extensions: ["ics"]
        }]
      }, (filename) => {
        ipcRenderer.send('get-ics-calendar', filename)
      })
    },
    onSubmit(e) {
      ipcRenderer.send('login-for-backup', {
        username: e.target.username.value,
        password: e.target.password.value
      })
      e.target.username.value = ""
      e.target.password.value = ""
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/colours";
@import "../sass/forms";
  #card {
    width: calc(100% - 3em);
    color:$main-text-colour;
    background: $background;
    border: 1px solid $main-border;
    padding:1.5em;
    margin-top: 1em;
    overflow-y: auto;
  }
</style>
