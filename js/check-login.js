window.onload = onLoadPage;

async function onLoadPage(askLogin, callback) {
    const destination = `${API_URL}:${API_PORT}/users`;

    let username;
    let id;
    let ok = false;
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
            if (user.username) {
                ok = true;
                username = user.username;
                id = user.id;
            }
        }
    } catch (error) {
        //render something in the browser to let the user know something happened
    }

    if (!ok && askLogin) {
        makeSigninPrompt(false);
    }

    makeHeader(username);
    makeFooter();

    if (ok && callback) {
        callback(id);
    }
}

function makeSigninPrompt(skipObserve) {
    const html = document.getElementsByTagName("html")[0];

    const film = document.createElement("div");
    film.id = "login-tint";
    html.appendChild(film);

    if (!skipObserve) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.removedNodes.forEach(node => {
                    if (node.id == "login-tint") {
                        history.back();
                        observer.disconnect();
                    }
                });
            });
        });

        observer.observe(html, {childList: true, subtree: false});
    }

    const prompt = document.createElement("div");
    prompt.id = "login-prompt";
    html.appendChild(prompt);

    const xButton = document.createElement("button");
    xButton.id = "x-button";
    xButton.innerText = "X";
    xButton.onclick = () => {
        film.remove();
        prompt.remove();
    }
    prompt.appendChild(xButton);

    const title = document.createElement("p");
    title.innerText = "User Login";
    prompt.appendChild(title);

    const form = document.createElement("form");
    prompt.appendChild(form);

    let inputRow = document.createElement("div");
    inputRow.className = "input-row";
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "username-input";
    usernameInput.name = "username";
    usernameInput.placeholder = "Username: ";
    inputRow.appendChild(usernameInput);
    form.appendChild(inputRow);

    inputRow = document.createElement("div");
    inputRow.className = "input-row";
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password-input";
    passwordInput.name = "password";
    passwordInput.placeholder = "Password: ";
    inputRow.appendChild(passwordInput);
    form.appendChild(inputRow);

    inputRow = document.createElement("div");
    inputRow.className = "input-row";
    const button = document.createElement("input");
    button.type = "button";
    button.name = "submitbutton";
    button.value = "Log In";
    button.onclick = signin;
    inputRow.appendChild(button);
    form.appendChild(inputRow);

    const signup = document.createElement("p");
    signup.innerText = "Don't have an account? ";
    const signupLink = document.createElement("a");
    signupLink.innerText = "Sign Up!";
    signupLink.href = "/signup";
    signup.appendChild(signupLink);
    prompt.appendChild(signup);
}

async function signin(clickEvent) {
    const form = clickEvent.explicitOriginalTarget.form;
    const destination = `${API_URL}:${API_PORT}/login`;

    const data = {
        username: form.username.value,
        password: form.password.value
    };

    try {
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
        
        if (response.ok) {
            window.location.reload();
        } else {
            //TODO: handle incorrect logins
        }
    } catch (error) {
        //render something to indicate an error, not incorrect login
    }
}

function makeHeader(name) {
    let elem;
    if (name) {
        elem = document.createElement("div");

        const button = document.createElement("button");
        button.className = "nav-button";
        button.innerHTML = name;
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
        elem = document.createElement("button");
        elem.onclick = makeSigninPrompt;
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
                <a href="/art/upload">Upload</a>
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