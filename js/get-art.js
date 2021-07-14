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
            response.json()
            .then(result => populateArt(result))
            .catch(error => {
                const container = document.getElementById("art-container");
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                container.style.textAlign = "center";
                container.style.display = "block";
                container.innerHTML = `<p>There's nothing here yet! If you'd like,</p><br><a href="/art/upload/">be the first to contribute!</a>`;
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        const container = document.getElementById("art-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.style.color = "red";
        container.innerText = "There was an error while retrieving art from the server. Please try again later.";
    }
}

async function getArt() {
    const card = getQueryText("cardID");
    const artist = getQueryText("artistID");
    if (!card && !artist) {
        return window.location.replace('/art');
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
            response.json()
            .then(result => populateArt(result))
            .catch(error => {
                const container = document.getElementById("art-container");
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                container.style.textAlign = "center";
                container.style.display = "block";
                container.innerHTML = `<p>No art found by this artist or for this card.</p>`;
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        const container = document.getElementById("art-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.style.color = "red";
        container.innerText = "There was an error while retrieving art from the server. Please try again later.";
    }
}

function populateArt(results) {
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
    artistLink.href = `/art/submissions?artistID=${art.user_id}`
    artistLink.className = "artist-view-link";
    artistLink.innerHTML = art.credits_name;
    infoContainer.appendChild(artistLink);

    const artistPage = document.createElement("a");
    artistPage.href = `/external/?link=${encodeURIComponent(art.credits_url)}`;
    artistPage.target = "_blank";
    artistPage.className = "artist-page-link";
    artistPage.innerHTML = art.credits_url;
    infoContainer.appendChild(artistPage);

    const cardLinkContainer = document.createElement("div");
    cardLinkContainer.className = "art-card-link";
    infoContainer.appendChild(cardLinkContainer);

    const cardIcon = document.createElement("img");
    cardIcon.className = "art-card-icon";
    cardIcon.src = "/card_icon.png";
    cardLinkContainer.appendChild(cardIcon);

    const cardName = document.createElement("a");
    cardName.href = `/cards/view?cardID=${art.card_id}&artID=${art.id}`;
    cardName.classname = "art-card-name";
    cardName.innerText = art.card_name;
    cardLinkContainer.appendChild(cardName);

    return buffer;
}