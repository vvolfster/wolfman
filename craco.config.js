const { ESLINT_MODES } = require("@craco/craco")

module.exports = {
    reactScriptsVersion: "react-scripts",
    eslint: {
        mode: ESLINT_MODES.file
    },
    babel: {
        plugins: [["react-directives", { prefix: "x", pragmaType: "React" }]]
    }
}
