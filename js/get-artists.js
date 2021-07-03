async function getAllArtists() {
    const destination = `${API_URL}:${API_PORT}/art/users`;

    try {
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
            populateArtists(result);
        } else {
            console.log(response);
        }
    } catch (error) {
        //render something in the browser to let the user know something error'd
    }
}

function populateArtists(results) {
    const container = document.getElementById("artist-container");
    const tmp = document.createElement("div");
    tmp.innerText = JSON.stringify(results);
    container.appendChild(tmp);
}