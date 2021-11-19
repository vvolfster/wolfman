import { makeStyles, Button, Menu, MenuItem, Typography, Theme, Icon } from "@material-ui/core"
import clsx from "clsx"
import { observer } from "mobx-react-lite"
import React, { CSSProperties } from "react"
import { Row } from "style/cssHelpers"

export interface PopoverMenuOption {
    element?: React.ReactNode
    label: string
    fn: () => any | Promise<any>
}

interface ComponentProps {
    label?: string
    className?: string
    style?: CSSProperties
    options: PopoverMenuOption[]
    x?: number
    y?: number
    hideArrow?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    popoverMenuAnchor: {
        cursor: "pointer",
        position: "relative",
        ...Row("center")
    },
    popoverMenuIcon: {
        marginLeft: theme.spacing(0.25)
    },
    popover: {
        top: 96
    }
}))

export const PopoverMenu: React.FC<ComponentProps> = observer(function PopoverMenu(props) {
    const classes = useStyles()
    const className = clsx(classes.popoverMenuAnchor, props.className)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)
    const handleOptionClick = (opt: PopoverMenuOption) => {
        opt.fn()
        handleClose()
    }

    const menuItems = props.options.map((opt, idx) => {
        const label = opt.element ? opt.element : <Typography variant="body1">{opt.label}</Typography>
        return (
            <MenuItem key={idx} onClick={() => handleOptionClick(opt)}>
                {label}
            </MenuItem>
        )
    })

    return (
        <React.Fragment>
            <div onClick={handleClick} className={className} style={props.style}>
                <Button x-if={!props.children} aria-controls="simple-menu" aria-haspopup="true">
                    Open Menu
                </Button>
                {props.children}
                <Icon x-if={!props.hideArrow} className={classes.popoverMenuIcon}>
                    {anchorEl ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                </Icon>
                {props.x}
            </div>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} keepMounted anchorPosition={{ left: props.x || 0, top: props.y || 0 }}>
                {menuItems}
            </Menu>
        </React.Fragment>
    )
})
