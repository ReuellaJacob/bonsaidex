// data will be init by loadDataFromJson()
let pokemons;
let abilities;
let forms;
// attribute
const mainView = "pokemonMainView";
const infoView = "pokemonInfoView";
const subInfoView = "pokemonSubInfoView";

function loadDataFromJson() {
    // fetch pokemon abilities
    fetch('data/abilities.json')
        .then(response => {
            return response.json()
        })
        .then(jsondata => {
            abilities = jsondata
        })

    // fetch pokemon forms data
    fetch('data/forms.json')
        .then(response => {
            return response.json()
        })
        .then(jsondata => {
            forms = jsondata
        })

    // fetch pokemon data
    fetch('data/pokemons.json')
        .then(response => {
            return response.json()
        })
        .then(jsondata => {

            pokemons = jsondata
            // TODO: uncomment landing view
            // drawPokedexGridView()
            drawPokemonDetailedView(getPokemon("Mewtwo"))
        })
}

/*********** DRAW VIEW FUNCTION **********/
function drawPokedexGridView() {
    clearView()

    // properties
    const pokemonNames = Object.keys(pokemons)
    const mainViewTag = document.querySelector(`#${mainView}`)

    const title = document.createElement("h1")
    title.innerHTML = "Bonsaidex"
    mainViewTag.append(title)

    // populate all pokemon to pokedex list
    for (const pokemonName of pokemonNames) {
        const pokemon = getPokemon(pokemonName)

        // tags
        const gridView = document.createElement("div")
        const image = document.createElement("img")
        const name = document.createElement("p")
        const etymology = document.createElement("p")
        const nationdexNum = document.createElement("p")
        const toDetailViewButton = document.createElement("button")

        // contents
        image.src = getPokemonImagePath(pokemon)
        name.innerHTML = `${pokemon.name}`
        etymology.innerHTML = `${pokemon.etymology}`
        nationdexNum.innerHTML = getPokedexNumber(pokemon)
        toDetailViewButton.innerHTML = ">"

        // event listeners
        toDetailViewButton.addEventListener("click", () => { drawPokemonDetailedView(pokemon)})

        // class
        image.classList.add("pokemonGridImage")

        // append tags
        mainViewTag.append(gridView)
        gridView.append(image)
        gridView.append(name)
        gridView.append(etymology)
        gridView.append(nationdexNum)
        gridView.append(toDetailViewButton)
    }
}

function drawPokemonDetailedView(pokemon) {
    clearView()

    // tags
    const viewTag = document.querySelector(`#${mainView}`)
    const infoViewTag = document.createElement("div")
    const subInfoViewTag = document.createElement("div")
    const backButton = document.createElement("button")
    const name = document.createElement("h1")
    const species = document.createElement("p")
    const nationdexNum = document.createElement("p")
    const image = document.createElement("img")
    const entry = document.createElement("p")
    const dataButton = document.createElement("button")
    const statsButton = document.createElement("button")
    const typesButton = document.createElement("button")

    // contents
    backButton.innerHTML = "< Bonsaidex"
    name.innerHTML = `${pokemon.name}`
    species.innerHTML = `${pokemon.species}`
    nationdexNum.innerHTML = getPokedexNumber(pokemon)
    image.src = getPokemonImagePath(pokemon)
    entry.innerHTML = pokemon.pokedex.entry
    dataButton.innerHTML = "Data"
    statsButton.innerHTML = "Stats"
    typesButton.innerHTML = "Types"

    // attributes
    infoViewTag.setAttribute('id', `${infoView}`)
    subInfoViewTag.setAttribute('id', `${subInfoView}`)
    image.classList.add("pokemonDetailedImage")

    // event listeners
    backButton.addEventListener("click", drawPokedexGridView)
    dataButton.addEventListener("click", () => { drawDataView(pokemon)} )
    statsButton.addEventListener("click", () => { drawStatsView(pokemon)} )
    typesButton.addEventListener("click", () => { drawTypesView(pokemon)} )

    // append tags
    viewTag.append(backButton)
    viewTag.append(infoViewTag)
    viewTag.append(subInfoViewTag)
    infoViewTag.append(name)
    infoViewTag.append(species)
    infoViewTag.append(nationdexNum)
    infoViewTag.append(image)
    infoViewTag.append(entry)
    infoViewTag.append(dataButton)
    infoViewTag.append(statsButton)
    infoViewTag.append(typesButton)

    drawDataView(pokemon)
}

function drawDataView(pokemon) {
    clearSubInfoView()
}

function drawStatsView(pokemon) {
    clearSubInfoView()
    const subInfoViewTag = document.querySelector(`#${subInfoView}`)

    /*** STATS ***/
    pokemon.stats.forEach((stat) => {
        // tags
        const nameTag = document.createElement("p")
        const valueTag = document.createElement("p")
        const barTag = document.createElement("canvas")

        // contents
        nameTag.innerHTML = stat.name
        valueTag.innerHTML = stat.value
        const canvas = barTag.getContext("2d")
        canvas.rect(0, 0, stat.value, 300)
        canvas.fillStyle = "blue"
        canvas.fill()

        // append tags
        subInfoViewTag.append(nameTag)
        subInfoViewTag.append(valueTag)
        subInfoViewTag.append(barTag)
    })

    /*** HIDDEN ABILITY ***/
    if (pokemon.hiddenAbilities.length === 0) {
        // tags
        const hiddenAbility = document.createElement("p")
        const hiddenAbilityDescription = document.createElement("p")

        // contents
        hiddenAbility.innerHTML = "Hidden Ability: "
        hiddenAbilityDescription.innerHTML = "Does not know any."

        // append tag
        subInfoViewTag.append(hiddenAbility)
        subInfoViewTag.append(hiddenAbilityDescription)
    }

    pokemon.hiddenAbilities.forEach((ability) => {
        // tags
        const hiddenAbility = document.createElement("p")
        const hiddenAbilityDescription = document.createElement("p")

        // contents
        hiddenAbility.innerHTML = `Hidden Ability: ${ability}`
        hiddenAbilityDescription.innerHTML = abilities[ability]

        // append tags
        subInfoViewTag.append(hiddenAbility)
        subInfoViewTag.append(hiddenAbilityDescription)
    })

    /*** FORMS ***/
    if (pokemon.forms.length === 0) {
        const form = document.createElement("p")
        const noFormText = document.createElement("p")
        form.innerHTML = "Forms:"
        noFormText.innerHTML = "Has no other forms."
        subInfoViewTag.append(form)
        subInfoViewTag.append(noFormText)
    }

    pokemon.forms.forEach((pokemonName) => {
        const pokemon = getPokemon(pokemonName)
        // tags
        const formTag = document.createElement("p")
        const image = document.createElement("img")
        const name = document.createElement("p")
        const nationdexNum = document.createElement("p")

        // contents
        formTag.innerHTML = "Forms:"
        image.src = getPokemonImagePath(pokemon)
        name.innerHTML = pokemon.name
        nationdexNum.innerHTML = getPokedexNumber(pokemon)

        // attributes
        image.setAttribute('class', 'pokemonGridImage')

        // event listner
        image.addEventListener("click", () => {
            drawPokemonDetailedView(pokemon)
        })

        // append tags
        subInfoViewTag.append(image)
        subInfoViewTag.append(name)
        subInfoViewTag.append(nationdexNum)
    })
}
function drawTypesView() {
    clearSubInfoView()
}

/*********** CLEAR VIEW FUNCTIONS **********/
function clearView() {
    const pokemonViewTag = document.querySelector(`#${mainView}`)
    while (pokemonViewTag.firstChild) {
        pokemonViewTag.removeChild(pokemonViewTag.firstChild)
    }
}

function clearSubInfoView() {
    const pokemonSubInfoViewTag = document.querySelector(`#${subInfoView}`)
    while (pokemonSubInfoViewTag.firstChild) {
        pokemonSubInfoViewTag.removeChild(pokemonSubInfoViewTag.firstChild)
    }
}

/*********** GETTERS **********/
function getPokemon(pokemonName) {
    let pokemon = pokemons[pokemonName]

    if (pokemon === undefined) {
        pokemon = forms[pokemonName]
    }

    return pokemon
}

function getPokedexListView(pokemon) { }

function getPokedexNumber(pokemon) {
    const pokedexNum = `00${pokemon.id}`
    const pokedexNumTrim = pokedexNum.substr(pokedexNum.length - 3, pokedexNum.length)

    return `#${pokedexNumTrim}`
}

function getPokemonImagePath(pokemon) {
    if (pokemons[pokemon.name] === undefined) {
        return `images/pokemons/${pokemon.name}.imageset/${pokemon.name}.png`
    }

    return `images/pokemons/${pokemon.name}.imageset/${pokemon.id}.png`
}