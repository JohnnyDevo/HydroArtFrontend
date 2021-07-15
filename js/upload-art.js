let uploadButtonClicked = false;

async function uploadArt(form) {
    if (uploadButtonClicked) {
        return;
    } else {
        uploadButtonClicked = true;
    }
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
            window.location.href = `/cards/view?cardID=${form.cardID.value}&artID=${artInfo.id}`;
        } else {
            throw new Error();
        }
    } catch (error) {
        const errorMessage = document.getElementById("upload-art-error");
        errorMessage.style.display = "block";
        errorMessage.innerText = "There was an error when submitting your art to the server, please try again later.";
        uploadButtonClicked = false;
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