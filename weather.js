const apiURL = "http://api.openweathermap.org/data/2.5/weather"
// const apiURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather"
const appid = 'APPID=346d9d7fa12c58ce3cf80709862132cc'
const units = 'units=imperial'
const londonCoords = {lat: 51.5074, lon: 0.128}
const seattleCoords = {lat: 47.6762, lon: -122.3182}
let values = ''
let cityName = ''

document.getElementById('seattle').onclick = function () {
values = seattleCoords
cityName = "Seattle"
// call click handler
handleClick()
}

document.getElementById('london').onclick = function () {
values = londonCoords
cityName = "London"
// call click handler
handleClick()
}

document.getElementById('userLoc').onclick = function () {
navigator.geolocation.getCurrentPosition(success, error)
  // if success assign the values and call click handler
  function success(position){
    let addLoc = {lat: position.coords.latitude, lon: position.coords.longitude}
    values = addLoc
    cityName = "your current location"
    console.log("It worked!")
    // console.log(values)
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
    let conditionsDiv = document.getElementById("conditions")
    let tempDiv = document.getElementById("temp")
    let iconDiv = document.getElementById("icon")
    let response = JSON.parse(request.response)

    // debug = response
    imperialTemp = Math.round(response.main.temp)
    icon = response.weather[0].icon
    conditionsDiv.innerHTML = `Conditions for ${cityName}: ${response.weather[0].main}`
    conditionsDiv.appendChild(iconDiv)
    conditionsDiv.appendChild(tempDiv)
    iconDiv.innerHTML = `<img src='http://openweathermap.org/img/w/${icon}.png'>`
    tempDiv.innerHTML = `<h2>${imperialTemp}<span>&#8457;</span></h2>`
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
