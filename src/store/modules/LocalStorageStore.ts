export enum LOCAL_STORAGE_KEYS {
    CHANCE_SEED = "CHANCE_SEED",
    LINE_FN = "LINE_FN",
    NUM_CONNECTIONS = "NUM_CONNECTIONS",
    POPULATION_SIZE = "POPULATION_SIZE",
    TICKS_PER_GENERATION = "TICKS_PER_GENERATION",
    MUTATION_CHANCE = "MUTATION_CHANCE",
    NUM_INTERNAL_NEURONS = "NUM_INTERNAL_NEURONS"
}

export interface LocalStorageAccessor<T> {
    getIfExists: () => T | undefined
    get: () => T
    set: (val: T) => any
    delete: () => any
}

function localStorageAccessor<T>(name: string, defVal?: T): LocalStorageAccessor<T> {
    const getIfExists = (): T | undefined => {
        const val = localStorage.getItem(name)
        if (val === null) {
            return defVal || undefined
        }
        try {
            return JSON.parse(val)
        } catch (e) {
            console.error(`Failed to parse`, val, e)
            return defVal || undefined
        }
    }
    return {
        getIfExists,
        get: (): T => {
            const val = getIfExists()
            if (val === undefined) {
                throw new Error(`${name} does not exist in localStorage`)
            }
            return val
        },
        set: (val: T) => localStorage.setItem(name, JSON.stringify(val)),
        delete: () => localStorage.removeItem(name)
    }
}

export class LocalStorageStore {
    chanceSeed = localStorageAccessor<string>(LOCAL_STORAGE_KEYS.CHANCE_SEED, "")
    lineFn = localStorageAccessor<string>(LOCAL_STORAGE_KEYS.LINE_FN, "")
    numConnections = localStorageAccessor<number>(LOCAL_STORAGE_KEYS.NUM_CONNECTIONS, 5)
    populationSize = localStorageAccessor<number>(LOCAL_STORAGE_KEYS.POPULATION_SIZE, 25)
    ticksPerGeneration = localStorageAccessor<number>(LOCAL_STORAGE_KEYS.TICKS_PER_GENERATION, 10)
    mutationChance = localStorageAccessor<number>(LOCAL_STORAGE_KEYS.MUTATION_CHANCE, 0.1)
    numInternalNeurons = localStorageAccessor<number>(LOCAL_STORAGE_KEYS.NUM_INTERNAL_NEURONS, 2)

    clear = () => {
        this.chanceSeed.delete()
    }
}

export const localStorageStore = new LocalStorageStore()
