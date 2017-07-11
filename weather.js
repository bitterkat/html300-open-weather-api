// const apiURL = "https://uwpce-weather-proxy.herokuapp.com/data/2.5/weather"
// const apiURL = "http://api.openweathermap.org/data/2.5/weather"
const apiURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather"
const appid = 'APPID=346d9d7fa12c58ce3cf80709862132cc'
const units = 'units=imperial'
const londonCoords = {lat: 51.5074, lon: 0.128}
const seattleCoords = {lat: 47.6762, lon: -122.3182}
let values = ''

document.getElementById('seattle').onclick = function () {
values = seattleCoords
// call click handler
handleClick()
}

document.getElementById('london').onclick = function () {
values = londonCoords
// call click handler
handleClick()
}

document.getElementById('userLoc').onclick = function () {
navigator.geolocation.getCurrentPosition(success, error)
  // if success assign the values and call click handler
  function success(position){
    let addLoc = {lat: position.coords.latitude, lon: position.coords.longitude}
    values = addLoc
    console.log("It worked!")
    handleClick()
  }

    function error (position){
      console.log("It didn't work!")
    }
}

function handleClick () {
  // serialize values into a query string
  let queryString = queryBuilder(values)
  // call getConditions with the query string
  getConditions(queryString)
}

function getConditions (queryString) {
  let request = new XMLHttpRequest()
  // starts to talk to API - 3 params
  // request method, url, (optional) async flag (default true)
  request.open("GET", apiURL + queryString, true)

  // fires when the request is complete
  // long term - I want to update the DOM
  request.onload = function () {
    let weatherboxDiv = document.getElementById("weatherbox")
    // weatherboxDiv.innerHTML = ''
    let conditionsDiv = document.getElementById("conditions")
    let tempDiv = document.getElementById("temp")
    let iconDiv = document.getElementById("icon")
    let response = JSON.parse(request.response)
    let cityName = ''

    // fix the wonky "city" from the JSON name response
    if (response.name == "Inglewood-Finn Hill") {
      cityName = "Seattle" } else if (response.name == "Abbey Wood") { cityName = "London"
    } else  { cityName = response.name }

    // round the JSON temp response
    let roundedTemp = Math.round(response.main.temp)
    // assign the icon that matches the JSON response
    let icon = response.weather[0].icon

    iconDiv.innerHTML = `<img src='http://openweathermap.org/img/w/${icon}.png'>`
    tempDiv.innerHTML = `${cityName}<br>${roundedTemp}<span>&#8457;</span>`

    // get the JSON main conditions, humidity, and wind speed responses
    conditionsDiv.innerHTML =
    `Conditions: ${response.weather[0].main}<br>
    Humidity: ${response.main.humidity}%<br>
    Wind speed: ${response.wind.speed} m/s`

    weatherboxDiv.appendChild(tempDiv)
    weatherboxDiv.appendChild(iconDiv)
    weatherboxDiv.appendChild(conditionsDiv)
  }

  // fires if something goes wrong
  request.error = function (errorObject) {
    console.log("bwoken :(")
    console.log(errorObject)
  }

  // send the request!
  request.send()
}

function queryBuilder(queryObj){
  let holder = []
  // loop through queryObj key value pairs
  for(let key in queryObj){
    // turn each one into "key=value"
    let convert = `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`
    // encodeURIComponent converts spaces and & to URI friendly values so we don't have to worry about them
    holder.push(convert)
  }
  // concatenate the pairs together, with & between
  let longString = holder.join("&")
  // prepend a ? to concatenated string, return
  // console.log(`?${longString}&${units}&${appid}`)
  return `?${longString}&${units}&${appid}`
}
