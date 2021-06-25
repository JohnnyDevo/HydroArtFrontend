async function signup(form) {
    const destination = 'http://localhost:3000/users';

    const data = {
        username: form.username.value,
        password: form.password.value,
        credits_name: form.credits_name.value,
        credits_url: form.credits_url.value,
        contact_info: form.contact_info.value
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
        window.location.href = '/signin/index.html';
    } catch (error) {
        
    }
}