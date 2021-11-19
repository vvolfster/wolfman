import { observable } from "mobx"
import { StoreClass } from "../Store"

export class BaseStoreModule {
    store?: StoreClass = undefined
    @observable hasStore = false

    async init(store: StoreClass) {
        this.store = store
        this.hasStore = true
        // override this method to do stuff on store creation
        return Promise.resolve()
    }
}
