fetch("navbar.html")
    .then(Response => Response.text())
    .then(data => {document.getElementById("navbar").innerHTML = data});

fetch("footer.html")
    .then(Response => Response.text())
    .then(data => {document.getElementById("footer").innerHTML = data});