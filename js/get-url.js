function getUrl() {
    const url = getQueryText("link");
    const linkElement = document.getElementById("external-link");
    linkElement.innerHTML = url;
    linkElement.href = url;
    document.getElementById("report").href = `/feedback/?reason=reportuser&url=${encodeURIComponent(url)}`;
}