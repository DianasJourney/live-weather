const searchButton = document.querySelector('#submit');
const search = document.querySelector('#search');
const form = document.getElementById('locationInput');
const ul = document.querySelector('ul');
const temp = document.querySelector('.tempa');
const humid = document.querySelector('.humidity');
const windKmH = document.querySelector('.wind');
const cityName = document.querySelector('.name');
const fiveDayForecast = document.querySelectorAll('.weatherInfo');
const tempMain = document.querySelector('.temp');
const weathIcon = document.querySelector('#weatherIcon1');

let cityList = JSON.parse(localStorage.getItem('citySearch')) || []

const weatherSearch = text => {
  const li = document.createElement('li');
  li.textContent = text;
  li.className = 'city';
  ul.appendChild(li);
}

document
  .getElementById('searchedCities')
  .addEventListener('click', function (e) {
    if (e.target && e.target.matches('li.city')) {
      inputCity = e.target.textContent;
      weatherInfo();
    }
  })

for (let i = 0; i < cityList.length; i++) {
  weatherSearch(cityList[i]);
}

let inputCity = 'toronto';
weatherInfo();

form.addEventListener('submit', event => {
  if (search.value.length !== 0) {
    event.preventDefault();
    inputCity = search.value;
    if (!cityList.includes(inputCity)) {
      cityList.push(inputCity);
      weatherSearch(inputCity);
    }
    localStorage.setItem('citySearch', JSON.stringify(cityList));
    weatherInfo();

    /* removes text from search bar*/
    search.value = '';
  }
})

function weatherInfo () {
  let apiKey = 'f31e5e392fa0900574376fb4aea4a1e8'
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&units=metric&appid=${apiKey}`;
  let url2 = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=metric&appid=${apiKey}`;

  fetch(url2)
    .then(response => response.json())
    .then(currentdata => {
      console.log(currentdata)
      fetch(url)
        .then(response => response.json())
        .then(data => {
          let dayCounter = 0;
          // we will use this to divide later to get the average
          let dayIntervalCounter = 0;
          let dayTemps = 0;
          let dayHumidity = 0;
          let dayWind = 0;
          let index = 0;
          let prevDay = '';

          while (dayCounter < 5) {
            let dataDate = data.list[index].dt_txt.split(' ')[0];
            let dataTime = data.list[index].dt_txt.split(' ')[1];

            // if first index is midnight, get values and move onto next hour interval
            if (index == 0 && dataTime == '00:00:00') {
              dayTemps = data.list[index].main.temp;
              dayHumidity = data.list[index].main.humidity;
              dayWind = data.list[index].wind.speed;
              dayIntervalCounter++;
              index++;
              continue;
            }

            if (dataTime == '00:00:00') {
              let tempAverage = Math.trunc(dayTemps / dayIntervalCounter)
              let humidityAverage = Math.trunc(dayHumidity / dayIntervalCounter)
              let windAverage = (dayWind / dayIntervalCounter).toFixed(2)
              let icon = data.list[index].weather[0].icon;

              if (dayCounter == 0) {
                temp.innerHTML = tempAverage + '°';
                humid.innerHTML = humidityAverage + '%';
                windKmH.innerHTML = windAverage + 'MPS';
                tempMain.innerHTML = tempAverage + '°';
                cityName.innerHTML = inputCity;
                weathIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`

              
              }
              // create our data and append to day forecast
              let tempa = document.createElement('p');
              tempa.textContent = `Temp: ${tempAverage}°`;

              let windS = document.createElement('p');
              windS.textContent = `Humidity: ${humidityAverage}%`;

              let humidityy = document.createElement('p');
              humidityy.textContent = `Wind: ${windAverage} MPS`;

              let weatherIcon = document.createElement('img');
              weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

              fiveDayForecast[dayCounter].replaceChildren(
                tempa,
                windS,
                humidityy,
                weatherIcon
              );

              fiveDayForecast[dayCounter].prepend(prevDay);

              // it is a new day
              dayCounter++;

              // new day means we start adding into our variables here
              dayTemps = data.list[index].main.temp;
              dayHumidity = data.list[index].main.humidity;
              dayWind = data.list[index].wind.speed;
              dayIntervalCounter = 1;
            } else {
              dayTemps += data.list[index].main.temp;
              dayHumidity += data.list[index].main.humidity;
              dayWind += data.list[index].wind.speed;
              dayIntervalCounter++;
              prevDay = dataDate;
            }
            index++
          }
        })
    })
}
