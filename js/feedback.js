function initializeFeedback() {
    const reason = getQueryText("reason");
    let element;
    if (reason) {
        element = document.getElementById(reason);
    }
    if (element) {
        const selector = document.getElementById("category");
        selector.value = element.value;
        const cardSelection = document.getElementById("card-feedback");
        const feedbackContainer = document.getElementById("feedback-content");
        switch(reason) {
            case "card":
                cardSelection.style.display = "block";
                break;
            case "reportuser":
                const suspiciousUrl = getQueryText("url");
                if (suspiciousUrl) {
                    feedbackContainer.innerText = `I find the following url to be suspicious: ${suspiciousUrl}.`;
                }
                break;
            case "reportart":
                cardSelection.style.display = "block";
                let suspiciousUser = getQueryText("artist");
                if (!suspiciousUser) {
                    suspiciousUser = "Anonymous";
                }
                feedbackContainer.innerText = `I believe that the art submitted for this card by the artist "${suspiciousUser}" is inappropriate or stolen.`;
                break;
            case "other":
                const custom = document.getElementById("custom-feedback");
                custom.style.display = "block";
                break;
        }
    }
}

function showHideRows(input) {
    const custom = document.getElementById("custom-feedback");
    const card = document.getElementById("card-feedback");
    if (input.value === "Card feedback" || input.value === "Report inappropriate art") {
        custom.style.dispaly = "none";
        card.style.display = "block";
    } else if (input.value === "Other (please specify)") {
        custom.style.display = "block";
        card.style.display = "none";
    } else {
        custom.style.display = "none";
        card.style.display = "none";
    }
}

async function submitFeedback(form) {
    const destination = `${API_URL}:${API_PORT}/comments`;

    const cardContainer = document.getElementById("card-feedback");
    const categorySelect = document.getElementById("category");

    let category;
    if (categorySelect.value === "Other (please specify)") {
        category = document.getElementById("custom-feedback-input").value;
    } else {
        category = categorySelect.value;
    }

    const comment = document.getElementById("feedback-content").value;

    let cardID;
    if (cardContainer.style.display != "none") {
        cardID = document.getElementById("card-id-selector").value;
    }

    const data = {
        category: category,
        comment: comment,
        cardID: cardID
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
            window.history.back();
        } else {
            throw new Error();
        }
    } catch (error) {
        const errorMessage = document.getElementById("feedback-error");
        errorMessage.innerText = "There was an error when communicating with the server, please try again later.";
        errorMessage.style.display = "block";
    }
}