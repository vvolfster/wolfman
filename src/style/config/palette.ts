import { PaletteOptions } from "@material-ui/core/styles/createPalette"

const palette: PaletteOptions = {
    common: { black: "#000", white: "#fff" },
    // default is
    background: { paper: "#fff", default: "#B0D9FF" },
    primary: {
        light: "#61B3FF",
        main: "#006CD0",
        dark: "#00498C",
        contrastText: "#fff"
    },
    secondary: {
        light: "#B0D9FF",
        main: "#8EC9FF",
        dark: "#00365A",
        contrastText: "#010825"
    },
    error: {
        light: "#e57373",
        main: "#f44336",
        dark: "#d32f2f",
        contrastText: "#fff"
    },
    text: {
        primary: "rgba(1, 8, 37, 0.87)",
        secondary: "rgba(1, 8, 37, 0.54)",
        disabled: "rgba(1, 8, 37, 0.38)",
        hint: "rgba(1, 8, 37, 0.45)"
    },
    success: {
        main: "#2A9034",
        light: "#7BD682"
    },
    info: {
        main: "#FFF500"
    }
}
export default palette
