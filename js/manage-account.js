let updateButtonClicked = false;

async function updateAccount(form) {
    if (updateButtonClicked) {
        return;
    } else {
        updateButtonClicked = true;
    }
    const destination = `${API_URL}:${API_PORT}/users`;

    const data = {
        username: form.username.value,
        password: form.password.value,
        credits_name: form.credits_name.value,
        credits_url: form.credits_url.value,
        contact_info: form.contact_info.value,
        old_password: form.key.value
    };

    try {
        const response = await fetch(destination, {
            method: 'PUT',
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
            updateButtonClicked = false;
        }
    } catch (error) {
        makeGenericError(error.message, "browser");
        updateButtonClicked = false;
    }
}

//this script depends on signup.js, and redefines this method
checkEnableSignupButton = () => {
    let disable = false;
    const keyField = document.getElementById("signup-key");
    if (!keyField.value) {
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

function checkOldPasswordField(input) {
    validateGenericInput(input);
}