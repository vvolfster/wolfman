import { ThemeProvider } from "@material-ui/core"
import CssBaseLine from "@material-ui/core/CssBaseline"
import { observer } from "mobx-react-lite"
import "mobx-react-lite/batchingForReactDom"
import React from "react"
import ReactDOM from "react-dom"
import { register as registerServiceWorker } from "serviceWorker"
import { Store } from "store/Store"
import { Theme } from "style"
import "sweetalert2/dist/sweetalert2.min.css"
import "style/cssOverrides.css"
import { AppRouter } from "./Router"

async function main() {
    registerServiceWorker({
        onUpdate: (registration: ServiceWorkerRegistration) => {
            if (window.confirm("Update available. Do you want to reload?")) {
                window.location.reload()
            }
        }
    })

    await Store.init()

    const rootElement = document.getElementById("root")

    const LayoutRouter = AppRouter.Layout
    const App = observer(() => (
        <ThemeProvider theme={Theme}>
            <CssBaseLine />
            <LayoutRouter className="layoutRouter" />
        </ThemeProvider>
    ))

    ReactDOM.render(<App />, rootElement)
}

main()
