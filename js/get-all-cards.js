async function getCards() {
    const destination = 'http://localhost:3000/cards';

    const response = await fetch(destination, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer'
    });

    const result = await response.json();

    document.getElementById('results').innerText = result;
}