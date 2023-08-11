var searchData = {
    currentForecastData: '',
    forecastData: '',
    async apiKey() {
    },
    async getForecast(city) {
        let newForecast = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a93b7b525eb348d0be7194048232007&q=${city}&days=3&aqi=yes&alerts=no`);
        let currentForecast = await newForecast.json();
        searchData.currentForecastData = currentForecast;
        searchData.forecastData = currentForecast.forecast.forecastday;
    },
    async submitForm() {
        let searchValue = document.querySelector('#search-input');
        let newSearch = await searchData.getForecast(searchValue.value);
        searchValue.value = '';
        return newSearch;
    },
};

var display = {
    setScale: 0,
    async loadPage () {
        await searchData.getForecast('Atlanta');
        display.setCityName();
        display.setRegionName();
        display.setRegionImg();
        display.setCurrentDisplay();
        display.setForecastDisplay();
    },
    async submitAndSet() {
        await searchData.submitForm();
        display.setCityName();
        display.setRegionName();
        display.setRegionImg();
        display.setCurrentDisplay();
        display.setForecastDisplay();
    },
    getRegionName() {
        let regionData = searchData.currentForecastData.location.region.toLowerCase();
        return regionData.replace(/\s/g, '-');
    },
    setCityName () {
        let cityField = document.querySelector('.city');
        let cityName = searchData.currentForecastData.location.name;
        cityField.textContent = cityName;
    },
    setRegionName () {
        let regionField = document.querySelector('.region');
        let locationData = searchData.currentForecastData.location;
        if (locationData.country === "United States of America" || locationData.country === "USA" || locationData.country === "Canada") {
            let regionName = searchData.currentForecastData.location.region;
            regionField.textContent = regionName;
        } else {
            let regionName = searchData.currentForecastData.location.country;
            regionField.textContent = regionName;
        };
    },
    setRegionImg() {
        let imgField = document.querySelector('.region-img');
        if (searchData.currentForecastData.location.country === "United States of America") {
            let imgRegion = display.getRegionName()
            imgField.src = `./img/states/${imgRegion}.svg`;
        };
    },
    setCurrentDisplay() {
        let currentConditionImgDiv = document.querySelector('.condition-img');
        let currentConditionTempDiv = document.querySelector('.current-temp-num');
        let currentConditionDiv = document.querySelector('.current-condition-string');
        let currentFeelsLikeDiv = document.querySelector('.feels-like-num');
        let currentStatCloud = document.querySelector('.current-cloud-num');
        let currentStatRain = document.querySelector('.current-rain-num');
        let currentStatHumidity = document.querySelector('.current-humidity-num');
        let currentStatUV = document.querySelector('.current-uv-num');
        let currentStatWind = document.querySelector('.current-wind-speed-num');
        let currentStatWindDirection = document.querySelector('.current-wind-dir-num');
        let currentStatPressure = document.querySelector('.current-pressure-num');
        let conditionIcon = searchData.currentForecastData.current.condition.icon.slice(-7);

        if (display.setScale === 0) {
            currentConditionTempDiv.textContent = `${new Number(searchData.currentForecastData.current.temp_f).toFixed(0)}ºF`;
            currentConditionDiv.innerHTML = `<i>${searchData.currentForecastData.current.condition.text}</i>`;
            currentFeelsLikeDiv.textContent = `${new Number(searchData.currentForecastData.current.feelslike_f).toFixed(0)}ºF`;
            currentConditionImgDiv.src = `./img/weather/day/${conditionIcon}`;
            currentStatCloud.textContent = `${new Number(searchData.currentForecastData.current.cloud).toFixed(0)}%`;
            currentStatRain.textContent = `${new Number(searchData.currentForecastData.current.precip_in).toFixed(0)}in`;
            currentStatHumidity.textContent = `${new Number(searchData.currentForecastData.current.humidity).toFixed(0)}`;
            currentStatUV.textContent = `${new Number(searchData.currentForecastData.current.uv).toFixed(0)}`;
            currentStatWind.textContent = `${new Number(searchData.currentForecastData.current.wind_mph).toFixed(0)}mph`;
            currentStatWindDirection.textContent = `${searchData.currentForecastData.current.wind_dir}`
            currentStatPressure.textContent = `${new Number(searchData.currentForecastData.current.pressure_in).toFixed(0)}in`
        } else if (display.setScale === 1) {
            currentConditionTempDiv.textContent = `${new Number(searchData.currentForecastData.current.temp_c).toFixed(0)}ºC`;
            currentConditionDiv.innerHTML = `<i>${searchData.currentForecastData.current.condition.text}</i>`;
            currentFeelsLikeDiv.textContent = `${new Number(searchData.currentForecastData.current.feelslike_c).toFixed(0)}ºC`;
            currentConditionImgDiv.src = `./img/weather/day/${conditionIcon}`;
            currentStatCloud.textContent = `${new Number(searchData.currentForecastData.current.cloud).toFixed(0)}%`;
            currentStatRain.textContent = `${new Number(searchData.currentForecastData.current.precip_mm).toFixed(0)}mm`;
            currentStatHumidity.textContent = `${new Number(searchData.currentForecastData.current.humidity).toFixed(0)}`;
            currentStatUV.textContent = `${new Number(searchData.currentForecastData.current.uv).toFixed(0)}`;
            currentStatWind.textContent = `${new Number(searchData.currentForecastData.current.wind_kph).toFixed(0)}kph`;
            currentStatWindDirection.textContent = `${searchData.currentForecastData.current.wind_dir}`
            currentStatPressure.textContent = `${new Number(searchData.currentForecastData.current.pressure_mb).toFixed(0)}mb`
        } else {
            alert("setScale broke!");
        }
    },
    setForecastDisplay() {
        let threeDayForecast = searchData.currentForecastData.forecast.forecastday;
        for (let d=0;d<threeDayForecast.length;d++) {
            let forecastDiv = document.createElement('div');
            forecastDiv.classList.add(`forecast-div-${d+1}`)
            let forecastContainer = document.querySelector(`#forecast-${d+1}`);
            forecastContainer.innerHTML = '';

            let forecastDate = new Date(threeDayForecast[d].date.replace(/-/g, '\/')).toDateString();
            let forecastCondition = searchData.currentForecastData.forecast.forecastday[d].day.condition;
            let forecastImgSrc = `./img/weather/day/${forecastCondition.icon.slice(-7)}`;
            let precipChance = (searchData.currentForecastData.forecast.forecastday[d].day.daily_chance_of_rain + searchData.currentForecastData.forecast.forecastday[d].day.daily_chance_of_snow)/2;
            if (display.setScale === 0) {
                forecastDiv.innerHTML = 
                    `
                    <div class="forecast-lower">
                        <div class="forecast-date">${forecastDate}</div>
                        <div class="forecast-more"></div>
                    </div>
                    <div class="forecast-upper">
                        <img class="forecast-condition-img" src="${forecastImgSrc}">
                        <div class="forecast-temps">
                            <div class="forecast-temp-hi">Hi: ${new Number(searchData.currentForecastData.forecast.forecastday[d].day.maxtemp_f).toFixed(0)}ºF</div>
                            <div class="forecast-temp-lo">Lo: ${new Number(searchData.currentForecastData.forecast.forecastday[d].day.mintemp_f).toFixed(0)}ºF</div>
                        </div>
                    </div>
                    <div class="forecast-middle">
                        <div class="forecast-middle-left">
                            <div class="forecast-condition-text">${forecastCondition.text}</div>
                            <div class="forecast-uv">UV - ${searchData.currentForecastData.forecast.forecastday[d].day.uv}</div>
                        </div>
                        <div class="forecast-middle-right">
                            <div class="forecast-precip">Precip - ${new Number(precipChance).toFixed(0)}%</div>
                            <div class="forecast-humidity">Humidity - ${new Number(searchData.currentForecastData.forecast.forecastday[d].day.avghumidity).toFixed(0)}%</div>
                        </div>
                    </div>
                    <div class="forecast-hourly" href="https://www.google.com">Click for hourly...</div>
                    `
            } else if (display.setScale === 1) {
                forecastDiv.innerHTML = 
                    `
                    <div class="forecast-lower">
                        <div class="forecast-date">${forecastDate}</div>
                        <div class="forecast-more"></div>
                    </div>
                    <div class="forecast-upper">
                        <img class="forecast-condition-img" src="${forecastImgSrc}">
                        <div class="forecast-temps">
                            <div class="forecast-temp-hi">Hi: ${new Number(searchData.currentForecastData.forecast.forecastday[d].day.maxtemp_c).toFixed(0)}ºC</div>
                            <div class="forecast-temp-lo">Lo: ${new Number(searchData.currentForecastData.forecast.forecastday[d].day.mintemp_c).toFixed(0)}ºC</div>
                        </div>
                    </div>
                    <div class="forecast-middle">
                        <div class="forecast-middle-left">
                            <div class="forecast-condition-text">${forecastCondition.text}</div>
                            <div class="forecast-uv">UV - ${searchData.currentForecastData.forecast.forecastday[d].day.uv}</div>
                        </div>
                        <div class="forecast-middle-right">
                            <div class="forecast-precip">Precip - ${new Number(precipChance).toFixed(0)}%</div>
                            <div class="forecast-humidity">Humidity - ${new Number(searchData.currentForecastData.forecast.forecastday[d].day.avghumidity).toFixed(0)}%</div>
                        </div>
                    </div>
                    <div class="forecast-hourly" href="https://www.google.com">Click for hourly...</div>
                    `
            } else {
                alert("setScale broke!");
            };
            forecastDiv.addEventListener('click', ()=>{
                    display.listForecast(d);
            })

            forecastContainer.append(forecastDiv);
        };
    },
    listAirQuality() {
        let airQualityData = searchData.currentForecastData.current.air_quality;
        let airQualityDiv = document.createElement('div');
        airQualityDiv.innerHTML = 
            `
            <div class="air-quality-display">
                <div class="air-quality-title">--Air Quality Index--
                    <button class="air-quality-exit" onclick="display.exitAirQuality()">X</button>
                </div>
                <div class="air-quality-container">
                    <div class="air-quality-top">
                        <div class="air-co">CO: ${airQualityData.co}</div>
                        <div class="air-o3">O3: ${airQualityData.o3}</div>
                        <div class="air-no2">NO2: ${airQualityData.no2}</div>
                    </div>
                    <div class="air-quality-bottom">
                        <div class="air-so2">SO2: ${airQualityData.so2}</div>
                        <div class="air-pm2">PM2.5: ${airQualityData['pm2_5']}</div>
                        <div class="air-pm10">PM10: ${airQualityData.pm10}</div>
                    </div>
                </div>
                <div class="air-quality-index">EPA Index: ${airQualityData['us-epa-index']}</div>
            </div>
            `
        document.body.prepend(airQualityDiv);
    },
    exitAirQuality() {
        let divToRemove = document.querySelector('.air-quality-display');
        divToRemove.parentElement.remove()
    },
    listForecast(day) {
        if (!!(document.querySelector('.forecast-hour-display'))) {
            display.exitForecast();
            return;
        } else {
            let forecastData = searchData.currentForecastData.forecast.forecastday[day];
            let forecastDiv = document.createElement('div');
            forecastDiv.innerHTML = 
                `
                <div class="forecast-hour-display">
                    <div class="forecast-hour-title">
                        --${new Date(forecastData.date.replace(/-/g, '\/')).toDateString()}--
                        <button class="forecast-exit" onclick="display.exitForecast()">X</button>
                    </div>
                <div class="table-container">
                    <table class="hourly-table">
                        <tr class="hourly-header">
                            <td class="hourly-hour">HOUR</td>
                            <td class="hourly-condition-icon">ICON</td>
                            <td class="hourly-condition-text">COND</td>
                            <td class="hourly-temp">TEMP</td>
                            <td class="hourly-feelslike">FEELS LIKE</td>
                            <td class="hourly-humidity">HUMIDITY</td>
                        </tr>
                    </table>
                </div>
                </div>
                `
            document.body.prepend(forecastDiv);
            forecastData.hour.forEach((hour) => {
                let hourlyHour = hour.time.slice(-5);
                if (display.setScale === 0) {
                    if (hourlyHour === '00:00') {
                        let newRow = document.createElement('tr');
                        let hourlyConditionIcon = `./img/weather/day/${hour.condition.icon.slice(-7)}`;
                        newRow.setAttribute('id', 'hour-00')
                        newRow.innerHTML =
                            `
                            <td class="hourly-00-hour">12:00AM</td>
                            <td class="hourly-00-icon"><img src="${hourlyConditionIcon}"></td>
                            <td class="hourly-00-text">${hour.condition.text}</td>
                            <td class="hourly-00-temp">${hour.temp_f}ºF</td>
                            <td class="hourly-00-feelslike">${hour.feelslike_f}ºF</td>
                            <td class="hourly-00-humidity">${hour.humidity}%</td>
                            `
                        document.querySelector('tbody').append(newRow);
                    } else if ((Number(hourlyHour.slice(0,2))-12 < 0)) {
                        let hourToDisplay = `${Number(hourlyHour.slice(0,2))}:00AM`;
                        let newRow = document.createElement('tr');
                        let hourlyConditionIcon = `./img/weather/day/${hour.condition.icon.slice(-7)}`;
                        newRow.setAttribute('id', `hour-${hourlyHour.slice(0,2)}`);
                        newRow.innerHTML = 
                            `
                            <td class="hourly-${hourlyHour.slice(0,2)}-hour">${hourToDisplay}</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-icon"><img src="${hourlyConditionIcon}"></td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-text">${hour.condition.text}</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-temp">${hour.temp_f}ºF</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-feelslike">${hour.feelslike_f}ºF</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-humidity">${hour.humidity}%</td>
                            `
                        document.querySelector('tbody').append(newRow);
                    } else if (hourlyHour === '12:00') {
                        let newRow = document.createElement('tr');
                        let hourlyConditionIcon = `./img/weather/day/${hour.condition.icon.slice(-7)}`;
                        newRow.setAttribute('id', 'hour-12')
                        newRow.innerHTML =
                            `
                            <td class="hourly-12-hour">12:00PM</td>
                            <td class="hourly-12-icon"><img src="${hourlyConditionIcon}"></td>
                            <td class="hourly-12-text">${hour.condition.text}</td>
                            <td class="hourly-12-temp">${hour.temp_f}ºF</td>
                            <td class="hourly-12-feelslike">${hour.feelslike_f}ºF</td>
                            <td class="hourly-12-humidity">${hour.humidity}%</td>
                            `
                        document.querySelector('tbody').append(newRow);
                    } else if ((Number(hourlyHour.slice(0,2))-12 > 0)) {
                        let hourToDisplay = `${Number(hourlyHour.slice(0,2)-12)}:00PM`;
                        let newRow = document.createElement('tr');
                        let hourlyConditionIcon = `./img/weather/day/${hour.condition.icon.slice(-7)}`;
                        newRow.setAttribute('id', `hour-${hourlyHour.slice(0,2)}`);
                        newRow.innerHTML = 
                            `
                            <td class="hourly-${hourlyHour.slice(0,2)}-hour">${hourToDisplay}</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-icon"><img src="${hourlyConditionIcon}"></td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-text">${hour.condition.text}</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-temp">${hour.temp_f}ºF</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-feelslike">${hour.feelslike_f}ºF</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-humidity">${hour.humidity}%</td>
                            `
                        document.querySelector('tbody').append(newRow);
                    };
                } else if (display.setScale === 1) {
                    if (hourlyHour === '00:00') {
                        let newRow = document.createElement('tr');
                        let hourlyConditionIcon = `./img/weather/day/${hour.condition.icon.slice(-7)}`;
                        newRow.setAttribute('id', 'hour-00')
                        newRow.innerHTML =
                            `
                            <td class="hourly-00-hour">12:00AM</td>
                            <td class="hourly-00-icon"><img src="${hourlyConditionIcon}"></td>
                            <td class="hourly-00-text">${hour.condition.text}</td>
                            <td class="hourly-00-temp">${hour.temp_c}ºC</td>
                            <td class="hourly-00-feelslike">${hour.feelslike_c}ºC</td>
                            <td class="hourly-00-humidity">${hour.humidity}%</td>
                            `
                        document.querySelector('tbody').append(newRow);
                    } else if ((Number(hourlyHour.slice(0,2))-12 < 0)) {
                        let hourToDisplay = `${Number(hourlyHour.slice(0,2))}:00AM`;
                        let newRow = document.createElement('tr');
                        let hourlyConditionIcon = `./img/weather/day/${hour.condition.icon.slice(-7)}`;
                        newRow.setAttribute('id', `hour-${hourlyHour.slice(0,2)}`);
                        newRow.innerHTML = 
                            `
                            <td class="hourly-${hourlyHour.slice(0,2)}-hour">${hourToDisplay}</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-icon"><img src="${hourlyConditionIcon}"></td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-text">${hour.condition.text}</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-temp">${hour.temp_c}ºC</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-feelslike">${hour.feelslike_c}ºC</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-humidity">${hour.humidity}%</td>
                            `
                        document.querySelector('tbody').append(newRow);
                    } else if (hourlyHour === '12:00') {
                        let newRow = document.createElement('tr');
                        let hourlyConditionIcon = `./img/weather/day/${hour.condition.icon.slice(-7)}`;
                        newRow.setAttribute('id', 'hour-12')
                        newRow.innerHTML =
                            `
                            <td class="hourly-12-hour">12:00PM</td>
                            <td class="hourly-12-icon"><img src="${hourlyConditionIcon}"></td>
                            <td class="hourly-12-text">${hour.condition.text}</td>
                            <td class="hourly-12-temp">${hour.temp_c}ºC</td>
                            <td class="hourly-12-feelslike">${hour.feelslike_c}ºC</td>
                            <td class="hourly-12-humidity">${hour.humidity}%</td>
                            `
                        document.querySelector('tbody').append(newRow);
                    } else if ((Number(hourlyHour.slice(0,2))-12 > 0)) {
                        let hourToDisplay = `${Number(hourlyHour.slice(0,2)-12)}:00PM`;
                        let newRow = document.createElement('tr');
                        let hourlyConditionIcon = `./img/weather/day/${hour.condition.icon.slice(-7)}`;
                        newRow.setAttribute('id', `hour-${hourlyHour.slice(0,2)}`);
                        newRow.innerHTML = 
                            `
                            <td class="hourly-${hourlyHour.slice(0,2)}-hour">${hourToDisplay}</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-icon"><img src="${hourlyConditionIcon}"></td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-text">${hour.condition.text}</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-temp">${hour.temp_c}ºC</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-feelslike">${hour.feelslike_c}ºC</td>
                            <td class="hourly-${hourlyHour.slice(0,2)}-humidity">${hour.humidity}%</td>
                            `
                        document.querySelector('tbody').append(newRow);
                    };
                } else {
                    alert("setScale broke!");
                }
            });
        };
    },
    exitForecast() {
        let forecastToRemove = document.querySelector('.forecast-hour-display');
        forecastToRemove.parentElement.remove();
    },
    toggleDisplay() {
        if (display.setScale === 0) {
            display.setScale = 1;
            display.setCurrentDisplay();
            display.setForecastDisplay();
        } else if (display.setScale === 1) {
            display.setScale = 0;
            display.setCurrentDisplay();
            display.setForecastDisplay();
        };
    }
};

/*//Used to get IP of connecting client
var Location = {
    async getIP() {
        let newIP = await fetch('https://api.ipify.org?format=json');
        let newData = await newIP.json();
        clientIP = newData.ip;
        return newData.ip;        
    }
};*/

display.loadPage();