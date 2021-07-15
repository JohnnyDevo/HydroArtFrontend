let signupButtonClicked = false;

async function signup(form) {
    if (signupButtonClicked) {
        return;
    } else {
        signupButtonClicked = true;
    }
    const destination = `${API_URL}:${API_PORT}/users`;

    const data = {
        username: form.username.value,
        password: form.password.value,
        credits_name: form.credits_name.value,
        credits_url: form.credits_url.value,
        contact_info: form.contact_info.value
    };

    try {
        const response = await fetch(destination, {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer',
            body: new URLSearchParams(data),
            credentials: 'include'
        });
        if (response.ok) {
            window.location.href = `/profile`;
        } else {
            const reason = await response.text();
            makeGenericError(reason, "server");
            signupButtonClicked = false;
        }
    } catch (error) {
        makeGenericError(error.message, "browser");
        signupButtonClicked = false;
    }
}

function validateGenericInput(input, isValid = true) {
    if (input.value && isValid) {
        input.className = "valid-input";
    } else if (input.value && !isValid) {
        input.className = "invalid-input";
    } else {
        input.className = null;
    }

    checkEnableSignupButton();
}

function clearGenericError() {
    const genericError = document.getElementById("signup-submission-error");
    genericError.innerHTML = null;
    checkEnableSignupButton();
}

function makeGenericError(reason, where) {
    const genericError = document.getElementById("signup-submission-error");
    genericError.innerText = `oh no! There was an error in the ${where} when processing your submission. Reason:`;
    const errorElement = document.createElement("p");
    errorElement.innerHTML = reason;
    genericError.appendChild(errorElement);
    const tryAgain = document.createElement("p");
    tryAgain.innerText = "Please try again later. If the problem persists, please contact me.";
    const confirmButton = document.createElement("button");
    confirmButton.innerText = "OK";
    confirmButton.onclick = clearGenericError;
    genericError.appendChild(confirmButton);
}

//stored in a variable so manage-account.js can redefine it
let checkEnableSignupButton = () => {
    let disable = false;
    const usernameField = document.getElementById("signup-username");
    if (!usernameField.value) {
        disable = true;
    }
    const passwordField = document.getElementById("signup-password");
    if (!passwordField.value) {
        disable = true;
    }
    const confirmField = document.getElementById("signup-confirmpassword");
    if (!confirmField.value) {
        disable = true;
    }

    Array.from(document.getElementsByClassName("error-message")).forEach(element => {
        if (element.innerText) {
            disable = true;
        }
    });
    
    const button = document.getElementById("signup-submit-button");
    if (disable) {
        button.className = "disabled";
    } else {
        button.className = null;
    }
}

function validatePasswordInput(input) {
    let isValid = false;
    if (!input.value) {
        const errorMessage = document.getElementById("password-error");
        errorMessage.innerText = null;
        errorMessage.style.display = null;
    } else if (input.value.length < 8) {
        const errorMessage = document.getElementById("password-error");
        errorMessage.innerText = "Password is below 8 characters";
        errorMessage.style.display = "block";
    } else {
        const errorMessage = document.getElementById("password-error");
        errorMessage.innerText = null;
        errorMessage.style.display = null;
        isValid = true;
    }
    validateGenericInput(input, isValid);
    const confirmField = document.getElementById("signup-confirmpassword");
    if (confirmField.value) {
        validatePasswordConfirm(confirmField);
    }
}

function validatePasswordConfirm(input) {
    const passwordField = document.getElementById("signup-password");
    let isValid = false;
    if (!input.value) {
        const errorMessage = document.getElementById("password-confirm-error");
        errorMessage.innerText = null;
        errorMessage.style.display = null;
    } else if (input.value.length < 8) {
        const errorMessage = document.getElementById("password-confirm-error");
        errorMessage.innerText = "Password is below 8 characters";
        errorMessage.style.display = "block";
    } else if (passwordField.value === input.value) {
        const errorMessage = document.getElementById("password-confirm-error");
        errorMessage.innerText = null;
        errorMessage.style.display = null;
        isValid = true;
    } else {
        const errorMessage = document.getElementById("password-confirm-error");
        errorMessage.innerText = "Passwords do not match";
        errorMessage.style.display = "block";
    }
    this.validateGenericInput(input, isValid);
}

function validateUrlInput(input) {
    if (!input.value) {
        const errorMessage = document.getElementById("credits-url-error");
        errorMessage.innerText = null;
        errorMessage.style.display = null;
        return;
    }
    const url = makeUrl(input.value);
    if (!url) {
        const errorMessage = document.getElementById("credits-url-error");
        errorMessage.innerText = "URL is invalid";
        errorMessage.style.display = "block";
    } else {
        const errorMessage = document.getElementById("credits-url-error");
        input.value = url;
        errorMessage.innerText = null;
        errorMessage.style.display = null;
    }
    this.validateGenericInput(input, url);
}

function makeUrl(str) {
    try {
        return new URL(str).toString();
    } catch (error) {
        return false;
    }
}

async function checkUsernameAvailable(input) {
    if (!input.value) {
        const errorMessage = document.getElementById("username-error");
        errorMessage.innerText = null;
        errorMessage.style.display = null;
        return;
    }
    const destination = `${API_URL}:${API_PORT}/users/${input.value}`;

    //render username bar in "awaiting" mode
    let isValid = false;
    try {
        const response = await fetch(destination, {
            method: 'GET',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer'
        });
        if (response.ok) {
            const errorMessage = document.getElementById("username-error");
            errorMessage.innerText = null;
            errorMessage.style.display = null;
            isValid = true;
        } else if (response.status === 409) {
            const errorMessage = document.getElementById("username-error");
            errorMessage.innerText = "This username is taken!";
            errorMessage.style.display = "block";
        } else {
            throw new Error();
        }
    } catch (error) {
        const errorMessage = document.getElementById("username-error");
        errorMessage.innerText = "Oh no! There was an error when checking this username with the server. Please try again later. If the problem persists, please contact me.";
        errorMessage.style.display = "block";
    }

    validateGenericInput(input, isValid);
}