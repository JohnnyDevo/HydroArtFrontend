async function signin(form) {
    const destination = `${API_URL}:${API_PORT}/login`;

    const data = {
        username: form.username.value,
        password: form.password.value
    };
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
    try {
        const result = JSON.parse(await response.text());
        window.location.href = '/profile/index.html';
    } catch (error) {
        
    }
}