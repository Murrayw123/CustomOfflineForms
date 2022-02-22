import { RealmCollection } from 'services/RealmCollection';
import { RealmFactory } from 'services/RealmFactory';
import { Database } from 'services/Db';
import { BSON, Credentials } from 'realm';
import { MundaBiddiProblemSchema } from 'models/MundaBiddiProblem';

const TESTS = 'tests';

describe('RealmCollection basic operations integration test', () => {
    let realmFactory: RealmFactory;
    let subject: RealmCollection;
    let database: Database;

    beforeAll(async () => {
        database = new Database('dynamicforms_dev-xezyh', Credentials.anonymous());
        await database.login();
        realmFactory = new RealmFactory(database);
        subject = new RealmCollection(realmFactory);
        await subject.addRealm(TESTS, [MundaBiddiProblemSchema], true);
    });

    it('should create a new entry in a Realm collection and then delete ', async () => {
        const realm = subject.getRealmByPartition(TESTS);

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
        const realm = subject.getRealmByPartition(TESTS);
        realm.close();
    });
});
