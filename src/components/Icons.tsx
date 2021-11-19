import { Button, ButtonProps, Icon } from "@material-ui/core"
import React from "react"

interface IconProps extends ButtonProps {
    className?: string
    style?: React.CSSProperties
    iconSize?: number
    icon?: string
}

const BaseIcon: React.FC<IconProps> = function BaseIcon(props) {
    const { className, iconSize, style, ...buttonProps } = props
    const assignedStyle = { ...style }
    const iSize = iconSize || 32

    assignedStyle.minWidth = Math.max(42, iSize)
    assignedStyle.minHeight = iSize
    assignedStyle.cursor = buttonProps.onClick ? "pointer" : "unset"

    const iconStyle: React.CSSProperties = {}
    if (props.children) {
        iconStyle.marginRight = 4
    }

    return (
        <Button size="small" disableRipple={!props.onClick} className={className} style={assignedStyle} {...buttonProps}>
            <Icon style={iconStyle}>{props.icon}</Icon>
            {props.children}
        </Button>
    )
}

export const OrgIcon: React.FC<IconProps> = function OrgIcon(props) {
    return <BaseIcon {...props} icon="home" />
}

export const SiteIcon: React.FC<IconProps> = function DeviceIcon(props) {
    return <BaseIcon {...props} icon="business" />
}

export const DeviceIcon: React.FC<IconProps> = function DeviceIcon(props) {
    return <BaseIcon {...props} icon="stay_current_portrait" />
}

export const DeviceIconAlert: React.FC<IconProps> = function DeviceIcon(props) {
    return <BaseIcon {...props} icon="phonelink_erase" />
}

export const CloseIcon: React.FC<IconProps> = function CloseIcon(props) {
    return <BaseIcon {...props} icon="close" />
}

export const RightArrowIcon: React.FC<IconProps> = function RightArrow(props) {
    return <BaseIcon {...props} icon="arrow_right_alt" />
}

export const LeftArrowIcon: React.FC<IconProps> = function LeftArrow(props) {
    return <BaseIcon {...props} icon="arrow_left_alt" />
}

export const EditIcon: React.FC<IconProps> = function EditIcon(props) {
    return <BaseIcon {...props} icon="edit" />
}

export const BatteryIcon: React.FC<IconProps> = function BatteryIcon(props) {
    return <BaseIcon {...props} icon="battery_full" />
}

export const SignalIcon: React.FC<IconProps> = function SignalIcon(props) {
    return <BaseIcon {...props} icon="signal_cellular_4_bar" />
}

export const BroadcastIcon: React.FC<IconProps> = function BroadcastIcon(props) {
    return <BaseIcon {...props} icon="podcasts" />
}

export const SearchIcon: React.FC<IconProps> = function SearchIcon(props) {
    return <BaseIcon {...props} icon="search" />
}

export const DeleteIcon: React.FC<IconProps> = function DeleteIcon(props) {
    return <BaseIcon {...props} icon="delete" />
}

export const ElipsisIcon: React.FC<IconProps> = function DeleteIcon(props) {
    return <BaseIcon {...props} icon="more_horiz" />
}

export const InfoIcon: React.FC<IconProps> = function InfoIcon(props) {
    return <BaseIcon {...props} icon="info" />
}

export const BluetoothIcon: React.FC<IconProps> = function BluetoothIcon(props) {
    return <BaseIcon {...props} icon="bluetooth" />
}
