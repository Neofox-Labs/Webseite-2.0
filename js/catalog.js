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

    const bookLinks = document.querySelectorAll(".book-link");
    const homeButton = document.getElementById("homePage");
    const bookTabs = document.querySelectorAll(".book-tab");
    homeButton.addEventListener("click", goHome);

    const projectVideos = document.querySelectorAll(".project-video");

    
    const projectSubtabsContainer = document.querySelector(".project-subtabs");

    const projectSubtabs = document.querySelectorAll(".project-subtab");


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
    const animationDuration = 800;

    function hideControlsWhileTurning() {
        catalogControls.classList.add("is-turning");
    }

    function showControlsAfterTurning() {
        catalogControls.classList.remove("is-turning");
    }

    console.log("2: status gefunden");

    /* =========================================
       BLATTREIHENFOLGE
    ========================================= */

    function setSheetOrder() {
        sheets.forEach((sheet, index) => {

            if (index < currentSheet) {
                // Bereits umgeblätterte Seiten links
                // Je näher an currentSheet, desto weiter oben
                sheet.style.zIndex = index + 1;
            } else {
                // Noch nicht umgeblätterte Seiten rechts
                // Die aktuelle Seite muss ganz oben liegen
                sheet.style.zIndex =
                    sheets.length - (index - currentSheet);
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
        updateBookTabs();
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
            updateBookTabs();
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

        hideControlsWhileTurning();

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
            currentSheet++;
            setSheetOrder();
            sheet.classList.remove("is-turning");
            updateButtons();
            updateBookTabs();

            showControlsAfterTurning();

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

        hideControlsWhileTurning();

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
            setSheetOrder();
            sheet.classList.remove("is-turning");
            updateButtons();
            updateBookTabs();

            showControlsAfterTurning();

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

    /* =========================================
       ZU SEITE SPRINGEN
    ========================================= */

    bookLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            const targetChapter = document.getElementById(targetId);
            if (!targetChapter) {
                console.error("Kapitel nicht gefunden:", targetId);
                return;
            }
            const targetSheet =
                targetChapter.querySelector(".catalog-sheet");
            if (!targetSheet) {
                console.error(
                    "Keine Buchseite im Kapitel gefunden:",
                    targetId
                );
                return;
            }
            const targetIndex = sheets.indexOf(targetSheet);
            console.log("Zielseite:", targetIndex);
            goToSheet(targetIndex);
        });
    });


    function goToSheet(targetIndex) {
        if (isAnimating || targetIndex === currentSheet) {
            return;
        }
        isAnimating = true;

        hideControlsWhileTurning();

        const oldIndex = currentSheet;
        const topZ = sheets.length + 300;

        /* =========================================
           NACH VORNE SPRINGEN
           Seitenzahl wird höher
           Blätter drehen nach LINKS
        ========================================= */

        if (targetIndex > oldIndex) {
            const sheetsToTurn = sheets.slice(
                oldIndex,
                targetIndex
            );

            /* -----------------------------------------
               ERSTE HÄLFTE

               Auf der rechten Seite muss das ERSTE
               Blatt oben liegen.

               Beispiel:
               2 -> 7

               Blatt 2 liegt oben,
               dann 3,
               dann 4 ...
            ----------------------------------------- */

            sheetsToTurn.forEach((sheet, index) => {
                sheet.classList.add("is-turning");
                sheet.style.zIndex =
                    topZ - index;
            });

            /* -----------------------------------------
               DREHUNG STARTEN
            ----------------------------------------- */

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sheetsToTurn.forEach(sheet => {
                        sheet.classList.add("is-turned");
                    });
                });
            });

            /* -----------------------------------------
               BEI 90° STAPEL UMDREHEN

               Jetzt befinden sich die Blätter auf
               der LINKEN Buchseite.

               Dort muss das LETZTE Blatt oben liegen,
               weil dessen Rückseite die neue linke
               Zielseite ist.
            ----------------------------------------- */

            window.setTimeout(() => {
                sheetsToTurn.forEach((sheet, index) => {
                    sheet.style.zIndex =
                        topZ -
                        (sheetsToTurn.length - 1 - index);
                });
            }, animationDuration / 2);

            /* -----------------------------------------
               ANIMATION BEENDET
            ----------------------------------------- */

            window.setTimeout(() => {
                currentSheet = targetIndex;
                sheetsToTurn.forEach(sheet => {
                    sheet.classList.remove("is-turning");
                    sheet.style.zIndex = "";
                });
                setSheetOrder();
                updateButtons();
                updateBookTabs();

                showControlsAfterTurning();
                
                isAnimating = false;
            }, animationDuration);
        }

        /* =========================================
           NACH HINTEN SPRINGEN
           Seitenzahl wird kleiner
           Blätter drehen nach RECHTS
        ========================================= */

        else {
            const sheetsToTurn = sheets.slice(
                targetIndex,
                oldIndex
            );

            /* -----------------------------------------
               ERSTE HÄLFTE

               Wir starten auf der LINKEN Seite.

               Deshalb muss zunächst das LETZTE Blatt
               oben liegen.
            ----------------------------------------- */

            sheetsToTurn.forEach((sheet, index) => {
                sheet.classList.add("is-turning");
                sheet.style.zIndex =
                    topZ -
                    (sheetsToTurn.length - 1 - index);
            });

            /* -----------------------------------------
               DREHUNG STARTEN
            ----------------------------------------- */

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sheetsToTurn.forEach(sheet => {
                        sheet.classList.remove("is-turned");
                    });
                });
            });

            /* -----------------------------------------
               BEI 90° STAPEL UMDREHEN

               Jetzt kommen die Blätter auf die
               RECHTE Buchseite.

               Dort muss das ERSTE Blatt oben liegen,
               weil dessen Vorderseite die neue
               rechte Zielseite ist.
            ----------------------------------------- */

            window.setTimeout(() => {
                sheetsToTurn.forEach((sheet, index) => {
                    sheet.style.zIndex =
                        topZ - index;
                });
            }, animationDuration / 2);

            /* -----------------------------------------
               ANIMATION BEENDET
            ----------------------------------------- */

            window.setTimeout(() => {
                currentSheet = targetIndex;
                sheetsToTurn.forEach(sheet => {
                    sheet.classList.remove("is-turning");
                    sheet.style.zIndex = "";
                });
                setSheetOrder();
                updateButtons();
                updateBookTabs();

                showControlsAfterTurning();
                
                isAnimating = false;
            }, animationDuration);
        }
    }

    function goHome() {
        if (isAnimating || currentSheet === 0) {
            return;
        }
        goToSheet(0);
    }

    bookTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.dataset.target;
            const targetChapter = document.getElementById(targetId);
            if (!targetChapter) {
                console.error("Kapitel nicht gefunden:", targetId);
                return;
            }
            const targetSheet =
                targetChapter.querySelector(".catalog-sheet");
            if (!targetSheet) {
                console.error(
                    "Keine Buchseite im Kapitel gefunden:",
                    targetId
                );
                return;
            }
            const targetIndex = sheets.indexOf(targetSheet);
            if (!catalogBook.classList.contains("is-open")) {
                openCatalog();
                window.setTimeout(() => {
                    goToSheet(targetIndex);
                }, 500);
            } else {
                goToSheet(targetIndex);
            }
        });
    });

    /* =========================================
       PROJEKT-UNTERREITER
    ========================================= */

    projectSubtabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetPage =
                Number(tab.dataset.page);
            const targetSheet = sheets.find(
                sheet =>
                    Number(sheet.dataset.page) === targetPage
            );
            if (!targetSheet) {
                console.error(
                    "Projektseite nicht gefunden:",
                    targetPage
                );
                return;
            }
            const targetIndex =
                sheets.indexOf(targetSheet);

            /* Buch gegebenenfalls zuerst öffnen */

            if (
                !catalogBook.classList.contains("is-open")
            ) {
                openCatalog();
                window.setTimeout(() => {
                    goToSheet(targetIndex);
                }, 500);
            } else {
                goToSheet(targetIndex);
            }
        });
    });

    function updateBookTabs() {
        /* =========================================
           BUCH GESCHLOSSEN
        ========================================= */

        if (!catalogBook.classList.contains("is-open")) {

            bookTabs.forEach(tab => {
                tab.classList.remove("active");
            });
            projectSubtabsContainer?.classList.remove("is-visible");
            projectSubtabs.forEach(tab => {tab.classList.remove("active");});
            return;
        }


        /* =========================================
           HAUPTREITER
        ========================================= */

        const chapterTabs = Array.from(bookTabs);
        chapterTabs.forEach((tab, index) => {
            const targetId = tab.dataset.target;
            const chapter = document.getElementById(targetId);
            if (!chapter) {
                tab.classList.remove("active");
                return;
            }
            const chapterSheet = chapter.querySelector(".catalog-sheet");
            const startIndex = sheets.indexOf(chapterSheet);
            const nextTab = chapterTabs[index + 1];
            let endIndex = sheets.length;
            if (nextTab) {
                const nextChapter = document.getElementById(nextTab.dataset.target);
                if (nextChapter) {
                    const nextSheet = nextChapter.querySelector(".catalog-sheet");
                    endIndex = sheets.indexOf(nextSheet);
                }
            }
            tab.classList.toggle(
                "active",
                currentSheet >= startIndex &&
                currentSheet < endIndex
            );
        });


        /* =========================================
           PROJEKT-UNTERREITER EINBLENDEN
        ========================================= */

        const projectsTab = document.querySelector('.book-tab[data-target="kapitel_projekte"]');

        const projectsActive = projectsTab?.classList.contains("active");
        projectSubtabsContainer?.classList.toggle("is-visible", projectsActive);


        /* =========================================
           AKTIVEN PROJEKT-UNTERREITER MARKIEREN
        ========================================= */

        projectSubtabs.forEach(tab => {
            const page = Number(tab.dataset.page);
            const targetSheet = sheets.find(sheet => Number(sheet.dataset.page) === page);
            if (!targetSheet) {
                tab.classList.remove("active");
                return;
            }
            const targetIndex = sheets.indexOf(targetSheet);
            tab.classList.toggle(
                "active",
                currentSheet === targetIndex
            );
        });
    }

    /* =========================================
       VIDEOEINBETTUNG
    ========================================= */

    projectVideos.forEach(video => {
        video.addEventListener("click", () => {
            const videoId = video.dataset.videoId;

            if (!videoId) {
                console.error("Keine YouTube-Video-ID gefunden.");
                return;
            }

            const iframe = document.createElement("iframe");

            iframe.src =
                `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;

            iframe.title = "YouTube Video";
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;

            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "0";

            video.innerHTML = "";
            video.appendChild(iframe);
        });
    });
});