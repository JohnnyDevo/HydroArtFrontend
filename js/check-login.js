async function onLoadPage(redirect) {
    const destination = `${API_URL}:${API_PORT}/users`;

    let username;
    try {
        const response = await fetch(destination, {
            method: 'GET',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer',
            credentials: 'include'
        });
    
        if (response.ok) {
            const user = await response.json();
            username = user.username;
            if (!user.username) {
                if (redirect) {
                    window.location.replace('/signin');
                }
            }
        }
    } catch (error) {
        //render something in the browser to let the user know something happened
    }

    makeHeader(username);
    makeFooter();
}

function makeHeader(name) {
    let label = 'Sign In';
    let link = '/signin';
    if (name) {
        label = name;
        link = '/profile';
    }

    document.getElementById('nav-bar').innerHTML = `
        <a class="navigation" href="/">Home</a>
        <a class="navigation" href="/art">Art</a>
        <a class="navigation" href="/cards">Cards</a>
        <form id="search" action="/cards/search" method="GET">
            <input type="text" id="searchBar" name="search" placeholder="card search...">
            <button type="submit" id="submitButton"><img id="searchIcon" src="/search-icon.png"></button>
        </form>
        <a id="user" class="navigation" href="${link}">${label}</a>
    `;
}

function makeFooter() {
    document.getElementById('footer').innerHTML = `
        <a class="navigation" href="/aboutme">About Me</a>
        <a class="navigation" href="/contactme">Contact Me</a>
    `;
}