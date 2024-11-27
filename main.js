import { apiKey } from "./config.js";
import {
  obtenirVilleDepuisURL,
  demanderMeteoParVille,
  onLoad,
  onError,
  onProgress,
} from "./functions.js";

let xhr = new XMLHttpRequest();

function demanderMeteo(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
  );
  xhr.send();
  xhr.onload = function () {
    onLoad(xhr);
  };
  xhr.onerror = onError;
  xhr.onprogress = onProgress;
}

function erreurGeolocalisation(error) {
  console.warn(`Erreur de géolocalisation : ${error.message}`);
  let ville = prompt("Veuillez entrer le nom de votre ville :");
  if (ville) {
    demanderMeteoParVille(ville);
  } else {
    console.error("Aucune ville saisie. Impossible de récupérer la météo.");
  }
}

let ville = obtenirVilleDepuisURL();
if (ville) {
  demanderMeteoParVille(ville);
} else {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      demanderMeteo,
      erreurGeolocalisation
    );
  } else {
    console.error(
      "La géolocalisation n'est pas supportée par votre navigateur."
    );
  }
}

let villeStockee = localStorage.getItem("ville");
if (villeStockee) {
  demanderMeteoParVille(villeStockee);
} else {
  console.error("Votre ville n'est pas stockée dans votre navigateur.");
}
