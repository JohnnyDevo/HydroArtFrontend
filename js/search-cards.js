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

    document.getElementById('results').innerText = await response.json();
}