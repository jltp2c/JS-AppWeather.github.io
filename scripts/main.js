import tabJoursEnOrdre from './Utilitaire/gestionTemps.js'


let resultatsAPI;
const APIKEY = '9e0a89a7b8f73bc00203113959fbd791';
const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const geoloca = navigator.geolocation;
const heure = document.querySelectorAll('.heure-nom-prevision');
const temp = document.querySelectorAll('.heure-prevision-valeur');
const jour = document.querySelectorAll('.jour-prevision-nom');
const jourTemp = document.querySelectorAll('.jour-prevision-temp');
const IconeDynamique = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');



//appel API + localisation 

if (geoloca){
    geoloca.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        appelAPI(lat, long)

    }, ()=> {
        alert('Impossible de définir votre localisation !')
    });

};

function appelAPI(lat, long){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${APIKEY}`)
    .then((response) =>{
        return response.json();
    })
    .then((data)=>{
        resultatsAPI = data  
        
        console.log(data);
        temps.innerHTML = resultatsAPI.current.weather[0].description;
        temperature.innerHTML = `${Math.trunc(resultatsAPI.current.temp)}˚C`;
        localisation.innerHTML = resultatsAPI.timezone;

    //afficher les horaires toutes les 2heures 

        let heureActual = new Date().getHours();

        for (let i = 0 ; i< heure.length ; i++){
            let heureIncr = heureActual + i*2 ;

            if (heureIncr === 24){
                heure[i].innerText = "00h";
            } else if (heureIncr > 24){
                heure[i].innerText = `${heureIncr-24}h`
            }else{
                heure[i].innerText = `${heureIncr}h`
            };
        };
    //affichage de temp 

        for (let j = 0; j < temp.length; j++){
        let tempAct = Math.trunc(resultatsAPI.hourly[j*2].temp);
            temp[j].innerText = `${tempAct}°C`
        }
    //affichage des jours 

        for(let k= 0; k < jour.length ; k++ ){
        jour[k].innerText = tabJoursEnOrdre[k].slice(0,3)
        }
        for(let i = 0; i < jourTemp.length ; i++){
            jourTemp[i].innerText = `${Math.trunc(resultatsAPI.daily[i+1].temp.day)}˚`
        }

        if (heureActual >= 6 && heureActual < 21){
            IconeDynamique.src= `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
        }else{
            IconeDynamique.src= `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
        }

        chargementContainer.classList.add('disparition')

    });
};






