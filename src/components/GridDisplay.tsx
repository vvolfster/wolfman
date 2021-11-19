import { makeStyles, Theme } from "@material-ui/core"
import { useWindowSize } from "@react-hook/window-size"
import clsx from "clsx"
import { observer } from "mobx-react-lite"
import React from "react"
import { Row } from "style/cssHelpers"
import { Parser } from "expr-eval"
import { MainState } from "pages/MainState"

interface Props {
    state: MainState
    className?: string
    style?: React.CSSProperties
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        ...Row("center", "center")
    },
    grid: {
        border: "solid 1px black"
    },
    circle: {
        transition: "all 0.1s ease-in-out;"
    }
}))

export const GridDisplay: React.FC<Props> = observer(function GridDisplay(props) {
    const classes = useStyles()
    const { state } = props
    const { input } = state
    const { size, lineFn } = input

    const [width, height] = size
    const [w, h] = useWindowSize()

    const entities = state.entities.map(entity => {
        const { x, y } = entity.point
        const lineYPos = Parser.evaluate(lineFn, { x })
        const isSafe = entity.point.y > lineYPos
        const fill = isSafe ? "green" : "red"

        return <circle key={entity.id} cx={x} cy={y} r={1} fill={fill} className={classes.circle} />
    })

    const linePts = {
        x1: "0",
        x2: width,
        y1: Parser.evaluate(lineFn, { x: 0 }),
        y2: Parser.evaluate(lineFn, { x: width })
    }

    return (
        <div className={clsx(classes.root, props.className)} style={props.style}>
            <svg width={w - 245 - 16} height={h - 48 - 16} viewBox={`0 0 ${width} ${height}`} className={classes.grid}>
                <g transform={`matrix(1 0 0 -1 0 ${height})`}>
                    <rect width={width} height={height} fill="peachpuff" />
                    {entities}
                    <line {...linePts} stroke="purple" />
                </g>
            </svg>
        </div>
    )
})
