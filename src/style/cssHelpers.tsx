import { CSSProperties } from "@material-ui/styles"
import { Theme } from "./index"

type FlexAlign = "center" | "stretch" | "flex-start" | "flex-end" | "space-between"

export function Row(alignItems: FlexAlign = "flex-start", justifyContent: FlexAlign = "flex-start"): CSSProperties {
    return {
        display: "flex",
        flexFlow: "row",
        alignItems,
        justifyContent
    }
}

export function Column(alignItems: FlexAlign = "flex-start", justifyContent: FlexAlign = "flex-start"): CSSProperties {
    return {
        display: "flex",
        flexFlow: "column",
        alignItems,
        justifyContent
    }
}

export function Padding(verticalOrAll: number, horizontal?: number): CSSProperties {
    if (horizontal === undefined) {
        return {
            padding: Theme.spacing(verticalOrAll)
        }
    } else {
        return {
            padding: Theme.spacing(verticalOrAll, horizontal)
        }
    }
}

export function Margin(verticalOrAll: number, horizontal?: number): CSSProperties {
    if (horizontal === undefined) {
        return {
            margin: Theme.spacing(verticalOrAll)
        }
    } else {
        return {
            margin: Theme.spacing(verticalOrAll, horizontal)
        }
    }
}

export function Shadow(depth = 3): CSSProperties {
    return {
        boxShadow: `0 ${depth}px 5px 3px #ccc`
    }
}

export function ShadowUp(depth = 3): CSSProperties {
    return {
        boxShadow: `0 ${-depth}px 5px 3px #ccc`
    }
}

export function ShadowRight(depth = 3): CSSProperties {
    return {
        boxShadow: `${depth}px 0 5px 3px #ccc`
    }
}
