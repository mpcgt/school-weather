export function obtenirVilleDepuisURL() {
  let params = new URLSearchParams(window.location.search);
  return params.get("ville");
}

import { apiKey } from "./config.js";

export function demanderMeteoParVille(ville) {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      ville
    )}&appid=${apiKey}&units=metric&lang=fr`
  );
  xhr.send();
  xhr.onload = function () {
    onLoad(xhr);
  };
  xhr.onerror = onError;
  xhr.onprogress = onProgress;
}

export function onLoad(xhr) {
  if (xhr.status === 200) {
    try {
      let meteo = JSON.parse(xhr.responseText);
      afficherMeteo(meteo);
    } catch (error) {
      console.error("Erreur de parsing JSON : ", error);
    }
  } else {
    console.error(`Erreur ${xhr.status} : ${xhr.statusText}`);
  }
}

export function onError() {
  console.error("Erreur réseau ou accès à l'API impossible");
}

export function onProgress(event) {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100;
    console.log(`Progression : ${percentComplete}%`);
  }
}

export function afficherMeteo(meteo) {
  let paragrapheInfo = document.querySelector("#info");
  let heureLever = new Date(meteo.sys.sunrise * 1000).toLocaleTimeString();
  let heureCoucher = new Date(meteo.sys.sunset * 1000).toLocaleTimeString();
  paragrapheInfo.innerHTML = `
    <h2><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg> ${meteo.name}, ${meteo.sys.country}</h2>
    <hr>
    <img src="https://openweathermap.org/img/wn/${meteo.weather[0].icon}@2x.png" alt="${meteo.weather[0].description}">
    <p class="temp">${meteo.main.temp}°C</p>
    <p class="majuscules">${meteo.weather[0].description}</p>
    <p>💦 Humidité : ${meteo.main.humidity}%</p>
    <p>💨 Vent : ${meteo.wind.speed}m/s</p>
    <p>🌅 Lever du soleil : ${heureLever}</p>
    <p>🌇 Coucher du soleil : ${heureCoucher}</p>
  `;
  localStorage.setItem("ville", meteo.name);
}