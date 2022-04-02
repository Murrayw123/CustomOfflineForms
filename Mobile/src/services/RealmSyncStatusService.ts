import { Subject } from 'rxjs';
import { RealmCollection } from 'services/RealmCollection';
import { ConfigurationService } from 'services/ConfigurationService';
import NetInfo from '@react-native-community/netinfo';

enum ChangeNotification {
    online,
    offline,
    syncingRealm
}

interface NetworkChangeNotification {
    isSyncing: boolean;
    type: ChangeNotification;
}

type SyncSubject = Subject<NetworkChangeNotification>;

export class RealmSyncStatusService {
    private _subject: SyncSubject;
    private _realmCollection: RealmCollection;
    private _configurationService: ConfigurationService;

    constructor(realmCollection: RealmCollection, configurationService: ConfigurationService) {
        this._subject = new Subject();
        this._realmCollection = realmCollection;
        this._configurationService = configurationService;

        const syncCallback = (transferred: number, transferable: number) => {
            if (transferred === transferable) {
                this._subject.next({
                    isSyncing: false,
                    type: ChangeNotification.syncingRealm
                });
            } else {
                this._subject.next({
                    isSyncing: true,
                    type: ChangeNotification.syncingRealm
                });
            }
        };

        NetInfo.addEventListener(state => {
            this._subject.next({
                isSyncing: false,
                type: state.isConnected ? ChangeNotification.online : ChangeNotification.offline
            });
        });

        this._realmCollection.subscribeToRealmReady(() => {
            this._realmCollection
                .getRealm()
                .syncSession?.addProgressNotification(
                    'download',
                    'reportIndefinitely',
                    syncCallback
                );
            this._realmCollection
                .getRealm()
                .syncSession?.addProgressNotification('upload', 'reportIndefinitely', syncCallback);
        });
    }

    subscribe(callback: {
        next: (networkChangeNotification: NetworkChangeNotification) => void;
    }): void {
        this._subject.subscribe(callback);
    }

    public destroy(): void {
        this._realmCollection.getRealm().removeAllListeners();
    }
}
