const apiKey = "f55a75f336f50dfd8e70737799cb51d0";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const backgroundColor = document.querySelector(".card-background-base");

// Add weather condition mapping
const weatherConditions = {
    Clouds: {
        icon: "./images/Clouds_02d@2x.png",
        backgroundClass: "card-background-clouds",
        textColor: "#fff"
    },
    Clear: {
        icon: "./images/Clear_01d@2x.png",
        backgroundClass: "card-background-clear",
        textColor: "#000"
    },
    Rain: {
        icon: "./images/rain_09d@2x.png",
        backgroundClass: "card-background-rain",
        textColor: "#fff"
    },
    Drizzle: {
        icon: "./images/drizzle_10d@2x.png",
        backgroundClass: "card-background-drizzle",
        textColor: "#000"
    },
    Mist: {
        icon: "./images/mist_50d@2x.png",
        backgroundClass: "card-background-mist",
        textColor: "#fff"
    },
    Snow: {
        icon: "./images/snow_13d@2x.png",
        backgroundClass: "card-background-snow",
        textColor: "#000"
    }
};

// Function to remove all weather background classes
function removeWeatherClasses() {
    const classes = Object.values(weatherConditions).map(condition => condition.backgroundClass);
    classes.forEach(className => backgroundColor.classList.remove(className));
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if(response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        let data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        // Handle weather condition
        const weatherMain = data.weather[0].main;
        const condition = weatherConditions[weatherMain];
        
        if (condition) {
            weatherIcon.src = condition.icon;
            removeWeatherClasses();
            backgroundColor.classList.add(condition.backgroundClass);
            
            // Add temperature-based styling
            const temp = data.main.temp;
            if (temp <= 0) {
                backgroundColor.style.filter = "hue-rotate(180deg)"; // Make it look colder
            } else if (temp >= 30) {
                backgroundColor.style.filter = "hue-rotate(30deg) saturate(1.2)"; // Make it look warmer
            } else {
                backgroundColor.style.filter = "none";
            }
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

searchBox.addEventListener("keypress", (e) => {
    if(e.key == "Enter") searchBtn.click();

})

searchBtn.addEventListener("click", ()=>{
    checkWeather(searchBox.value);

})

