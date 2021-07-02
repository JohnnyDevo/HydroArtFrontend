async function getAllArt() {
    const destination = `${API_URL}:${API_PORT}/art`;

    const response = await fetch(destination, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer'
    });

    if (response.ok) {
        const result = await response.json();
        console.log(result);
    } else {
        console.log(response);
    }
}