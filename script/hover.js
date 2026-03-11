function addHoverEffect(imgElement, pokemonData) {
    const normalSprite = pokemonData.sprites.versions["generation-v"]["black-white"].front_default || pokemonData.sprites.other.home.front_default || 'img/placeholder.png';
    const hoverSprite = pokemonData.sprites.versions["generation-v"]["black-white"].animated.front_default || pokemonData.sprites.other.home.front_default || 'img/placeholder.png';
    if (!hoverSprite) return;
    imgElement.addEventListener('mouseover', () => {
        imgElement.src = hoverSprite;
        imgElement.style.filter = 'none';
    });
    imgElement.addEventListener('mouseout', () => {
        imgElement.src = normalSprite;
        imgElement.style.filter = 'drop-shadow(4px 4px 6px rgba(0, 0, 0, 1))';
    });
};