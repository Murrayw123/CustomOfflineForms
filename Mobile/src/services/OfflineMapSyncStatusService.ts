export class OfflineMapSyncStatusService {
    private _subscribers: Array<(syncing: boolean) => void>;

    constructor() {
        this._subscribers = [];
    }

    public subscribe(callback: (syncing: boolean) => void) {
        this._subscribers.push(callback);
    }

    public updateSyncStatus = (syncing: boolean) => {
        this._subscribers.forEach(callback => callback(syncing));
    };
}
