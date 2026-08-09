document.querySelectorAll(".book-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        const page = Number(link.dataset.page);

        goToPage(page);
    });
});

function goToPage(targetPage) {

    while (currentPage < targetPage) {
        flipNextPage();
    }

    while (currentPage > targetPage) {
        flipPreviousPage();
    }

}