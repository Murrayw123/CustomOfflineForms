import { MundaBiddiProblemFormType, MundaBiddiProblemSchema } from 'configurations/MundaBiddi';
import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';
import { RealmCollection } from 'services/RealmCollection';
import { FormController } from 'controllers/FormController';

describe('Saving a form', () => {
    let realmCollection: RealmCollection;
    let appBootstrapper: AppBootstrapper;
    let formController: FormController;

    beforeEach(async () => {
        appBootstrapper = new AppBootstrapper(() => servicesFactory(TestConfiguration));
        await appBootstrapper.bootstrap();

        const { formControllerCollection, realmCollection: rc } = appBootstrapper.services;
        formController = formControllerCollection.getFormControllerFromFormTypeName(
            MundaBiddiProblemFormType.name
        );

        realmCollection = rc;
    });

    it('should save a form into the database', () => {
        formController.createNewFormSubmission({
            description: 'Test Description',
            latitude: '023',
            longitude: '02222',
            org: 'Mundabiddi Trail Foundation',
            type: 'structural_damage'
        });
        const realmAsJS = realmCollection.getRealmObjectsAsJS();
        expect(realmAsJS[MundaBiddiProblemSchema.name].length).toBe(1);
    }, 10000);

    afterAll(async () => {
        await appBootstrapper.cleanUp();
    });
});
