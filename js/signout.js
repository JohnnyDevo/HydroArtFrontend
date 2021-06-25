async function signout() {
    const destination = 'http://localhost:3000/users/logout';

    const response = await fetch(destination, {
        method: 'POST',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer',
        credentials: 'include'
    });
    try {
        const result = JSON.parse(await response.text());
        window.location.href = '/index.html';
    } catch (error) {
        
    }
}