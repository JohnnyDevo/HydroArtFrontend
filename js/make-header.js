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

async function getUser() {
    const destination = "http://localhost:3000/users"

    const response = await fetch(destination, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer',
        credentials: 'include'
    });
    const text = await response.text()
    try {
        const result = JSON.parse(text);
        const element = document.getElementById('user');
        element.innerText = result.username;
        element.href = "/profile/index.html"
    } catch (error) {
        
    }
}

getUser();