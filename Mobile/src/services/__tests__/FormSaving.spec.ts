import { MundaBiddiProblemFormType, MundaBiddiProblemSchema } from 'configurations/MundaBiddi';
import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';
import { RealmCollection } from 'services/RealmCollection';
import { FormController } from 'controllers/FormController';
import Realm from 'realm';

describe('Saving a form', () => {
    let realmCollection: RealmCollection;
    let appBootstrapper: AppBootstrapper;
    let formController: FormController;

    beforeEach(async () => {
        appBootstrapper = new AppBootstrapper(() => servicesFactory(TestConfiguration));
        await appBootstrapper.bootstrap(Realm.Credentials.anonymous());

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
            type: 'structural_damage',
            resolved: false
        });
        const realmAsJS = realmCollection.getRealmObjectsAsJS();
        expect(realmAsJS[MundaBiddiProblemSchema.name].length).toBe(1);
    }, 10000);

    it('should allow you to update a form', () => {
        formController.createNewFormSubmission({
            description: 'Test Description',
            latitude: '023',
            longitude: '02222',
            org: 'Mundabiddi Trail Foundation',
            type: 'structural_damage',
            resolved: true
        });

        const realmAsJS = realmCollection.getRealmObjectsAsJS();
        expect(realmAsJS[MundaBiddiProblemSchema.name].length).toBe(1);
        const form = realmAsJS[MundaBiddiProblemSchema.name][0];

        form.description = 'Updated Description';
        formController.updateFormSubmission(form);

        const realmAsJSAfterUpdate = realmCollection.getRealmObjectsAsJS();
        expect(realmAsJSAfterUpdate[MundaBiddiProblemSchema.name][0].description).toBe(
            'Updated Description'
        );
    }, 10000);

    afterEach(() => {
        realmCollection.getRealm().write(() => {
            realmCollection.getRealm().deleteAll();
        });
    });

    afterAll(async () => {
        await appBootstrapper.cleanUp();
    });
});
