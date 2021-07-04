async function getAllArt() {
    const destination = `${API_URL}:${API_PORT}/art`;

    try {
        const response = await fetch(destination, {
            method: 'GET',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer'
        });
    
        if (response.ok) {
            const result = await response.json();
            populateArt(result);
        } else {
            console.log(response);
        }
    } catch (error) {
        //render something in the browser to let the user know something happened
    }
}

function getQueryText(paramName) {

    //regex to read the parameters
    paramName = paramName.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);

    if (results && results[2]) {
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
};

async function getArt() {
    const card = getQueryText("cardID");
    const artist = getQueryText("artistID");
    if (!card && !artist) {
        return window.location.replace('/art/index.html');
    }

    let destination = `${API_URL}:${API_PORT}/art`;
    if (card) {
        destination += `/cards/${card}`;
    }
    if (artist) {
        destination += `/users/${artist}`;
    }

    try {
        const response = await fetch(destination, {
            method: 'GET',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer'
        });
    
        if (response.ok) {
            const result = await response.json();
            populateArt(result);
        } else {
            console.log(response);
        }
    } catch (error) {
        //render something in the browser to let the user know something happened
    }
}

function populateArt(results) {
    //if no art, do something in the browser to show that there is no art (yet! :D)
    const container = document.getElementById("art-container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    for (const artIndex in results) {
        const art = results[artIndex];
        const artElement = makeArtElement(art);
        container.appendChild(artElement);
    }
}

function makeArtElement(art) {
    const buffer = document.createElement("div");
    buffer.className = "art-buffer";

    const info = document.createElement("div");
    info.className = "art-info";
    buffer.appendChild(info);

    const imageContainer = document.createElement("div");
    imageContainer.className = "art-image-container";
    info.appendChild(imageContainer);

    const image = document.createElement("img");
    image.className = "art-image";
    image.src = `data:image/png;base64,${art.encode}`;
    imageContainer.appendChild(image);

    const infoContainer = document.createElement("div");
    infoContainer.className = "artist-info-container";
    info.appendChild(infoContainer);

    const artistLink = document.createElement("a");
    artistLink.href = `/art/submissions/index.html?artistID=${art.user_id}`
    artistLink.className = "artist-view-link";
    artistLink.innerText = art.credits_name;
    infoContainer.appendChild(artistLink);

    const artistPage = document.createElement("a");
    artistPage.href = art.credits_url;
    artistPage.className = "artist-page-link";
    artistPage.innerText = art.credits_url;
    infoContainer.appendChild(artistPage);

    const cardLinkContainer = document.createElement("div");
    cardLinkContainer.className = "art-card-link";
    infoContainer.appendChild(cardLinkContainer);

    const cardIcon = document.createElement("img");
    cardIcon.className = "art-card-icon";
    cardIcon.src = "/card_icon.png";
    cardLinkContainer.appendChild(cardIcon);

    const cardName = document.createElement("a");
    cardName.href = `/cards/view/index.html?cardID=${art.card_id}`;
    cardName.classname = "art-card-name";
    cardName.innerText = art.card_name;
    cardLinkContainer.appendChild(cardName);

    return buffer;
}