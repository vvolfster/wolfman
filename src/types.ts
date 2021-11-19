export interface Point {
    x: number
    y: number
}

export interface NeuronConnection {
    neurons: string[]
    weight: number
}

export interface Neuron {
    name: string
    value: number
    layer: number
    connections: NeuronConnection[]
    isConnected: boolean
}

export const NET_INPUT = {
    GENERATION_TICK: "GENERATION_TICK",
    POS_X: "POS_X",
    POS_Y: "POS_Y",
    DISTANCE_NEAREST: "DISTANCE_NEAREST",
    DISTANCE_FURTHEST: "DISTANCE_FURTHEST"
}

export const NET_OUTPUT = {
    VELOCITY_X: "VELOCITY_X",
    VELOCITY_Y: "VELOCITY_Y"
}
