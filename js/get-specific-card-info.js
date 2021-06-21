let paramName = 'card';

//regex to read the parameters
paramName = paramName.replace(/[\[\]]/g, '\\$&');
const regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)');
const results = regex.exec(window.location.href);

if (results && results[2]) {
    const element = document.getElementById('result');
    element.innerHTML = `The card searched for is "${decodeURIComponent(results[2].replace(/\+/g, ' '))}".`;
}