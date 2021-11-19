import { min, max } from "lodash"
import { Point } from "types"

export function getDistance(point: Point, allPoints: Point[]) {
    const distances = allPoints
        .map(p => {
            const x = Math.pow(p.x - point.x, 2)
            const y = Math.pow(p.y - point.y, 2)
            return Math.sqrt(x + y)
        })
        .filter(d => d !== 0)

    const distanceToNearest = distances.length ? min(distances) || 0 : 0
    const distanceToFurthest = distances.length ? max(distances) || 0 : 0
    return {
        distanceToNearest,
        distanceToFurthest
    }
}
