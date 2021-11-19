import { observable, action, computed } from "mobx"
import { BaseStoreModule } from "./BaseStoreModule"
import { StoreClass } from "../Store"
import { HistoryListenerParameter, HistoryLocation, globalHistory } from "@reach/router"
import { GetQueryParams, Params } from "../../helpers/QueryParam"

interface RouteState {
    location: HistoryLocation
    prevLocation: HistoryLocation | undefined
}

export class Route extends BaseStoreModule {
    @observable state: RouteState = {
        location: globalHistory.location,
        prevLocation: undefined
    }

    init = async (store: StoreClass) => {
        await super.init(store)
        globalHistory.listen(this.onHistoryChange)

        return Promise.resolve()
    }

    @action
    onHistoryChange = (listener: HistoryListenerParameter) => {
        this.state.prevLocation = this.state.location
        this.state.location = listener.location
    }

    @computed get queryParams(): Params {
        return GetQueryParams(this.state.location.search)
    }
}
