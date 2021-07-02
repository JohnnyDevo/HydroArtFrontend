async function uploadArt(form) {
    const destination = `${API_URL}:${API_PORT}/art`;

    const response = await fetch(destination, {
        method: 'POST',
        redirect: 'manual',
        referrerPolicy: 'no-referrer',
        body: new FormData(form),
        credentials: 'include'
    });
    const artInfo = await response.json();
    document.getElementById('reflect').src = `data:image/png;base64,${artInfo.encode}`
}