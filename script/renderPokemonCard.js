

function renderMainCard(batchSize = BATCH_SIZE, showAll = false) {
    setTimeout(() => {
        showLoader();
        if (showAll) {
            displayedCount = Total_Pokemon;
        } else {
            displayedCount = Math.min(displayedCount + batchSize, pokemonList.length);
        };
        clearMainContainer();
        attachLightbox();
        updateButtonsVisibility(displayedCount)
        hideLoader();
    }, 100);
};


function clearMainContainer() {
    const mainContainer = document.getElementById('main_container');
    mainContainer.innerHTML = "";
    const pokemonToShow = pokemonList.slice(0, (displayedCount));
    pokemonToShow.forEach((pokemon) => {
        if (pokemon) {
            fillMainContainer(pokemon);
        } else {
            console.warn("Pokémon undefined!", pokemon);
        };
    });
};


function fillMainContainer(pokemon) {
    const mainContainer = document.getElementById('main_container');
    const card = document.createElement('div');
    card.id = 'cards';
    card.appendChild(createHeader(pokemon));
    card.appendChild(createSprite(pokemon));
    card.appendChild(createFooter(pokemon));
    mainContainer.appendChild(card);
};


function createHeader(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card_header');
    card.innerHTML = `<h3>${pokemon.id}. ${pokemon.name}</h3>`;
    return card;

};


function createSprite(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card_sprite');
    const colors = typeColors[pokemon.types[0]] || ['#ffffff', '#f8f8f8', '#e0e0e0'];
    card.style.background = `linear-gradient(135deg, ${colors[0]} 20%, ${colors[1]} 50%, ${colors[2]} 100%)`;
    const sprite = document.createElement('img')
    sprite.classList.add('lightbox_enabled');
    sprite.src = pokemon.sprite;
    sprite.alt = pokemon.name;
    card.appendChild(sprite);
    return card;
};


function createFooter(pokemon) {
    const card = document.createElement('div');
    card.id = 'card_footer';
    card.innerHTML = `
        ${pokemon.types.map(type => `
            <img src="img/type_${type}.png" alt="${type}-Type">`).join('')}
            `;
    return card;
};