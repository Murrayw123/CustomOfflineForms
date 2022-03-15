import { MundaBiddiProblemSchema } from 'configurations/MundaBiddi';
import { AppBootstrapper, factory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';
import { FormSaverService } from 'services/FormSaverService';
import { RealmCollection } from 'services/RealmCollection';

describe('Saving a form', () => {
    let formSaverService: FormSaverService;
    let realmCollection: RealmCollection;
    let appBootstrapper: AppBootstrapper;

    beforeEach(() => {
        appBootstrapper = new AppBootstrapper(() => factory(TestConfiguration));
        appBootstrapper.bootstrap();

        formSaverService = appBootstrapper.services.formSaverService;
        realmCollection = appBootstrapper.services.realmCollection;
    });

    it('should save a form into the database', () => {
        formSaverService.saveForm(
            {
                description: 'Test Description',
                latitude: '023',
                longitude: '02222',
                org: 'Mundabiddi Trail Foundation',
                type: 'structural_damage'
            },
            MundaBiddiProblemSchema.name
        );
        const realmAsJS = realmCollection.getRealmObjectsAsJS();
        expect(realmAsJS[MundaBiddiProblemSchema.name].length).toBe(1);
    });

    afterAll(async () => {
        await appBootstrapper.cleanUp();
    });
});
