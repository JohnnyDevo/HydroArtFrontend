async function getAllCards() {
    const destination = `${API_URL}:${API_PORT}/cards`;

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
            populateResults(await response.json());
        } else {
            throw new Error();
        }
    } catch (error) {
        const container = document.getElementById("cards-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.style.color = "red";
        container.innerText = "There was an error while retrieving cards from the server. Please try again later.";
    }
}

async function doSearch() {
    const search = getQueryText('search');
    if (!search) {
        return window.location.replace('/cards');
    }
    const destination = `${API_URL}:${API_PORT}/cards/search?`;
    const query = `search=${encodeURIComponent(search)}`;

    try {
        const response = await fetch(`${destination}${query}`, {
            method: 'GET',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer'
        });

        if (response.ok) {
            populateResults(await response.json());
        } else {
            throw new Error();
        }
    } catch (error) {
        const container = document.getElementById("cards-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.style.color = "red";
        container.innerText = "There was an error while retrieving cards from the server. Please try again later.";
    }
    document.getElementById('searchBar').value = search;
}

async function getSingleCard() {
    const cardID = getQueryText('cardID');
    if (!cardID) {
        return window.location.replace('/cards');
    }
    const destination = `${API_URL}:${API_PORT}/cards/${cardID}`;

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
            makeSingleCardView(await response.json());
        } else {
            throw new Error();
        }
    } catch (error) {
        const container = document.getElementById("cards-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.style.color = "red";
        container.innerText = "There was an error while retrieving the card from the server. Please try again later.";
    }
}

function populateResults(results) {
    const resultsElement = document.getElementById('cards-container');
    while (resultsElement.firstChild) {
        resultsElement.removeChild(resultsElement.firstChild);
    }
    for (const card in results.cards) {
        let art;
        if (results.arts) {
            art = results.arts.find(art => art.card_id === results.cards[card].id);
        }
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "card-wrapper";
        const cardElement = makeCard(results.cards[card], art, false, true);
        if (results.cards[card].swaps_to) {
            art = null;
            if (results.arts) {
                art = results.arts.find(art => art.card_id === results.cards[card].swaps_to);
            }
            const previewElement = makeCard(results.swaps.find(swapCard => swapCard.id === results.cards[card].swaps_to), art, true, false);
            cardElement.prepend(previewElement);
        }
        cardWrapper.appendChild(cardElement);
        resultsElement.appendChild(cardWrapper);
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
    if (card.rarity === "BASIC" || card.rarity === "STARTER" || card.rarity === "SPECIAL") {
        card.rarity = "COMMON";
    }

    let url;

    if (art) {
        url = `data:image/png;base64,${art.encode}`;
    } else {
        url = '/portraits/noart.png';
    }
    const artElement = createImageElement("art", url);
    cardElement.appendChild(artElement);

    if (card.id === "hydrologistmod:RazorIce") {
        url = '/portraits/colorless_attack.png';
    } else if (card.id === "hydrologistmod:Raincloud") {
        url = '/portraits/colorless_skill.png';
    } else {
        url = `/portraits/${card.type}.png`;
    }
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
        if (card.cost == -1) {
            card.cost = "X";
            card.upgraded_cost = "X";
        }

        url = `/portraits${card.subtype}/energy.png`;
        const energyElement = createImageElement("energy-symbol", url)
        cardElement.appendChild(energyElement);

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
        clickableLink.href = `/cards/view?cardID=${card.id}`;
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
        if (artsArray[i].style.display !== 'none') {
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
            artsArray[nextArt].style.display = 'block';
            populateCreditsInfo(artsArray[nextArt]);
            break;
        }
    }
}

function getActiveArt() {
    for (let i = 0; i < artsArray.length; ++i) {
        if (artsArray[i].style.display !== 'none') {
            return artsArray[i];
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
    const artID = getQueryText("artID");

    const resultsElement = document.getElementById('cards-container');
    resultsElement.style.setProperty('--size-multiplier', "calc(1.5 * var(--base-size))");

    let defaultArt;
    let defaultNameElement;
    let defaultUrlElement;
    let creditsInfoContainer;

    if (cardInfo.arts) {
        for (const artInfo in cardInfo.arts) {
            if (cardInfo.arts[artInfo].id !== cardInfo.defaultArtID) {
                let url = `data:image/png;base64,${cardInfo.arts[artInfo].encode}`;
                const artElement = createImageElement("art", url);
                artElement.style.display = "none";

                const artistName = document.createElement("span");
                artistName.innerHTML = cardInfo.arts[artInfo].credits_name;
                artistName.style.display = "none";
                artistName.className = "art-artist-name";
                artElement.appendChild(artistName);
                const artistUrl = document.createElement("span");
                artistUrl.innerHTML = cardInfo.arts[artInfo].credits_url;
                artistUrl.style.display = "none";
                artistUrl.className = "art-artist-url";
                artElement.appendChild(artistUrl);

                artsArray.push(artElement);

                if (artID == cardInfo.arts[artInfo].id) {
                    artElement.style.display = "block";
                }
            } else {
                defaultArt = cardInfo.arts[artInfo];

                defaultNameElement = document.createElement("span");
                defaultNameElement.innerHTML = cardInfo.arts[artInfo].credits_name;
                defaultNameElement.style.display = "none";
                defaultNameElement.className = "art-artist-name";

                defaultUrlElement = document.createElement("span");
                defaultUrlElement.innerHTML = cardInfo.arts[artInfo].credits_url;
                defaultUrlElement.style.display = "none";
                defaultUrlElement.className = "art-artist-url";
            }
        }
        creditsInfoContainer = document.createElement("div");
        creditsInfoContainer.id = "credits-info";

        const creditsInfoTop = document.createElement("img");
        creditsInfoTop.src = "/tips/tipTop.png";
        creditsInfoTop.id = "credits-info-img-top";
        creditsInfoContainer.appendChild(creditsInfoTop);
        
        const creditsInfoBot = document.createElement("img");
        creditsInfoBot.src = "/tips/tipBot.png";
        creditsInfoBot.id = "credits-info-img-bot";
        creditsInfoContainer.appendChild(creditsInfoBot);

        const creditsInfoNameContainer = document.createElement("div");
        creditsInfoNameContainer.id = "credits-info-name-container";
        creditsInfoNameContainer.innerText = "Art by: ";
        creditsInfoContainer.appendChild(creditsInfoNameContainer);
        
        const creditsInfoName = document.createElement("span");
        creditsInfoName.id = "credits-info-name";
        creditsInfoNameContainer.appendChild(creditsInfoName);

        const creditsUrl = document.createElement("a");
        creditsUrl.id = "credits-info-url";
        creditsInfoContainer.appendChild(creditsUrl);
        if (artsArray.length > 0) {
            const showPreviousArtButton = document.createElement("button");
            showPreviousArtButton.id = "show-previous-art";
            showPreviousArtButton.addEventListener('click', showPreviousArt);
            const showNextArtButton = document.createElement("button");
            showNextArtButton.id = "show-next-art";
            showNextArtButton.addEventListener('click', showNextArt);
            creditsInfoContainer.prepend(showPreviousArtButton);
            creditsInfoContainer.append(showNextArtButton);
        }
    }

    const cardWrapper = document.createElement("div");
    cardWrapper.className = "single-card-wrapper";

    const card = makeCard(cardInfo.card, defaultArt, false, false);
    const defaultArtElement = card.getElementsByClassName('card-art')[0];
    if (artID && artID != defaultArt.id) {
        defaultArtElement.style.display = "none";
    }
    cardWrapper.appendChild(card);

    if (defaultNameElement) {
        defaultArtElement.appendChild(defaultNameElement);
        defaultArtElement.appendChild(defaultUrlElement);
    }

    const reportButton = document.createElement("a");
    reportButton.id = "single-view-report-button";
    reportButton.className = cardInfo.card.id;
    reportButton.href = null;
    reportButton.style.display = "none";
    const reportImage = document.createElement("img");
    reportImage.src = "/redflag.png";
    reportButton.appendChild(reportImage);
    card.appendChild(reportButton);

    artsArray.forEach(art => {
        card.prepend(art);
    });
    artsArray.push(defaultArtElement);
    resultsElement.appendChild(cardWrapper);

    if (creditsInfoContainer) {
        card.prepend(creditsInfoContainer);
        populateCreditsInfo(getActiveArt());
    }

    if (cardInfo.keywords) {
        const container = document.createElement("div");
        container.className = "keywords-container";
        for (const keywordInfo in cardInfo.keywords) {
            const keywordElement = createKeywordElement(cardInfo.keywords[keywordInfo].name, cardInfo.keywords[keywordInfo].description);
            container.appendChild(keywordElement);
        }
        card.appendChild(container);
    }

    if (cardInfo.swapsTo) {
        let art;
        if (cardInfo.swapsTo.art) {
            art = cardInfo.swapsTo.art;
        }
        const previewElement = makeCard(cardInfo.swapsTo, art, true, true);
        previewElement.style.display = "block";
        card.prepend(previewElement);
    }

    const contributeButton = document.createElement('a');
    contributeButton.id = "contribute-button";
    contributeButton.href = `/art/upload/?cardID=${cardInfo.card.id}`;
    contributeButton.innerText = "Contribute!";
    card.appendChild(contributeButton);
}

function populateCreditsInfo(artElement) {
    const creditsInfoName = document.getElementById("credits-info-name");
    const creditsInfoUrl = document.getElementById("credits-info-url");
    const artistName = artElement.getElementsByClassName("art-artist-name")[0];
    creditsInfoName.innerHTML = artistName.innerHTML;
    const url = artElement.getElementsByClassName("art-artist-url")[0].innerHTML;
    creditsInfoUrl.innerHTML = url;
    creditsInfoUrl.href = `/external/?link=${encodeURIComponent(url)}`;
    creditsInfoUrl.target = "_blank";

    const reportButton = document.getElementById("single-view-report-button");
    reportButton.style.display = "block";
    const cardID = reportButton.className;
    reportButton.href = `/feedback/?reason=reportart&cardID=${cardID}&artist=${encodeURIComponent(artistName.innerHTML)}`
}

function createKeywordElement(name, description) {
    const container = document.createElement("div");
    container.className = "keyword-container";

    const backgroundTop = document.createElement("img");
    backgroundTop.className = "keyword-background-top";
    backgroundTop.src = "/tips/tipTop.png";
    container.appendChild(backgroundTop);

    const content = document.createElement("div");
    content.className = "keyword-content";
    container.appendChild(content);

    const text = document.createElement("div");
    text.className = "keyword-text";
    content.appendChild(text);

    const keywordName = document.createElement("p");
    keywordName.className = "keyword-name";
    keywordName.innerText = name;
    text.appendChild(keywordName);

    const keywordDescription = document.createElement("p");
    keywordDescription.className = "keyword-description";
    keywordDescription.innerHTML = description;
    text.appendChild(keywordDescription);

    const backgroundMiddle = document.createElement("img");
    backgroundMiddle.className = "keyword-background-middle";
    backgroundMiddle.src = "/tips/tipMid.png";
    content.appendChild(backgroundMiddle);

    const backgroundBottom = document.createElement("img");
    backgroundBottom.className = "keyword-background-bottom";
    backgroundBottom.src = "/tips/tipBot.png";
    container.appendChild(backgroundBottom);

    return container;
}