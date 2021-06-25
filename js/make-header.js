document.write(`
    <nav id="header">
        <img src="/favicon.ico" id="fox">
        <a class="navigation" href="/index.html">Home</a>
        <a class="navigation" href="/cards/index.html">Cards</a>
        <form id="search" action="/cards/view/index.html" method="GET">
            <input type="text" id="searchBar" name="card" placeholder="card lookup...">
            <button type="submit" id="submitButton"><img id="searchIcon" src="/search-icon.png"></button>
        </form>
        <a id="user" class="navigation" href="/signin/index.html">Sign In</a>
    </nav>
`);

const url = "http://localhost:3000/users"

async function getUser() {
    const response = await fetch(destination, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer'
    });
    alert(`get user result: ${response.json()}`);
}

getUser();