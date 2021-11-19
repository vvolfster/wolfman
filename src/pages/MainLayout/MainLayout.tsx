import { makeStyles, Theme } from "@material-ui/core"
import { RouteComponentProps } from "@reach/router"
import { observer } from "mobx-react-lite"
import React from "react"
import { AppRouter } from "Router"
import { Column } from "style/cssHelpers"
import { NavBar } from "./NavBar"

const useStyles = makeStyles((theme: Theme) => ({
    mainLayout: {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        ...Column("stretch", "flex-start")
    },
    topBar: {
        flex: `0 0 ${theme.spacing(6)}px`
    },
    mainRouter: {
        position: "relative",
        overflow: "hidden",
        flexGrow: 1,
        background: theme.palette.common.white,
        maxHeight: `calc(100vh - ${theme.spacing(6)}px)`
    }
}))

export const MainLayout: React.FC<RouteComponentProps> = observer(function MainLayout() {
    const classes = useStyles()
    const MainRouter = AppRouter.Main

    return (
        <div className={classes.mainLayout}>
            <NavBar className={classes.topBar} />
            <MainRouter className={classes.mainRouter} />
        </div>
    )
})
