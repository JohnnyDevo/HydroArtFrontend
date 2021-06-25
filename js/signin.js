const destination = 'http://localhost:3000/signin';

async function signup(form) {
    const data = JSON.stringify({
        username: form.username,
        password: form.password
    });
    const response = await fetch(destination, {
        method: 'POST',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: data
    });
    alert(`sign in response is: ${response.json()}`);
}