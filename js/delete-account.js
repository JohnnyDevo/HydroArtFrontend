function confirmDeleteAccount() {
    const html = document.getElementsByTagName("html")[0];

    const film = document.createElement("div");
    film.id = "delete-account-tint";
    html.appendChild(film);

    const prompt = document.createElement("div");
    prompt.id = "delete-account-prompt";
    html.appendChild(prompt);

    const xButton = document.createElement("button");
    xButton.id = "x-button";
    xButton.innerText = "X";
    xButton.onclick = () => {
        film.remove();
        prompt.remove();
    }
    prompt.appendChild(xButton);

    const title = document.createElement("p");
    title.innerText = "Delete your account?";
    prompt.appendChild(title);

    const noButton = document.createElement("button");
    noButton.innerText = "Cancel Account Deletion";
    noButton.onclick = () => {
        film.remove();
        prompt.remove();
    }
    prompt.appendChild(noButton);

    const cascadeLabel = document.createElement("label");
    cascadeLabel.htmlFor = "cascade-delete";
    cascadeLabel.innerText = "also delete submissions"
    prompt.appendChild(cascadeLabel);

    const cascadeOption = document.createElement("input");
    cascadeOption.type = "checkbox";
    cascadeOption.id = "cascade-delete";
    prompt.appendChild(cascadeOption);

    const passwordInput = document.createElement("input");
    passwordInput.id = "delete-account-password";
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.placeholder = "Password: ";
    prompt.appendChild(passwordInput);

    const button = document.createElement("input");
    button.type = "button";
    button.name = "submitbutton";
    button.value = "Confirm Account Deletion";
    button.onclick = deleteAccount;
    prompt.appendChild(button);

    const errorMessage = document.createElement("p");
    errorMessage.style.display = "none";
    errorMessage.id = "delete-account-error";
    prompt.appendChild(errorMessage);
}

let deleteAccountPressed = false;

async function deleteAccount() {
    if (deleteAccountPressed) {
        return;
    } else {
        deleteAccountPressed = true;
    }
    const password = document.getElementById("delete-account-password").value;
    const cascade = document.getElementById("cascade-delete").checked;
    const data = {
        password: password,
        cascade: cascade
    }
    const destination = `${API_URL}:${API_PORT}/users/`;

    try {
        const response = await fetch(destination, {
            method: 'DELETE',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer',
            body: new URLSearchParams(data),
            credentials: 'include'
        });
    
        if (response.ok) {
            window.location.replace("/");
        } else {
            const errorMessage = document.getElementById("delete-account-error");
            errorMessage.innerText = "incorrect password.";
            errorMessage.style.display = "block";
            deleteAccountPressed = false;
        }
    } catch (error) {
        const errorMessage = document.getElementById("delete-account-error");
        errorMessage.innerText = "There was an error when communicating with the server.";
        errorMessage.style.display = "block";
        deleteAccountPressed = false;
    }
}