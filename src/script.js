let city;
let toggleTempUnit = true;
let temperatureUnit = "metric";
let SearchedResult;
let Searchedcities;

let input = document.querySelector("input")
input.addEventListener("input", (e) => {
    city = e.target.value;
})

input.addEventListener("click", (e) => {
    e.stopPropagation()
    let prevSearch = document.querySelector(".previous-Search");
    prevSearch.classList.toggle("hidden")
    SearchedResult = JSON.parse(localStorage.getItem("sHistory")) || [];
    prevSearch.innerHTML = SearchedResult.map((item) => {
        return `
            <p class="Searchedcity w-full p-2  cursor-pointer bg-[#f8f6f6]">${item}</p>
        `
    }).join("")
    Searchedcities = document.querySelectorAll(".Searchedcity");
    Searchedcities.forEach((item) => {
        item.addEventListener("click", () => {
            getweather(item.textContent)
        })
    })
})

document.addEventListener("click", () => {
    document.querySelector(".previous-Search").classList.add("hidden");
});


let searchbtn = document.getElementById("search-btn")
searchbtn.addEventListener("click", () => {
    if (!city || city.trimEnd() === "") {
        showerrors("Please Enter city name cautiously")
        return 
    }
    getweather(city)
    if(SearchedResult.length>4){
        SearchedResult.shift()
    }
    if (!SearchedResult.includes(city)) {
        SearchedResult.push(city)
    }
    localStorage.setItem("sHistory", JSON.stringify(SearchedResult))
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
        if (data.cod !== 200) {
            showerrors(data.message || "City not found");
            return;
        }
        renderweather(data)
    } catch (error) {
        console.log(error)
        showerrors(error.message)
    }
}

function renderweather(data) {
    if(data.main.temp>40){
        showerrors("Extreme Heat Alert Temperature above 40°C Stay hydrated and indoors Extreme Heat Alert")
    }
    const timestamp = data.dt * 1000;
    const date = new Date(timestamp);
    const DateString = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    })
    document.getElementById("broad").innerHTML = `
    <div class="md:flex justify-between">
            <div class="flex flex-col">
                <span class="text-2xl font-medium">${data.name}, ${data.sys.country}</span>
                <span >${data.weather[0].main}</span>
                <span class="text-gray-500 text-sm">${data.weather[0].description}</span>
            </div>
            <div>
                <section class="text-gray-400 text-[14px] md:px-3 py-1 md:border border-gray-400 rounded-xl">${DateString}</section>
            </div>
        </div>
        <div class="mt-4 md:flex justify-between items-center"> 
            <div>
                <p class="text-6xl font-light">${Math.round(data.main.temp)}&deg;${toggleTempUnit ? "C" : "F"}</p>
                <p class="text-gray-600 text-sm">Feels like ${Math.round(data.main.feels_like)}&deg;${toggleTempUnit ? "C" : "F"}</p>
            </div>
            <div class="w-22">
                <img class="clouds" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
            </div>
        </div>
    `
    broadcast5(data.name)
}

async function broadcast5(city) {

    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=372def02d20b2017339dcb0832b6cb0c`)
    let data = await response.json();
    let warr = data.list;
    console.log(warr)

    document.getElementById("5d-broad").innerHTML = `
    <h4 class="font-medium text-xl">5-day forcast</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  mt-6 gap-5 broadcast p-10 rounded-xl">
            <div class="border border-gray-400 rounded-xl p-3 ">
                <p class="text-[16px] font-medium">${(warr[1].dt_txt).split(" ")[0]}</p>
                <img class="w-16 mt-3" src="https://openweathermap.org/img/wn/${warr[1].weather[0].icon}@2x.png" alt="">
                <p class="text-xs text-gray-400">clear sky</p>
                <p class="font-semibold">${warr[1].main.temp}&deg;C</p>
            </div>
            <div class="border border-gray-400 rounded-xl p-3 ">
                <p class="text-[16px] font-medium">${(warr[9].dt_txt).split(" ")[0]}</p>
                <img class="w-16 mt-3" src="https://openweathermap.org/img/wn/${warr[9].weather[0].icon}@2x.png" alt="">
                <p class="text-xs text-gray-400">clear sky</p>
                <p class="font-semibold">${warr[9].main.temp}&deg;C</p>
            </div>
            <div class="border border-gray-400 rounded-xl p-3 ">
                <p class="text-[16px] font-medium">${(warr[17].dt_txt).split(" ")[0]}</p>
                <img class="w-16 mt-3" src="https://openweathermap.org/img/wn/${warr[17].weather[0].icon}@2x.png" alt="">
                <p class="text-xs text-gray-400">clear sky</p>
                <p class="font-semibold">${warr[17].main.temp}&deg;C</p>
            </div>
            <div class="border border-gray-400 rounded-xl p-3 ">
                <p class="text-[16px] font-medium">${(warr[25].dt_txt).split(" ")[0]}</p>
                <img class="w-16 mt-3" src="https://openweathermap.org/img/wn/${warr[25].weather[0].icon}@2x.png" alt="">
                <p class="text-xs text-gray-400">clear sky</p>
                <p class="font-semibold">${warr[25].main.temp}&deg;C</p>
            </div>
            <div class="border border-gray-400 rounded-xl p-3 ">
                <p class="text-[16px] font-medium">${(warr[33].dt_txt).split(" ")[0]}</p>
                <img class="w-16 mt-3" src="https://openweathermap.org/img/wn/${warr[33].weather[0].icon}@2x.png" alt="">
                <p class="text-xs text-gray-400">clear sky</p>
                <p class="font-semibold">${warr[33].main.temp}&deg;C</p>
            </div>
        </div>
    `
}


function showerrors(error){
    let div=document.createElement("div")
    div.classList.add("alert", "fixed" ,"top-[5%]","right-1")
    div.innerHTML=`<span class="border border-red-300 shadow-xl rounded-sm text-white p-2 bg-[#fa1919]">${error}</span>`
    document.body.appendChild(div)
    setTimeout(() => {
        div.remove();
    }, 1200);
}
