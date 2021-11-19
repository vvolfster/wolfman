import { times, range } from "lodash"
import { Point, Neuron, NET_INPUT, NET_OUTPUT } from "types"
import { getDistance } from "./Distance"

interface GenNetworkProps {
    chance: Chance.Chance
    point: Point
    allPoints: Point[]
    numConnections: number
    numInternalNeurons: number
}

export function generateNeuralNet(props: GenNetworkProps): Neuron[] {
    const { chance, point, allPoints, numConnections, numInternalNeurons } = props

    const { distanceToNearest, distanceToFurthest } = getDistance(point, allPoints)

    const inputLayer: Neuron[] = [
        {
            name: NET_INPUT.GENERATION_TICK,
            connections: [],
            value: 0,
            layer: 0,
            isConnected: true
        },
        {
            name: NET_INPUT.POS_X,
            connections: [],
            value: point.x,
            layer: 0,
            isConnected: true
        },
        {
            name: NET_INPUT.POS_Y,
            connections: [],
            value: point.y,
            layer: 0,
            isConnected: true
        },
        {
            name: NET_INPUT.DISTANCE_NEAREST,
            connections: [],
            value: distanceToNearest || 0,
            layer: 0,
            isConnected: true
        },
        {
            name: NET_INPUT.DISTANCE_FURTHEST,
            connections: [],
            value: distanceToFurthest || 0,
            layer: 0,
            isConnected: true
        }
    ]
    const middleLayer: Neuron[] = range(0, numInternalNeurons).map(n => {
        return {
            name: `m${n}`,
            connections: [],
            value: 0,
            layer: 1,
            isConnected: false
        }
    })

    const outputLayer: Neuron[] = [
        {
            name: NET_OUTPUT.VELOCITY_X,
            connections: [],
            value: 0,
            layer: 2,
            isConnected: false
        },
        {
            name: NET_OUTPUT.VELOCITY_Y,
            connections: [],
            value: 0,
            layer: 2,
            isConnected: false
        }
    ]

    const network = [...inputLayer, ...middleLayer, ...outputLayer]

    times(numConnections).forEach(() => {
        const availableStartNeurons = network.filter(n => n.isConnected && n.layer !== 2)
        if (!availableStartNeurons.length) {
            return
        }

        const selected = chance.pickone(availableStartNeurons)
        const destNeurons = network.filter(n => {
            if (n.layer <= selected.layer) {
                return false
            }

            const connNames = n.connections.map(nn => nn.neurons[0])
            if (connNames.includes(n.name)) {
                return false
            }

            return true
        })

        if (!destNeurons.length) {
            return
        }

        const destNeuron = chance.pickone(destNeurons)
        destNeuron.isConnected = true
        destNeuron.connections.push({
            neurons: [selected.name, destNeuron.name],
            weight: chance.floating({ min: -1, max: 1 })
        })
    })

    return network
}
