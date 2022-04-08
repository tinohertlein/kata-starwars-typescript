const BASE_URL = 'https://swapi.dev/api'

export interface Character {
    name: string
    homeworldUrl: string
}

export interface Planet {
    name: string
    url: string
}

export const fetchCharacters = async () => fetchEntities('people', toCharacters)

export const fetchPlanets = async () => fetchEntities('planets', toPlanets)

const fetchEntities = async (path: string, toEntity: (json: any) => any[]) => {
    const firstPageUrl = `${BASE_URL}/${path}`
    const entities = [] as any[]

    let pageUrl = firstPageUrl

    while (pageUrl) {
        const json = await fetchPage(pageUrl)
        pageUrl = json.next
        entities.push(...toEntity(json))
    }

    return entities
}

const fetchPage = async (url: string) => await (await fetch(url)).json()

const toCharacters = (json: any) =>
    json.results.map(
        (result: any) =>
            ({
                name: result.name,
                homeworldUrl: result.homeworld,
            } as Character)
    )

const toPlanets = (json: any) =>
    json.results.map(
        (result: any) =>
            ({
                name: result.name,
                url: result.url,
            } as Planet)
    )
