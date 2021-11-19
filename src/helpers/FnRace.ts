export function fnRace<T>(fns: (() => T)[]): T | undefined {
    for (let i = 0; i < fns.length; i++) {
        try {
            const v = fns[i]()
            if (v !== undefined) {
                return v
            }
        } catch (e) {
            console.warn(e)
        }
    }
    return undefined
}
