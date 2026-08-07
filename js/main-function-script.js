function go_to(underpage){
    if (underpage.startsWith("http://") || underpage.startsWith("https://")){
        window.open(underpage, "_blank")
    } else {
        window.location.href = underpage;
    }
}

const form = document.querySelector("form");
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                "Accept": "applicatoin/json"
            }
        });

        if (response.ok) {
            alert("Nachricht wurde erfolgreich gesendet!");
            form.reset();
        } else {
            alert("Fehler beim Senden.");
        }
    });
}