/**
 * @jest-environment jsdom
 */
import * as apiClient from './api-client'
import {Character, Planet} from './api-client'
import {populateTableBody} from './app'
import jquery from 'jquery'
import Mock = jest.Mock

describe('populateTable should', () => {
    console.error = jest.fn()

    beforeEach(() => {
        ;(console.error as Mock).mockClear()
    })

    test('display the characters & their homeworlds', async () => {
        const tbody = jquery('body').append('<tbody></tbody>')
        const fetchCharactersSpy = jest.spyOn(apiClient, 'fetchCharacters').mockResolvedValue([
            {
                name: 'Leia',
                homeworldUrl: 'tatooine-url',
            } as Character,
            {
                name: 'Luke',
                homeworldUrl: 'alderaan-url',
            } as Character
        ])
        const fetchPlanetsSpy = jest.spyOn(apiClient, 'fetchPlanets').mockResolvedValue([
            {
                name: 'Tatooine',
                url: 'tatooine-url',
            } as Planet,
            {
                name: 'Alderaan',
                url: 'alderaan-url',
            } as Planet
        ])

        await populateTableBody()

        expect(fetchCharactersSpy).toBeCalled()
        expect(fetchPlanetsSpy).toBeCalled()
        expect(tbody.get()).toMatchSnapshot()
    })

    test('write errors to the console', async () => {
        const errorMessage = 'This is an error';
        jest.spyOn(apiClient, 'fetchCharacters').mockRejectedValue(
            errorMessage
        )

        await populateTableBody()

        expect(console.error).toHaveBeenCalledWith(errorMessage)
    })
})
