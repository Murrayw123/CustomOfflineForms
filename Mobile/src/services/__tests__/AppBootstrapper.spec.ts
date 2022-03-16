import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { TestConfiguration } from 'configurations/TestConfiguration';

describe('AppBootstrapper', () => {
    let subject: AppBootstrapper;

    beforeEach(() => {
        subject = new AppBootstrapper(() => servicesFactory(TestConfiguration));
    });

    it('should log in to the database when bootstrap is called', async () => {
        await subject.bootstrap();
        expect(subject.services.db.user).toBeDefined();
    });
});
