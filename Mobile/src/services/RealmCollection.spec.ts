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
    let objId: BSON.ObjectId;
    let realm: Realm;

    beforeAll(async () => {
        const { realmCollection: rc, database: db } = await setupTestDatabase();
        subject = rc;
        database = db;
    });

    beforeAll(() => {
        realm = subject.getRealm();

        let obj: Realm.Object;
        objId = new BSON.ObjectId();

        realm.write(() => {
            obj = realm.create('MundaBiddiProblem', {
                _id: objId,
                description: 'Test',
                image: 'Test',
                latitude: 132,
                longitude: 142,
                org: TESTS,
                type: 'test'
            });
            expect(obj).toBeDefined();
        });
    });

    it('should convert a realm to JS', () => {
        const realmAsJS = subject.getRealmObjectsAsJS();
        expect(realmAsJS).toEqual({
            MundaBiddiProblem: [
                {
                    _id: objId,
                    description: 'Test',
                    image: 'Test',
                    latitude: 132,
                    longitude: 142,
                    org: 'tests',
                    type: 'test'
                }
            ],
            MundaBiddiTrackInfo: []
        });
    });

    it('should subscribe to changes and get a response', async () => {
        const callback = jest.fn();
        const newObjId = new BSON.ObjectId();
        let newObj: Realm.Object;

        subject.subscribeToRealmChanges(callback);

        callback.mockReset();

        realm.write(() => {
            newObj = realm.create('MundaBiddiProblem', {
                _id: newObjId,
                description: 'Test2',
                image: 'Test2',
                latitude: 1000,
                longitude: 1000,
                org: TESTS,
                type: 'test'
            });
            expect(newObj).toBeDefined();
        });

        await new Promise(resolve => setTimeout(resolve, 5000));

        expect(callback).toHaveBeenCalledWith({
            MundaBiddiProblem: [
                {
                    _id: objId,
                    description: 'Test',
                    image: 'Test',
                    latitude: 132,
                    longitude: 142,
                    org: 'tests',
                    type: 'test'
                },
                {
                    _id: newObjId,
                    description: 'Test2',
                    image: 'Test2',
                    latitude: 1000,
                    longitude: 1000,
                    org: TESTS,
                    type: 'test'
                }
            ],
            MundaBiddiTrackInfo: []
        });
    }, 10000);

    afterAll(() => {
        const realm = subject.getRealm();
        realm.close();
        database.logout();
    });
});
