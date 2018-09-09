<template lang="jade">
  #login-container
    #login-wrapper
      #login-header
        #icon-wrapper
          img(src="@/assets/uoit.png" style="height:70%")
        span UOIT MyCampus Login
        p(style="text-align:center;") Sign into MyCampus to get access to all features (don't worry, I won't steal your password)
      form#login-main-container(v-on:submit.prevent="onSubmit",)
        input.input(name="username", type="text", placeholder="student id")
        input.input(name="password", type="password", placeholder="password")
        input.button(type="submit", value="Login")
</template>

<script>
const {remote, ipcRenderer} = window.require('electron')
const BrowserWindow = remote.BrowserWindow

export default {
  name: 'Login',
  data () {
    return {
    }
  },
  methods: {
    onSubmit(e) {
      ipcRenderer.send('user-login', {
        username: e.target.username.value,
        password: e.target.password.value
      })
      ipcRenderer.on('login-success', (event, arg) => {
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../sass/colours";
  @import "../sass/forms";
  #login-container {
    // background: $colourMain;
    display: flex;
    justify-content: center;
    align-items: center;
    height:100%;
    width:100%;
    #login-wrapper {
      width:400px;
      height:550px;
      color:$main-text-colour;
      background: $background;
      border: 1px solid $main-border;
      padding:1.5em;
      overflow-y: auto;
      display: grid;
      grid-template-areas: "a" "b";
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 1fr;
      grid-gap: 1em;
      transition: all 0.3s;
      #login-header {
        grid-area: a;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        #icon-wrapper {
          background: $colourMain;
          width:100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color:white;
          font-size: 60px;
        }
        span {
          font-size: 30px;
        }
        & > * {
          margin:16px;
        }
      }
    }
    #login-main-container {
      grid-area: b;
      display:grid;
      grid-gap: 2em;
    }
  }
</style>
