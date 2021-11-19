import { TypographyOptions } from "@material-ui/core/styles/createTypography"

const fontFamily = '"Nunito", sans-serif'

const typography: TypographyOptions = {
    htmlFontSize: 16,
    fontFamily,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
        fontFamily,
        fontSize: "4.5rem",
        fontWeight: 900,
        fontStyle: "normal",
        lineHeight: 1.22,
        letterSpacing: "0.04em",
        textTransform: "capitalize"
    },
    h2: {
        fontFamily,
        fontSize: "2.25rem",
        fontWeight: 900,
        fontStyle: "normal",
        lineHeight: 1.22,
        letterSpacing: "0.04em",
        textTransform: "capitalize"
    },
    h3: {
        fontFamily,
        fontSize: "1.5rem",
        fontWeight: 900,
        fontStyle: "normal",
        lineHeight: 1.21,
        letterSpacing: "0.04em",
        textTransform: "capitalize"
    },
    h4: {
        fontFamily,
        fontSize: "1.125rem",
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 1.22,
        letterSpacing: "0.01em",
        textTransform: "uppercase"
    },
    h5: {
        fontFamily,
        fontSize: "1.125rem",
        fontWeight: 900,
        fontStyle: "normal",
        lineHeight: 1.22,
        letterSpacing: "0.02em"
    },
    h6: {
        fontFamily,
        fontSize: "20px",
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 1.6,
        letterSpacing: "0.25px"
    },
    body1: {
        fontFamily,
        fontSize: "1.125rem",
        fontWeight: 500,
        fontStyle: "normal",
        lineHeight: 1.22
        // letterSpacing: "0.25px"
    },
    button: {
        // same as h5
        fontFamily,
        fontSize: "1.125rem",
        fontWeight: 900,
        fontStyle: "normal",
        lineHeight: 1,
        letterSpacing: "0.02em",
        textTransform: "capitalize"
    },
    subtitle1: {
        fontFamily,
        fontSize: "16px",
        fontWeight: 300,
        fontStyle: "normal",
        lineHeight: 1.5,
        letterSpacing: "0.15px"
    },
    body2: {
        fontFamily,
        fontSize: "0.875rem",
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 1.214,
        letterSpacing: "0.5px"
    },
    subtitle2: {
        fontFamily,
        fontSize: "14px",
        fontWeight: 300,
        fontStyle: "normal",
        lineHeight: 1.71,
        letterSpacing: "normal"
    },
    overline: {
        fontFamily,
        fontSize: "0.875rem",
        fontWeight: 500,
        fontStyle: "normal",
        lineHeight: 1.14,
        letterSpacing: "0.08em"
    }
}

export default typography
