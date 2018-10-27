<template lang="jade">
  #home-container
    #floating-box-wrapper(v-bind:class="{ invisible: hide_newproject }")
      #floating-box.project-box
        #header-wrapper
          #header Add New Project
          #project-close-button
            i.fa.fa-times
        #content add new project
        #project-form-wrapper
          form#project-form(@submit.prevent="getProjectFormValues")
            input.input(type="text", placeholder="project name", name="name")
            input.input(type="text", placeholder="description", name="description")
            input.input(type="date", name="date")
            input.input(type="time", name="time")
            select.input(placeholder="linked course", name="course")
              option(value="none") None
              option(v-for="cor in courses", :value="cor.code", :key="cor._id") {{ cor.code }} - {{ cor.name }}
            input.button(type="submit", value="Add")
    #floating-box-wrapper(v-bind:class="{ invisible: hide_editproject }")
      #floating-box.edit-project-box
        #header-wrapper
          #header Edit Project
          #edit-project-close-button
            i.fa.fa-times
        #content Make changes to the project
        #project-form-wrapper
          form#edit-project-form(@submit.prevent="getEditProjectFormValues")
            input.input(type="hidden", placeholder="id", name="id")
            input.input(type="text", placeholder="project name", name="name")
            input.input(type="text", placeholder="description", name="description")
            input.input(type="date", name="date")
            input.input(type="time", name="time")
            select.input(placeholder="linked course", name="course")
              option(value="none") None
              option(v-for="cor in courses", :value=" cor.code ", :key="cor._id") {{ cor.code }} - {{ cor.name }}
            #wrapper
              input.button(type="button", value="DELETE", v-on:click="deleteProject", style="background: red !important;")
              input.button(type="submit", value="Edit")
    #floating-box-wrapper(v-bind:class="{ invisible: hide_newtodo }")
      #floating-box.todo-box
        #header-wrapper
          #header Add New Todo
          #todo-close-button
            i.fa.fa-times
        #content add new todo
        #project-form-wrapper
          form#todo-form(@submit.prevent="getTodoFormValues")
            input.input(type="text", placeholder="todo name", name="name")
            input.input(type="text", placeholder="description", name="description")
            select.input(placeholder="linked course", name="course")
              option(value="none") None
              option(v-for="cor in courses", :value="cor.code", :key="cor._id") {{ cor.code }} - {{ cor.name }}
            input.button(type="submit", value="Add")
    #floating-box-wrapper(v-bind:class="{ invisible: hide_edittodo }")
      #floating-box.edit-todo-box
        #header-wrapper
          #header Edit Todo
          #edit-todo-close-button
            i.fa.fa-times
        #content Make changes to the todo
        #project-form-wrapper
          form#edit-todo-form(@submit.prevent="getEditTodoFormValues")
            input.input(type="hidden", placeholder="id", name="id")
            input.input(type="text", placeholder="todo name", name="name")
            input.input(type="text", placeholder="description", name="description")
            select.input(placeholder="linked course", name="course")
              option(value="none") None
              option(v-for="cor in courses", :value=" cor.code ", :key="cor._id") {{ cor.code }} - {{ cor.name }}
            #wrapper
              input.button(type="button", value="DELETE", v-on:click="deleteTodo", style="background: red !important;")
              input.button(type="submit", value="Edit")
    #info-container
      #weather-container
        i.wi(v-bind:class="weathericon")
        span {{ weathertemp }} {{ weatherstr }}
      #date-container
        span {{ datestr }}
      #time-container
        span {{ time }}
    #summary-container
      h1 Summary
      #summary-wrapper
        #summary.classes(style="color: #004c99")
          #summary-graphic
            span {{ courses_today.length }}
          span Classes
        #summary.classes(style="color: #c53320")
          #summary-graphic
            span {{ projects_today.length }}
          span Projects
        #summary.classes(style="color: #ca6614")
          #summary-graphic
            span {{ all_todo.length }}
          span To-Dos
    #schedule-container
      h1 Schedule
      #schedule-wrapper
        #daybreak Today
        #linebreak
        router-link.item-wrapper(v-for="course in courses_today", v-bind:to="'/course/' + course.code.toUpperCase()", :key="course._id")
          .item(v-bind:class="{classDone: ((new Date(course.endTime)) - (new Date()) < 0)}", :style="{'background-color': '#' + course.color + '40', 'border-left': '10px solid ' + '#' + course.color + 'ff' }")
            .event-name {{ course.name + " " + course.type }}
            .event-location {{ course.location }}
            .event-time {{ (new Date(course.startTime)).toLocaleTimeString() }} - {{ (new Date(course.endTime)).toLocaleTimeString() }}
            .icon(:style="{'color': '#' + course.colour}")
              i.fa(v-bind:class="'fa-' + course.icon")
        #daybreak Tomorrow
        #linebreak
        router-link.item-wrapper(v-for="course in courses_tomorrow", v-bind:to="'/course/' + course.code.toUpperCase()", :key="course._id")
          .item(:style="{'background-color': '#' + course.color + '40', 'border-left': '10px solid ' + '#' + course.color + 'ff' }")
            .event-name {{ course.name + " " + course.type }}
            .event-location {{ course.location }}
            .event-time {{ (new Date(course.startTime)).toLocaleTimeString() }} - {{ (new Date(course.endTime)).toLocaleTimeString() }}
            .icon(:style="{'color': '#' + course.colour}")
              i.fa(v-bind:class="'fa-' + course.icon")
    #projects-container
      #header-wrapper
        h1 Projects
        button.button#new-project() +
      #projects-wrapper
        #daybreak Past Due
        #linebreak
        .project(v-for="project in projects_past", :key="project._id", :style="{'background-color': '#' + project.color + '40', 'border-left': '10px solid ' + '#' + project.color + 'ff' }")
          .project-name {{ project.name }}
          .project-course {{ project.coursename }}
          .project-due {{  (new Date(project.duedate)).toLocaleString() }}
          .project-warning
            i.fa.fa-cog(v-on:click="editProject(project)")
            i.fa.fa-check(v-on:click="markDoneProject(project)")
          .project-progress
        #daybreak Due Today
        #linebreak
        .project(v-for="project in projects_today", :key="project._id", :style="{'background-color': '#' + project.color + '40', 'border-left': '10px solid ' + '#' + project.color + 'ff' }")
          .project-name {{ project.name }}
          .project-course {{ project.coursename }}
          .project-due {{  (new Date(project.duedate)).toLocaleString() }}
          .project-warning
            i.fa.fa-cog(v-on:click="editProject(project)")
            i.fa.fa-check(v-on:click="markDoneProject(project)")
          .project-progress
        #daybreak Due Upcoming
        #linebreak
        .project(v-for="project in projects_upcoming", :key="project._id", :style="{'background-color': '#' + project.color + '40', 'border-left': '10px solid ' + '#' + project.color + 'ff' }")
          .project-name {{ project.name }}
          .project-course {{ project.coursename }}
          .project-due {{  (new Date(project.duedate)).toLocaleString() }}
          .project-warning
            i.fa.fa-cog(v-on:click="editProject(project)")
            i.fa.fa-check(v-on:click="markDoneProject(project)")
          .project-progress
    #todo-container
      #header-wrapper
        h1 To-Do
        button.button#new-todo() +
      #todo-wrapper
        .todo(v-for="todo in all_todo", v-on:click="editTodo(todo)", :key="todo._id", :style="{'background-color': '#' + todo.color + '40', 'border-left': '10px solid ' + '#' + todo.color + 'ff' }")
          .todo-name {{ todo.name }}
          .todo-course {{ todo.coursename }}
          .todo-description {{ todo.description }}
</template>

<script>
const {ipcRenderer, remote} = window.require('electron')
const { dialog } = remote
let $ = window.document.querySelector.bind(document)

function Get ($url, $method, $callback, $json) {
  $json = $json || false
  let xmlhttp
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest()
  }
  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if ($json) {
        $callback(JSON.parse(this.responseText))
      } else {
        $callback(this.responseText)
      }
    }
  }
  xmlhttp.open($method, $url, true)
  xmlhttp.send()
}

function pad (x) {
  return (x < 10 ? '0' : '') + x
}
function timeFormat (dob) {
  return (
    pad(dob.getHours()) +
    ':' +
    pad(dob.getMinutes()) +
    ':' +
    pad(dob.getSeconds())
  )
}

function dateFormat (dob) {
  return dob.toDateString()
}

export default {
  name: 'Home',
  data () {
    return {
      popup_title: 'Title',
      popup_content: 'Message',
      time: timeFormat(new Date()),
      datestr: dateFormat(new Date()),
      weatherstr: 'Loading Weather...',
      weathertemp: '',
      weathericon: 'wi',
      courses: [],
      courses_today: [],
      courses_tomorrow: [],
      projects_past: [],
      projects_today: [],
      projects_upcoming: [],
      all_todo: [],
      hide_newproject: true,
      hide_editproject: true,
      hide_newtodo: true,
      hide_edittodo: true
    }
  },
  methods: {
    getProjectFormValues (submitEvent) {
      let es = submitEvent.target.elements
      ipcRenderer.send('add-new-project', {
        name: es.name.value,
        description: es.description.value,
        date: es.date.value,
        time: es.time.value,
        course: es.course.value
      })
    },
    getEditProjectFormValues (submitEvent) {
      let es = submitEvent.target.elements
      ipcRenderer.send('edit-project', {
        id: es.id.value, // ID from db for reference
        name: es.name.value,
        description: es.description.value,
        date: es.date.value,
        time: es.time.value,
        course: es.course.value
      })
    },
    editProject (project) {
      let form = $('#edit-project-form').children
      let ddo = new Date(project.duedate)
      form.name.value = project.name
      form.description.value = project.description
      form.date.value = ddo.getFullYear() + '-' + pad(ddo.getMonth() + 1) + '-' + pad(ddo.getDate())
      form.time.value = pad(ddo.getHours()) + ':' + pad(ddo.getMinutes()) + ':' + pad(ddo.getSeconds())
      form.id.value = project._id
      form.course.value = project.course
      this.hide_editproject = false
    },
    markDoneProject (project) {
      dialog.showMessageBox({
        type: 'question',
        title: 'Mark as Done',
        message: 'Are you sure you want to delete this?',
        buttons: ['No', 'Yes']
      }, (response) => {
        if (response === 1) {
          ipcRenderer.send('delete-project', project._id)
        }
      })
    },
    deleteProject (data) {
      ipcRenderer.send('delete-project', data.srcElement.parentNode.parentElement.id.value)
    },
    deleteTodo (data) {
      ipcRenderer.send('delete-todo', data.srcElement.parentNode.parentElement.id.value)
    },
    getTodoFormValues (submitEvent) {
      let es = submitEvent.target.elements
      ipcRenderer.send('add-todo', {
        name: es.name.value,
        description: es.description.value,
        course: es.course.value
      })
    },
    getEditTodoFormValues (submitEvent) {
      let es = submitEvent.target.elements
      ipcRenderer.send('edit-todo', {
        id: es.id.value, // ID from db for reference
        name: es.name.value,
        description: es.description.value,
        course: es.course.value
      })
    },
    editTodo (todo) {
      let form = $('#edit-todo-form').children
      form.name.value = todo.name
      form.description.value = todo.description
      form.id.value = todo._id
      form.course.value = todo.course
      this.hide_edittodo = false
    },
    getWeather () {
      Get(
        'http://api.wunderground.com/api/bbed11284ee97594/conditions/q/autoip.json',
        'GET',
        $data => {
          let cur = $data.current_observation
          this.weathertemp = cur.temp_c + '°C'
          this.weatherstr = cur.weather
          this.weathericon = 'wi-wu-' + cur.icon
        },
        true
      )
    }
  },
  mounted () {
    let context = this
    $('#new-project').onclick = function () {
      context.hide_newproject = false
    }
    $('#new-todo').onclick = function () {
      context.hide_newtodo = false
    }
    $('#project-close-button').onclick = function () {
      context.hide_newproject = true
    }
    $('#edit-project-close-button').onclick = function () {
      context.hide_editproject = true
    }
    $('#todo-close-button').onclick = function () {
      context.hide_newtodo = true
    }
    $('#edit-todo-close-button').onclick = function () {
      context.hide_edittodo = true
    }

    ipcRenderer.on('project-added', (event, arg) => {
      context.hide_newproject = true
    })
    ipcRenderer.on('project-deleted', (event, arg) => {
      context.hide_editproject = true
    })
    ipcRenderer.on('project-edited', (event, arg) => {
      context.hide_editproject = true
      let children = $('#edit-project-form').children
      for (let i = 0; i < children.length; i++) {
        if (children[i].type !== 'submit') {
          children[i].value = ''
        }
      }
    })
    ipcRenderer.on('not-logged-in', (event, arg) => {
      this.$router.push('/login')
    })
    ipcRenderer.on('give-courses', (event, arg) => {
      this.courses = arg
    })
    ipcRenderer.on('give-courses-today', (event, arg) => {
      this.courses_today = arg
    })
    ipcRenderer.on('give-courses-tomorrow', (event, arg) => {
      this.courses_tomorrow = arg
    })
    ipcRenderer.on('give-projects-past', (event, arg) => {
      this.projects_past = arg
    })
    ipcRenderer.on('give-projects-today', (event, arg) => {
      this.projects_today = arg
    })
    ipcRenderer.on('give-projects-upcoming', (event, arg) => {
      this.projects_upcoming = arg
    })
    ipcRenderer.on('give-todo', (event, arg) => {
      this.all_todo = arg
    })
    ipcRenderer.on('todo-added', (event, arg) => {
      context.hide_newtodo = true
    })
    ipcRenderer.on('todo-deleted', (event, arg) => {
      context.hide_edittodo = true
    })
    ipcRenderer.on('todo-edited', (event, arg) => {
      context.hide_edittodo = true
      let children = $('#edit-todo-form').children
      for (let i = 0; i < children.length; i++) {
        if (children[i].type !== 'submit') {
          children[i].value = ''
        }
      }
    })
    ipcRenderer.send('check-login')
    setInterval(() => {
      ipcRenderer.send('get-courses')
      ipcRenderer.send('get-todo')
      ipcRenderer.send('get-courses-today')
      ipcRenderer.send('get-courses-tomorrow')
      ipcRenderer.send('get-projects-past')
      ipcRenderer.send('get-projects-today')
      ipcRenderer.send('get-projects-upcoming')
    }, 500)
    this.getWeather()
    setInterval(() => {
      this.getWeather()
    }, 900 * 1000)
    setInterval(() => {
      this.time = timeFormat(new Date())
      this.datestr = dateFormat(new Date())
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/forms";
@import "../sass/colours";
@import "../sass/animations";
a {
  text-decoration: none;
  color: inherit;
}
#home-container {
  color: black;
  display: grid;
  grid-template-areas:
    "a a a a a a"
    "c c f f b b"
    "c c g g b b"
    "c c g g b b"
    "c c g g b b";
  grid-template-rows: 50px 1fr 1fr 1fr 1fr;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1em;
  height: 94vh;
  width: 100%;

  .invisible {
    display: none !important;
    opacity: 0 !important;
  }
  .classDone {
    text-decoration: line-through;
  }
  #wrapper {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 1em;
  }
  #floating-box-wrapper {
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    display: flex;
    opacity: 1;
    transition: all 1s;
    justify-content: center;
    align-items: center;
    #floating-box.todo-box {
      width: 700px;
      // height: 450px;
    }
    #floating-box.project-box {
      width: 700px;
      // height: 600px;
    }
    #floating-box {
      width: 700px;
      // height: 600px;
      background: white;
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.7);
      border-radius: 3px;
      overflow: hidden;
      #header-wrapper {
        display: grid;
        grid-template-columns: auto 50px;
        background: $colourMain;
        color: white;
        #header {
          font-size: 2em;
          margin: 0.25em;
        }
        #project-close-button,
        #todo-close-button,
        #edit-project-close-button,
        #edit-todo-close-button {
          width: 50px;
          height: 100%;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          background: red;
          transition: all 0.3s;
          &:hover {
            opacity: 0.8;
            i {
              cursor: pointer;
            }
            cursor: pointer;
          }
        }
      }
      #content {
        margin: 1em;
        font-size: 1.4;
      }
      #project-form-wrapper {
        margin: 1.5em;
        form {
          display: grid;
          grid-gap: 1.5em;
        }
      }
    }
  }

  & > #projects-container {
    grid-template-rows: 50px auto;
  }
  & > * {
    display: grid;
    grid-template-rows: 35px auto;
    grid-template-areas: "title" "content";
    color: $main-text-colour;
    background: $background;
    border: 1px solid $main-border;
    padding: 0.5em;
    overflow-y: auto;
    #header-wrapper {
      display: grid;
      grid-template-columns: auto 50px;
      grid-template-areas: "title button";
      width: 100%;
      background: $background;
      position: sticky;
      top: 0px;
      h1 {
        font-size: 22px;
        grid-area: title;
      }
      button {
        background-color: $colourMain;
        grid-area: button;
        color: white;
        font-size: 2em;
        padding: 0em;
        margin: 0.1em;
        border: none;
        cursor: pointer;
        opacity: 0.9;
        border-radius: 50%;
        transition: all 0.3s;
      }
      button:hover {
        opacity: 1;
        border-radius: 10%;
      }
    }
    h1 {
      width: 100%;
      background: $background;
      border-bottom: 1px solid $main-border;
      padding-bottom: 1em;
      font-size: 22px;
      grid-area: title;
      position: sticky;
      top: 0px;
    }
  }
  #info-container {
    grid-area: a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    font-size: 18px;
    & > * {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
    }
    span {
      font-size: 1.2em;
    }
    #weather-container {
      justify-content: flex-start;
      i {
        font-size: 1.5em;
        margin-left: 0.5em;
      }
      span {
        margin-left: 0.5em;
      }
    }
    #date-container {
      justify-content: center;
    }
    #time-container {
      justify-content: flex-end;
      span {
        margin-right: 1em;
      }
    }
  }
  #summary-container {
    grid-area: f;
    #summary-wrapper {
      display: grid;
      grid-template-areas: "a b c";
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 1fr;
      grid-gap: 1em;
      #summary {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 2.7vh;
        #summary-graphic {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 7px solid currentColor;
          border-bottom-color: transparent;
          border-radius: 50%;
          width: 6.5vh;
          height: 6.5vh;
          span {
            font-size: 2em;
          }
        }
      }
    }
  }
  #schedule-container {
    grid-area: c;
    #schedule-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      padding-left: 1em;
      padding-right: 1em;
      #daybreak {
        width: 100%;
        padding: 0.8em;
      }
      #linebreak {
        width: 100%;
        height: 0;
        border-bottom: 1px solid $main-border;
        margin-bottom: 0.5em;
      }
      .item-wrapper {
        width: 100%;
        margin-top: 0.5em;
        margin-bottom: 0.5em;

        .item {
          display: grid;
          grid-template-areas: "a g" "b g" "c g";
          grid-template-columns: 5fr 1fr;
          grid-template-rows: 3fr 2fr 2fr;
          padding: 0.3em 0;
          width: calc(100% - 10px);
          border-left: 10px solid #ff0000ff;
          font-size: 16px;
          transition: all 0.3s;
          &:hover {
            margin-left: 1em;
          }
          & > * {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
          .event-name {
            grid-area: a;
            padding-left: 16px;
            font-size: 18px;
            font-weight: bold;
          }
          .event-location {
            grid-area: b;
            padding-left: 16px;
            font-style: italic;
          }
          .event-time {
            grid-area: c;
            padding-left: 16px;
          }
          .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            grid-area: g;
            font-size: 32px;
          }
        }
      }
    }
  }
  #projects-container {
    grid-area: b;
    #projects-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      padding-left: 1em;
      padding-right: 1em;
      #daybreak {
        width: 100%;
        padding: 0.8em;
      }
      #linebreak {
        width: 100%;
        height: 0;
        border-bottom: 1px solid $main-border;
        margin-bottom: 0.5em;
      }
      .project {
        display: grid;
        grid-template-areas: "a a h"
                             "b b h"
                             "c c h"
                             "d d d";
        grid-template-columns: 3fr 2fr 1fr;
        grid-template-rows: 3fr 2fr 2fr 1fr;
        border-left: 10px solid rgba(34, 150, 34, 1);
        background: rgba(34, 150, 34, 0.2);
        width: 100%;
        transition: all 0.3s;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
        padding: 0.25em 0;
        font-size: 16px;
        &:hover {
          .project-warning {
            opacity: 1;
          }
        }
        & > * {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          font-size: 16px;
        }
        .project-name {
          grid-area: a;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-left: 16px;
          font-size: 20px;
          font-weight: bold;
        }
        .project-course {
          grid-area: b;
          margin-left: 16px;
        }
        .project-due {
          grid-area: c;
          margin-left: 16px;
        }
        .project-warning {
          opacity: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          grid-area: h;
          font-size: 24px;
          transition: all 0.3s;
          & > * {
            margin-top:5px;
            margin-bottom:5px;
            transition: all 0.8s;
            &:hover {
              transform: rotate(360deg);
              cursor: pointer;
              .project-name {
                text-decoration: line-through;
              }
            }
          }
        }
        .project-progress {
          grid-area: d;
          //background: black;
        }
      }
    }
  }
  #todo-container {
    grid-area: g;
    #todo-wrapper {
      margin-top: 1em;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      padding-left: 1em;
      padding-right: 1em;
      .todo {
        display: grid;
        grid-template-areas: "a a h"
                             "b b h"
                             "c c c";
        grid-template-columns: auto auto auto;
        grid-template-rows: auto auto auto;
        grid-row-gap: 0.5em;
        border-left: 10px solid rgba(34, 150, 34, 1);
        background: rgba(34, 150, 34, 0.2);
        width: 100%;
        transition: all 0.3s;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
        padding: 0.25em 0;
        font-size: 16px;
        &:hover {
          margin-left: 1em;
        }
        & > * {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          font-size: 16px;
        }
        .todo-name {
          grid-area: a;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-left: 16px;
          font-size: 20px;
          font-weight: bold;
        }
        .todo-course {
          grid-area: b;
          margin-left: 16px;
          font-style: italic;
        }
        .todo-description {
          grid-area: c;
          margin-left: 16px;
        }
      }
    }
  }
}
</style>
