async function signup(form) {
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
            window.location.href = `/signin`;
            //TODO: indicate successful sign up
        } else {
            //TODO: render reason why signup failed
        }
    } catch (error) {
        //render some sort of indication that there was an error, and not a bad sign up
    }
}