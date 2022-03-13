import { ObjectSchema } from 'realm';
import { RealmFactory } from 'services/RealmFactory';
import { ConfigurationService } from 'services/ConfigurationService';

export class RealmCollection {
    private _realmCollection: Array<{ partition: string; realm: Realm }>;
    private _realmFactory: RealmFactory;
    private _configurationService: ConfigurationService;

    constructor(realmFactory: RealmFactory, configurationService: ConfigurationService) {
        this._realmFactory = realmFactory;
        this._realmCollection = [];
        this._configurationService = configurationService;
    }

    public async addRealm(schemas: Array<ObjectSchema>, inMemory: boolean = false): Promise<void> {
        const partitionValue = this._configurationService.configuration.partitionValue;
        const realm = await this._realmFactory.openRealm(partitionValue, schemas, inMemory);
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

    public closeAllRealms(): void {
        this._realmCollection.forEach(realm => {
            realm.realm.close();
        });
    }
}
