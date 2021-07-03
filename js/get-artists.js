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
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    const table = document.createElement("table");
    table.id = "artist-table";
    container.appendChild(table);

    const thead = document.createElement("thead");
    table.appendChild(thead);

    const headRow = document.createElement("tr");
    thead.appendChild(headRow);

    const artistNameHead = document.createElement("th");
    artistNameHead.innerText = "Artist";
    headRow.appendChild(artistNameHead);

    const artistPageHead = document.createElement("th");
    artistPageHead.innerText = "Artist's Page";
    headRow.appendChild(artistPageHead);

    const artistContributionsHead = document.createElement("th");
    artistContributionsHead.innerText = "Contributions";
    headRow.appendChild(artistContributionsHead);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for(const artist in results) {
        const tableRow = createRow(results[artist]);
        tbody.appendChild(tableRow);
    }
}

function createRow(artist) {
    const row = document.createElement("tr");

    const artistName = document.createElement("td");
    row.appendChild(artistName);

    const artistNameLink = document.createElement("a");
    artistNameLink.href = `/art/submissions/index.html?artistID=${artist.id}`;
    artistNameLink.innerText = artist.credits_name;
    artistName.appendChild(artistNameLink);

    const artistPage = document.createElement("td");
    row.appendChild(artistPage);

    const artistPageLink = document.createElement("a");
    artistPageLink.href = artist.credits_url;
    artistPageLink.innerText = artist.credits_url;
    artistPage.appendChild(artistPageLink);

    const contributions = document.createElement("td");
    contributions.innerText = artist.contributions;
    row.appendChild(contributions);

    return row;
}