import { cloneDeep } from "lodash"
import { toJS } from "mobx"

export function deepClone<T>(obj: T): T {
    return cloneDeep(toJS(obj))
}
