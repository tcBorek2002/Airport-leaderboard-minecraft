import userStore from "./users.js";

// Get the icons from here: https://www.gamergeeks.net/apps/minecraft/web-developer-tools/css-blocks-and-entities
window.addEventListener('DOMContentLoaded', (event) => {
    // Set a random background
    var images = ['wallpaper1.jpg', 'wallpaper2.webp', 'wallpaper3.png', 'wallpaper4.webp'];
    var randomImage = images[Math.floor(Math.random() * images.length)];
    document.querySelector('.bg-image').style.backgroundImage = 'url(././assets/wallpapers/' + randomImage + ')';

    // Start playing music
    var tracks = ['A_Familiar_Room.ogg', 'Crescent_Dunes.ogg', 'C418 - Stal.mp3'];
    var randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    var audio = new Audio('././assets/music/' + randomTrack);

    // Start playing music after an interaction
    document.addEventListener('mousemove', function() {
        audio.play();
    });

    populateList(userStore);

    loadServerStatus();
});


async function populateList(data) {
    const ol = document.querySelector('.leaderboard ol');
    ol.innerHTML = ''; // clear existing list items

    for (const item of data) {
        const apiUrl = "https://api.ashcon.app/mojang/v2/user/" + item.username;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            item.imgUrl = "https://api.mineatar.io/face/" + data.uuid;
            createListItem(item);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
}

function createListItem(item) {
    const mainDiv = document.createElement('div');
    mainDiv.className = 'leaderboard-main';
    const firstLine = document.createElement('div');
    firstLine.className = 'username-line';
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const img = document.createElement('img');
    const iconLine = document.createElement('div');
    iconLine.style.display = 'flex';
    iconLine.style.gap = '3%'

    img.src = item.imgUrl;
    firstLine.appendChild(img);
    h3.appendChild(document.createTextNode(item.username));
    firstLine.appendChild(h3)

    mainDiv.appendChild(firstLine);
    item.icons.forEach(iconItem => {
        const iconDiv = document.createElement('div');
        const text = document.createElement('p');
        text.className = 'icon-text';
        text.appendChild(document.createTextNode(iconItem.iconText));
        const icon = document.createElement('i');
        iconDiv.style.display = 'flex';
        iconDiv.style.gap = '2%';
        iconDiv.style.alignItems = 'center';

        icon.className = "icon-minecraft " + iconItem.iconClass;

        iconDiv.appendChild(text);
        iconDiv.appendChild(icon);
        iconLine.appendChild(iconDiv);
    });

    mainDiv.appendChild(iconLine);
    li.appendChild(mainDiv);

    const ol = document.querySelector('ol');

    ol.appendChild(li);
}

function loadServerStatus() {
    const requestUrl = 'https://api.mcsrvstat.us/3/play.emphisia.nl';
    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            let lastCacheHit = new Date(data.debug.cachetime * 1000);
            let lastRefreshString = getLastRefreshedTimeString(lastCacheHit);
            if (data.online) {
                document.querySelector('.server-status').innerText = 'Online';
                document.querySelector('.server-status').style.color = 'rgb(42 226 27)';
                let players = data.players.online;
                if (players > 0) {
                    // Show the amount of players online
                    let playerList = data.players.list;
                    // Loop throug player
                }
                // document.querySelector('.players').innerText = data.players.online + ' spelers';
            } else {
                document.querySelector('.server-status').innerText = 'Offline';
                document.querySelector('.server-status').style.color = '#FF0000';
            }
        });
}

function getLastRefreshedTimeString(lastRefresh) {
    let now = new Date();
    let difference = now - lastRefresh; // Difference in milliseconds
    let totalSeconds = Math.floor(difference / 1000); // Convert to seconds
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60; // Remainder is seconds beyond full minutes
    let timeAgoString;

    if (minutes > 0 && seconds > 0) {
        timeAgoString = `${minutes} minuut${minutes > 1 ? 's' : ''} en ${seconds} seconde${seconds > 1 ? 's' : ''} geleden`;
    } else if (minutes > 0) {
        timeAgoString = `${minutes} minuut${minutes > 1 ? 's' : ''} geleden`;
    } else {
        timeAgoString = `${seconds} seconde${seconds > 1 ? 's' : ''} geleden`;
    }

    document.querySelector('.last-refresh').innerText = "Laatst bijgewerkt: " + timeAgoString;

    return timeAgoString;
}

let test = {
    "ip": "217.105.22.226",
    "port": 8880,
    "debug": {
        "ping": true,
        "query": false,
        "srv": true,
        "querymismatch": false,
        "ipinsrv": false,
        "cnameinsrv": false,
        "animatedmotd": false,
        "cachehit": false,
        "cachetime": 1719168624,
        "cacheexpire": 1719168684,
        "apiversion": 3,
        "dns": {
            "srv": [
                {
                    "name": "_minecraft._tcp.play.emphisia.nl",
                    "type": "SRV",
                    "class": "IN",
                    "ttl": 300,
                    "rdlength": 0,
                    "rdata": "",
                    "priority": 0,
                    "weight": 5,
                    "port": 8880,
                    "target": "_dc-srv.e2388e728bc9._minecraft._tcp.play.emphisia.nl"
                }
            ],
            "srv_a": [
                {
                    "name": "_dc-srv.e2388e728bc9._minecraft._tcp.play.emphisia.nl",
                    "type": "A",
                    "class": "IN",
                    "ttl": 300,
                    "rdlength": 0,
                    "rdata": "",
                    "address": "217.105.22.226"
                }
            ]
        },
        "error": {
            "query": "Failed to read from socket."
        }
    },
    "motd": {
        "raw": [
            "Jeanette heet u welkom"
        ],
        "clean": [
            "Jeanette heet u welkom"
        ],
        "html": [
            "Jeanette heet u welkom"
        ]
    },
    "players": {
        "online": 0,
        "max": 20
    },
    "version": "1.20.6",
    "online": true,
    "protocol": {
        "version": 766,
        "name": "1.20.6"
    },
    "hostname": "_dc-srv.e2388e728bc9._minecraft._tcp.play.emphisia.nl",
    "icon": "data:image/png;base64,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",
    "software": "Paper",
    "eula_blocked": false
}