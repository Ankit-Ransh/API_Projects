// By default user location
let searchedLocation = "Berlin";
let units = "metric";

// City along with Country
let city = document.querySelector(".city");

// Day Date Time
let day = document.querySelector(".date");

// Current status of weather
let description = document.querySelector(".status");

// current temperature 
let temperature = document.querySelector(".temperature");

// min max temperature expected
let minTemperature = document.querySelector(".min");
let maxTemperature = document.querySelector(".max");

// actual temperature on human body
let actual = document.querySelector(".actual");

// humidity
let humidity = document.querySelector(".humidity");

// wind
let wind = document.querySelector(".wind");

// pressure 
let pressure = document.querySelector(".pressure");

// icon
let icon = document.querySelector(".icon");

// BACKEND_URL
// const BACKEND_URL = "http://127.0.0.1:8080";

const BACKEND_URL = "https://skysnap.onrender.com";

const countryCodeToCountry = (country) => {
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

const formatDateTime = (input) => {
    const date = new Date(input);

    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(date);

    return formattedDateTime;
}

// Store original temperature values
let originalTemps = {
    temperature: null,
    minTemperature: null,
    maxTemperature: null,
    actual: null,
};

const currentWeather = async (e) => {
    // prevents refresh on submit
    e.preventDefault();

    let inputLocation = document.querySelector(".search").value;
    if(inputLocation !== "") searchedLocation = inputLocation;

    try{
        const geoResponse = await fetch(`${BACKEND_URL}/location`, {
            method: "POST",
            body: JSON.stringify({
                searchedLocation: searchedLocation,
                units: units,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        const geoData = await geoResponse.json();

        let latitude = geoData.coord.lat;
        let longitude = geoData.coord.lon;
        let country = countryCodeToCountry(geoData.sys.country);

        try{
            const locationResponse = await fetch(`${BACKEND_URL}/environment`, {
                method: "POST",
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const locationData = await locationResponse.json();
            
            if(locationData.status === "OK"){
                const inputDateTime = locationData.formatted;
                const formattedDateTime = formatDateTime(inputDateTime);
                
                day.innerText = formattedDateTime;
            }
            
            city.innerText = `${searchedLocation}, ${country}`;

            description.innerText = geoData.weather[0].main;
            icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${geoData.weather[0].icon}@4x.png" />`;
            
            originalTemps = {
                temperature: `${geoData.main.temp_min}\u00B0`,
                minTemperature: `${geoData.main.temp_min}\u00B0`,
                maxTemperature: `${geoData.main.temp_max}\u00B0`,
                actual: `${geoData.main.feels_like}\u00B0`,
            };

            temperature.innerText = originalTemps.temperature;
            minTemperature.innerText = originalTemps.minTemperature;
            maxTemperature.innerText = originalTemps.maxTemperature;
            actual.innerText = originalTemps.actual;

            humidity.innerText = `${geoData.main.humidity}%`;
            pressure.innerText = `${geoData.main.pressure} hPa`;
            wind.innerText = `${geoData.wind.speed} m/s`;

            document.getElementById("input").value = ""; // Reset Input Data
        }
        catch(err){
            throw new Error(err);
        }        
    }
    catch(err){
        throw new Error(err);
    }

}

// Function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
}

// Function to convert Fahrenheit to Celsius
const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5/9;
}

// current Degree -> Celsius
let degree = document.querySelectorAll(".degree");
let fahrenheit = document.querySelector("#fahrenheit");
let celsius = document.querySelector("#celsius");

// conversion to Fahrenheit
degree[1].addEventListener("click", () => {
    temperature.innerText = convertAndDisplay(celsiusToFahrenheit, originalTemps.temperature);
    minTemperature.innerText = convertAndDisplay(celsiusToFahrenheit, originalTemps.minTemperature);
    maxTemperature.innerText = convertAndDisplay(celsiusToFahrenheit, originalTemps.maxTemperature);
    actual.innerText = convertAndDisplay(celsiusToFahrenheit, originalTemps.actual);

    // change styling
    fahrenheit.style.fontSize = "1.5rem";
    fahrenheit.style.fontWeight = "900";

    // revert style
    celsius.style.fontSize = "1rem";
    celsius.style.fontWeight = "400";
});

// conversion to Celsius
degree[0].addEventListener("click", () => {
    temperature.innerText = originalTemps.temperature;
    minTemperature.innerText = originalTemps.minTemperature;
    maxTemperature.innerText = originalTemps.maxTemperature;
    actual.innerText = originalTemps.actual;

    // change styling
    celsius.style.fontSize = "1.5rem";
    celsius.style.fontWeight = "900";

    // revert style
    fahrenheit.style.fontSize = "1rem";
    fahrenheit.style.fontWeight = "400";
});

// Helper function to convert and display
const convertAndDisplay = (conversionFunction, value) => {
    // Parse the value into a number, if possible
    const numericValue = parseFloat(value);
    
    // Check if the parsing was successful (not NaN)
    if (!isNaN(numericValue)) {
        // Perform the conversion, limit to two decimal digits, and return the formatted result
        return `${conversionFunction(numericValue).toFixed(2)}\u00B0`;
    } else {
        // Handle the case where parsing fails, for example, by returning the original value
        // console.error("Invalid numeric value:", value);
        return value;
    }
};

// Click Event
let desiredLocation = document.querySelector(".desiredLocation");
desiredLocation.addEventListener("submit", (e) => {
    currentWeather(e);
});

window.addEventListener('load', (e) => {
    currentWeather(e);
});
