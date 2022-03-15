import { ObjectSchema } from 'realm';
import { RealmFactory } from 'services/RealmFactory';
import { ConfigurationService } from 'services/ConfigurationService';

interface RealmAsJS {
    [key: string]: Array<{ [key: string]: unknown }>;
}

export class RealmCollection {
    private _realmCollection: Array<{ partition: string; realm: Realm }>;
    private _realmFactory: RealmFactory;
    private _configurationService: ConfigurationService;

    constructor(realmFactory: RealmFactory, configurationService: ConfigurationService) {
        this._realmFactory = realmFactory;
        this._realmCollection = [];
        this._configurationService = configurationService;
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

    public getRealmObjectsAsJS(): RealmAsJS {
        const realmObjectsAsJS: RealmAsJS = {};

        this._configurationService.configuration.schemas.forEach(schema => {
            realmObjectsAsJS[schema.name] = this.getRealm()
                .objects(schema.name)
                .map(realmObject => realmObject.toJSON());
        });

        return realmObjectsAsJS;
    }

    public subscribeToRealmChanges(callback: (realmObjectsAsJS: RealmAsJS) => void): void {
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
}
