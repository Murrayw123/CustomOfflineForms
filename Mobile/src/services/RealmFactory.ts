import { Database } from 'services/Db';
import { ConfigurationService } from 'services/ConfigurationService';
import { ObjectSchema, OpenRealmBehaviorType } from 'realm';
import Realm from 'realm';

const realmFileBehavior = {
    type: 'downloadBeforeOpen' as OpenRealmBehaviorType
};

export class RealmFactory {
    private _db: Database;
    private _configurationService: ConfigurationService;

    constructor(db: Database, configurationService: ConfigurationService) {
        this._db = db;
        this._configurationService = configurationService;
    }

    public async openRealm(partitionValue: string, schemas: Array<ObjectSchema>): Promise<Realm> {
        const inMemory = this._configurationService.configuration.partitionValue === 'TEST';

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
