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

function drawDataView(pokemon) {
    clearSubInfoView(0)

    const view = document.querySelector(`#${subInfoView}`)
    drawDataHeader(pokemon)

    // ablitiies
    pokemon.abilities.forEach((ability) => {
        const abilityTag = drawDataAbility(ability, false)
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

function drawStatsView(pokemon) {
    clearSubInfoView(1)
    const view = document.querySelector(`#${subInfoView}`)

    /*** STATS ***/
    pokemon.stats.forEach((stat) => {
        const statsTag = drawBaseStats(stat, getTypeCSSHex(pokemon.types[0]))
        view.append(statsTag)
    })

    /*** HIDDEN ABILITY ***/
    if (pokemon.hiddenAbilities.length === 0) {
        const title = drawSection("Hidden Ability", "", "hiddenAbility")
        const value = document.createElement("label")

        value.innerHTML = "does not know any."
        value.classList.add("abilityValue")

        view.append(title)
        view.append(value)
    }

    pokemon.hiddenAbilities.forEach((ability) => {
        const hiddenAbilityTag = drawDataAbility(ability, true)
        view.append(hiddenAbilityTag)
    })

    /*** FORMS ***/
    const title = drawSection("Forms", "", "forms")
    view.append(title)

    if (pokemon.forms.length === 0) {

        const value = document.createElement("label")

        value.innerHTML = "Has no other forms."
        value.classList.add("abilityValue")

        view.append(value)
    }

    const formsDiv = document.createElement("div")
    formsDiv.setAttribute('id', 'formsPreview')
    formsDiv.style.gridTemplateColumns = `repeat(${pokemon.forms.length}, 1fr)`
    title.append(formsDiv)
    pokemon.forms.forEach((pokemonName) => {
        const form = drawPokemonPreview(pokemonName)
        formsDiv.append(form)
    })
}

function drawTypesView(pokemon) {
    clearSubInfoView(2)
    const view = document.querySelector(`#${subInfoView}`)
    const div = document.createElement("div")
    div.setAttribute('id', 'types')

    view.append(div)

    const chart = getTypeChart(pokemon.types)
    const effectiveX4 = drawTitle("Super Effective x4")
    const type1 = drawTypesGrid(chart[0])
    const effectiveX2 = drawTitle("Super Effective x2")
    const type2 = drawTypesGrid(chart[1])
    const effectiveXHalf = drawTitle("Super Effective x0.5")
    const type3 = drawTypesGrid(chart[2])
    const effectiveXQuarter = drawTitle("Super Effective x0.25")
    const type4 = drawTypesGrid(chart[3])
    const immunity = drawTitle("Immunity")
    const type5 = drawTypesGrid(chart[4])

    div.append(effectiveX4)
    div.append(type1)
    div.append(effectiveX2)
    div.append(type2)
    div.append(effectiveXHalf)
    div.append(type3)
    div.append(effectiveXQuarter)
    div.append(type4)
    div.append(immunity)
    div.append(type5)
}

/*********** DRAW VIEW HELPERS **********/
function drawBaseStats(stat, hexColor) {
    // tags
    const statsDiv = document.createElement("div")
    const nameTag = document.createElement("label")
    const valueTag = document.createElement("label")
    const barTag = document.createElement("canvas")

    // contents
    statsDiv.classList.add("baseStat")
    nameTag.innerHTML = stat.name
    nameTag.classList.add("baseStatName")
    valueTag.innerHTML = stat.value
    valueTag.classList.add("baseStatValue")
    const canvas = barTag.getContext("2d")
    const gradient = canvas.createLinearGradient(0, 0, 100, 0)
    gradient.addColorStop(0, "#343434")
    gradient.addColorStop(1, `#${hexColor}`)
    canvas.fillStyle = gradient
    canvas.fillRect(0, 15, `${stat.value*2}`, 300)

    // append tags
    statsDiv.append(nameTag)
    statsDiv.append(valueTag)
    statsDiv.append(barTag)

    return statsDiv
}

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

function drawDataAbility(ability, isHidden) {
    // tags
    const tag = drawSection(isHidden ? "Hidden Ability" : "Ability", ability, isHidden ? "hiddenAbility" : "dataAbility")
    const value = drawAbilitiyDescription(abilities[ability])
    value.classList.add("abilityValue")

    tag.append(value)
    return tag
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
    const div = document.createElement("div")
    div.classList.add("types")

    types.forEach((type) => {
        const typeIcon = drawTypeIcon(type)
        div.append(typeIcon)
    })

    return div
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
    const preview = document.createElement("div")
    const image = document.createElement("img")
    const nameTag = document.createElement("p")
    const nationdexNum = document.createElement("p")

    // contents
    preview.classList.add("pokemonPreview")
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
    preview.append(image)
    preview.append(nameTag)
    preview.append(nationdexNum)

    return preview
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
    tag.style.boxShadow = `0 0 5px 4px #${getTypeCSSHex(type)}`

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
        return '736C75'
    } else if (type === "Dragon") {
        return '6A7BAF'
    } else if (type === "Electric") {
        return 'E5C531'
    } else if (type === "Fairy") {
        return 'E397D1'
    } else if (type === "Fighting") {
        return 'CB5F48'
    } else if (type === "Fire") {
        return 'EA7A3C'
    } else if (type === "Flying") {
        return '7DA6DE'
    } else if (type === "Ghost") {
        return '846AB6'
    } else if (type === "Grass") {
        return '71C558'
    } else if (type === "Ground") {
        return 'CC9F4F'
    } else if (type === "Ice") {
        return '70CBD4'
    } else if (type === "Normal") {
        return 'AAB09F'
    } else if (type === "Poison") {
        return 'B468B7'
    } else if (type === "Psychic") {
        return 'E5709B'
    } else if (type === "Rock") {
        return 'B2A061'
    } else if (type === "Steel") {
        return '89A1B0'
    } else if (type === "Water") {
        return '539AE2'
    }
}