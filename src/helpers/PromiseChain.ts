export function promiseChain(fns: (() => Promise<any>)[]) {
    const result: Array<any> = []
    return new Promise<Array<any>>((resolve, reject) => {
        if (!fns.length) {
            return resolve([])
        }

        const promiseStepper = async (idx: number) => {
            if (idx >= fns.length) {
                return resolve(result)
            }

            try {
                const fn = fns[idx]
                result[idx] = await fn()
                promiseStepper(idx + 1)
            } catch (e) {
                console.error("Error in promise chain at idx", idx)
                return reject(e)
            }
        }
        promiseStepper(0)
    })
}
