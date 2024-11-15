    let _switch = false; //Switch between 'minutes remaining' and current time
    const apiKey = '8c946f062b744c74b0777a3805fc3a00'; // Vervang dit door je eigen API-sleutel
    let TrainDate = new Date();
    let _now = new Date();

    async function getNextTrainFromTrack(track) {
        const url = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=ut'; // Vervang 'ut' door het gewenste station
    
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey
            }
        });
    
        if (response.ok) {
            const data = await response.json();
            const departuresFromTrack = data.payload.departures.filter(departure => departure.plannedTrack === track);
    
            if (departuresFromTrack.length > 0) {
                // Sorteer de vertrektijden op tijd
                departuresFromTrack.sort((a, b) => new Date(a.plannedDateTime) - new Date(b.plannedDateTime));
    
                // De eerste trein in de gesorteerde lijst is de volgende trein
                const nextTrain = departuresFromTrack[1];
                let nextFormattedTime = new Date(nextTrain.plannedDateTime);
    
                const hours = nextFormattedTime.getHours();
                const minutes = nextFormattedTime.getMinutes();
    
                const formattedHours = hours.toString().padStart(2, '0');
                const formattedMinutes = minutes.toString().padStart(2, '0');
    
                const departTime = `${formattedHours}:${formattedMinutes}`;
                console.log(`De volgende trein vanaf spoor ${track} vertrekt om ${departTime} naar ${nextTrain.direction}.`);
                return {
                    time: departTime,
                    direction: nextTrain.direction
                };
            } else {
                throw new Error(`Geen vertrekkende treinen vanaf spoor ${track}.`);
            }
        } else {
            throw new Error('Error fetching data:', response.status, response.statusText);
        }
    }

async function getReisInformatie() {
    const url = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=ut'; // Vervang 'ut' door het gewenste station

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': apiKey
        }
    });

    if (response.ok) {
        const data = await response.json();
        const now = new Date();
        console.log(data); // Verwerk de data zoals nodig
        // Bijvoorbeeld: toon de eerste vertrekkende trein
        const departuresFromPlatform20 = data.payload.departures.filter(departure => departure.plannedTrack === '20');
        const firstDeparture = departuresFromPlatform20[0];
        const firstDepartureIndex = data.payload.departures.indexOf(firstDeparture);
        document.getElementById('treinnaam').innerHTML = firstDeparture.product.longCategoryName;
        document.getElementById('stationnaam').innerHTML = firstDeparture.direction;
        const routeStations = firstDeparture.routeStations.map(station => station.mediumName).join(', ');
        //document.getElementById('tijd').innerHTML = firstDeparture.plannedDepartureTime.substring(11, 16);
        const plannedDepartureTime = new Date(firstDeparture.plannedDateTime);
        TrainDate = plannedDepartureTime;
        document.getElementById('richting').innerHTML = `via ${routeStations}`;
        if (data.payload.departures[firstDepartureIndex + 1]) {
            
            const nextDeparture = data.payload.departures[firstDepartureIndex + 1];
            const nextPlannedDepartureTime = new Date(nextDeparture.plannedDateTime);
            const nextFormattedTime = nextPlannedDepartureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            getNextTrainFromTrack('20').then(nextTrain => {
                document.getElementById('volgendetrein').innerHTML = `hierna/<span style="font-style:italic">next</span>: ${nextTrain.time} ${nextTrain.direction}`;
            }).catch(error => {
                console.error(error);
                document.getElementById('volgendetrein').innerHTML = 'Geen volgende trein';
            });
        } else {
            document.getElementById('volgendetrein').innerHTML = 'Geen volgende trein';
        }

    } else {
        console.error('Error fetching data:', response.status, response.statusText);
    }
}

    async function GetDate(){
        const url = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=ut'; // Vervang 'ut' door het gewenste station

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': apiKey
        }
    });
    if(response.ok){
            const data = await response.json();
            const departuresFromPlatform20 = data.payload.departures.filter(departure => departure.plannedTrack === '20');
            if (departuresFromPlatform20.length > 0) {
                const firstDeparture = departuresFromPlatform20[0];
                let plannedDepartureTime = new Date(firstDeparture.plannedDateTime);
                TrainDate = plannedDepartureTime;
            } else {
                throw new Error('Geen vertrekkende treinen vanaf platform 20.');
            }
    }
    }



async function getDepartTime(){
    const url = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=ut'; // Vervang 'ut' door het gewenste station

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': apiKey
        }
    });
    if(response.ok){
        const data = await response.json();
        const departuresFromPlatform20 = data.payload.departures.filter(departure => departure.plannedTrack === '20');
        const firstDeparture = departuresFromPlatform20[0];
        let  nextFormattedTime = new Date(firstDeparture.plannedDateTime);
        let MS = nextFormattedTime.getTime();
        console.log(nextFormattedTime);
        const Hours = nextFormattedTime.getHours();
        const minutes = nextFormattedTime.getMinutes();

        const FormattedHours = Hours.toString().padStart(2, '0');
        const Minutes = minutes.toString().padStart(2, '0');

        DepartTime = `${FormattedHours}:${Minutes}`;
        return DepartTime;
            } else {
                throw new Error('Geen vertrekkende treinen vanaf platform 20.');
            }
    }

    function updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const secondDegrees = ((seconds / 60) * 360) + 90;
        const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
        const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

        document.getElementById('second').style.transform = `rotate(${secondDegrees}deg)`;
        document.getElementById('minute').style.transform = `rotate(${minuteDegrees}deg)`;
        document.getElementById('hour').style.transform = `rotate(${hourDegrees}deg)`;
    }
    function GetMinutes(date1, date2){
        let Time1 = date1.getTime();
        let Time2 = date2.getTime();
        let diffInMilliseconds = Time2 - Time1;
 
        let diffInMinutes = diffInMilliseconds / (1000 * 60);
        return Math.round(diffInMinutes);
    }

    function DisplayDigital(remaining){


        const now = new Date();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        GetDate();
        let _Time = getDepartTime();

        if(remaining){
            const promise = new Promise((resolve, reject) => {
                resolve(_Time);
            } );
            promise.then((value) => {
                _Time = value;
                document.getElementById("tijd").innerHTML = value;
            });

        } else {
            document.getElementById("tijd").innerHTML = `${GetMinutes(now, TrainDate)} minuten`;
        }
    }

    // setup Intervals
    setInterval(updateClock, 1000);
    setInterval(() => {
        _switch = !_switch;
        if (_switch) {
            DisplayDigital(true);
        } else {
            DisplayDigital(false);
        }
    }, 5000);

    // Init
    getReisInformatie();
    updateClock();
    DisplayDigital(true);

