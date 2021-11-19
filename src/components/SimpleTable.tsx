import { Typography } from "@material-ui/core"
import { Dictionary, keys } from "lodash"
import { observer } from "mobx-react-lite"
import React from "react"

interface Props {
    value: Dictionary<string | number | boolean>
}

export const SimpleTable: React.FC<Props> = observer(function SimpleTable(props) {
    const rows = keys(props.value).map(key => {
        return (
            <tr key={key}>
                <td>
                    <Typography variant="body1">{key}</Typography>
                </td>
                <td>
                    <Typography variant="body1">{props.value[key].toString()}</Typography>
                </td>
            </tr>
        )
    })
    return (
        <table>
            <tbody>{rows}</tbody>
        </table>
    )
})
