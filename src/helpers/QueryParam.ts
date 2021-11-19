import { keys, isArray } from "lodash"
import { observable, observe } from "mobx"
import queryString from "query-string"
import { Store } from "store/Store"

export interface Params {
    [key: string]: string
}

export const GetQueryParams = (url: string = ""): Params => {
    const query: Params = {}
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (substring, key, value) => {
        return (query[key] = value)
    })
    return query
}

export const GetQueryParam = (url: string, name: string): string | undefined => {
    const params = GetQueryParams(url)
    if (!keys(params).includes(name)) {
        return undefined
    }
    return params[name]
}

// Helper class that reads query param "name" from the window.location.href
// and updates the href without reload when using the "set" method
// Using this should help us create more "sharable" links
export class QueryParam {
    name: string
    @observable value: string = ""
    onDestroy: () => void

    constructor(name: string) {
        this.name = name
        this.value = GetQueryParam(window.location.href, name) || ""
        this.onDestroy = observe(Store.route.state, "location", () => {
            this.value = GetQueryParam(window.location.href, name) || ""
        })
    }

    private valToString = (value: boolean | string | number | (string | number)[] | undefined) => {
        if (value === undefined) {
            return ""
        }
        if (isArray(value)) {
            return !value.length ? "" : value[0].toString()
        }
        return value.toString()
    }

    set = (val: boolean | string | number | (string | number)[] | undefined) => {
        const value = this.valToString(val)
        this.value = value
        const query = queryString.parse(window.location.search)
        if (value) {
            query[this.name] = value
        } else {
            delete query[this.name]
        }

        const [url] = window.location.href.split("?")
        const newUrl = queryString.stringifyUrl({ url, query })

        window.history.replaceState({}, "Pandatopia", newUrl)
    }
}
