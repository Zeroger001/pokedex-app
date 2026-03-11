document.getElementById("searchInput").addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();
    const mainContent = document.getElementById("main_container");
    showLoader();
    setTimeout(() => {
        if (searchTerm === "") { renderMainCard(BATCH_SIZE, false, displayedCount = 0); return hideLoader(); }

        const filteredPokemon = pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm) || pokemon.id.toString().includes(searchTerm)
        );
        mainContent.innerHTML = "";
        filteredPokemon.forEach(pokemon => fillMainContainer(pokemon));
        console.log(filteredPokemon);
        attachLightbox();
        hideLoader();
    }, 500);
});