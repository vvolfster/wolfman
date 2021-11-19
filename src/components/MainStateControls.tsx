import { makeStyles, Paper, TextField, Theme } from "@material-ui/core"
import { Dialog } from "helpers"
import { toNumber } from "lodash"
import { observer } from "mobx-react-lite"
import { MainState } from "pages/MainState"
import React from "react"
import { LocalStorageAccessor, localStorageStore } from "store/modules/LocalStorageStore"
import { Column, Padding } from "style/cssHelpers"
import { SecondaryBtn } from "./Btn"
import { SimpleTable } from "./SimpleTable"

interface Props {
    state: MainState
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "100%",
        ...Column("stretch", "space-between")
    },
    controlsArea: {
        ...Padding(2),
        display: "grid",
        gridAutoFlow: "row",
        rowGap: theme.spacing(1)
    },
    control: {
        display: "grid",
        gridAutoFlow: "row",
        gridAutoColumns: "1fr",
        rowGap: theme.spacing(1)
    },
    row: {
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: "1fr",
        columnGap: theme.spacing(1)
    }
}))

interface ControlProps<T> {
    modal?: boolean
    label: string
    value: T
    localStorageAccessor: LocalStorageAccessor<T>
    setter: (v: string) => any
}

export const Control: React.FC<ControlProps<string>> = observer(function Control(props) {
    const classes = useStyles()
    const { label, value, setter, localStorageAccessor, modal } = props

    const doDialog = async () => {
        try {
            const newVal = await Dialog({
                inputLabel: label,
                title: `Change ${label}`,
                inputValue: value,
                showCancelButton: true
            })
            setter(newVal)
        } catch (e) {
            console.warn(e)
        }
    }
    return (
        <div className={classes.control}>
            <TextField x-if={!modal} value={value} label={label} onChange={e => setter(e.target.value)} />
            <SecondaryBtn x-else onClick={doDialog}>
                <b>{label}</b>:{value}
            </SecondaryBtn>

            <div className={classes.row}>
                <SecondaryBtn onClick={() => localStorageAccessor.set(value)}>Save</SecondaryBtn>
                <SecondaryBtn onClick={() => localStorageAccessor.delete()}>Delete</SecondaryBtn>
            </div>
        </div>
    )
})

export const ControlNumber: React.FC<ControlProps<number>> = observer(function Control(props) {
    const classes = useStyles()
    const { label, value, setter, localStorageAccessor, modal } = props

    const doDialog = async () => {
        try {
            const newVal = await Dialog({
                inputLabel: label,
                title: `Change ${label}`,
                inputValue: value.toString(),
                showCancelButton: true
            })
            setter(newVal)
        } catch (e) {
            console.warn(e)
        }
    }
    return (
        <div className={classes.control}>
            <TextField x-if={!modal} type="numer" value={value} label={label} onChange={e => setter(e.target.value)} />
            <SecondaryBtn x-else onClick={doDialog}>
                <b>{label}</b>:{value}
            </SecondaryBtn>

            <div className={classes.row}>
                <SecondaryBtn onClick={() => localStorageAccessor.set(value)}>Save</SecondaryBtn>
                <SecondaryBtn onClick={() => localStorageAccessor.delete()}>Delete</SecondaryBtn>
            </div>
        </div>
    )
})

export const MainStateControls: React.FC<Props> = observer(function MainStateControls(props) {
    const classes = useStyles()
    const { state } = props

    return (
        <Paper>
            <div className={classes.root}>
                <div className={classes.controlsArea}>
                    <Control label="Seed" value={state.input.seed} setter={v => (state.input.seed = v)} localStorageAccessor={localStorageStore.chanceSeed} />
                    <Control modal label={"Line Fn"} value={state.lineFn} setter={v => (state.lineFn = v)} localStorageAccessor={localStorageStore.lineFn} />
                    <ControlNumber
                        label="Population Size"
                        value={state.input.populationSize}
                        setter={v => (state.input.populationSize = toNumber(v))}
                        localStorageAccessor={localStorageStore.populationSize}
                    />

                    <ControlNumber
                        label="Num Connections"
                        value={state.input.numConnections}
                        setter={v => (state.input.numConnections = toNumber(v))}
                        localStorageAccessor={localStorageStore.numConnections}
                    />
                    <ControlNumber
                        label="Num Internal Neurons"
                        value={state.input.numInternalNeurons}
                        setter={v => (state.input.numInternalNeurons = toNumber(v))}
                        localStorageAccessor={localStorageStore.numInternalNeurons}
                    />

                    <ControlNumber
                        label="Ticks Per Generation"
                        value={state.input.ticksPerGeneration}
                        setter={v => (state.input.ticksPerGeneration = toNumber(v))}
                        localStorageAccessor={localStorageStore.ticksPerGeneration}
                    />

                    <ControlNumber
                        label="Mutation Chance"
                        value={state.input.mutationChance}
                        setter={v => (state.input.mutationChance = toNumber(v))}
                        localStorageAccessor={localStorageStore.mutationChance}
                    />
                </div>

                <div className={classes.controlsArea}>
                    <SimpleTable
                        value={{
                            Generation: state.generation,
                            SuccessRate: [((state.numSurvivors / state.input.populationSize) * 100).toFixed(2), "%"].join(""),
                            Age: [state.generationTick, state.input.ticksPerGeneration].join(" / ")
                        }}
                    />

                    <TextField
                        value={state.simulationSpeedMs}
                        label="Simulation Speed Ms"
                        type="number"
                        onChange={e => (state.simulationSpeedMs = toNumber(e.target.value))}
                    ></TextField>
                    <SecondaryBtn onClick={() => state.togglePlaySimulation()}>{state.playSimulation ? "Pause" : "Play"}</SecondaryBtn>
                    <SecondaryBtn onClick={state.nextTick}>Next Tick</SecondaryBtn>
                </div>
            </div>
        </Paper>
    )
})
