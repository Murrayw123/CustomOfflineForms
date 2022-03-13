import { RealmCollection } from 'services/RealmCollection';
import { RealmFactory } from 'services/RealmFactory';
import { Database } from 'services/Db';
import { BSON, Credentials } from 'realm';
import { ConfigurationService } from 'services/ConfigurationService';
import { TestConfiguration } from 'configurations/TestConfiguration';

export const TESTS = 'tests';

export async function setupTestDatabase(): Promise<{
    database: Database;
    realmFactory: RealmFactory;
    realmCollection: RealmCollection;
    configurationService: ConfigurationService;
}> {
    const database = new Database('dynamicforms_dev-xezyh', Credentials.anonymous());
    await database.login();
    const realmFactory = new RealmFactory(database);
    const configurationService = new ConfigurationService(TestConfiguration);
    const realmCollection = new RealmCollection(realmFactory, configurationService);
    await realmCollection.addRealm(TestConfiguration.schemas, true);

    return { database, realmFactory, configurationService, realmCollection };
}

describe('RealmCollection basic operations integration test', () => {
    let subject: RealmCollection;
    let database: Database;

    beforeAll(async () => {
        const { realmCollection: rc, database: db } = await setupTestDatabase();
        subject = rc;
        database = db;
    });

    it('should create a new entry in a Realm collection and then delete ', async () => {
        const realm = subject.getRealm();

        let obj: Realm.Object;
        realm.write(() => {
            obj = realm.create('MundaBiddiProblem', {
                _id: new BSON.ObjectId(),
                description: 'Test',
                image: 'Test',
                latitude: 132,
                longitude: 142,
                org: TESTS,
                type: 'test'
            });
            expect(obj).toBeDefined();
        });

        realm.write(() => {
            realm.delete(obj);
        });
    });

    afterAll(() => {
        const realm = subject.getRealm();
        realm.close();
        database.logout();
    });
});
