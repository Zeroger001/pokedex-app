function addButtonsEvents() {
    scrollTopButton();
    loadMore();
    loadAll();
};


function scrollTopButton() {
    document.getElementById('scrollToTopBtn').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    });
    window.addEventListener("scroll", function () {
        if (window.scrollY > 600) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        };
    })
};


function loadMore() {
    document.getElementById('loadMoreBtn').addEventListener('click', () => {
        renderMainCard();
    });
};


function loadAll() {
    document.getElementById('showAllBtn').addEventListener('click', () => {
        renderMainCard(Total_Pokemon, true);
    });
};


function setupNavigation(navigateSections) {
    const rightDataArrow = document.getElementById('rightArrowData');
    const leftDataArrow = document.getElementById('leftArrowData');
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    rightDataArrow.addEventListener("click", () => navigateSections("next"));
    leftDataArrow.addEventListener("click", () => navigateSections("prev"));
};


function addPkmNavigation(pokemon) {
    const prevPokemon = document.getElementById(`leftArrowPkm`);
    const nextPokemon = document.getElementById(`rightArrowPkm`);
    prevPokemon.addEventListener("click", () => navigatePokemon("left"));
    nextPokemon.addEventListener("click", () => navigatePokemon("right"));
    async function navigatePokemon(dir) {
        if (!pokemon) return;
        let index = pokemonList.findIndex(p => p.name.toLowerCase() === pokemon);
        index = index + (dir === 'right' ? 1 : -1);
        if (index >= 0 && index < pokemonList.length) {
            const newPokemon = pokemonList[index].name;
            await openLightbox(newPokemon);
        };
    };
};


function addDataNavigation() {
    const sectionElements = {
        details: document.getElementById("data_lightbox"),
        stats: document.getElementById("stats_lightbox"),
        evolve: document.getElementById("evolve_lightbox"),
    };
    let currentSection = "details";
    function navigateSections(direction) {
        let index = ["details", "stats", "evolve"].indexOf(currentSection) + (direction === "next" ? 1 : -1);
        if (index < 0 || index > 2) return;
        sectionElements[currentSection].style.display = "none";
        currentSection = Object.keys(sectionElements)[index];
        sectionElements[currentSection].style.display = "flex";
        updateDataBtnVisibility(currentSection);
    };
    setupNavigation(navigateSections);
};


function createCryButton(pokemon, image) {
    const card = document.createElement('div');
    card.classList.add('lightbox_image_buttons');
    const cryButton = document.createElement('img');
    cryButton.src = 'img/speaker.png';
    cryButton.alt = `${pokemon.name}-cry`;
    cryButton.id = `cryButton`;
    card.appendChild(cryButton);
    addCryButtonEvent(pokemon, cryButton);
    card.appendChild(createShinyButton(pokemon, image));
    return card;
};


function addCryButtonEvent(pokemon, cryButton) {
    let cryAudio = new Audio(pokemon.cries.latest);
    cryButton.addEventListener('click', () => {
        cryAudio.currentTime = 0;
        cryAudio.play();
    });
};


function createShinyButton(pokemon, image) {
    const shinyButton = document.createElement('img');
    shinyButton.src = 'img/shiny_none.png';
    shinyButton.alt = `${pokemon.name}-shiny`;
    shinyButton.id = `shinyButton`;
    addShinyButtonEvent(pokemon, shinyButton, image);
    return shinyButton;
};


function addShinyButtonEvent(pokemon, shinyButton, image) {
    let isShiny = false;
    shinyButton.addEventListener('click', () => {
        isShiny = !isShiny;
        if (isShiny) {
            shinyButton.src = 'img/shiny_hover.png';
            image.src = pokemon.sprites.other.home.front_shiny;
        } else {
            shinyButton.src = 'img/shiny_none.png';
            image.src = pokemon.sprites.other.home.front_default;
        };
    });
};


function createPkmNavigationBtn(dir) {
    const arrow = document.createElement('img');
    arrow.classList.add(`pkm_arrow_${dir}`);
    arrow.id = (`${dir}ArrowPkm`);
    arrow.src = `img/arrow-${dir}.png`;
    return arrow;
};


function createDataNavigationBtn(dir) {
    const arrow = document.createElement('img');
    arrow.classList.add(`data_arrow_${dir}`);
    arrow.id = (`${dir}ArrowData`);
    arrow.src = `img/arrow-${dir}.png`;
    return arrow;
};


// Button Visibilitys
function updatePkmBtnVisibility(pokemon) {
    const prevPokemon = document.getElementById(`leftArrowPkm`);
    const nextPokemon = document.getElementById(`rightArrowPkm`);
    let index = pokemonList.findIndex(p => p.name.toLowerCase() === pokemon);
    prevPokemon.style.display = index === 0 ? "none" : "grid";
    nextPokemon.style.display = index === pokemonList.length - 1 ? "none" : "grid";
};


function updateDataBtnVisibility(currentSection) {
    const rightDataArrow = document.getElementById('rightArrowData');
    const leftDataArrow = document.getElementById('leftArrowData');
    if (!leftDataArrow || !rightDataArrow) return;
    const isDetails = currentSection === "details";
    const isEvolve = currentSection === "evolve";
    leftDataArrow.style.opacity = isDetails ? "0" : "1";
    leftDataArrow.style.pointerEvents = isDetails ? "none" : "auto";
    rightDataArrow.style.opacity = isEvolve ? "0" : "1";
    rightDataArrow.style.pointerEvents = isEvolve ? "none" : "auto";
};


function updateButtonsVisibility(displayedCount) {
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const showAllBtn = document.getElementById("showAllBtn");
    if (displayedCount >= Total_Pokemon) {
        loadMoreBtn.style.display = "none";
        showAllBtn.style.display = "none";
    } else {
        loadMoreBtn.style.display = "block";
        showAllBtn.style.display = "block";
    };
};