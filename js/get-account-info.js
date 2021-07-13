async function getAccountInfo() {
    const destination = `${API_URL}:${API_PORT}/users/profile`;

    try {
        const response = await fetch(destination, {
            method: 'GET',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer',
            credentials: 'include'
        });
    
        if (response.ok) {
            const user = await response.json();
            populateUserInfo(user);
        } else {
            throw new Error();
        }
    } catch (error) {
        const errorMessage = document.getElementById("profile-error");
        errorMessage.innerText = "There was an error when communicating with the server, please try again later.";
        errorMessage.style.display = "block";
    }
}

function populateUserInfo(user) {
    document.getElementById("user-info-username").innerHTML = user.username;
    document.getElementById("user-info-credits_name").innerHTML = user.credits_name;
    document.getElementById("user-info-credits_url").innerHTML = user.credits_url;
    document.getElementById("user-info-contact_info").innerHTML = user.contact_info;
}