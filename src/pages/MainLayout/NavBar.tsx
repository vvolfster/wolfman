import { AppBar, makeStyles, Theme } from "@material-ui/core"
import { RouteComponentProps } from "@reach/router"
import clsx from "clsx"
import { observer } from "mobx-react-lite"
import React, { CSSProperties } from "react"
import { Padding, Row } from "style/cssHelpers"

interface NavBarProps {
    className?: string
    style?: CSSProperties
}

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        position: "relative",
        ...Padding(1),
        ...Row("center", "space-between")
    }
}))

export const NavBar: React.FC<RouteComponentProps<NavBarProps>> = observer(function NavBar(props) {
    const classes = useStyles()
    const className = clsx(classes.appBar, props.className)

    return <AppBar className={className} position="relative"></AppBar>
})
