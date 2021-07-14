const queryText = new URLSearchParams(window.location.search);

function getQueryText(paramName) {
    return queryText.get(paramName);
};