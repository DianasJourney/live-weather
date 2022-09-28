const searchButton = document.querySelector('#submit')
const search = document.querySelector('#search')
const form = document.getElementById('locationInput')
const ul = document.querySelector('ul')
const temp = document.querySelector('.tempa')
const humid = document.querySelector('.humidity')
const windKmH = document.querySelector('.wind')
const cityName = document.querySelector('.name')
const fiveDayForecast = document.querySelectorAll('.weatherInfo')
const tempMain = document.querySelector('.temp')



let cityList = JSON.parse(localStorage.getItem('citySearch')) || []

const weatherSearch = text => {
  const li = document.createElement('p')
  li.textContent = text
  ul.appendChild(li)
}
for (let i = 0; i < cityList.length; i++) {
  weatherSearch(cityList[i])
}


let inputCity = 'toronto';
weatherInfo()

form.addEventListener('submit', event => {
  if (search.value.length !== 0) {
    event.preventDefault()
    inputCity = search.value
    if (!cityList.includes(inputCity)) {
      cityList.push(inputCity)
      weatherSearch(inputCity)
    }
    localStorage.setItem('citySearch', JSON.stringify(cityList))
    weatherInfo()

    /* removes text from search bar*/
    search.value = ''
  }
  console.log(inputCity)
})

function weatherInfo () {
  let apiKey = 'f31e5e392fa0900574376fb4aea4a1e8'
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&units=metric&appid=${apiKey}`
  let url2 = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=metric&appid=${apiKey}`

  fetch(url2)
    .then(response => response.json())
    .then(currentdata => {
      console.log(currentdata)
      fetch(url)
        .then(response => response.json())
        .then(data => {
          let currentForecast = data.list[0]
          console.log(data)
          let dayCounter = 0
          // we will use this to divide later to get the average
          let dayIntervalCounter = 0
          let dayTemps = 0
          let dayHumidity = 0
          let dayWind = 0
          let index = 0

          while (dayCounter < 5) {
            let dataDate = data.list[index].dt_txt
            let dataTime = dataDate.split(' ')[1]

            if (dataTime != '00:00:00') {
              dayTemps += data.list[index].main.temp
              dayHumidity += data.list[index].main.humidity
              dayWind += data.list[index].wind.speed
              dayIntervalCounter++
            } else {
              let tempAverage = Math.trunc(dayTemps / dayIntervalCounter)
              let humidityAverage = Math.trunc(dayHumidity / dayIntervalCounter)
              let windAverage = (dayWind / dayIntervalCounter).toFixed(2)

              if (dayCounter == 0) {
                temp.innerHTML = tempAverage + '°';
                humid.innerHTML = humidityAverage + '%';
                windKmH.innerHTML = windAverage + 'km/h';
                tempMain.innerHTML = tempAverage + '°';
                cityName.innerHTML = inputCity;

              }
              // create our data and append to day forecast
              let tempa = document.createElement('p')
              tempa.textContent = `Temp: ${tempAverage}°`

              let windS = document.createElement('p')
              windS.textContent = `Humidity: ${humidityAverage}%`

              let humidityy = document.createElement('p')
              humidityy.textContent = `Wind: ${windAverage} m/s`

              fiveDayForecast[dayCounter].replaceChildren(
                tempa,
                windS,
                humidityy
              )

              fiveDayForecast[dayCounter].prepend(`Day ${dayCounter + 1}`)

              // it is a new day
              dayCounter++

              // new day means we start adding into our variables here
              dayTemps = data.list[index].main.temp
              dayHumidity = data.list[index].main.humidity
              dayWind = data.list[index].wind.speed
              dayIntervalCounter = 1
            }
            index++
          }
        
        })
    })
}

