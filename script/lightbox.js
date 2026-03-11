function attachLightbox() {
    document.querySelectorAll(".lightbox_enabled").forEach((img) => {
        img.removeEventListener("click", handleLightboxClick);
        img.addEventListener("click", handleLightboxClick);
    });
};


async function handleLightboxClick(pokemon) {
    const foundPokemon = pokemonList.find(p => p.name.toLowerCase() === pokemon.currentTarget.alt.toLowerCase());
    const pokemonName = foundPokemon.name;
    openLightbox(pokemonName);
};


async function openLightbox(name) {
    clearLightbox();
    showLoader();
    disableScroll();
    if (name) {
        const response = await fetch(`${BASE_URL}${name}`);
        const pokemonData = await response.json();
        const specResponse = await fetch(pokemonData.species.url);
        const species = await specResponse.json();
        await renderLightbox(pokemonData, species);
    };
    addDataNavigation();
    addPkmNavigation(name);
    updatePkmBtnVisibility(name);
    updateDataBtnVisibility("details");
    hideLoader();
};


async function renderLightbox(pokemon, species) {
    const nextPkmButton = createPkmNavigationBtn('right');
    const prevPkmButton = createPkmNavigationBtn('left');
    const card = createLightboxContainer();
    card.appendChild(createLightboxHeader(pokemon));
    card.appendChild(createLightboxImage(pokemon));
    card.appendChild(await createLightboxInfo(pokemon, species));
    lightbox.classList.add('active');
    lightbox.appendChild(nextPkmButton);
    lightbox.appendChild(prevPkmButton);
    lightbox.appendChild(card);
};


function createLightboxContainer() {
    const card = document.createElement('div');
    card.classList.add('lightbox_container');
    return card;
};


function createLightboxHeader(pokemon) {
    const card = document.createElement('div');
    card.classList.add('lightbox_header');
    card.innerHTML = `<h3>${pokemon.id}. ${pokemon.name}</h3>`;
    return card;
};


function createLightboxImage(pokemon) {
    const card = document.createElement('div');
    card.classList.add('lightbox_sprite');
    const colors = typeColors[pokemon.types[0].type.name] || ['#ffffff', '#f8f8f8', '#e0e0e0'];
    card.style.background = `linear-gradient(135deg, ${colors[0]} 20%, ${colors[1]} 50%, ${colors[2]} 100%)`;
    const image = document.createElement('img');
    image.src = pokemon.sprites.other.home.front_default;
    image.alt = pokemon.name;
    image.classList.add('lightbox_showed_pokemon');
    card.appendChild(createCryButton(pokemon, image));
    card.appendChild(image);
    return card;
};


async function createLightboxInfo(pokemon, species) {
    const card = document.createElement('div');
    card.classList.add('lightbox_footer');
    const currentData = document.createElement('div');
    currentData.classList.add('lightbox_info');
    currentData.appendChild(createDataContainer(pokemon));
    currentData.appendChild(createStatsContainer(pokemon));
    currentData.appendChild(await createEvolutionContainer(species));
    card.appendChild(createDataNavigationBtn('left'));
    card.appendChild(createDataNavigationBtn('right'));
    card.appendChild(currentData);
    card.appendChild(await createLineContainer(pokemon));
    return card;
};


function createDataContainer(pokemon) {
    const card = document.createElement('div');
    card.classList.add('lightbox_data');
    card.id = ('data_lightbox');
    card.appendChild(createBaseData(pokemon));
    card.appendChild(createBaseTypes(pokemon));
    card.appendChild(createBaseAbilities(pokemon));
    return card;
};


function createBaseData(pokemon) {
    const card = document.createElement('div');
    card.classList.add('base_data');
    card.innerHTML = `
    <h3>Data</h3>
        <div class="space_between"> <p>Size:</p><p>${pokemon.height / 10} m</p></div>
        <div class="space_between"> <p>Weight:</p><p>${pokemon.weight / 10} kg</p></div>
        <div class="space_between"> <p>Gender:</p>${pokemon.gender_rate === -1 ? "<p>Genderless</p>" : "<p>♂ / ♀</p>"}</div>
    `;
    return card;
};


function createBaseTypes(pokemon) {
    const card = document.createElement('div');
    card.classList.add('base_types');
    card.innerHTML = `
            ${pokemon.types.map(t => `
                <img src="img/type_${t.type.name}_writen.png" alt="${t.type.name}-Type">
            `).join('')}
        `;
    return card;
};


function createBaseAbilities(pokemon) {
    const card = document.createElement('div');
    card.classList.add('base_abilities');
    card.innerHTML = `
    <h3>Abilities</h3>
            ${pokemon.abilities.map(a => `<p>${a.ability.name}</p>`).join('')}
        `;
    return card;
};


function createStatsContainer(pokemon) {
    const card = document.createElement('div');
    card.classList.add('lightbox_stats');
    card.id = ('stats_lightbox');
    card.innerHTML = `
    <h3>Base Stats:</h3>
    ${pokemon.stats.map(s => `
        <div class="space_between"><p>${s.stat.name}</p>
        <div class="stat_bar_container">
                <div class="stat_bar" style="width: ${getStatPercentage(s.base_stat)}%; background-color: ${getStatColor(s.base_stat)}">
                </div>
            </div>
            </div>`).join('')}`;
    return card;
};


function getStatPercentage(value) {
    return Math.round((value / 200) * 100);
};


function getStatColor(value) {
    return value >= 150 ? "#06b60c" : value >= 85 ? "#dda900" : "#dd281b";
};


async function createEvolutionContainer(species) {
    const respondChain = await fetch(species.evolution_chain.url);
    const evolutionChain = await respondChain.json();
    const card = document.createElement('div');
    card.classList.add("lightbox_evolve_container");
    card.id = ("evolve_lightbox");
    card.innerHTML = "<h3>Evolution Chain</h3>";
    const evolutionSprites = document.createElement('div');
    evolutionSprites.classList.add("evolve_sprites_container");
    await getEvolutionInfo(evolutionChain.chain, evolutionSprites);
    card.appendChild(evolutionSprites);
    return card;
};


async function getEvolutionInfo(evolutionChain, container) {
    const currentName = evolutionChain.species.name;
    const sprite = await createEvolutionSprite(currentName);
    if (sprite) {
        container.appendChild(sprite);
    }
    if (evolutionChain.evolves_to.length > 0) {
        for (const nextEvolution of evolutionChain.evolves_to) {
            const Arrow = await createEvolutionArrow();
            container.appendChild(Arrow);
            await getEvolutionInfo(nextEvolution, container);
        };
    };
};


async function createEvolutionSprite(name) {
    try {
        const respond = await fetch(`${BASE_URL}/${name}`);
        const currentPokemon = await respond.json();
        const sprite = document.createElement('img');
        sprite.classList.add('evolution_sprite');
        sprite.src = currentPokemon.sprites.versions["generation-v"]["black-white"].front_default || currentPokemon.sprites.other.home.front_default || 'img/placeholder.png';
        sprite.alt = name;
        addHoverEffect(sprite, currentPokemon)
        sprite.addEventListener('click', () => {
            openLightbox(name);
        });
        return sprite;
    } catch (error) {
        console.error('Cant get Sprite', error);
    };
};


async function createEvolutionArrow() {
    const evoArrow = document.createElement('img');
    evoArrow.classList.add('evolution_arrow')
    evoArrow.src = 'img/evo_arrow.png';
    evoArrow.alt = 'evolves to:'
    return evoArrow;
};


// Pokemon Discription Line 
async function createLineContainer(pokemon) {
    const card = document.createElement('div');
    card.classList.add('lightbox_foot_line');

    try {
        const response = await fetch(`${DISCRIPTION_URL}${pokemon.id}`);

        if (!response.ok) {
            throw new Error(`HTTP Fehler: ${response.status}`);
        }

        const currentDescription = await response.json();

        const germanEntry = currentDescription.flavor_text_entries.find(
            entry => entry.language.name === 'de'
        );

        const englishEntry = currentDescription.flavor_text_entries.find(
            entry => entry.language.name === 'en'
        );

        const descriptionText =
            englishEntry?.flavor_text ||
            germanEntry?.flavor_text ||
            'No description available yet.';

        card.innerHTML = `<p>${descriptionText.replace(/\f/g, ' ')}</p>`;
    } catch (error) {
        console.warn("Description not available:", error);
        card.innerHTML = `<p>Not explored yet...</p>`;
    }

    return card;
}


// Lightbox Clear and close
function clearLightbox() {
    [...lightbox.children].forEach(child => {
        if (child) lightbox.removeChild(child);
    });
};


lightbox.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return
    enableScroll();
    lightbox.classList.remove('active')
    clearLightbox();
});


function disableScroll() {
    document.body.style.overflow = "hidden";
}

function enableScroll() {
    document.body.style.overflow = "auto";

}