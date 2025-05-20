import { config } from '../config.js';

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// DOM Elements
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const backgroundColor = document.querySelector(".card-background-base");
const loadingSpinner = document.querySelector(".loading-spinner");
const weatherElement = document.querySelector(".weather");
const errorElement = document.querySelector(".error");

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

// Function to show loading state
function showLoading() {
    loadingSpinner.style.display = "flex";
    weatherElement.style.display = "none";
    errorElement.style.display = "none";
}

// Function to show error
function showError(message) {
    errorElement.querySelector("p").textContent = message;
    errorElement.style.display = "block";
    weatherElement.style.display = "none";
    loadingSpinner.style.display = "none";
}

// Function to show weather
function showWeather() {
    weatherElement.style.display = "block";
    weatherElement.classList.add("visible");
    errorElement.style.display = "none";
    loadingSpinner.style.display = "none";
}

// Function to validate city name
function validateCityName(city) {
    if (!city || city.trim() === "") {
        throw new Error("Please enter a city name");
    }
    if (!/^[a-zA-Z\s-']+$/.test(city.trim())) {
        throw new Error("City name can only contain letters, spaces, hyphens, and apostrophes");
    }
    return city.trim();
}

// Function to remove all weather background classes
function removeWeatherClasses() {
    const classes = Object.values(weatherConditions).map(condition => condition.backgroundClass);
    classes.forEach(className => backgroundColor.classList.remove(className));
}

async function checkWeather(city) {
    try {
        showLoading();
        const validatedCity = validateCityName(city);
        
        const response = await fetch(apiUrl + validatedCity + `&appid=${config.apiKey}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling and try again.");
            } else {
                throw new Error("Failed to fetch weather data. Please try again later.");
            }
        }

        const data = await response.json();

        // Update weather information
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".weather-description").innerHTML = data.weather[0].description;
        document.querySelector(".feels-like").innerHTML = 
            `Feels like: ${Math.round(data.main.feels_like)}°c`;

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
                backgroundColor.style.filter = "hue-rotate(180deg)";
            } else if (temp >= 30) {
                backgroundColor.style.filter = "hue-rotate(30deg) saturate(1.2)";
            } else {
                backgroundColor.style.filter = "none";
            }
        }

        showWeather();
    } catch (error) {
        showError(error.message);
    }
}

// Event Listeners
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
    }
});

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Add keyboard navigation support
searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        searchBox.value = "";
        searchBox.blur();
    }
});

// Add input validation on blur
searchBox.addEventListener("blur", () => {
    try {
        validateCityName(searchBox.value);
        errorElement.style.display = "none";
    } catch (error) {
        showError(error.message);
    }
});

