import { MapService } from 'services/MapService';
import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';

describe('MapService', () => {
    let subject: MapService;
    let appBootstrapper: AppBootstrapper;

    beforeEach(() => {
        appBootstrapper = new AppBootstrapper(() => servicesFactory(TestConfiguration));
        subject = appBootstrapper.services.mapService;
    });

    it('should format properly the mapMarkers', () => {
        const res = subject.getDescriptionFromMapMarker({
            type: 'trail_obstruction',
            description: 'test',
            latitude: 1,
            longitude: 2,
            _id: 1
        });

        expect(res.title).toEqual('Trail Obstructed');
    });

    afterAll(async () => {
        await appBootstrapper.cleanUp();
    });
});
