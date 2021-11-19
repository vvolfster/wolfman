import { isArray, pickBy } from "lodash"
import React, { useState, useEffect } from "react"
import CircularProgress from "@material-ui/core/CircularProgress"
import { RouteComponentProps, Redirect } from "@reach/router"
import { GetQueryParams } from "./helpers/QueryParam"

type GuardFn = (to: RouteInfo, from?: RouteInfo) => Promise<boolean | string>

interface RouteProps extends RouteComponentProps {
    component: React.ComponentType<RouteComponentProps<{}>>
    redirect?: string
    guard?: GuardFn | GuardFn[]
    topBarVisible?: boolean
}

enum STATUS {
    LOADING,
    REDIRECT,
    READY,
    ERROR
}

interface Params {
    [key: string]: {}
}

export interface RouteInfo {
    path?: string
    fullPath?: string
    parameters: Partial<RouteProps>
    query: Params
}

const helpers = {
    previousRouteInfo: undefined as RouteInfo | undefined,
    getParameters(props: RouteProps): Partial<RouteProps> {
        const removeKeys = ["component", "default", "guard", "location", "name", "navigate", "path", "redirect", "uri", "children", "*"]
        return pickBy(props, (v, k) => !removeKeys.includes(k))
    },
    getQuery(url: string = ""): Params {
        return GetQueryParams(url)
    },
    pageProps(props: RouteProps) {
        const removeKeys = [`component`, `redirect`, `guard`]
        return pickBy(props, (v, k) => !removeKeys.includes(k))
    },
    getRouteInfo(props: RouteProps): RouteInfo {
        return {
            path: props.path,
            fullPath: props.location && props.location.pathname,
            parameters: helpers.getParameters(props),
            query: helpers.getQuery(window.location.href)
        }
    },
    runGuardChain(guardFnArr: GuardFn[], routeInfo: RouteInfo, toReady: () => void, toRedirect: (newRedirect?: string) => void) {
        return new Promise<void>(async (resolve, reject) => {
            const runGuardFn = async (idx: number) => {
                // console.log(routeInfo.fullPath, `Run guard fn`, idx, `of`, guardFnArr.length)
                const isLast = idx === guardFnArr.length - 1
                const fn = guardFnArr[idx]
                const errPrefix = `${routeInfo.fullPath} GuardFn when going to ${routeInfo.fullPath}::`

                if (!fn) {
                    toReady()
                    return resolve()
                }

                const result = await fn(routeInfo, helpers.previousRouteInfo)
                if (typeof result === "boolean") {
                    if (!result) {
                        throw new Error(`${errPrefix} (${idx}) guardfn failed`)
                    }
                    if (isLast) {
                        toReady()
                        return resolve()
                    } else {
                        await runGuardFn(idx + 1)
                        return
                    }
                } else if (typeof result === "string") {
                    if (!result.length) {
                        throw new Error(`${errPrefix} (${idx}) redirect of guardFn was empty string!`)
                    }

                    // if redirected, kill the chain
                    toRedirect(result)
                    return resolve()
                } else {
                    throw new Error(`${errPrefix} (${idx}) result of guardFn was not boolean or string`)
                }
            }

            try {
                await runGuardFn(0)
            } catch (e) {
                return reject(e)
            }
        })
    }
}

export const Route: React.FC<RouteProps> = props => {
    const [status, setStatus] = useState(STATUS.LOADING)
    const [redirect, setRedirect] = useState(props.redirect || "/login")

    useEffect(() => {
        const onGuard = async () => {
            const routeInfo = helpers.getRouteInfo(props)
            const toReady = () => {
                helpers.previousRouteInfo = routeInfo
                return setStatus(STATUS.READY)
            }
            const toRedirect = (newRedirect?: string) => {
                if (newRedirect) {
                    setRedirect(newRedirect)
                }
                return setStatus(STATUS.REDIRECT)
            }

            if (!props.guard) {
                helpers.previousRouteInfo = routeInfo
                return toReady()
            }

            try {
                const guardFnArr = isArray(props.guard) ? props.guard : [props.guard]
                await helpers.runGuardChain(guardFnArr, routeInfo, toReady, toRedirect)
            } catch (e) {
                console.error(`Error in guard function`, e)
                return setStatus(STATUS.ERROR)
            }
        }
        onGuard()
    }, [props])

    switch (status) {
        default:
            return null // error case
        case STATUS.LOADING:
            return <CircularProgress />
        case STATUS.REDIRECT:
            return <Redirect noThrow to={redirect} />
        case STATUS.READY:
            return <props.component {...helpers.pageProps(props)} />
    }
}
