async function signin(form) {
    const destination = `${API_URL}:${API_PORT}/login`;

    const data = {
        username: form.username.value,
        password: form.password.value
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
            window.location.href = '/profile';
        } else {
            //TODO: handle incorrect logins
        }
    } catch (error) {
        //render something to indicate an error, not incorrect login
    }
}