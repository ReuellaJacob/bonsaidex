// data will be init by loadDataFromJson()
let pokemons;
let abilities;
let forms;

// attribute names
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

            drawPokedexGridView()
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

    // tags
    const subInfoViewTag = document.querySelector(`#${subInfoView}`)
    const heightLabelTag = document.createElement("p")
    const weightLabelTag = document.createElement("p")
    const heightValueTag = document.createElement("p")
    const weightValueTag = document.createElement("p")
    const typeLabelTag = document.createElement("p")
    const dividerTag1 = document.createElement("p")
    const dividerTag2 = document.createElement("p")

    // content
    heightLabelTag.innerHTML = "Height"
    weightLabelTag.innerHTML = "Weight"
    heightValueTag.innerHTML = pokemon.height
    weightValueTag.innerHTML = pokemon.weight
    typeLabelTag.innerHTML = "Type"
    dividerTag1.innerHTML = " | "
    dividerTag2.innerHTML = " | "

    // append tags
    subInfoViewTag.append(heightLabelTag)
    subInfoViewTag.append(heightValueTag)
    subInfoViewTag.append(dividerTag1)
    subInfoViewTag.append(typeLabelTag)

    // pokemon types
    pokemon.types.forEach((type => {
        drawTypeIcon(type)
    }))

    // append tags
    subInfoViewTag.append(dividerTag2)
    subInfoViewTag.append(weightLabelTag)
    subInfoViewTag.append(weightValueTag)

    // pokemon ability
    pokemon.abilities.forEach((ability) => {
        drawTitle("Ability")
        drawDataTextView(ability)
        drawDataTextView(abilities[ability])
    })

    // append tag
    drawTitle("Region")
    drawDataTextView(getRegion(pokemon))
    drawTitle("Evolution Chain")
    drawPokemonEvoChain(pokemon.evolutionNames)
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
        drawPokemonPreview(pokemonName)
    })
}

function drawTypeView(pokemon) {
    clearSubInfoView()
    const chart = getTypeChart(pokemon.types)

    drawTitle("Super Effective x4")
    drawTypesGrid(chart[0])
    drawTitle("Super Effective x2")
    drawTypesGrid(chart[1])
    drawTitle("Super Effective x0.5")
    drawTypesGrid(chart[2])
    drawTitle("Super Effective x0.25")
    drawTypesGrid(chart[3])
    drawTitle("Immunity")
    drawTypesGrid(chart[4])
}

/*********** DRAW VIEW HELPERS **********/
function drawTypesGrid(types) {
    const view = document.querySelector(`#${subInfoView}`)

    types.forEach((type) => {
        drawTypeIcon(type)
    })
}

function drawPokemonEvoChain(chains) {
    const view = document.querySelector(`#${subInfoView}`)

    chains.forEach((chain) => {
        chain.forEach((pokemonName) => {
            const arrowTag = document.createElement("p")
            arrowTag.innerHTML = ">"
            view.append(arrowTag)
            drawPokemonPreview(pokemonName)
        })
    })
}

function drawPokemonPreview(name) {
    const pokemon = getPokemon(name)

    // tags
    const view = document.querySelector(`#${subInfoView}`)
    const image = document.createElement("img")
    const nameTag = document.createElement("p")
    const nationdexNum = document.createElement("p")

    // contents
    image.src = getPokemonImagePath(pokemon)
    nameTag.innerHTML = pokemon.name
    nationdexNum.innerHTML = getPokedexNumber(pokemon)

    // attributes
    image.setAttribute('class', 'pokemonGridImage')

    // event listner
    image.addEventListener("click", () => {
        drawPokemonDetailedView(pokemon)
    })

    // append tags
    view.append(image)
    view.append(nameTag)
    view.append(nationdexNum)
}

function drawTitle(title) {
    const view = document.querySelector(`#${subInfoView}`)
    const tag = document.createElement("p")
    tag.innerHTML = `${title}:`
    tag.classList.add("dataTitle")
    view.append(tag)
}

function drawDataTextView(text) {
    const view = document.querySelector(`#${subInfoView}`)
    const tag = document.createElement("p")
    tag.innerHTML = text
    tag.classList.add("dataText")
    view.append(tag)
}

function drawTypeIcon(type) {
    const view = document.querySelector(`#${subInfoView}`)
    const tag = document.createElement("img")
    tag.src = `images/types/${type.toLowerCase()}.svg`
    tag.classList.add(type.toLowerCase())
    tag.classList.add("typeIcon")
    view.append(tag)
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

function getRegion(pokemon) {
    const pokemonID = pokemon.id

    if (pokemonID <= 151) {
        return "Kanto"
    } else if (pokemonID <= 251) {
        return "Johto"
    } else if (pokemonID <= 386) {
        return "Hoenn"
    } else if (pokemonID <= 493) {
        return "Sinnoh"
    } else if (pokemonID <= 649) {
        return "Unova"
    } else if (pokemonID <= 721) {
        return "Kalos"
    } else if (pokemonID <= 809) {
        return "Alola"
    } else if (pokemonID <= 905) {
        return "Galar"
    } else {
        return "No region found."
    }
}

function getTypeChart(types) {
    let array = [[], [], [], [], []]
    let chart = {"Bug": 1, "Dark": 1, "Dragon": 1,"Electric": 1, "Fairy": 1, "Fighting": 1 ,"Fire": 1, "Flying": 1, "Ghost": 1,"Grass": 1, "Ground": 1, "Ice": 1,"Normal": 1, "Poison": 1, "Psychic": 1,"Rock": 1, "Steel": 1, "Water": 1}

    // get type values for each type
    types.forEach((type) => {
        if (type === "Normal") {
            chart["Fighting"] *= 2

            chart["Ghost"] *= 0
        } else if (type === "Fire") {
            chart["Water"] *= 2
            chart["Ground"] *= 2
            chart["Rock"] *= 2

            chart["Fire"] *= 0.5
            chart["Grass"] *= 0.5
            chart["Ice"] *= 0.5
            chart["Bug"] *= 0.5
            chart["Steel"] *= 0.5
            chart["Fairy"] *= 0.5
        } else if (type === "Water") {
            chart["Electric"] *= 2
            chart["Grass"] *= 2

            chart["Fire"] *= 0.5
            chart["Water"] *= 0.5
            chart["Ice"] *= 0.5
            chart["Steel"] *= 0.5
        } else if (type === "Electric") {
            chart["Ground"] *= 2

            chart["Electric"] *= 0.5
            chart["Flying"] *= 0.5
            chart["Steel"] *= 0.5
        } else if (type === "Grass") {
            chart["Fire"] *= 2
            chart["Ice"] *= 2
            chart["Poison"] *= 2
            chart["Flying"] *= 2
            chart["Bug"] *= 2

            chart["Water"] *= 0.5
            chart["Electric"] *= 0.5
            chart["Grass"] *= 0.5
            chart["Ground"] *= 0.5
        } else if (type === "Ice") {
            chart["Fire"] *= 2
            chart["Fighting"] *= 2
            chart["Rock"] *= 2
            chart["Steel"] *= 2

            chart["Ice"] *= 0.5
        } else if (type === "Fighting") {
            chart["Flying"] *= 2
            chart["Psychic"] *= 2
            chart["Fairy"] *= 2

            chart["Bug"] *= 0.5
            chart["Rock"] *= 0.5
            chart["Dark"] *= 0.5
        } else if (type === "Poison") {
            chart["Ground"] *= 2
            chart["Psychic"] *= 2

            chart["Grass"] *= 0.5
            chart["Fighting"] *= 0.5
            chart["Poison"] *= 0.5
            chart["Bug"] *= 0.5
            chart["Fairy"] *= 0.5
        } else if (type === "Ground") {
            chart["Water"] *= 2
            chart["Grass"] *= 2
            chart["Ice"] *= 2

            chart["Poison"] *= 0.5
            chart["Rock"] *= 0.5


            chart["Electric"] *= 0
        } else if (type === "Flying") {
            chart["Electric"] *= 2
            chart["Ice"] *= 2
            chart["Rock"] *= 2

            chart["Grass"] *= 0.5
            chart["Fighting"] *= 0.5
            chart["Bug"] *= 0.5

            chart["Ground"] *= 0
        } else if (type === "Psychic") {
            chart["Bug"] *= 2
            chart["Ghost"] *= 2
            chart["Dark"] *= 2

            chart["Fighting"] *= 0.5
            chart["Psychic"] *= 0.5
        } else if (type === "Bug") {
            chart["Fire"] *= 2
            chart["Flying"] *= 2
            chart["Rock"] *= 2

            chart["Grass"] *= 0.5
            chart["Fighting"] *= 0.5
            chart["Ground"] *= 0.5
        } else if (type === "Rock") {
            chart["Water"] *= 2
            chart["Grass"] *= 2
            chart["Fighting"] *= 2
            chart["Ground"] *= 2
            chart["Steel"] *= 2

            chart["Normal"] *= 0.5
            chart["Fire"] *= 0.5
            chart["Poison"] *= 0.5
            chart["Flying"] *= 0.5
        } else if (type === "Ghost") {
            chart["Ghost"] *= 2
            chart["Dark"] *= 2

            chart["Poison"] *= 0.5
            chart["Bug"] *= 0.5

            chart["Normal"] *= 0
            chart["Fighting"] *= 0
        } else if (type === "Dragon") {
            chart["Ice"] *= 2
            chart["Dragon"] *= 2
            chart["Fairy"] *= 2

            chart["Fire"] *= 0.5
            chart["Water"] *= 0.5
            chart["Electric"] *= 0.5
            chart["Grass"] *= 0.5
        } else if (type === "Dark") {
            chart["Fighting"] *= 2
            chart["Bug"] *= 2
            chart["Fairy"] *= 2

            chart["Ghost"] *= 0.5
            chart["Dark"] *= 0.5

            chart["Psychic"] *= 0
        } else if (type === "Steel") {
            chart["Fire"] *= 2
            chart["Fighting"] *= 2
            chart["Ground"] *= 2

            chart["Normal"] *= 0.5
            chart["Grass"] *= 0.5
            chart["Ice"] *= 0.5
            chart["Flying"] *= 0.5
            chart["Psychic"] *= 0.5
            chart["Bug"] *= 0.5
            chart["Rock"] *= 0.5
            chart["Dragon"] *= 0.5
            chart["Steel"] *= 0.5
            chart["Fairy"] *= 0.5

            chart["Poison"] *= 0
        } else if (type === "Fairy") {
            chart["Poison"] *= 2
            chart["Steel"] *= 2

            chart["Fighting"] *= 0.5
            chart["Bug"] *= 0.5
            chart["Dark"] *= 0.5

            chart["Dragon"] *= 0
        }
    })

    // get type value
    const keys = Object.keys(chart)
    keys.forEach((key) => {
        const value = chart[key]
        if (value === 4) {
            array[0].push(key)
        } else if (value === 2) {
            array[1].push(key)
        } else if (value === 0.5) {
            array[2].push(key)
        } else if (value === 0.25) {
            array[3].push(key)
        } else if (value === 0) {
            array[4].push(key)
        }
    })

    return array
}