function toggleUpgrades() {
    Array.from(document.getElementsByClassName("card-cost-container")).forEach(toggleHidden);
    Array.from(document.getElementsByClassName("card-description-container")).forEach(toggleHidden);
    Array.from(document.getElementsByClassName("card-name-container")).forEach(element => {
        if (element.style.color === "lime") {
            element.style.color = "white";
        } else {
            element.style.color = "lime";
        }
    });

    const button = document.getElementById('toggle-upgrades');
    if (button.innerText === "hide upgrades") {
        button.innerText = "show upgrades";
    } else {
        button.innerText = "hide upgrades";
    }
}

function toggleHidden(element) {
    if (element.style.display === "none") {
        element.style.display = "flex";
    } else {
        element.style.display = "none";
    }
}