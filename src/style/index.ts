import { createMuiTheme } from "@material-ui/core/styles"
import breakpoints from "./config/breakpoints"
import palette from "./config/palette"
import spacing from "./config/spacing"
import typography from "./config/typography"

export const Theme = createMuiTheme({
    typography,
    palette,
    breakpoints,
    spacing
})
