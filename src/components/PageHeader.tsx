import { makeStyles, Theme, Typography } from "@material-ui/core"
import { navigate, RouteComponentProps } from "@reach/router"
import { DeviceIcon, OrgIcon, RightArrowIcon, SiteIcon } from "components/Icons"
import { observer } from "mobx-react-lite"
import React from "react"
import { PATHS } from "Router"
import { Padding, Row, Shadow } from "style/cssHelpers"
import { CloseIcon } from "./Icons"

interface PageHeaderProps {
    orgId: string
    siteId?: string
    deviceId?: string
    backPath?: string
    onBackClick?: () => any
}

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        ...Row("center", "space-between"),
        ...Padding(0, 0.5),
        ...Shadow(),
        minHeight: theme.spacing(4)
    },
    grid: {
        ...Row("center", "flex-start")
    },
    crumb: {
        ...Row("center", "flex-start")
    }
}))

export const PageHeader: React.FC<RouteComponentProps<PageHeaderProps>> = observer(function PageHeader(props) {
    const classes = useStyles()

    return (
        <div className={classes.header}>
            <div className={classes.grid}>{props.children && <Typography variant="h5">{props.children}</Typography>}</div>
            <CloseIcon x-if={props.backPath || props.onBackClick} onClick={() => (props.onBackClick ? props.onBackClick() : navigate(props.backPath || ""))} />
        </div>
    )
})
