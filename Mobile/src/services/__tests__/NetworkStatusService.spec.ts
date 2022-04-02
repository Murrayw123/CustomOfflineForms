import { RealmSyncStatusService } from 'services/RealmSyncStatusService';
import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';

describe('NetworkStatusService', () => {
    let subject: RealmSyncStatusService;
    let subscriber: jest.Mock;

    beforeEach(async () => {
        const appBootstrapper = new AppBootstrapper(() => servicesFactory(TestConfiguration));
        await appBootstrapper.bootstrap();

        subscriber = jest.fn();
        subject = appBootstrapper.services.realmSyncStatusService;
        subject.subscribe(subscriber);
    });

    it('should let the subscriber know when we are uploading or downloading', () => {
        expect(subscriber).toBeCalled();
    });
});
