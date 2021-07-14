async function getCardList() {
    const destination = `${API_URL}:${API_PORT}/cards/names`;

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
            populateOptions(result);
        } else {
            throw new Error();
        }
    } catch (error) {
        const errorMessage = document.getElementById("card-list-error");
        errorMessage.style.display = "block";
        errorMessage.innerText = "there was an error while retrieving a list of cards from the server. Please try again later.";
    }
}

function populateOptions(results) {
    const cardID = getQueryText("cardID");
    const selector = document.getElementById("card-id-selector");

    let defaultSet = false;
    for (const index in results) {
        const card = results[index];

        const option = document.createElement("option");
        option.value = card.id;
        option.innerText = card.name;

        selector.appendChild(option);

        if (cardID == card.id) {
            selector.value = card.id;
            defaultSet = true;
        }
    }
    if (!defaultSet) {
        selector.value = "";
    }
}