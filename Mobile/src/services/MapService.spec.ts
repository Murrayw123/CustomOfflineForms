import { Database } from 'services/Db';
import { setupTestDatabase, TESTS } from 'services/RealmCollection.spec';
import { MapService } from 'services/MapService';
import { RealmCollection } from 'services/RealmCollection';
import { BSON } from 'realm';
import { testDataFeatureCollection } from 'test_data/geojson';

describe('MapService', () => {
    let database: Database;
    let realmCollection: RealmCollection;
    let subject: MapService;
    let testGeoJSON: Realm.Object;

    beforeEach(async () => {
        const { realmCollection: rc, database: db } = await setupTestDatabase();
        database = db;
        realmCollection = rc;

        subject = new MapService(realmCollection);
    });

    beforeEach(() => {
        const realm = realmCollection.getRealm();
        realm.write(() => {
            testGeoJSON = realm.create('MundaBiddiTrackInfo', {
                _id: new BSON.ObjectId(),
                org: TESTS,
                type: 'track',
                data: JSON.stringify(testDataFeatureCollection)
            });
            expect(testGeoJSON).toBeDefined();
        });
    });

    it('should pull map tracks from the database', () => {
        const mapTracks = subject.getMapFeatures();
        expect(mapTracks).toBeDefined();
    });

    afterAll(() => {
        const realm = realmCollection.getRealm();
        realm.close();
        realm.delete(testGeoJSON);
        database.logout();
    });
});
