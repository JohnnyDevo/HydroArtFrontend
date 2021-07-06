async function uploadArt(form) {
    const destination = `${API_URL}:${API_PORT}/art`;

    try {
        const response = await fetch(destination, {
            method: 'POST',
            redirect: 'manual',
            referrerPolicy: 'no-referrer',
            body: new FormData(form),
            credentials: 'include'
        });
        if (response.ok) {
            const artInfo = await response.json();
            document.getElementById('reflect').src = `data:image/png;base64,${artInfo.encode}`;
            //generate link to the card
        } else {
            //render the reason why the submission was rejected
        }
    } catch (error) {
        //render some indication that an error happened that wasn't a failed submission
    }
}

function checkSize(input) {
    const sizeWarning = document.getElementById("size-warning");
    if (input.files[0].size > 1048576) {
        sizeWarning.style.display = "block";
        input.value = "";
    } else {
        sizeWarning.style.display = "none"
    }
}