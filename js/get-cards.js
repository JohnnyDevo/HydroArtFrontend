async function getAllCards() {
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

    document.getElementById('results').innerText = JSON.stringify(result, null, 1);
}

function getSearchText() {
    let paramName = 'search'

    //regex to read the parameters
    paramName = paramName.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);

    if (results && results[2]) {
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
};

async function doSearch() {
    const search = getSearchText();
    if (!search) {
        search = "";
    }
    document.getElementById('search-text').innerText = `you searched for: ${search}`;
    const destination = 'http://localhost:3000/cards/search?';
    const query = `search=${encodeURIComponent(search)}`

    const response = await fetch(`${destination}${query}`, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer'
    });

    const result = await response.json();

    document.getElementById('results').innerText = JSON.stringify(result, null, 1);
}