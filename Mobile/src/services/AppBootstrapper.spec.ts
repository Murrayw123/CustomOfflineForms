import { AppBootstrapper, factory } from 'services/AppBootstrapper';

describe('AppBootstrapper', () => {
    let subject: AppBootstrapper;

    beforeEach(() => {
        subject = new AppBootstrapper(() => factory());
    });

    it('should log in to the database when bootstrap is called', async () => {
        await subject.bootstrap();
        expect(subject.services.db.user).toBeDefined();
    });
});
