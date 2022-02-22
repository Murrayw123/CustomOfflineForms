import { ObjectSchema } from 'realm';
import { RealmFactory } from 'services/RealmFactory';

export class RealmCollection {
    private _realmCollection: Array<{ partition: string; realm: Realm }>;
    private _realmFactory: RealmFactory;

    constructor(realmFactory: RealmFactory) {
        this._realmFactory = realmFactory;
        this._realmCollection = [];
    }

    public async addRealm(
        partitionValue: string,
        schemas: Array<ObjectSchema>,
        inMemory: boolean = false
    ): Promise<void> {
        const realm = await this._realmFactory.openRealm(partitionValue, schemas, inMemory);
        this._realmCollection.push({ partition: partitionValue, realm: realm });
    }

    public getRealmByPartition(partitionValue: string): Realm {
        const res = this._realmCollection.find(realm => realm.partition === partitionValue);
        if (res) {
            return res.realm;
        } else {
            throw new Error('Realm not found');
        }
    }
}
