import { RealmSyncStatusService } from 'services/RealmSyncStatusService';
import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';
import Realm from 'realm';
import { FormController } from 'controllers/FormController';
import { MundaBiddiProblemFormType } from 'configurations/MundaBiddi';

describe('NetworkStatusService', () => {
    let subject: RealmSyncStatusService;
    let subscriber: jest.Mock;
    let formController: FormController;

    beforeEach(async () => {
        const appBootstrapper = new AppBootstrapper(() => servicesFactory(TestConfiguration));
        await appBootstrapper.bootstrap(Realm.Credentials.anonymous());
        const formControllerCollection = appBootstrapper.services.formControllerCollection;
        formController = formControllerCollection.getFormControllerFromFormTypeName(
            MundaBiddiProblemFormType.name
        );
        subscriber = jest.fn();
        subject = appBootstrapper.services.realmSyncStatusService;
        subject.subscribe({
            next: changeNotification => {
                subscriber();
            }
        });
    });

    it('should let the subscriber know when we are uploading or downloading', () => {
        formController.createNewFormSubmission({
            description: 'Test Description',
            latitude: '023',
            longitude: '02222',
            org: 'Mundabiddi Trail Foundation',
            type: 'structural_damage',
            resolved: false
        });

        expect(subscriber).toBeCalled();
    });
});
