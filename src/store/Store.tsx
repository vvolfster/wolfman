import { Route } from "./modules/Route"
import { BaseStoreModule } from "./modules/BaseStoreModule"

export class StoreClass {
    route: Route

    constructor() {
        this.route = new Route()
    }

    init = () => {
        const self = this
        async function initWrapper<T extends BaseStoreModule>(name: string, storeModule: T) {
            try {
                await storeModule.init(self)
                console.log(`Finished initting store module:: ${name}`)
            } catch (e) {
                console.log(`Failed to initialize store module:: ${name}`)
                throw e
            }
        }

        const promises = [initWrapper("route", this.route)]
        return Promise.all(promises)
    }
}

export const Store = new StoreClass()
