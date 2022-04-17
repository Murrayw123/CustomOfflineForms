import { RealmFactory } from 'services/RealmFactory';
import { ConfigurationService } from 'services/ConfigurationService';
import { Subject } from 'rxjs';
import { ObjectSchema } from 'realm';

export interface RealmRow {
    _id: string;
    [key: string]: string | number | boolean;
}

export interface RealmAsJSValues {
    [key: string]: Array<RealmRow>;
}

export class RealmCollection {
    private _realmCollection: Array<{ partition: string; realm: Realm }>;
    private _realmFactory: RealmFactory;
    private _configurationService: ConfigurationService;
    private _realmsReadySubscribers: Subject<void>;

    constructor(realmFactory: RealmFactory, configurationService: ConfigurationService) {
        this._realmFactory = realmFactory;
        this._realmCollection = [];
        this._configurationService = configurationService;
        this._realmsReadySubscribers = new Subject();
    }

    public async addRealm(schemas: Array<ObjectSchema>): Promise<void> {
        const partitionValue = this._configurationService.configuration.partitionValue;
        const realm = await this._realmFactory.openRealm(partitionValue, schemas);
        this._realmCollection.push({ partition: partitionValue, realm: realm });
    }

    public getRealm(): Realm {
        const partitionValue = this._configurationService.configuration.partitionValue;
        const res = this._realmCollection.find(realm => realm.partition === partitionValue);
        if (res) {
            return res.realm;
        } else {
            throw new Error('Custom: Realm not found');
        }
    }

    public getRealmObjectsAsJS(): RealmAsJSValues {
        const realmObjectsAsJS = {} as RealmAsJSValues;

        this._configurationService.configuration.schemas.forEach(schema => {
            realmObjectsAsJS[schema.name] = this.getRealm()
                .objects(schema.name)
                .map(realmObject => realmObject.toJSON());
        });

        return realmObjectsAsJS;
    }

    public subscribeToRealmChanges(callback: (realmObjectsAsJS: RealmAsJSValues) => void): void {
        this._configurationService.configuration.schemas.forEach(schema => {
            this.getRealm()
                .objects(schema.name)
                .addListener(() => {
                    callback(this.getRealmObjectsAsJS());
                });
        });
    }

    public closeAllRealms(): void {
        this._configurationService.configuration.schemas.forEach(schema => {
            this.getRealm().objects(schema.name).removeAllListeners();
        });
        this._realmCollection.forEach(realm => {
            realm.realm.close();
        });
    }

    public markRealmsAsReady(): void {
        this._realmsReadySubscribers.next();
    }

    public subscribeToRealmReady(callback: () => void): void {
        this._realmsReadySubscribers.subscribe(callback);
    }
}
