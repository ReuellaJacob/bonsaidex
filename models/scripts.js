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
            // drawPokedexGridView()
            drawPokemonInfoView(getPokemon("Mega Swampert"))
        })
}

/*********** DRAW VIEW FUNCTION **********/
// TODO: grid view
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
        toDetailViewButton.addEventListener("click", () => { drawPokemonInfoView(pokemon)})

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

// TODO: info view
function drawPokemonInfoView(pokemon) {
    clearView()

    // tags
    const viewTag = document.querySelector(`#${mainView}`)
    const infoViewTag = document.createElement("div")
    const subInfoViewTag = document.createElement("div")
    const backButton = document.createElement("button")

    // attributes
    backButton.setAttribute('id', "backButton")
    infoViewTag.setAttribute('id', `${infoView}`)
    subInfoViewTag.setAttribute('id', `${subInfoView}`)
    backButton.addEventListener("click", drawPokedexGridView)

    // content
    backButton.innerHTML = "< Home"

    // append tag
    viewTag.append(backButton)
    viewTag.append(infoViewTag)
    viewTag.append(subInfoViewTag)

    // draw views
    drawInfoHeader(pokemon)
    drawInfoContent(pokemon)
    drawInfoButtons(pokemon)

    // default sub view
    drawDataView(pokemon)
}

// TODO data view
function drawDataView(pokemon) {
    clearSubInfoView(0)

    const view = document.querySelector(`#${subInfoView}`)
    drawDataHeader(pokemon)

    // ablitiies
    pokemon.abilities.forEach((ability) => {
        const abilityTag = drawDataAbility(ability)
        view.append(abilityTag)
    })

    // region and egg group
    const region = drawSection("Region", getRegion(pokemon), "region")
    const eggGroup = drawSection("Egg Group", pokemon.eggGroup, "eggGroup")
    view.append(region)
    view.append(eggGroup)

    // evo chain
    const evoChain = drawSection("Evolution Chain", "", "evoChain")
    view.append(evoChain)
    const evoChainPreview = drawPokemonEvoChain(pokemon.evolutionNames)
    view.append(evoChainPreview)

}

// TODO stats view
function drawStatsView(pokemon) {
    clearSubInfoView(1)
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

// TODO types view
function drawTypesView(pokemon) {
    clearSubInfoView(2)
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

// TODO helper view
/*********** DRAW VIEW HELPERS **********/
function drawSection(title, value, id) {
    const group = document.createElement("div")
    const text = drawTitle(title)
    const content = drawDataTextView(value)
    const div = document.createElement("div")

    // attibute
    group.setAttribute('id', id)
    group.classList.add("section")
    div.classList.add("group")
    text.classList.add("sectionTitle")
    content.classList.add("sectionContent")

    // append tags
    group.append(text)
    group.append(content)

    return group
}

function drawDataAbility(ability) {
    // tags
    const abilityTag = drawSection("Ability", ability, "dataAbility")
    const value = drawAbilitiyDescription(abilities[ability])
    value.classList.add("abilityValue")

    abilityTag.append(value)
    return abilityTag
}

function drawDataHeader(pokemon) {
    // tags
    const view = document.querySelector(`#${subInfoView}`)
    const dataDiv = document.createElement("div")
    const heightDiv = document.createElement("div")
    const weightDiv = document.createElement("div")
    const typesDiv = document.createElement("div")

    // attribute
    dataDiv.setAttribute('id', 'dataHeader')
    heightDiv.setAttribute('id', 'dataHeightDiv')
    weightDiv.setAttribute('id', 'dataWeightDiv')
    typesDiv.setAttribute('id', 'dataTypeDiv')

    // append tags
    view.append(dataDiv)
    dataDiv.append(heightDiv)
    dataDiv.append(typesDiv)
    dataDiv.append(weightDiv)

    // attribute
    heightDiv.classList.add("hStack")
    heightDiv.classList.add("center")
    typesDiv.classList.add("hStack")
    typesDiv.classList.add("center")
    weightDiv.classList.add("hStack")
    weightDiv.classList.add("center")

    // height
    const heightTag = drawDataLabel("Height")
    const heightValue = drawDataValue(pokemon.height.replace(" ", ""))
    heightDiv.append(heightValue)
    heightDiv.append(heightTag)

    // pokemon types
    pokemon.types.forEach((type => {
        const iconTag = drawTypeIcon(type)
        typesDiv.append(iconTag)
    }))
    const typesLabel = drawDataLabel("Type")
    typesDiv.append(typesLabel)

    // weight
    const weightTag = drawDataLabel("Weight")
    const weightValue = drawDataValue(pokemon.weight)
    weightDiv.append(weightValue)
    weightDiv.append(weightTag)
}

function drawDataValue(value) {
    const tag = document.createElement("p")
    tag.innerHTML = value
    tag.classList.add("heightWeightValue")
    tag.classList.add("center")

    return tag
}

function drawDataLabel(text) {
    const tag = document.createElement("p")
    tag.innerHTML = text
    tag.classList.add("heightWeightLabel")
    tag.classList.add("center")

    return tag
}

function drawInfoButtons(pokemon) {
    // tags
    const view = document.querySelector(`#${infoView}`)
    const div = document.createElement("div")
    const data = document.createElement("button")
    const stats = document.createElement("button")
    const types = document.createElement("button")

    // contents
    data.innerHTML = "Data"
    stats.innerHTML = "Stats"
    types.innerHTML = "Types"

    // attributes
    div.setAttribute('id', "infoButton")
    data.setAttribute('id', "infoDataButton")
    stats.setAttribute('id', "infoStatsButton")
    types.setAttribute('id', "infoTypesButton")

    // event listeners
    data.addEventListener("click", () => { drawDataView(pokemon)} )
    stats.addEventListener("click", () => { drawStatsView(pokemon)} )
    types.addEventListener("click", () => { drawTypesView(pokemon)} )

    // append tags
    view.append(div)
    div.append(data)
    div.append(stats)
    div.append(types)
}

function drawInfoContent(pokemon) {
    // tags
    const view = document.querySelector(`#${infoView}`)
    const infoContent = document.createElement("div")
    const image = document.createElement("img")
    const entry = document.createElement("p")

    // attributes
    infoContent.setAttribute('id', "infoContent")
    image.setAttribute('id', 'infoImage')
    entry.setAttribute('id', 'infoEntry')

    // contents
    image.src = getPokemonImagePath(pokemon)
    image.classList.add("center")
    entry.innerHTML = pokemon.pokedex.entry

    // append tags
    view.append(infoContent)
    infoContent.append(image)
    infoContent.append(entry)
}

function drawInfoHeader(pokemon) {
    // tags
    const view = document.querySelector(`#${infoView}`)
    const infoHeader = document.createElement("div")
    const div = document.createElement("div")
    const infoHeaderGroup = document.createElement("div")
    const name = document.createElement("h1")
    const species = document.createElement("p")
    const dexNum = document.createElement("p")

    // attributes
    infoHeader.setAttribute('id', 'infoHeader')
    div.classList.add("group")
    infoHeaderGroup.classList.add("infoHeaderGroup")
    name.setAttribute('id', 'infoName')
    species.setAttribute('id', 'infoSpecies')
    dexNum.setAttribute('id', 'infoDexNum')

    // contents
    name.innerHTML = pokemon.name
    species.innerHTML = pokemon.species
    dexNum.innerHTML = getPokedexNumber(pokemon)

    // append tags
    view.append(infoHeader)
    infoHeader.append(div)
    infoHeaderGroup.append(name)
    infoHeaderGroup.append(species)
    div.append(infoHeaderGroup)
    infoHeader.append(dexNum)
}

function drawTypesGrid(types) {
    const view = document.querySelector(`#${subInfoView}`)

    types.forEach((type) => {
        drawTypeIcon(type)
    })
}

function drawPokemonEvoChain(chains) {
    const div = document.createElement("div")
    div.classList.add("evoChain")

    chains.forEach((chain) => {
        chain.forEach((pokemonName) => {
            div.style.gridTemplateColumns = `repeat(${chain.length}, 1fr)`

            const groupDiv = document.createElement("div")
            groupDiv.classList.add("evoGroup")

            const arrowTag = document.createElement("label")
            arrowTag.classList.add("evoChainLabel")
            arrowTag.innerHTML = ">"
            groupDiv.append(arrowTag)

            const preview = drawPokemonPreview(pokemonName)
            groupDiv.append(preview)

            div.append(groupDiv)
        })
    })

    return div
}

function drawPokemonPreview(name) {
    const pokemon = getPokemon(name)

    // tags
    const tag = document.createElement("div")
    const image = document.createElement("img")
    const nameTag = document.createElement("p")
    const nationdexNum = document.createElement("p")

    // contents
    tag.classList.add("pokemonPreview")
    image.src = getPokemonImagePath(pokemon)
    image.classList.add("previewImage")
    nameTag.innerHTML = pokemon.name
    nameTag.classList.add("previewName")
    nationdexNum.innerHTML = getPokedexNumber(pokemon)
    nationdexNum.classList.add("previewDexNum")

    // event listener
    image.addEventListener("click", () => {
        drawPokemonInfoView(pokemon)
    })

    // append tags
    tag.append(image)
    tag.append(nameTag)
    tag.append(nationdexNum)

    return tag
}

function drawTitle(title) {
    const tag = document.createElement("label")
    tag.innerHTML = `${title}:`
    tag.classList.add("dataTitle")

    return tag
}

function drawDataTextView(text) {
    const tag = document.createElement("label")
    tag.innerHTML = text
    tag.classList.add("dataText")

    return tag
}

function drawAbilitiyDescription(description) {
    const tag = document.createElement("span")
    tag.innerHTML = description
    tag.classList.add("abilitiyValue")

    return tag
}

function drawTypeIcon(type) {
    const tag = document.createElement("img")
    tag.src = `images/types/${type.toLowerCase()}.svg`
    tag.classList.add(type.toLowerCase())
    tag.classList.add("typeIcon")
    tag.style.boxShadow = `0 0 10px 6px #${getTypeCSSHex(type)};`

    return tag
}

/*********** CLEAR VIEW FUNCTIONS **********/
function clearView() {
    const pokemonViewTag = document.querySelector(`#${mainView}`)
    while (pokemonViewTag.firstChild) {
        pokemonViewTag.removeChild(pokemonViewTag.firstChild)
    }
}

function clearSubInfoView(selectorIndex) {
    const pokemonSubInfoViewTag = document.querySelector(`#${subInfoView}`)
    while (pokemonSubInfoViewTag.firstChild) {
        pokemonSubInfoViewTag.removeChild(pokemonSubInfoViewTag.firstChild)
    }

    setInfoSelector(selectorIndex)
}

// TODO: setters
/*********** SETTERS **********/
function setInfoSelector(index) {
    const data = document.querySelector("#infoDataButton")
    const stats = document.querySelector("#infoStatsButton")
    const types = document.querySelector("#infoTypesButton")
    const selectedClassName = "infoButtonSelected"

    data.classList.remove(selectedClassName)
    types.classList.remove(selectedClassName)
    stats.classList.remove(selectedClassName)

    if (index === 0) {
        data.classList.add(selectedClassName)
    } else if (index === 1) {
        stats.classList.add(selectedClassName)
    } else if (index === 2) {
        types.classList.add(selectedClassName)
    }
}

// TODO: getters
/*********** GETTERS **********/
function getPokemon(pokemonName) {
    let pokemon = pokemons[pokemonName]

    if (pokemon === undefined) {
        pokemon = forms[pokemonName]
    }

    return pokemon
}

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

function getTypeCSSHex(type) {
    if (type === "Bug") {
        return 'A6B91A'
    } else if (type === "Dark") {
        return '705746'
    } else if (type === "Dragon") {
        return '6F35FC'
    } else if (type === "Electric") {
        return 'F7D02C'
    } else if (type === "Fairy") {
        return 'D685AD'
    } else if (type === "Fighting") {
        return 'C22E28'
    } else if (type === "Fire") {
        return 'EE8130'
    } else if (type === "Flying") {
        return 'A98FF3'
    } else if (type === "Ghost") {
        return '735797'
    } else if (type === "Grass") {
        return '7AC74C'
    } else if (type === "Ground") {
        return 'E2BF65'
    } else if (type === "Ice") {
        return '96D9D6'
    } else if (type === "Normal") {
        return 'A8A77A'
    } else if (type === "Poison") {
        return 'A33EA1'
    } else if (type === "Psychic") {
        return 'F95587'
    } else if (type === "Rock") {
        return 'B6A136'
    } else if (type === "Steel") {
        return 'B7B7CE'
    } else if (type === "Water") {
        return '6390F0'
    }
}