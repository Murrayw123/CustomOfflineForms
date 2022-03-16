import { RealmCollection } from 'services/RealmCollection';
import { Database } from 'services/Db';
import { BSON } from 'realm';
import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';

const TESTS = 'tests';

describe('RealmCollection basic operations integration test', () => {
    let subject: RealmCollection;
    let db: Database;
    let objId: BSON.ObjectId;
    let realm: Realm;

    beforeAll(async () => {
        const bootstrapper = new AppBootstrapper(() => servicesFactory(TestConfiguration));
        await bootstrapper.bootstrap();
        subject = bootstrapper.services.realmCollection;
    });

    beforeAll(() => {
        realm = subject.getRealm();

        let obj: Realm.Object;
        objId = new BSON.ObjectId();

        realm.write(() => {
            obj = realm.create('MundaBiddiProblem', {
                _id: objId,
                description: 'Test',
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
                    latitude: 132,
                    longitude: 142,
                    org: TESTS,
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
                    latitude: 132,
                    longitude: 142,
                    org: 'tests',
                    type: 'test'
                },
                {
                    _id: newObjId,
                    description: 'Test2',
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
        db.logout();
    });
});
