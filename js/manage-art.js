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
            const result = await response.json();
            makeConfirmButton();
            populateArt(result);
        } else {
            console.log(response);
            //render something in the browser to let user know why request failed
        }
    } catch (error) {
        //render something in the browser to let the user know something happened in the browser
        console.log(error);
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
                }
            })
            .catch(() => {
                //TODO: render an error on the screen why the deletion failed
            });
        }
    });
}

function removeArtElement(id) {
    document.getElementById(`art-buffer-${id}`).remove();
}