import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';
import { DisplayableMapMarker, MarkerService } from 'services/MarkerService';
import { RealmCollection } from 'services/RealmCollection';
import { BSON } from 'realm';

describe('MarkerService', () => {
    let markerService: MarkerService;
    let realmCollection: RealmCollection;
    let appBootstrapper: AppBootstrapper;

    beforeEach(async () => {
        appBootstrapper = new AppBootstrapper(() => servicesFactory(TestConfiguration));
        await appBootstrapper.bootstrap();

        const { markerService: mrS, realmCollection: rc } = appBootstrapper.services;
        markerService = mrS;
        realmCollection = rc;
    });

    it('should get map markers and format the title properly', async () => {
        const realm = realmCollection.getRealm();
        let displayableMapMarkers: DisplayableMapMarker[] = [];

        markerService.subscribeToMapMarkerChanges(markers => {
            displayableMapMarkers = markers;
        });

        realm.write(() => {
            realm.create('MundaBiddiProblem', {
                _id: new BSON.ObjectId(),
                description: 'Test2',
                latitude: 1000,
                longitude: 1000,
                org: 'TEST',
                type: 'vehicle_on_trail'
            });
        });

        await new Promise(resolve => setTimeout(resolve, 3000));

        expect(displayableMapMarkers.length).toBe(1);
        expect(displayableMapMarkers[0].title).toBe('Motorised Vehicle on Trail');
    }, 10000);

    afterAll(async () => {
        await appBootstrapper.cleanUp();
    });
});
