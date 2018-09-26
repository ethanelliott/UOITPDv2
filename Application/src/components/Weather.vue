<template lang="jade">
  #weather-container
    #current-weather-container
      h1.title Current Weather
      #weather-icon-container
        i.wi(v-bind:class="weathericon")
      #weather-temp-container
        span.temp {{ weathertemp }}
        span.condition {{ weatherstr }}
      #weather-current-pressure-container.weather-info-block
        span.info-identifier Presure
        i.wi.wi-barometer.info-icon
        span.info-value {{ weatherpressure }}
      #weather-current-humidity-container.weather-info-block
        span.info-identifier Humidity
        i.wi.wi-humidity.info-icon
        span.info-value {{ weatherhumidity }}
      #weather-current-wind-container.weather-info-block
        span.info-identifier Wind
        i.wi.wi-wind-direction.info-icon
        span.info-value {{ weatherwind }}
      #weather-current-precip-container.weather-info-block
        span.info-identifier Sunrise
        i.wi.wi-sunrise.info-icon
        span.info-value {{ weathersunrise }}
      #weather-current-sunset-container.weather-info-block
        span.info-identifier Sunset
        i.wi.wi-sunset.info-icon
        span.info-value {{ weathersunset }}
    #forecast-weather-container
      h1.title Forecast
      #forcast-row(v-for="day in forecast")
        #icon
          i.wi(v-bind:class="'wi-wu-' + day.icon")
        #condition {{ day.date.weekday }} - {{ day.conditions }}

    #weather-radar-container
      iframe(style="width:100%;height:100%;",src="https://maps.darksky.net/@radar,2018-5-23,17,43.750702,-79.300301,8?embed=true&amp;timeControl=false&amp;fieldControl=false&amp;defaultField=radar")
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

export default {
  name: 'Weather',
  data () {
    return {
      weathertemp: '',
      weatherstr: '',
      weathericon: '',
      weatherpressure: '',
      weatherhumidity: '',
      weatherwind: '',
      weathersunrise: '',
      weathersunset: '',
      forecast: []
    }
  },
  mounted () {
    this.getWeather()
    setInterval(() => {
      this.getWeather()
    }, 900000)
  },
  methods: {
    getWeather () {
      Get('http://api.wunderground.com/api/bbed11284ee97594/conditions/alerts/hourly/forecast10day/astronomy/q/autoip.json', 'GET', ($data) => {
        let cur = $data.current_observation
        let forecastData = $data.forecast.simpleforecast.forecastday
        let outArr = []
        for (let i = 0; i < 8; i++) {
          outArr.push(forecastData[i])
        }
        console.log(outArr)
        this.forecast = outArr
        this.weathertemp = cur.temp_c + '°C'
        this.weatherstr = cur.weather
        this.weathericon = 'wi-wu-' + cur.icon
        this.weatherpressure = cur.pressure_mb
        this.weatherhumidity = cur.relative_humidity
        this.weatherwind = cur.wind_kph + 'km/h ' + cur.wind_dir
        this.weathersunrise = $data.sun_phase.sunrise.hour + ':' + $data.sun_phase.sunrise.minute
        this.weathersunset = $data.sun_phase.sunset.hour + ':' + $data.sun_phase.sunset.minute
      }, true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/colours";
iframe {
  border:none;
}
#weather-container {
  display: grid;
  grid-template-areas: "a b" "c b";
  grid-template-columns: calc(50% - .5em) calc(50% - .5em);
  grid-template-rows: calc(50% - .5em) calc(50% - .5em);
  grid-gap: 1em;
  & > * {
    color:black;
    background: $background;
    border: 1px solid $main-border;
    &:not(#weather-radar-container) {
      padding:1em;
    }
  }
  #current-weather-container {
    grid-area: a;
    display: grid;
    grid-template-rows: 30px auto calc(40% - 30px);
    grid-template-columns: repeat(5, 20%);
    grid-template-areas: "a a a a a" "b b c c c" "d e f g h";
    font-size:14px;
    & > *:not(.title) {
      display:flex;
      justify-content: center;
      flex-direction: column;
    }
    .title {
      grid-area: a;
    }
    #weather-icon-container {
      grid-area: b;
      font-size: calc((100vw + 100vh) / 22);
      align-items: center;
    }
    #weather-temp-container {
      grid-area: c;
      align-items: center;
      .temp {
        font-size: calc((100vw + 100vh) / 30);
      }
      .condition {
        font-size: calc((100vw + 100vh) / 60);
      }
    }
    .weather-info-block {
      align-items: center;
      justify-content: space-around;
      font-size: calc((100vw + 100vh) / 140);
      .info-identifier {
        font-size: 1em;
      }
      .info-icon {
        font-size: 2em;
      }
      .info-value {
        font-size:1em;
      }
    }
    #weather-current-pressure-container {
      grid-area: d;
    }
    #weather-current-humidity-container {
      grid-area: e;
    }
    #weather-current-wind-container {
      grid-area: f;
    }
    #weather-current-sunrise-container {
      grid-area: g;
    }
    #weather-current-sunset-container {
      grid-area: h;
    }
  }
  #forecast-weather-container {
    grid-area: b;
    #forcast-row {
      display: grid;
      grid-template-columns: 50px auto auto auto auto;
      grid-template-rows: repeat(2, 25px);
      grid-template-areas: "a b b b b" "a c d e f";
      grid-gap: 1em;
      margin-top:2em;
      margin-bottom:2em;
      #icon {
        grid-area: a;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        color: black;
      }
      #condition {
        grid-area: b;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 25px;
        color: black;
      }
    }
  }
  #weather-radar-container {
    grid-area: c;
  }
}
</style>
