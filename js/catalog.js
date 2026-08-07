document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTE
    ========================================= */

    const catalogBook = document.getElementById("catalogBook");
    const bookCover = document.getElementById("bookCover");
    const catalogControls = document.getElementById("catalogControls");
    const catalogIntro = document.querySelector(".catalog-intro");

    const previousButton = document.getElementById("previousPages");
    const nextButton = document.getElementById("nextPages");
    const closeButton = document.getElementById("closeCatalog");

    const sheets = Array.from(
        document.querySelectorAll(".catalog-sheet")
    );

    

    /* =========================================
       SICHERHEITSPRÜFUNG
    ========================================= */

    /*if (
        !catalogBook ||
        !bookCover ||
        !catalogControls ||
        !previousButton ||
        !nextButton ||
        !closeButton ||
        sheets.length === 0
    ) {

        console.error(
            "Der Referenzkatalog konnte nicht gestartet werden. Prüfe deine HTML-Struktur."
        );

        return;
    }*/



    /* =========================================
       STATUS
    ========================================= */

    let currentSheet = 0;
    let isAnimating = false;

    const animationDuration = 1000;

    console.log("2: status gefunden");

    /* =========================================
       BLATTREIHENFOLGE
    ========================================= */

    function setSheetOrder() {

        sheets.forEach((sheet, index) => {

            if (index < currentSheet) {

                sheet.style.zIndex = index + 1;

            } else {

                sheet.style.zIndex = sheets.length - index;

            }

        });

    }



    /* =========================================
       BUTTONS AKTUALISIEREN
    ========================================= */

    function updateButtons() {

        previousButton.disabled = currentSheet === 0;
        nextButton.disabled = currentSheet === sheets.length;

        previousButton.setAttribute(
            "aria-disabled",
            String(currentSheet === 0)
        );

        nextButton.setAttribute(
            "aria-disabled",
            String(currentSheet === sheets.length)
        );

    }



    /* =========================================
       KATALOG ÖFFNEN
    ========================================= */

    function openCatalog() {

        if (isAnimating) {
            return;
        }

        catalogBook.classList.add("is-open");
        catalogControls.classList.add("is-visible");

        if (catalogIntro) {
            catalogIntro.classList.add("is-hidden");
        }

        bookCover.setAttribute(
            "aria-expanded",
            "true"
        );

        setSheetOrder();
        updateButtons();

    }



    /* =========================================
       KATALOG SCHLIESSEN
    ========================================= */

    function closeCatalog() {

        if (isAnimating) {
            return;
        }

        isAnimating = true;

        catalogBook.classList.remove("is-open");
        catalogControls.classList.remove("is-visible");

        if (catalogIntro) {
            catalogIntro.classList.remove("is-hidden");
        }

        bookCover.setAttribute(
            "aria-expanded",
            "false"
        );

        window.setTimeout(() => {

            sheets.forEach(sheet => {

                sheet.classList.remove(
                    "is-turned",
                    "is-turning"
                );

                sheet.style.zIndex = "";

            });

            currentSheet = 0;
            isAnimating = false;

            setSheetOrder();
            updateButtons();

        }, 500);

    }

    /* =========================================
       VORWÄRTS UMBLÄTTERN
    ========================================= */

    function nextPage() {

        if (
            isAnimating ||
            currentSheet >= sheets.length
        ) {
            return;
        }

        isAnimating = true;

        const sheet = sheets[currentSheet];

        sheet.classList.add("is-turning");

        /*
         * Das aktuelle Blatt muss beim Umblättern
         * über allen anderen liegen.
         */
        sheet.style.zIndex = sheets.length + 10;

        /*
         * Zwei requestAnimationFrame-Aufrufe sorgen
         * für eine saubere CSS-Animation.
         */
        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                sheet.classList.add("is-turned");

            });

        });

        window.setTimeout(() => {

            sheet.classList.remove("is-turning");

            currentSheet++;

            setSheetOrder();
            updateButtons();

            isAnimating = false;

        }, animationDuration);

    }



    /* =========================================
       RÜCKWÄRTS UMBLÄTTERN
    ========================================= */

    function previousPage() {

        if (
            isAnimating ||
            currentSheet <= 0
        ) {
            return;
        }

        isAnimating = true;

        currentSheet--;

        const sheet = sheets[currentSheet];

        sheet.classList.add("is-turning");

        /*
         * Auch beim Zurückblättern liegt das Blatt
         * während der Animation ganz oben.
         */
        sheet.style.zIndex = sheets.length + 10;

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                sheet.classList.remove("is-turned");

            });

        });

        window.setTimeout(() => {

            sheet.classList.remove("is-turning");

            setSheetOrder();
            updateButtons();

            isAnimating = false;

        }, animationDuration);

    }

    /* =========================================
       MAUSSTEUERUNG
    ========================================= */


    bookCover.addEventListener("click", openCatalog);

    nextButton.addEventListener("click", nextPage);

    previousButton.addEventListener("click", previousPage);

    closeButton.addEventListener("click", closeCatalog);



    /* =========================================
       TASTATURSTEUERUNG
    ========================================= */

    document.addEventListener("keydown", event => {

        if (!catalogBook.classList.contains("is-open")) {
            return;
        }

        if (event.key === "ArrowRight") {

            event.preventDefault();
            nextPage();

        }

        if (event.key === "ArrowLeft") {

            event.preventDefault();
            previousPage();

        }

        if (event.key === "Escape") {

            event.preventDefault();
            closeCatalog();

        }

    });



    /* =========================================
       STARTZUSTAND
    ========================================= */

    bookCover.setAttribute(
        "aria-expanded",
        "false"
    );

    setSheetOrder();
    updateButtons();

});