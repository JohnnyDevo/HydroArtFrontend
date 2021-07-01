function makeButton() {
    const context = document.getElementById('context-buttons');
    const container = document.createElement('div');
    container.id = "toggle-upgrades";
    context.append(container);

    const button = document.createElement('button');
    button.id = "toggle-upgrades-button";
    button.onclick = toggleUpgrades;
    container.appendChild(button);

    const label = document.createElement('label');
    label.htmlFor = "toggle-upgrades-button";
    label.id = "toggle-upgrades-label";
    label.innerText = "show upgrades";
    container.appendChild(label);
}

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

    const button = document.getElementById('toggle-upgrades-button');
    if (button.style.backgroundImage === 'url("/tickbox_ticked.png")') {
        button.style.backgroundImage = 'url("/tickbox_unticked.png")';
    } else {
        button.style.backgroundImage = 'url("/tickbox_ticked.png")';
    }
}

function toggleHidden(element) {
    if (element.style.display === "none") {
        element.style.display = "flex";
    } else {
        element.style.display = "none";
    }
}