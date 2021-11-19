import { Router } from "@reach/router"
import { capitalize, every, find, keys, toLower, values } from "lodash"
import { Error404Page } from "pages/Error404"
import { MainLayout } from "pages/MainLayout/MainLayout"
import { MainPage } from "pages/MainPage"
import React from "react"
import { Route, RouteInfo } from "./Route"

interface RouterProps {
    className?: string
    style?: React.CSSProperties
}

const navigationGuards = {
    print: async (to: RouteInfo, from?: RouteInfo): Promise<string | boolean> => {
        if (to.fullPath === "/" || to.fullPath === "") {
            return "/main"
        }

        if (from) {
            console.log(`navigate from ${from?.path} --> ${to.path}`)
        }
        return true
    }
}

export const PATHS = {
    ROOT: () => "/*",
    MAIN: () => "/main"
}

export function isOnPage(path: string) {
    return window.location.pathname === path
}

export function getPageName(PATH: string) {
    const path = PATH.startsWith("/") ? PATH.slice(1) : PATH
    const pieces = path.split("/")

    const pathNames = keys(PATHS)
    const pathValues = values(PATHS)
        .map(fn => fn())
        .map(p => (p.startsWith("/") ? p.slice(1) : p))

    const matchingPathName = find(pathNames, (name: string, idx: number) => {
        const pathPieces = pathValues[idx]?.split("/")
        return every(pieces, (piece: string, pieceIdx: number) => {
            const pathPiece = pathPieces[pieceIdx]
            if (!pathPiece) {
                return false
            }

            if (pathPiece.startsWith(":")) {
                return true
            }

            return piece === pathPiece
        })
    })

    if (!matchingPathName) {
        return "MT Game"
    }

    return matchingPathName
        .split("_")
        .map(toLower)
        .map(capitalize)
        .join(" ")
}

const Layout: React.FC<RouterProps> = props => (
    <Router className={props.className} style={props.style}>
        <Route path={PATHS.ROOT()} guard={[navigationGuards.print]} component={MainLayout} topBarVisible={true} />
    </Router>
)

const Main: React.FC<RouterProps> = props => (
    <Router className={props.className} style={props.style}>
        <Route path={PATHS.MAIN()} guard={[navigationGuards.print]} component={MainPage} />
        <Route path="*" guard={[navigationGuards.print]} component={Error404Page} />
    </Router>
)

export const AppRouter = { Layout, Main }
