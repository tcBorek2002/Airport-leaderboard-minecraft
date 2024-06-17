// Get the icons from here: https://www.gamergeeks.net/apps/minecraft/web-developer-tools/css-blocks-and-entities
window.addEventListener('DOMContentLoaded', (event) => {
    // Set a random background
    var images = ['wallpaper1.jpg', 'wallpaper2.webp', 'wallpaper3.png', 'wallpaper4.webp'];
    var randomImage = images[Math.floor(Math.random() * images.length)];
    document.querySelector('.bg-image').style.backgroundImage = 'url(./assets/wallpapers/' + randomImage + ')';

    // Start playing music
    var tracks = ['A_Familiar_Room.ogg', 'Bromeliad.ogg', 'Crescent_Dunes.ogg', 'Echo_in_the_Wind.ogg'];
    var randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    var audio = new Audio('./assets/music/' + randomTrack);

    // Start playing music after an interaction
    document.addEventListener('mousemove', function() {
        audio.play();
    });

    populateList([
        {
            username: 'YoupDeGamerNL',
            icons: [
                {
                    iconClass: 'icon-minecraft-diamond-pickaxe',
                    iconText: '1',
                },
                {
                    iconClass: 'icon-minecraft-diamond-shovel',
                    iconText: '1',
                },
                {
                    iconClass: 'icon-minecraft-bread',
                    iconText: '64'
                }
            ],
        },
        {
            username: 'tcBorek2002',
            icons: [
                {
                    iconClass: 'icon-minecraft-acacia-door',
                    iconText: '1',
                }
            ]
        },
    ]);
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
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const img = document.createElement('img');
    const iconLine = document.createElement('div');
    iconLine.style.display = 'flex';
    iconLine.style.gap = '3%'

    img.src = item.imgUrl;
    h3.appendChild(img);
    h3.appendChild(document.createTextNode(item.username));

    li.appendChild(h3);
    item.icons.forEach(iconItem => {
        const iconDiv = document.createElement('div');
        const text = document.createTextNode(iconItem.iconText);
        const icon = document.createElement('i');
        iconDiv.style.display = 'flex';
        iconDiv.style.gap = '2%';
        iconDiv.style.alignItems = 'center';

        icon.className = "icon-minecraft " + iconItem.iconClass;

        iconDiv.appendChild(text);
        iconDiv.appendChild(icon);
        iconLine.appendChild(iconDiv);
    });

    li.appendChild(iconLine);

    const ol = document.querySelector('ol');

    ol.appendChild(li);
}