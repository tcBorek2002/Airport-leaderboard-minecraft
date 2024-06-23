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
            getLastRefreshedTimeString(lastCacheHit);
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

    // Start a loop to update the time every second
    setInterval(() => {
        if (minutes > 0 && seconds > 0) {
            timeAgoString = `${minutes} ${minutes > 1 ? 'minuten' : 'minuut'} en ${seconds} seconde${seconds > 1 ? 's' : ''} geleden`;
        } else if (minutes > 0) {
            timeAgoString = `${minutes} ${minutes > 1 ? 'minuten' : 'minuut'} geleden`;
        } else {
            timeAgoString = `${seconds} seconde${seconds > 1 ? 's' : ''} geleden`;
        }
    
        document.querySelector('.last-refresh').innerText = "Laatst bijgewerkt: " + timeAgoString;
        seconds++;
        if (seconds > 59) {
            seconds = 0;
            minutes++;
        }
    }, 1000);
}