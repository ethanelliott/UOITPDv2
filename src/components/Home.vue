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
    #schedule-container
      h1 Schedule
    #todo-container
      h1 To-Do
    #something-container
      h1 Something
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
  #home-container {
    display: grid;
    grid-template-areas: "a a a a" "b b c c" "d d d d";
    grid-template-rows: 50px calc(75% - 60px) calc(25% - 60px);
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1.5em;
    & > *:not(#info-container) {
      display:flex;
      justify-content: center;
      align-items:center;
      color:black;
      background:rgb(245, 245, 245);
      border-radius: 3px;
      box-shadow: 0 0 10px 1px rgba(0,0,0,0.5);
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
        font-size: 1.25em;
      }
      #weather-container {
        justify-content: flex-start;
        i {
          font-size: 2em;
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
    #schedule-container {
      grid-area: b;
    }
    #todo-container {
      grid-area: c;
    }
    #something-container {
      grid-area: d;
    }
  }
</style>
