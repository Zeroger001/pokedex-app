const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const DISCRIPTION_URL = 'https://pokeapi.co/api/v2/pokemon-species/';
const Total_Pokemon = 1025;
const BATCH_SIZE = 30;
const lightbox = document.getElementById('lightbox');
let pokemonList = [];
let displayedCount = 0;

const typeColors = {
    normal: ['#5c5c5c', '#c0c0c0', '#ffffff'],
    fire: ['#db4500', '#e4ba00', '#FFFAE1'],
    water: ['#1900ff', '#0077ff', '#95c1fa'],
    electric: ['#868401', '#fffb00', '#ffffff'],
    grass: ['#006408', '#00ce11', '#8ef78a'],
    ice: ['#006eff', '#4caeff', '#9fd4ff'],
    fighting: ['#3f2900', '#946000', '#ec9b04'],
    poison: ['#5b0077', '#b500ec', '#dfbae9'],
    ground: ['#3f2900', '#946000', '#ec9b04'],
    psychic: ['#31002b', '#8a007a', '#ff67ed'],
    bug: ['#006408', '#00ce11', '#8ef78a'],
    rock: ['#3d3d3d', '#797979', '#d1c9c9'],
    ghost: ['#5b0077', '#b500ec', '#dfbae9'],
    dragon: ['#00375f', '#2e5a79', '#55aeee'],
    flying: ['#006eff', '#4caeff', '#9fd4ff'],
    dark: ['#000000', '#6F6F6E', '#000000'],
    steel: ['#8C8A8B', '#BCBAC1', '#E2E2E3'],
    fairy: ['#692660', '#d15ac1', '#ff97f1']
};


async function fetchPokemonData() {
    try {
        const response = await fetch(`${BASE_URL}?limit=${Total_Pokemon}`);
        const data = await response.json();
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const pokemonResponse = await fetch(pokemon.url);
                const pokemonData = await pokemonResponse.json();
                return {
                    id: pokemonData.id,
                    name: pokemonData.name,
                    sprite: pokemonData.sprites.other.home.front_default,
                    shiny: pokemonData.sprites.other.home.front_shiny,
                    types: pokemonData.types.map(typeInfo => typeInfo.type.name),
                    cries: pokemonData.cries.latest
                };
            })
        );
        pokemonList = pokemonDetails;
    } catch (error) {
        console.error("Cannot fetch Pokemon Data:", error);
    };
};


async function init() {
    await fetchPokemonData();
    renderMainCard();
    addButtonsEvents()
};


window.onload = init;
