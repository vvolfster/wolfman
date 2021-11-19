import { Button, ButtonGroup, makeStyles, Theme } from "@material-ui/core"
import { observer } from "mobx-react-lite"
import React from "react"

export interface TabButtonOption {
    label: string
    value: string
}

interface TabButtonsProps {
    className?: string
    style?: React.CSSProperties
    options: TabButtonOption[] | string[]
    value?: string
    onChange?: (value: string) => any
}

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        flexGrow: 1
    }
}))

export const TabButtons: React.FC<TabButtonsProps> = observer(function TabButtons(props) {
    const [value, setValue] = React.useState(props.value)
    const classes = useStyles()
    const onChange = (value: string) => {
        setValue(value)
        if (props.onChange) {
            props.onChange(value)
        }
    }

    const buttons = props.options.map((option: string | TabButtonOption) => {
        const optLabel = typeof option === "string" ? option : option.label
        const optVal = typeof option === "string" ? option : option.value

        return (
            <Button key={optVal} className={classes.button} variant={value === optVal ? "contained" : "outlined"} onClick={() => onChange(optVal)}>
                {optLabel}
            </Button>
        )
    })

    return (
        <ButtonGroup color="primary" className={props.className} style={props.style}>
            {buttons}
        </ButtonGroup>
    )
})
