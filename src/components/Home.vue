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
            span 4
          span Classes
        #summary.classes(style="color: #c53320")
          #summary-graphic
            span 1
          span Projects
        #summary.classes(style="color: #ca6614")
          #summary-graphic
            span 2
          span To-Dos
        #week-of-work
          .day
          .day
          .day
          .day
          .day
          .day
          .day
    #schedule-container
      h1 Schedule
      #schedule-wrapper
        #daybreak Today
        #linebreak
        .item
          .event-name SOFE2720 Lecture
          .event-location UA1350
          .event-time 11:10am - 12:30pm
          .icon
            i.fa.fa-book
        .item
          .event-name SOFE2720 Tutorial
          .event-location UA1350
          .event-time 11:10am - 12:30pm
          .icon
            i.fa.fa-book
        #daybreak Tomorrow
        #linebreak
        .item
          .event-name SOFE2720 Lecture
          .event-location UA1350
          .event-time 11:10am - 12:30pm
          .icon
            i.fa.fa-book
        .item
          .event-name SOFE2720 Tutorial
          .event-location UA1350
          .event-time 11:10am - 12:30pm
          .icon
            i.fa.fa-book
        .item
          .event-name SOFE2720 Tutorial
          .event-location UA1350
          .event-time 11:10am - 12:30pm
          .icon
            i.fa.fa-book
    #projects-container
      h1 Projects
      #projects-wrapper
        .project
          .project-name Project Name
          .project-course Course
          .project-due On this date
          .project-warning
            i.fa.fa-warning
          .project-progress
        .project
          .project-name Project Name
          .project-course Course
          .project-due On this date
          .project-warning
            i.fa.fa-warning
          .project-progress
    #note-container
      h1 Notes
      #notes-wrapper
        .note
    #todo-container
      h1 To-Do
</template>

<script>
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
      weathertemp: (1 + 2 === 3 ? '' : '25°C'),
      weathericon: 'wi'
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
  @import "colours";
  #home-container {
    color:#ca6614;
    display: grid;
    grid-template-areas: "a a a a a a" "f f c c d d" "b b c c d d" "b b c c g g";
    grid-template-rows: 50px 1fr 1fr 1fr;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 1em;
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
        font-size: 22px;
        grid-area: title;
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
        grid-template-areas: "a b c" "d d d";
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 3fr 1fr;
        grid-gap: 1em;
        #summary {
          display:flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-size: 2.8vh;
          #summary-graphic {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 7px solid currentColor;
            border-bottom-color: transparent;
            border-radius: 50%;
            width:7vh;
            height:7vh;
            span {
              font-size: 2em;
            }
          }
        }
        #week-of-work {
          grid-area: d;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: 1fr;
          grid-gap: 1em;
          & > * {
            background: #229622;
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
        .item {
          display: grid;
          grid-template-areas: "a g" "b g" "c g";
          grid-template-columns: 5fr 1fr;
          grid-template-rows: 3fr 2fr 2fr;
          height:80px;
          width: 100%;
          margin-top:0.5em;
          margin-bottom:0.5em;
          border-left: 10px solid red;
          background: rgba(255, 0, 0, 0.4);
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
    #projects-container {
      grid-area: b;
      #projects-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        padding-left:1em;
        padding-right:1em;
        .project {
          display: grid;
          grid-template-areas: "a a h" "b b h" "c c h" "d d d";
          grid-template-columns: 2fr 2fr 1fr;
          grid-template-rows: 3fr 2fr 2fr 1fr;
          border-left: 10px solid rgba(34, 150, 34, 1);
          background: rgba(34, 150, 34, 0.4);
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
            background: black;
          }
        }
      }
    }
    #todo-container {
      grid-area: g;
    }
    #note-container {
      grid-area: d;
      #notes-wrapper {
        .note {}
      }
    }
  }
</style>
