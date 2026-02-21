let city;
let toggleTempUnit = true;
let temperatureUnit = "metric";

let input = document.querySelector("input")
input.addEventListener("change", (e) => {
    city = e.target.value;
})
let searchbtn = document.getElementById("search-btn")
searchbtn.addEventListener("click", () => {
    getweather(city)
    input.value = ""
})

let tempbtn = document.getElementById("Temp-btn")
tempbtn.addEventListener("click", () => {
    toggleTempUnit = !toggleTempUnit;
    temperatureUnit = toggleTempUnit ? "metric" : "imperial"
    tempbtn.innerHTML = `${toggleTempUnit ? "&deg;F" : "&deg;C"}`
    getweather(city)
})


let currentLocation = document.getElementById("curr-location");
currentLocation.addEventListener("click", async () => {
    navigator.geolocation.getCurrentPosition((pos) => {
        getDataUsingLatLon(pos.coords.latitude, pos.coords.longitude)
    });

})

async function getDataUsingLatLon(lat, lon) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${temperatureUnit}&appid=372def02d20b2017339dcb0832b6cb0c`)
        let data = await response.json();
        city = data.name;
        renderweather(data)
    } catch (error) {
        console.log(error)
    }
}

async function getweather(city) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${temperatureUnit}&appid=372def02d20b2017339dcb0832b6cb0c`)
        let data = await response.json();
        renderweather(data)
    } catch (error) {
        console.log(error)
    }
}

function renderweather(data) {
    console.log(data)
    const timestamp = data.dt * 1000;
    const date = new Date(timestamp);
    const DateString = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    })
    console.log()
    document.getElementById("broad").innerHTML = `
    <div class="flex justify-between">
            <div class="flex flex-col">
                <span class="text-2xl font-medium">${data.name}, ${data.sys.country}</span>
                <span >${data.weather[0].main}</span>
                <span class="text-gray-500 text-sm">${data.weather[0].description}</span>
            </div>
            <div>
                <section class="text-gray-400 text-[14px] px-3 py-1 border border-gray-400 rounded-xl">${DateString}</section>
            </div>
        </div>
        <div class="mt-4 flex justify-between items-center"> 
            <div>
                <p class="text-6xl font-light">${Math.round(data.main.temp)}&deg;${toggleTempUnit ? "C" : "F"}</p>
                <p class="text-gray-600 text-sm">Feels like ${Math.round(data.main.feels_like)}&deg;${toggleTempUnit ? "C" : "F"}</p>
            </div>
            <div class="w-22">
                <img class="clouds" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
            </div>
        </div>
    `
}


