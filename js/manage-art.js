async function manageArt(userID) {
    const destination = `${API_URL}:${API_PORT}/art/users/${userID}`;

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
            .then(result => {
                makeConfirmButton();
                populateArt(result);
            })
            .catch(error => {
                const container = document.getElementById("art-container");
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                container.style.textAlign = "center";
                container.style.display = "block";
                container.innerHTML = `<p>There's nothing here yet! If you'd like,</p><br><a href="/art/upload/">submit your first piece!</a>`;
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
    buffer.id = `art-buffer-${art.id}`;

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

    const deleteButton = document.createElement("div");
    deleteButton.className = "delete-container";
    deleteButton.innerText = "delete";
    infoContainer.appendChild(deleteButton);

    const deleteBox = document.createElement("input");
    deleteBox.type = "checkbox";
    deleteBox.value = art.id;
    deleteBox.className = "delete-box";
    deleteBox.onclick = checkShowDeleteButtion;
    deleteButton.appendChild(deleteBox);

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

function makeConfirmButton() {
    const context = document.getElementById('context-buttons');
    const container = document.createElement('div');
    container.id = "confirm-deletion";
    context.append(container);

    const label = document.createElement("label");
    label.innerText = "Confirm Deletions:";
    label.htmlFor = "deletion-confirmation";
    container.appendChild(label);

    const input = document.createElement("input");
    input.type = "password";
    input.id = "deletion-confirmation";
    input.placeholder = "password";
    container.appendChild(input);

    const button = document.createElement("button");
    button.innerText = "Submit";
    button.onclick = deleteArts;
    container.appendChild(button);

    container.style.display = "none";

    const errorMessage = document.createElement("p");
    errorMessage.style.display = "none";
    errorMessage.id = "art-deletion-error";
    container.appendChild(errorMessage);
}

function checkShowDeleteButtion() {
    let show = false;
    const arr = Array.from(document.getElementsByClassName("delete-box"));
    for (const box in arr) {
        if (arr[box].checked) {
            show = true;
            break;
        }
    }

    const button = document.getElementById("confirm-deletion");
    if (show) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

function deleteArts() {
    const destination = `${API_URL}:${API_PORT}/art/`;
    const password = document.getElementById("deletion-confirmation").value;

    Array.from(document.getElementsByClassName("delete-box")).forEach(box => {
        if (box.checked) {
            fetch(`${destination}${box.value}`, {
                method: 'DELETE',
                redirect: 'manual',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: new URLSearchParams({password: password}),
                referrerPolicy: 'no-referrer',
                credentials: 'include'
            })
            .then(response => {
                if (response.ok) {
                    removeArtElement(box.value);
                } else if (response.status === 401) {
                    const errorMessage = document.getElementById("art-deletion-error");
                    errorMessage.style.display = "block";
                    errorMessage.innerText = "invalid password";
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                const errorMessage = document.getElementById("art-deletion-error");
                errorMessage.style.display = "block";
                errorMessage.innerText = "Failed to delete some or all arts";
            });
        }
    });
}

function removeArtElement(id) {
    document.getElementById(`art-buffer-${id}`).remove();
}