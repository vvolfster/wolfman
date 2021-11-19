import { isNumber } from "lodash"
import { DateTime } from "luxon"

type AcceptableDateType = Date | number | DateTime
export const MS_IN_MINUTE = 1000 * 60
export const MS_IN_HR = MS_IN_MINUTE * 60
export const MS_IN_DAY = MS_IN_HR * 24
export const MS_IN_WEEK = MS_IN_DAY * 7

export const NOW_MS = new Date().getTime()
export const MS_7_DAYS_AGO = NOW_MS - MS_IN_WEEK

export function nowAndSevenDaysAgoDateTime(timezone?: string) {
    let dateEnd: DateTime
    if (timezone) {
        dateEnd = DateTime.now()
            .setZone(timezone)
            .endOf("day")
    } else {
        dateEnd = DateTime.now()
    }

    return {
        dateEnd,
        dateStart: dateEnd.minus({ milliseconds: MS_IN_WEEK }).startOf("day")
    }
}

export function getDateTime(date: AcceptableDateType) {
    if (isNumber(date)) {
        return DateTime.fromMillis(date)
    } else if (date instanceof Date) {
        return DateTime.fromJSDate(date)
    } else {
        return date
    }
}

export const formatDate_mm_dd_yyyy = (date: AcceptableDateType) => getDateTime(date).toFormat("LL/dd/y")
export const formatDate_yyyy_mm_dd = (date: AcceptableDateType) => getDateTime(date).toFormat("y-LL-dd")
export const formatDate_hh_mm_12 = (date: AcceptableDateType) => getDateTime(date).toFormat("hh:mma")
export const formatDate_mm_dd_yyyy_hh_mm_12 = (date: AcceptableDateType) => getDateTime(date).toFormat("LL/dd/y hh:mma")
export const formatDate_mm_dd_yy_hh_mm_12 = (date: AcceptableDateType) => getDateTime(date).toFormat("LL/dd/yy hh:mma")
export const formatDate_mm_dd_yyyy_hh_mm_24 = (date: AcceptableDateType) => getDateTime(date).toFormat("LL/dd/y T")
export const formatDate_fileNameCompatible = (date: AcceptableDateType) => getDateTime(date).toFormat("y-LL-dd--hh-mm-a")
export const localTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

function padded(num: number, padding = 2) {
    return num.toString().padStart(padding, "0")
}

export function formatDate(date: number | Date | string) {
    const d = new Date(date)

    const result = {
        date: [padded(d.getMonth() + 1), padded(d.getDate()), padded(d.getFullYear(), 4)].join("/"),
        time: [padded(d.getHours()), padded(d.getMinutes()), padded(d.getSeconds())].join(":")
    }

    return [result.date, result.time].join(" ")
}
