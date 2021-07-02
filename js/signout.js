async function signout() {
    const destination = `${API_URL}:${API_PORT}/users/logout`;

    const response = await fetch(destination, {
        method: 'POST',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer',
        credentials: 'include'
    });
    if (response.ok) {
        window.location.href = '/index.html';
    }
}