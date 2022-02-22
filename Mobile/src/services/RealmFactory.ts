import Realm, { ObjectSchema, OpenRealmBehaviorType } from 'realm';
import { Database } from 'services/Db';

const realmFileBehavior = {
    type: 'openImmediately' as OpenRealmBehaviorType
};

export class RealmFactory {
    private _db: Database;

    constructor(db: Database) {
        this._db = db;
    }

    public async openRealm(
        partitionValue: string,
        schemas: Array<ObjectSchema>,
        inMemory: boolean = false
    ): Promise<Realm> {
        // in memory is really just used for testing
        if (inMemory) {
            return Realm.open({
                schema: schemas,
                schemaVersion: 1,
                inMemory: true
            });
        } else {
            return Realm.open({
                schema: schemas,
                sync: {
                    user: this._db.user,
                    partitionValue: partitionValue,
                    existingRealmFileBehavior: realmFileBehavior,
                    newRealmFileBehavior: realmFileBehavior
                }
            });
        }
    }
}
