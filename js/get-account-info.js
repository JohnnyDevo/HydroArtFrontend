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
            //render something in the browser to let the user know something happened
        }
    } catch (error) {
        //render something in the browser to let the user know something happened
    }
}

function populateUserInfo(user) {
    document.getElementById("user-info-username").innerHTML = user.username;
    document.getElementById("user-info-credits_name").innerHTML = user.credits_name;
    document.getElementById("user-info-credits_url").innerHTML = user.credits_url;
    document.getElementById("user-info-contact_info").innerHTML = user.contact_info;
}