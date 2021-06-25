const destination = 'http://localhost:3000/signup';

async function signup(form) {
    const data = JSON.stringify({
        username: form.username,
        password: form.password,
        credits_name: form.credits_name,
        credits_url: form.credits_url,
        contact_info: form.contact_info
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
    alert(`sign up response is: ${response.json()}`);
}