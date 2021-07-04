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
    let elem;
    if (name) {
        elem = document.createElement("div");

        const button = document.createElement("button");
        button.className = "nav-button";
        button.innerText = name;
        elem.appendChild(button);

        const dropdown = document.createElement("div");
        dropdown.className = "nav-dropdown";
        elem.appendChild(dropdown);

        const profileLink = document.createElement("a");
        profileLink.href = "/profile";
        profileLink.innerText = "My Profile";
        dropdown.appendChild(profileLink);

        const signOut = document.createElement("span");
        signOut.onclick = signout;
        signOut.innerText = "Sign Out";
        dropdown.appendChild(signOut);
    } else {
        elem = document.createElement("a");
        elem.href = "/signin";
        elem.innerText = "Sign In";
    }
    elem.className = "navigation";

    const navBar = document.getElementById('nav-bar');
    navBar.innerHTML = `
        <a class="navigation" href="/">Home</a>
        <div class="navigation">
            <button class="nav-button">Art</button>
            <div class="nav-dropdown">  
                <a href="/art">Submissions</a>
                <a href="/art/contributors">Contributors</a>
            </div>
        </div>
        <a class="navigation" href="/cards">Cards</a>
        <form id="search" action="/cards/search" method="GET">
            <input type="text" id="searchBar" name="search" placeholder="card search...">
            <button type="submit" id="submitButton"><img id="searchIcon" src="/search-icon.png"></button>
        </form>
    `;
    navBar.appendChild(elem);
}

function makeFooter() {
    document.getElementById('footer').innerHTML = `
        <a class="navigation" href="/aboutme">About Me</a>
        <a class="navigation" href="/contactme">Contact Me</a>
    `;
}

async function signout() {
    const destination = `${API_URL}:${API_PORT}/users/logout`;

    try {
        const response = await fetch(destination, {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            referrerPolicy: 'no-referrer',
            credentials: 'include'
        });
        if (response.ok) {
            window.location.href = '/';
        }
    } catch (error) {
        //render something to indicate an error occured
    }
}