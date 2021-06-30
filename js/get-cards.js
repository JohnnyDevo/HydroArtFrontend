async function getAllCards() {
    const destination = 'http://localhost:3000/cards';

    const response = await fetch(destination, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer'
    });

    populateResults(await response.json());
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

async function doSearch() {
    const search = getQueryText('search');
    if (!search) {
        return window.location.replace('/cards/index.html');
    }
    document.getElementById('search-text').innerText = `you searched for: ${search}`;
    const destination = 'http://localhost:3000/cards/search?';
    const query = `search=${encodeURIComponent(search)}`;

    const response = await fetch(`${destination}${query}`, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer'
    });

    populateResults(await response.json());
}

async function getSingleCard() {
    const cardID = getQueryText('cardID');
    if (!cardID) {
        return window.location.replace('/cards/index.html');
    }
    const destination = `http://localhost:3000/cards/${cardID}`;

    const response = await fetch(destination, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer'
    });

    const result = await response.json();
    makeSingleCardView(result);
}

function populateResults(results) {
    const resultsElement = document.getElementById('cards-container');
    for (const card in results.cards) {
        let art;
        if (results.arts) {
            art = results.arts.find(art => art.card_id === results.cards[card].id);
        }
        const cardElement = makeCard(results.cards[card], art, false, true);
        if (results.cards[card].swaps_to) {
            art = null;
            if (results.arts) {
                art = results.arts.find(art => art.card_id === results.cards[card].swaps_to);
            }
            const previewElement = makeCard(results.swaps.find(swapCard => swapCard.id === results.cards[card].swaps_to), art, true, false);
            cardElement.prepend(previewElement);
        }
        resultsElement.appendChild(cardElement);
    }
}

function makeCard(card, art, isPreview, makeLink) {
    const cardElement = document.createElement("div");
    if (isPreview) {
        cardElement.className = "card-preview";
    } else {
        cardElement.className = "card";
    }
    if (!card.subtype) {
        card.subtype = "";
    } else {
        card.subtype = `/${card.subtype}`;
    }
    if (card.cost == -1) {
        card.cost = "X";
    }
    if (card.rarity === "BASIC" || card.rarity === "STARTER") {
        card.rarity = "COMMON";
    }

    let url;

    if (art) {
        url = `data:image/png;base64,${art.encode}`;
        const artElement = createImageElement("art", url);
        cardElement.appendChild(artElement);
    }

    url = `/portraits/${card.type}.png`;
    const portraitElement = createImageElement("portrait", url);
    cardElement.appendChild(portraitElement);
    
    if (card.subtype) {
        url = `/portraits${card.subtype}/${card.type}_desc.png`;
        const descElement = createImageElement("description-background", url);
        cardElement.appendChild(descElement);
    }

    url = `/portraits${card.subtype}/${card.type}_frame.png`;
    const frameElement = createImageElement("frame", url);
    cardElement.appendChild(frameElement);
    
    url = `/portraits/${card.rarity}_banner.png`
    const bannerElement = createImageElement("banner", url);
    cardElement.appendChild(bannerElement);
    
    if (card.cost > -2) {
        url = `/portraits${card.subtype}/energy.png`;
        const energyElement = createImageElement("energy-symbol", url)
        cardElement.appendChild(energyElement);
    }

    if (card.cost > -2) {
        const costTextContainer = createDescriptionElement("cost", card.cost);
        cardElement.appendChild(costTextContainer);

        const upgradedCostTextContainer = createDescriptionElement("cost", card.upgraded_cost);
        cardElement.appendChild(upgradedCostTextContainer);
        upgradedCostTextContainer.style.display = "none";
    }

    const nameTextContainer = createDescriptionElement("name", card.name);
    cardElement.appendChild(nameTextContainer);

    const typeTextContainer = createDescriptionElement("type", card.type.charAt(0) + card.type.slice(1).toLowerCase());
    cardElement.appendChild(typeTextContainer);

    const descriptionTextContainer = createDescriptionElement("description", card.description);
    cardElement.appendChild(descriptionTextContainer);

    const upgradedDescriptionTextContainer = createDescriptionElement("description", card.upgraded_description);
    cardElement.appendChild(upgradedDescriptionTextContainer);
    upgradedDescriptionTextContainer.style.display = "none";

    if (makeLink) {
        const clickableLink = document.createElement("a");
        clickableLink.href = `http://localhost/cards/view/index.html?cardID=${card.id}`;
        const linkSpan = document.createElement("span");
        linkSpan.className = "card-link";
        clickableLink.appendChild(linkSpan);
        cardElement.appendChild(clickableLink);
    }

    return cardElement;
}

function createImageElement(type, path) {
    const element = document.createElement("img");
    element.className = `card-${type}`;
    element.src = path;
    return element;
}

function createDescriptionElement(type, content) {
    const container = document.createElement("div");
    container.className = `card-${type}-container`;
    const text = document.createElement("div");
    text.className = `card-${type}-text`;
    text.innerHTML = content;
    container.appendChild(text);
    return container;
}

const artsArray = [];

function changeArt(next) {
    for (let i = 0; i < artsArray.length; ++i) {
        if (artsArray[i].style.display === 'block') {
            artsArray[i].style.display = 'none';
            let nextArt = i;
            if (next) {
                nextArt++;
            } else {
                nextArt--;
            }
            if (nextArt < 0) {
                nextArt = artsArray.length - 1;
            }
            if (nextArt >= artsArray.length) {
                nextArt = 0;
            }
            artsArray[nextArt].style.display === 'block';
            break;
        }
    }
}

function showNextArt() {
    changeArt(true);
}

function showPreviousArt() {
    changeArt(false);
}

function makeSingleCardView(cardInfo) {

    const resultsElement = document.getElementById('cards-container');
    const card = makeCard(cardInfo.card, null, false, false);
    resultsElement.style.setProperty('--size-multiplier', "calc(1.5 * var(--base-size))");
    resultsElement.appendChild(card);

    if (cardInfo.arts) {
        for (const artInfo in cardInfo.arts) {
            let url = `data:image/png;base64,${cardInfo.arts[artInfo].encode}`;
            const artElement = createImageElement("art", url);
            card.appendChild(artElement);
            artsArray.push[artElement];
            if (artInfo.id !== cardInfo.defaultArtID) {
                artElement.style.display = "none";
            }
        }
        if (artsArray.length > 1) {
            const showPreviousArt = document.createElement("button");
            showPreviousArt.id = "show-previous-art";
            showPreviousArt.onclick = showPreviousArt;
            const showNextArt = document.createElement("button");
            showNextArt.id = "show-next-art";
            showNextArt.onclick = showNextArt;
            resultsElement.prepend(showPreviousArt);
            resultsElement.append(showNextArt);
        }
    }

    if (cardInfo.keywords) {
        //create a keywords container
        for (const keywordInfo in cardInfo.keywords) {
            //create a keyword, append it to keywords container
        }
        //append keywords container to resultsElement
    }

    if (cardInfo.swapsTo) {
        let art;
        if (cardInfo.swapsTo.art) {
            art = cardInfo.swapsTo.art;
        }
        const previewElement = makeCard(cardInfo.swapsTo, art, true);
        resultsElement.prepend(previewElement);
    }
}