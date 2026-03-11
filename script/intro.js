document.addEventListener("DOMContentLoaded", function () {
    disableScroll();
    const intro = document.getElementById("intro");
    const mainContent = document.getElementById("main_container");
    const enterBtn = document.getElementById("enterBtn");

    enterBtn.addEventListener("click", function () {
        intro.classList.add("slide_out");
        enableScroll();

        setTimeout(() => {
            intro.style.display = "none";
            mainContent.style.display = "grid";
        }, 1000);
    });
});


setTimeout(() => {
    const enterBtn = document.getElementById("enterBtn");
    enterBtn.style.opacity = "1";
    enterBtn.style.transform = "scale(1)";

    setTimeout(() => {
        enterBtn.classList.add("pulse");
    }, 1000);
}, 1500);