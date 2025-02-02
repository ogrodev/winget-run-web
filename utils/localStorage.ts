export const DownloadStateKey = "download_state"

export function syncLocalStorage<T extends object>(key: string, state: string | T) {
    let stringState = "";
    if (typeof state !== "string") {
        stringState = JSON.stringify(state)
    } else {
        stringState = state
    }
    localStorage.setItem(key, stringState)
}

export function stateOrStored<T>(key: string, state: T[]){
    return state.length > 0 ? (localStorage.getItem(key) || []) as T[] : []
}