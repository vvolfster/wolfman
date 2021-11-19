import { Button, ButtonProps } from "@material-ui/core"
import React from "react"

export const PrimaryBtn: React.FC<ButtonProps> = function PrimaryBtnSmall(props) {
    return (
        <Button {...props} variant="contained" color="primary" size="small">
            {props.children}
        </Button>
    )
}
export const PrimaryBtnLarge: React.FC<ButtonProps> = function PrimaryBtn(props) {
    return (
        <Button {...props} variant="contained" color="primary">
            {props.children}
        </Button>
    )
}

export const SecondaryBtn: React.FC<ButtonProps> = function SecondaryBtn(props) {
    return (
        <Button {...props} variant="outlined" color="primary" size="small">
            {props.children}
        </Button>
    )
}
export const SecondaryBtnLarge: React.FC<ButtonProps> = function SecondaryBtnLarge(props) {
    return (
        <Button {...props} variant="outlined" color="primary">
            {props.children}
        </Button>
    )
}
