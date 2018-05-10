<template lang="jade">
  #sidebar(v-bind:class="{ active: isToggle }")
    .toggle-button-container
      span {{ title }}
      .toggle-button(v-on:click="isToggle = !isToggle")
        i.fa.fa-bars
    .defaults-container
      router-link.button(v-on:click="isToggle = false", v-bind:to="'/'")
          span Home
          i.fa.fa-home
      router-link.button(v-on:click="isToggle = false", v-bind:to="'/calendar'")
          span Calendar
          i.fa.fa-calendar
      router-link.button(v-on:click="isToggle = false", v-bind:to="'/todo'")
          span To-Do
          i.fa.fa-list
    .courses-container
      router-link.course-button(v-on:click="isToggle = false", v-bind:to="'/course/course1'")
            span Course1
            i.fa.fa-book
      router-link.course-button(v-on:click="isToggle = false", v-bind:to="'/course/course2'")
            span Course2
            i.fa.fa-book
      router-link.course-button(v-on:click="isToggle = false", v-bind:to="'/course/course3'")
            span Course3
            i.fa.fa-book
      router-link.course-button(v-on:click="isToggle = false", v-bind:to="'/course/course4'")
            span Course4
            i.fa.fa-book
      router-link.course-button(v-on:click="isToggle = false", v-bind:to="'/course/course5'")
            span Course5
            i.fa.fa-book
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
  grid-template-rows: 50px 150px auto 50px;
  height:100%;
  -webkit-app-region: no-drag;
  transition:left 0.3s;
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
  & > .defaults-container, & > .courses-container  {
    display: flex;
    align-items: center;
    flex-direction: column;
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
</style>
