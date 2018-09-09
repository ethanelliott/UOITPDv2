<template lang="jade">
  #home-container
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
            span 0
          span Projects
        #summary.classes(style="color: #ca6614")
          #summary-graphic
            span 0
          span To-Dos
    #schedule-container
      h1 Schedule
      #schedule-wrapper
        #daybreak Today
        #linebreak
        .item-wrapper(v-for="course in courses_today")
          .item(:style="{'background-color': '#' + course.colour + '40', 'border-left': '10px solid ' + '#' + course.colour + 'ff' }")
            .event-name {{ course.name + " " + course.type }}
            .event-location {{ course.place }}
            .event-time {{ (new Date(course.startTime)).toLocaleTimeString() }} - {{ (new Date(course.endTime)).toLocaleTimeString() }}
            .icon(:style="{'color': '#' + course.colour}")
              i.fa(v-bind:class="'fa-' + course.icon")
        #daybreak Tomorrow
        #linebreak
        .item-wrapper(v-for="course in courses_tomorrow")
          .item(:style="{'background-color': '#' + course.colour + '40', 'border-left': '10px solid ' + '#' + course.colour + 'ff' }")
            .event-name {{ course.name + " " + course.type }}
            .event-location {{ course.place }}
            .event-time {{ (new Date(course.startTime)).toLocaleTimeString() }} - {{ (new Date(course.endTime)).toLocaleTimeString() }}
            .icon(:style="{'color': '#' + course.colour}")
              i.fa(v-bind:class="'fa-' + course.icon")
    #projects-container
      h1 Projects
      #projects-wrapper
        #daybreak Soon
        #linebreak
        .project
          .project-name Project Name
          .project-course Course
          .project-due On this date
          .project-warning
            i.fa.fa-warning
          .project-progress
        #daybreak Upcoming
        #linebreak
    #todo-container
      h1 To-Do
</template>

<script>
const {remote, ipcRenderer} = window.require('electron')
const BrowserWindow = remote.BrowserWindow

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
  return pad(dob.getHours()) + ':' + pad(dob.getMinutes()) + ':' + pad(dob.getSeconds())
}

function dateFormat (dob) {
  return dob.toDateString()
}

export default {
  name: 'Home',
  data () {
    return {
      time: timeFormat(new Date()),
      datestr: dateFormat(new Date()),
      weatherstr: 'Loading Weather...',
      // eslint-disable-next-line
      weathertemp: '',
      weathericon: 'wi',
      courses_today: [],
      courses_tomorrow: []
    }
  },
  methods: {
    getWeather () {
      Get('http://api.wunderground.com/api/bbed11284ee97594/conditions/q/autoip.json', 'GET', ($data) => {
        let cur = $data.current_observation
        this.weathertemp = cur.temp_c + '°C'
        this.weatherstr = cur.weather
        this.weathericon = 'wi-wu-' + cur.icon
      }, true)
    }
  },
  mounted () {
    ipcRenderer.send("check-login")
    ipcRenderer.on('not-logged-in', (event, arg) => {
      this.$router.push('/login')
    })

    ipcRenderer.send("get-courses-today")
    ipcRenderer.on('give-courses-today', (event, arg) => {
      this.courses_today = arg
    })
    ipcRenderer.send("get-courses-tomorrow")
    ipcRenderer.on('give-courses-tomorrow', (event, arg) => {
      this.courses_tomorrow = arg
    })

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
  @import "../sass/colours";
  #home-container {
    color:black;
    display: grid;
    grid-template-areas: "a a a a a a"
                         "c c f f b b"
                         "c c g g b b"
                         "c c g g b b"
                         "c c g g b b";
    grid-template-rows: 50px 1fr 1fr 1fr 1fr;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 1em;
    height:94vh;
    width:100%;
    & > * {
      display:grid;
      grid-template-rows: 25px auto;
      grid-template-areas: "title" "content";
      color:$main-text-colour;
      background: $background;
      border: 1px solid $main-border;
      padding:0.5em;
      overflow-y: auto;
      h1 {
        width:100%;
        background: $background;
        border-bottom: 1px solid $main-border;
        padding-bottom: 0.25em;
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
      align-items:center;
      flex-direction: row;
      font-size: 18px;
      & > * {
        height: 100%;
        width:100%;
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
          margin-left:0.5em;
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
        display:grid;
        grid-template-areas: "a b c";
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr;
        grid-gap: 1em;
        #summary {
          display:flex;
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
            width:6.5vh;
            height:6.5vh;
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
        padding-left:1em;
        padding-right:1em;
        #daybreak {
          width:100%;
          padding:0.8em;
        }
        #linebreak {
          width:100%;
          height:0;
          border-bottom:1px solid $main-border;
          margin-bottom:0.5em;
        }
        .item-wrapper {
          width: 100%;
          margin-top:0.5em;
          margin-bottom:0.5em;

          .item {
          display: grid;
          grid-template-areas: "a g" "b g" "c g";
          grid-template-columns: 5fr 1fr;
          grid-template-rows: 3fr 2fr 2fr;
          padding: 0.3em 0;
          width: calc(100% - 10px);
          border-left: 10px solid #ff0000ff;
          font-size:16px;
          transition: all 0.3s;
          &:hover {
            margin-left:1em;
          }
          & > * {
            display:flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
          .event-name {
            grid-area: a;
            padding-left:16px;
            font-size:18px;
            font-weight: bold;
          }
          .event-location {
            grid-area: b;
            padding-left:16px;
            font-style: italic;
          }
          .event-time {
            grid-area: c;
            padding-left:16px;
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
        padding-left:1em;
        padding-right:1em;
        #daybreak {
          width:100%;
          padding:0.8em;
        }
        #linebreak {
          width:100%;
          height:0;
          border-bottom:1px solid $main-border;
          margin-bottom:0.5em;
        }
        .project {
          display: grid;
          grid-template-areas: "a a h" "b b h" "c c h" "d d d";
          grid-template-columns: 2fr 2fr 1fr;
          grid-template-rows: 3fr 2fr 2fr 1fr;
          border-left: 10px solid rgba(34, 150, 34, 1);
          background: rgba(34, 150, 34, 0.2);
          height:90px;
          width:100%;
          transition: all 0.3s;
          margin-top:0.5em;
          margin-bottom:0.5em;
          font-size:16px;
          &:hover {
            margin-left:1em;
          }
          & > * {
            display:flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            font-size:16px;
          }
          .project-name {
            grid-area: a;
            margin-left:16px;
            font-size:18px;
            font-weight: bold;
          }
          .project-course {
            grid-area: b;
            margin-left:16px;
          }
          .project-due {
            grid-area: c;
            margin-left:16px;
          }
          .project-warning {
            display: flex;
            justify-content: center;
            align-items: center;
            grid-area: h;
            font-size:32px;
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
    }
  }
</style>
