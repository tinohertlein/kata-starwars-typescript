import {fetchCharacters, fetchPlanets} from './api-client'
import Mock = jest.Mock

describe('api-client should', () => {
    let mockedFetch: Mock

    beforeEach(() => {
        mockedFetch = jest.fn()
    })

    afterEach(() => {
        mockedFetch?.mockClear()
    })

    const mockFetch = (pages: any[]) => {
        pages.forEach(
            (page) =>
                (mockedFetch = mockedFetch.mockImplementationOnce(() =>
                    Promise.resolve({ json: () => Promise.resolve(page) })
                ))
        )
        global.fetch = mockedFetch
    }

    describe('fetch characters', () => {
        const LEIA = {
            name: 'Leia',
            homeworldUrl: 'leia-homeworld-url',
        }
        const LUKE = {
            name: 'Luke',
            homeworldUrl: 'luke-homeworld-url',
        }
        const firstPage = {
            next: 'next-page',
            results: [
                {
                    name: LEIA.name,
                    homeworld: LEIA.homeworldUrl,
                },
            ],
        }
        const lastPage = {
            next: undefined,
            results: [
                {
                    name: LUKE.name,
                    homeworld: LUKE.homeworldUrl,
                },
            ],
        }

        test('in one page', async () => {
            mockFetch([lastPage])

            const characters = await fetchCharacters()

            expect(characters).toEqual([LUKE])
            expect(mockedFetch).toHaveBeenCalledWith(
                'https://swapi.dev/api/people'
            )
        })

        test('in two pages', async () => {
            mockFetch([firstPage, lastPage])

            const characters = await fetchCharacters()

            expect(characters).toEqual([LEIA, LUKE])
            expect(mockedFetch).toHaveBeenNthCalledWith(
                1,
                'https://swapi.dev/api/people'
            )
            expect(mockedFetch).toHaveBeenNthCalledWith(2, 'next-page')
        })
    })
    describe('fetch planets', () => {
        const TATOOINE = {
            name: 'Tatooine',
            url: 'tatooine-url',
        }
        const ALDEARAAN = {
            name: 'Alderaan',
            url: 'alderaan-url',
        }
        const firstPage = {
            next: 'next-page',
            results: [
                {
                    name: TATOOINE.name,
                    url: TATOOINE.url,
                },
            ],
        }
        const lastPage = {
            next: undefined,
            results: [
                {
                    name: ALDEARAAN.name,
                    url: ALDEARAAN.url,
                },
            ],
        }

        test('in one page', async () => {
            mockFetch([lastPage])

            const planets = await fetchPlanets()

            expect(planets).toEqual([ALDEARAAN])
            expect(mockedFetch).toHaveBeenCalledWith(
                'https://swapi.dev/api/planets'
            )
        })

        test('in two pages', async () => {
            mockFetch([firstPage, lastPage])

            const planets = await fetchPlanets()

            expect(planets).toEqual([TATOOINE, ALDEARAAN])
            expect(mockedFetch).toHaveBeenNthCalledWith(
                1,
                'https://swapi.dev/api/planets'
            )
            expect(mockedFetch).toHaveBeenNthCalledWith(2, 'next-page')
        })
    })
})
