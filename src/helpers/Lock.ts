import AsyncLock from "async-lock"

let alock = new AsyncLock()

export function Lock<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
    return new Promise((resolve, reject) => {
        alock.acquire(name, async () => {
            try {
                const result = await fn()
                return resolve(result)
            } catch (e) {
                return reject(e)
            }
        })
    })
}
