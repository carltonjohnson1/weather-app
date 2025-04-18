
const apiKey = "f55a75f336f50dfd8e70737799cb51d0";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const backgroundColor = document.querySelector(".card-background-base");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if(response.status == 404){
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        let data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    
        if(data.weather[0].main == "Clouds"){
            weatherIcon.src = "images/clouds.png";

            // backgroundColor.classList.remove("card-background-base");
            backgroundColor.classList.add("card-background-clouds");
            
           
        }
        
        else if(data.weather[0].main == "Clear"){
            weatherIcon.src = "images/clear.png";

            // backgroundColor.classList.remove("card-background-base");
            backgroundColor.classList.add("card-background-clear");
        }
        
        else if(data.weather[0].main == "Rain"){
            weatherIcon.src = "images/rain.png";

            // backgroundColor.classList.remove("card-background-base");
            backgroundColor.classList.add("card-background-rain");
        }
        
        else if(data.weather[0].main == "Drizzle"){
            weatherIcon.src = "images/drizzle.png";

            // backgroundColor.classList.remove("card-background-base");
            backgroundColor.classList.add("card-background-drizzle");
        }
        
        else if(data.weather[0].main == "Mist"){
            weatherIcon.src = "images/mist.png";

            // backgroundColor.classList.remove("card-background-base");
            backgroundColor.classList.add("card-background-mist");
        }

        // else if(data.weather[0].main == "Snow"){
        //     weatherIcon.src = "images/snow.png";

        //     backgroundColor.classList.remove("card-background-base");
        //     backgroundColor.classList.add("card-background-snow");
        // }
    
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

