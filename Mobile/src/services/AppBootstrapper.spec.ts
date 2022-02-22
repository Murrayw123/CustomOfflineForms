import { Credentials } from 'realm';
import { RealmCollection } from 'services/RealmCollection';
import { Database } from 'services/Db';
import { AppBootstrapper, Services } from 'services/AppBootstrapper';
import { RealmFactory } from 'services/RealmFactory';
import { Subject } from 'rxjs';

jest.mock('./Db');
jest.mock('./RealmCollection');

describe('AppBootstrapper', () => {
    let database: Database;
    let realmFactory: RealmFactory;
    let realmCollection: RealmCollection;
    let errorObserver: Subject<string>;

    let subject: AppBootstrapper;

    function mockFactory(): Services {
        database = new Database('dynamicforms_dev-xezyh', Credentials.anonymous());
        realmFactory = new RealmFactory(database);
        realmCollection = new RealmCollection(realmFactory);
        errorObserver = new Subject<string>();
        return {
            db: database,
            realmFactory,
            realmCollection,
            errorObserver
        };
    }

    beforeEach(() => {
        subject = new AppBootstrapper(() => mockFactory());
    });

    it('should log in to the database when bootstrap is called', async () => {
        await subject.bootstrap();
        expect(database.login).toBeCalledTimes(1);
        expect(realmCollection.addRealm).toBeCalledTimes(1);
    });
});
