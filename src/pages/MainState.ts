import { Chance } from "chance"
import { Parser } from "expr-eval"
import stableStringify from "fast-json-stable-stringify"
import { deepClone } from "helpers"
import { getDistance } from "helpers/Distance"
import { generateNeuralNet } from "helpers/GenerateNeuralNet"
import { each, groupBy, isEqual, range, sortBy, sum, toNumber } from "lodash"
import { computed, observable, observe } from "mobx"
import { nanoid } from "nanoid"
import { localStorageStore } from "store/modules/LocalStorageStore"
import { NET_INPUT, NET_OUTPUT, Neuron, Point } from "types"

interface MainStateInput {
    size: [number, number]
    seed: string
    lineFn: string
    numConnections: number
    numInternalNeurons: number
    populationSize: number
    ticksPerGeneration: number
    mutationChance: number
}

interface DotEntity {
    id: string
    point: Point
    net: Neuron[]
}

export class MainState {
    @observable input: MainStateInput

    @observable entities: DotEntity[] = []

    @observable generation = 0
    @observable generationTick = 0
    @observable numSurvivors = 0
    @observable playSimulation = false

    chance: Chance.Chance
    @observable simulationSpeedMs = 100

    private timerId: NodeJS.Timeout | undefined

    onDestroy: () => void

    @computed get lineFn() {
        return this.input.lineFn
    }
    set lineFn(fn: string) {
        try {
            Parser.evaluate(fn, { x: 0 })
            Parser.evaluate(fn, { x: this.input.size[0] })
            this.input.lineFn = fn
        } catch (e) {
            console.warn(e)
        }
    }

    constructor(params: Partial<MainStateInput>) {
        const { seed, lineFn, numConnections, size, populationSize, ticksPerGeneration, mutationChance, numInternalNeurons } = params

        this.input = {
            seed: seed || localStorageStore.chanceSeed.getIfExists() || nanoid(),
            lineFn: lineFn || localStorageStore.lineFn.getIfExists() || "x",
            numConnections: numConnections || localStorageStore.numConnections.getIfExists() || 0,
            numInternalNeurons: numInternalNeurons || localStorageStore.numInternalNeurons.getIfExists() || 2,
            populationSize: populationSize || localStorageStore.populationSize.getIfExists() || 25,
            ticksPerGeneration: ticksPerGeneration || localStorageStore.ticksPerGeneration.getIfExists() || 10,
            size: size || [100, 100],
            mutationChance: mutationChance || localStorageStore.mutationChance.getIfExists() || 0.1
        }

        this.chance = new Chance(this.input.seed)

        const d1 = observe(this, "inputStr", change => {
            if (isEqual(change.oldValue, change.newValue)) {
                return
            }

            if (!change.oldValue && change.newValue) {
                this.reset()
                return
            }

            const oldValue: MainStateInput | undefined = JSON.parse(change.oldValue || "")
            const newValue: MainStateInput = JSON.parse(change.newValue)

            const changedEnough = [
                !isEqual(oldValue?.size, newValue.size),
                oldValue?.numConnections !== newValue.numConnections,
                oldValue?.numInternalNeurons !== newValue.numInternalNeurons,
                oldValue?.populationSize !== newValue.populationSize,
                oldValue?.seed !== newValue.seed
            ].filter(Boolean)

            if (changedEnough.length) {
                this.reset()
            }
        })

        this.reset()
        this.simulateLoop()

        this.onDestroy = () => {
            d1()
            if (this.timerId) {
                clearTimeout(this.timerId)
            }
        }
    }

    simulateLoop = async () => {
        if (this.playSimulation) {
            await this.nextTick()
        }

        this.timerId = setTimeout(this.simulateLoop, this.simulationSpeedMs)
    }

    togglePlaySimulation = (speed?: number) => {
        if (speed) {
            this.simulationSpeedMs = speed
        }

        this.playSimulation = !this.playSimulation
    }

    randomPt = () => {
        return {
            x: this.chance.integer({ min: 0, max: this.input.size[0] }),
            y: this.chance.integer({ min: 0, max: this.input.size[1] })
        }
    }

    reset = () => {
        const ids = this.chance.unique(this.chance.name, this.input.populationSize)
        const randPositions = this.chance.unique(this.randomPt, this.input.populationSize, (a: Point, b: Point) => {
            return a.x === b.x && a.y === b.y
        })

        this.entities = randPositions.map((point, idx) => {
            return {
                id: ids[idx],
                point,
                net: generateNeuralNet({
                    chance: this.chance,
                    point,
                    allPoints: randPositions,
                    numConnections: this.input.numConnections,
                    numInternalNeurons: this.input.numInternalNeurons
                })
            }
        })

        this.generation = 0
        this.generationTick = 0
    }

    nextGeneration = () => {
        const survivors = this.entities.filter(entity => {
            const lineY = Parser.evaluate(this.lineFn, { x: entity.point.x })
            return entity.point.y > lineY
        })

        this.numSurvivors = survivors.length

        // the survivors now must have kids.and then there should be a chance to
        // get a mutation on each child.
        const randPositions = this.chance.unique(this.randomPt, this.input.populationSize, (a: Point, b: Point) => {
            return a.x === b.x && a.y === b.y
        })

        const parentsA = range(0, this.input.populationSize).map(idx => {
            let survivorIdx = idx % survivors.length
            if (isNaN(survivorIdx)) {
                survivorIdx = 0
            }
            return survivors[idx % survivors.length]
        })
        const parentsB = this.chance.shuffle(parentsA)

        const newGeneration = parentsA.map((parentA, idx) => {
            const child = this.produceOffsring(parentA, parentsB[idx])

            // set survivor values
            child.point = randPositions[idx]
            const { nearest, furthest, posX, posY, generationTick } = this.getInputNodes(child.net)
            const dist = getDistance(child.point, randPositions)
            if (posX) {
                posX.value = child.point.x
            }
            if (posY) {
                posY.value = child.point.y
            }
            if (generationTick) {
                generationTick.value = 0
            }
            if (nearest) {
                nearest.value = dist.distanceToNearest
            }
            if (furthest) {
                furthest.value = dist.distanceToFurthest
            }

            return child
        })

        this.entities = newGeneration
        this.generationTick = 0
        this.generation += 1
    }

    private getInputNodes = (net: Neuron[]) => {
        const inputs = net.filter(n => n.layer === 0)
        const [nearest, furthest, posX, posY, generationTick] = [
            inputs.find(i => i.name === NET_INPUT.DISTANCE_NEAREST),
            inputs.find(i => i.name === NET_INPUT.DISTANCE_FURTHEST),
            inputs.find(i => i.name === NET_INPUT.POS_X),
            inputs.find(i => i.name === NET_INPUT.POS_Y),
            inputs.find(i => i.name === NET_INPUT.GENERATION_TICK)
        ]

        return {
            nearest,
            furthest,
            posX,
            posY,
            generationTick
        }
    }

    private getMinimumMoveSpeed = () => {
        const [w, h] = this.input.size
        const hyp = Math.sqrt(w * w + h * h)
        return Math.ceil(hyp / this.input.ticksPerGeneration)
    }

    nextTick = async () => {
        const moveSpeed = this.getMinimumMoveSpeed()

        const genTick = this.generationTick + 1

        const entities = deepClone(this.entities)

        entities.forEach(entity => {
            const { net } = entity
            const { distanceToNearest, distanceToFurthest } = getDistance(
                entity.point,
                entities.map(e => e.point)
            )

            const { nearest, furthest, posX, posY, generationTick } = this.getInputNodes(net)
            if (nearest) {
                nearest.value = distanceToNearest
            }
            if (furthest) {
                furthest.value = distanceToFurthest
            }
            if (posX) {
                posX.value = entity.point.x
            }
            if (posY) {
                posY.value = entity.point.y
            }
            if (generationTick) {
                generationTick.value = genTick
            }

            // navigate through net. do one layer at a time
            const layers = groupBy(
                net.filter(n => n.layer !== 0),
                n => n.layer
            )
            delete layers.undefined

            // update all values
            each(layers, layerPts => {
                layerPts.forEach(pt => {
                    const incomingValues = pt.connections.map(conn => {
                        const { weight, neurons } = conn
                        const [parentName] = neurons
                        const parentNeuron = net.find(n => n.name === parentName)
                        return (parentNeuron?.value || 0) * weight
                    })

                    pt.value = sum(incomingValues) / incomingValues.length
                })
            })

            // now figure out if we move or not
            const [vx, vy] = [net.find(n => n.name === NET_OUTPUT.VELOCITY_X), net.find(n => n.name === NET_OUTPUT.VELOCITY_Y)]

            const newPos: Point = {
                x: entity.point.x,
                y: entity.point.y
            }
            if (vx) {
                if (vx.value >= 0.5) {
                    newPos.x += moveSpeed
                } else if (vx.value <= -0.5) {
                    newPos.x -= moveSpeed
                }
            }
            if (vy) {
                if (vy.value >= 0.5) {
                    newPos.y += moveSpeed
                } else if (vy.value <= -0.5) {
                    newPos.y -= moveSpeed
                }
            }

            // make sure point is in bounds tho
            if (newPos.x < 0) {
                newPos.x = 0
            } else if (newPos.x > this.input.size[0]) {
                newPos.x = this.input.size[0]
            }

            if (newPos.y < 0) {
                newPos.y = 0
            } else if (newPos.y > this.input.size[1]) {
                newPos.y = this.input.size[1]
            }

            // see if we can do this move, is anyone else at this spot?
            const possibleMovePts = [newPos, { x: newPos.x, y: entity.point.y }, { x: entity.point.x, y: newPos.y }]
            const [moveTo] = possibleMovePts.filter(pos => {
                const blocked = entities.find(e => e.point.x === pos.x && e.point.y === pos.y)
                return !blocked
            })

            if (moveTo) {
                entity.point = moveTo
            }
        })

        this.entities = entities
        this.generationTick += 1

        if (this.generationTick >= this.input.ticksPerGeneration) {
            this.nextGeneration()
        }
    }

    @computed get inputStr() {
        return stableStringify(this.input)
    }

    private produceOffsring = (a: DotEntity, b: DotEntity): DotEntity => {
        const id = a.id + "-->" + b.id
        const net: Neuron[] = []

        // in each layer, pick half neurons from a, pick half from b
        const layers = groupBy(a.net, n => n.layer)

        each(layers, (aLayer, layer) => {
            const layerNum = toNumber(layer)
            const mid = Math.floor(aLayer.length / 2)

            const bLayer = b.net.filter(n => n.layer === layerNum)

            // sort both layers same
            const aSorted = sortBy(aLayer.slice(), n => n.name)
            const bSorted = sortBy(bLayer.slice(), n => n.name)

            aSorted.forEach((aNeuron, idx) => {
                if (idx < mid) {
                    net.push(deepClone(aNeuron))
                } else {
                    const bNeuron = bSorted[idx]
                    net.push(deepClone(bNeuron))
                }
            })
        })

        const child = {
            id,
            net,
            point: { x: 0, y: 0 }
        }

        const doesMutate = this.chance.floating({ min: 0, max: 1 }) <= this.input.mutationChance
        if (doesMutate) {
            const node = this.chance.pickone(child.net.filter(n => !!n.connections.length))
            const connection = this.chance.pickone(node.connections)
            connection.weight *= -1 // we flip the weight
        }

        return child
    }
}
