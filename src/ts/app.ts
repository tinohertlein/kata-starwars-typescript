import { fetchCharacters, fetchPlanets } from './api-client'
import jquery from 'jquery'

export const populateTableBody = () =>
    Promise.all([fetchCharacters(), fetchPlanets()])
        .then((entities) => {
            const [characters, planets] = entities

            const tbody = jquery('tbody').empty()

            characters.forEach((character) => {
                const homeworldName = planets.find(
                    (planet) => planet.url === character.homeworldUrl
                )?.name

                const tr = jquery('<tr></tr>')
                const tdCharacter = jquery(`<td>${character.name}</td>`)
                const tdHomeWorld = jquery(`<td>${homeworldName}</td>`)
                tr.append(tdCharacter)
                tr.append(tdHomeWorld)
                tbody.append(tr)
            })
        })
        .catch((error) => console.error(error))
