let pokemons; // data will be init by loadDataFromJson()
let abilities; // data will be init by loadDataFromJson()

function loadDataFromJson() {
    // fetch pokemon data
    fetch('data/pokemon/pokemons.json')
        .then(response => {
            return response.json()
        })
        .then(jsondata => {

            pokemons = jsondata
            drawPokedexGridView()
        })

    // fetch pokemon abilities
    fetch('data/pokemon/abilities.json')
        .then(response => {
            return response.json()
        })
        .then(jsondata => {
            abilities = jsondata
        })
}

/*********** DRAW VIEW FUNCTION **********/
function drawPokedexGridView() {
    clearCurrentView()

    // properties
    const pokemonNames = Object.keys(pokemons)
    const currentViewTag = document.querySelector("#pokemonView")

    // populate all pokemon to pokedex list
    for (const pokemonName of pokemonNames) {
        const pokemon = pokemons[pokemonName]


        // tags
        const gridView = document.createElement("div")
        const Image = document.createElement("img")
        const name = document.createElement("p")
        const etymology = document.createElement("p")
        const nationdexNum = document.createElement("p")
        const detailButton = document.createElement("button")

        // contents
        Image.src = `images/pokemons/${pokemon.name}.imageset/${pokemon.id}.png`
        name.innerHTML = `${pokemon.name}`
        etymology.innerHTML = `${pokemon.etymology}`
        nationdexNum.innerHTML = getPokedexNumber(pokemon.id)
        detailButton.innerHTML = ">"

        // event listeners
        detailButton.addEventListener("click", () => { drawPokemonDetailedView(pokemon)})

        // class
        Image.classList.add("pokemonImage")

        // append tags
        currentViewTag.append(gridView)
        gridView.append(Image)
        gridView.append(name)
        gridView.append(etymology)
        gridView.append(nationdexNum)
        gridView.append(detailButton)
    }
}

function drawPokemonDetailedView(pokemon) {
    clearCurrentView()

    // properties
    const currentViewTag = document.querySelector("#pokemonView")

    // tags
    const backButton = document.createElement("button")

    // contents
    backButton.innerHTML = "< back"

    // event listeners
    backButton.addEventListener("click", drawPokedexGridView)

    // append tags
    currentViewTag.append(backButton)
}

/*********** CLEAR VIEW FUNCTIONS **********/
function clearCurrentView() {
    const pokemonViewTag = document.querySelector("#pokemonView")
    while (pokemonViewTag.firstChild) {
        pokemonViewTag.removeChild(pokemonViewTag.firstChild)
    }
}

/*********** GETTERS **********/
function getPokemonSortedByID() { }

function getPokedexListView(pokemon) { }

function getPokedexNumber(id) {
    const pokedexNum = `00${id}`
    const pokedexNumTrim = pokedexNum.substr(pokedexNum.length - 3, pokedexNum.length)

    return `#${pokedexNumTrim}`
}