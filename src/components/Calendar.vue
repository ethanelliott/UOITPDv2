<template lang="jade">
  #calendar-container
    #calendar-card
      full-calendar(v-bind:config="config", v-bind:events="events")
</template>

<script>
import 'fullcalendar/dist/fullcalendar.css'
import moment from 'moment'
const {remote, ipcRenderer} = window.require('electron')
const BrowserWindow = remote.BrowserWindow

export default {
  name: 'Calendar',
  data () {
    let context = this;
    return {
      title: 'Calendar',
      events: [],
      config: {
        header: {
          left: 'prev, next today',
          center: 'title',
          right: ''
        },
        defaultView: 'agendaWeek',
        nowIndicator: true,
        selectable: false,
        editable: false,
        businessHours: {
          dow: [1, 2, 3, 4, 5],
          start: '8:00',
          end: '21:00'
        },
        eventRender: function (event, element) { },
        eventClick: function(calEvent, jsEvent, view) {
          context.$router.push('/course/' + calEvent.code)
        }
      }
    }
  },
  mounted() {
    ipcRenderer.send('get-calendar')
    ipcRenderer.on('give-calendar', (event, arg) => {
      let eventArray = []
      for(let i = 0; i < arg.length; i++) {
        let course = arg[i]
        eventArray.push({
          code: course.code,
          title: course.name + " " + course.type, // + "\n" + "SIRC2020B",
          location: "SIRC2020B",
          start: moment(course.startTime),
          end: moment(course.endTime),
          color: "#" + course.color
        })
      }
      this.events = eventArray
    })
  }
}
</script>
<style lang="scss" scoped>
@import "../sass/colours";
#calendar-container {
  display: grid;
  grid-template-areas: "a" "b";
  grid-template-rows:10px auto;
  h1 {
    grid-area:a;
  }
  #calendar-card {
    grid-area: b;
    display:flex;
    justify-content: center;
    align-items:center;
    color:black;
    background: $background;
    border: 1px solid $main-border;
  }
  #calendar {
    width:95%;
  }
}
</style>
