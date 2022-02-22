import { Database } from 'services/Db';
import { RealmCollection } from 'services/RealmCollection';
import { RealmFactory } from 'services/RealmFactory';
import { MundaBiddiProblemSchema } from 'models/MundaBiddiProblem';
import { Credentials } from 'realm';
import { Subject } from 'rxjs';

export interface Services {
    db: Database;
    realmFactory: RealmFactory;
    realmCollection: RealmCollection;
    errorObserver: Subject<string>;
}

export function factory(): Services {
    const db = new Database('dynamicforms_dev-xezyh', Credentials.anonymous());
    const realmFactory = new RealmFactory(db);
    const realmCollection = new RealmCollection(realmFactory);
    const errorObserver = new Subject<string>();

    return {
        db,
        realmFactory,
        realmCollection,
        errorObserver
    };
}

export class AppBootstrapper {
    private readonly _db: Database;
    private readonly _realmCollection: RealmCollection;
    private readonly _realmFactory: RealmFactory;
    private readonly _errorObservable: Subject<string>;

    constructor(factory: () => Services = () => factory()) {
        const { db, realmFactory, realmCollection, errorObserver } = factory();
        this._db = db;
        this._realmFactory = realmFactory;
        this._realmCollection = realmCollection;
        this._errorObservable = errorObserver;
    }

    public async bootstrap() {
        await this._db.login();
        await this._realmCollection.addRealm('mundabiddi', [MundaBiddiProblemSchema]);
    }

    public get services(): Services {
        return {
            db: this._db,
            realmFactory: this._realmFactory,
            realmCollection: this._realmCollection,
            errorObserver: this._errorObservable
        };
    }
}
