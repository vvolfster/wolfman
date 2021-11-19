import { makeStyles, TextField, Theme } from "@material-ui/core"
import clsx from "clsx"
import { formatDate_hh_mm_12, formatDate_yyyy_mm_dd, nowAndSevenDaysAgoDateTime } from "helpers/DateUtil"
import { isNaN } from "lodash"
import { observer } from "mobx-react-lite"
import React, { CSSProperties } from "react"
import { DateTime } from "luxon"

export interface DatePickerValue {
    dateStart: DateTime
    dateEnd: DateTime
}

interface ComponentProps {
    className?: string
    style?: CSSProperties
    value?: DatePickerValue
    onChange?: (v: DatePickerValue) => any
    timezone?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    dateRangePicker: {
        display: "grid",
        gridTemplateColumns: "auto auto",
        gridAutoFlow: "column",
        columnGap: theme.spacing(2)
    }
}))

const inputLabelProps = {
    shrink: true
}

function isEq(a: DatePickerValue | undefined, b: DatePickerValue | undefined) {
    if (a && b) {
        return a.dateStart.toMillis() === b.dateStart.toMillis() && a.dateEnd.toMillis() === b.dateEnd.toMillis()
    } else {
        return a === b
    }
}

export const DateRangePicker: React.FC<ComponentProps> = observer(function DateRangePicker(props) {
    const classes = useStyles()
    const className = clsx(classes.dateRangePicker, props.className)
    const [value, setValue] = React.useState<DatePickerValue | undefined>()
    const [tz, setTz] = React.useState(props.timezone)

    const setValueAndCb = (value: DatePickerValue) => {
        setValue(value)
        if (props.onChange) {
            props.onChange(value)
        }
    }

    // on start
    React.useEffect(() => {
        setValue(nowAndSevenDaysAgoDateTime(props.timezone))
    }, [])

    // on tz change
    React.useEffect(() => {
        if (tz !== props.timezone) {
            setTz(props.timezone)
            if (value) {
                if (props.timezone) {
                    setValueAndCb({
                        dateStart: value.dateStart.setZone(props.timezone).startOf("day"),
                        dateEnd: value.dateEnd.setZone(props.timezone).endOf("day")
                    })
                } else {
                    setValueAndCb({
                        dateStart: value.dateStart.startOf("day"),
                        dateEnd: value.dateEnd.endOf("day")
                    })
                }
            }
        }
    }, [props.timezone])

    // on value change
    React.useEffect(() => {
        if (props.value && !isEq(props.value, value)) {
            if (tz) {
                setValue({
                    dateEnd: props.value.dateEnd.setZone(tz),
                    dateStart: props.value.dateStart.setZone(tz)
                })
            } else {
                setValue(props.value)
            }
        }
    }, [props.value])

    if (!value) {
        return null
    }

    const onChange = (type: "start" | "end", e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let dateTime = DateTime.fromFormat(e.target.value, "y-LL-dd")
        if (props.timezone) {
            dateTime = dateTime.setZone(props.timezone)
        }

        if (isNaN(dateTime.toMillis())) {
            return
        }

        const newValue: DatePickerValue =
            type === "start"
                ? {
                      ...value,
                      dateStart: dateTime.startOf("day")
                  }
                : {
                      ...value,
                      dateEnd: dateTime.endOf("day")
                  }

        setValueAndCb(newValue)
    }

    return (
        <div className={className}>
            <TextField
                label={`From Date (${formatDate_hh_mm_12(value.dateStart)})`}
                type="date"
                value={formatDate_yyyy_mm_dd(value.dateStart)}
                InputLabelProps={inputLabelProps}
                onChange={e => onChange("start", e)}
            />

            <TextField
                label={`To Date (${formatDate_hh_mm_12(value.dateEnd)})`}
                type="date"
                value={formatDate_yyyy_mm_dd(value.dateEnd)}
                InputLabelProps={inputLabelProps}
                onChange={e => onChange("end", e)}
            />
        </div>
    )
})
