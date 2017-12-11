function download() {

    var transcript = document.getElementById('speech').innerHTML;
    var transcriptBlob = new Blob([transcript], {type:'text/plain'});
    var filename = 'transcript.txt';

    // Create clickable link
    var downloadLink = document.createElement("a");

    // Identify filename
    downloadLink.download = filename;

    // Provide body for the link
    downloadLink.innerHTML = "My Hidden Link";

    /* Allow our code to work in webkit & Gecko based browsers
     without the need for a if / else block */
    window.URL = window.URL || window.webkitURL;

    // Create the link Object.
    downloadLink.href = window.URL.createObjectURL(transcriptBlob);

    // Destroy link
    downloadLink.onclick = destroyLink;

    // Hides link.
    downloadLink.style.display = "none";

    // Add the link to the DOM
    document.body.appendChild(downloadLink);

    // Click the new link
    downloadLink.click();
}

function destroyLink(event)
{
    // Remove the link from the DOM
    document.body.removeChild(event.target);
}