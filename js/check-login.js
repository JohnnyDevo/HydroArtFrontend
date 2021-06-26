async function onLoadPage(redirect) {
    const destination = "http://localhost:3000/users"

    const response = await fetch(destination, {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        referrerPolicy: 'no-referrer',
        credentials: 'include'
    });

    let username;
    if (response.ok) {
        const user = await response.json();
        username = user.username;
        if (!user.username) {
            if (redirect) {
                window.location.replace('/signin/index.html');
            }
        }
    }

    makeHeader(username);
    makeFooter();
}

function makeHeader(name) {
    let label = 'Sign In';
    let link = '/signin/index.html';
    if (name) {
        label = name;
        link = '/profile/index.html';
    }

    document.getElementById('header').innerHTML = `
        <img src="/favicon.ico" id="fox">
        <a class="navigation" href="/index.html">Home</a>
        <a class="navigation" href="/cards/index.html">Cards</a>
        <form id="search" action="/cards/search/index.html" method="GET">
            <input type="text" id="searchBar" name="card" placeholder="card search...">
            <button type="submit" id="submitButton"><img id="searchIcon" src="/search-icon.png"></button>
        </form>
        <a id="user" class="navigation" href="${link}">${label}</a>
    `;
}

function makeFooter() {
    document.getElementById('footer').innerHTML = `
        <a class="navigation" href="/aboutme/index.html">About Me</a>
        <a class="navigation" href="/contactme/index.html">Contact Me</a>
    `;
}